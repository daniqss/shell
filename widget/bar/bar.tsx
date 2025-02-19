import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { bind, Variable, GLib } from "astal";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import Bluetooth from "gi://AstalBluetooth";
import fetchUpdates from "../../lib/updates";
import Hyprland from "gi://AstalHyprland";
import defaultApp from "../../lib/default_app";
import { moveToWorkspaceSilent } from "../../lib/workspace";
import { iconFallback, lookupIcon, iconSustitutions } from "../../lib/icons";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      className="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
    >
      <centerbox
        className="BarContainer"
        startWidget={
          <box className="Left" hexpand halign={Gtk.Align.START}>
            <LauncherIcon />
            <Workspaces />
          </box>
        }
        centerWidget={
          <box className="Center" halign={Gtk.Align.CENTER}>
            <FocusedClient />
          </box>
        }
        endWidget={
          <box className="Right" halign={Gtk.Align.END}>
            <SysTray />
            <eventbox className="SysMenu">
              <box>
                <NetworkIcon />
                <BluetoothIcon />
                <AudioIcon />
                <BatteryIcon />
                <Clock />
              </box>
            </eventbox>
          </box>
        }
      />
    </window>
  );
}

// left
export function LauncherIcon(): Gtk.Widget {
  const endeavourosIcon = "endeavouros-no-name";
  const iconName = lookupIcon(endeavourosIcon)
    ? endeavourosIcon
    : GLib.get_os_info("LOGO") ?? "go-home-symbolic";

  return (
    <button onClick={() => console.log("TODO: show app launcher")}>
      <icon icon={iconName} className="LauncherIcon" />
    </button>
  );
}

// workspaces widget
export function Workspaces(): Gtk.Widget {
  const hypr = Hyprland.get_default();
  let scrollCooldown = 0;

  // executed when workspaces container is clicked
  function onContainerClick(event: Astal.ClickEvent) {
    if (event.button === 1) {
      console.log("TODO: show workspace alt tab menu");
    }
  }

  function onContainerScroll(event: Astal.ScrollEvent) {
    const now = Date.now();
    const cooldownTime = 85;

    if (now - scrollCooldown < cooldownTime) return;
    scrollCooldown = now;

    moveToWorkspaceSilent(hypr.focusedWorkspace.id + Math.sign(event.delta_y));
  }

  // determine workspace class depending on if it's active, focused or empty
  function bindWorkspaceClass(
    workspace: Hyprland.Workspace | undefined,
    focused: Hyprland.Workspace
  ): string {
    return workspace === focused
      ? "FocusedWorkspace Workspace"
      : workspace && workspace.get_clients().length > 0
      ? "Workspace ActiveWorkspace"
      : "Workspace";
  }
  const workspaces = Array.from({ length: 9 }, (_, i) => i + 1);

  // executed when workspace is clicked
  function onWorkspaceClick(id: number, event: Astal.ClickEvent) {
    // left click
    if (event.button === 1) {
      moveToWorkspaceSilent(id);
    }
    // right click
    else if (event.button === 3) {
      defaultApp(id);
    }
  }

  return (
    <eventbox
      onClick={(_, event) => onContainerClick(event)}
      className="WorkspacesContainer"
      onScroll={(_, event) => onContainerScroll(event)}
    >
      <box className="Workspaces" vexpand={false} visible={true}>
        {bind(hypr, "workspaces").as((wss) =>
          workspaces.map((id) => {
            const workspace = wss.find((ws) => ws.id === id);

            return (
              <button
                vexpand={false}
                className={bind(hypr, "focusedWorkspace").as((focused) =>
                  bindWorkspaceClass(workspace, focused)
                )}
                onClick={(_, event) => onWorkspaceClick(id, event)}
              />
            );
          })
        )}
      </box>
    </eventbox>
  );
}

export function FocusedClient(): Gtk.Widget {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  return (
    <revealer
      transitionType={Gtk.RevealerTransitionType.CROSSFADE}
      transitionDuration={300}
      revealChild={focused.as(Boolean)}
    >
      <box className="FocusedClient" visible={focused.as(Boolean)}>
        <box spacing={8}>
          <icon
            className="AppIcon"
            icon={focused.as((focused) => {
              // return fallback if no focused client is undefined
              if (!focused) return iconFallback;

              // return icon if it exists, otherwise return fallback
              const iconName = focused.class;
              return (
                iconSustitutions[iconName] ??
                (lookupIcon(iconName) ? iconName : iconFallback)
              );
            })}
          />
          {focused.as(
            (client) =>
              client && (
                <label
                  label={bind(client, "title").as(String)}
                  truncate={true}
                  maxWidthChars={86}
                />
              )
          )}
        </box>
      </box>
    </revealer>
  );
}

// right
export function SysTray(): Gtk.Widget {
  const tray = Tray.get_default();

  return (
    <box className="SysTray">
      {bind(tray, "items").as((items) =>
        items
          .filter((item) => item.iconName !== "spotify-linux-32")
          .map((item) => (
            <menubutton
              tooltipMarkup={bind(item, "tooltipMarkup")}
              usePopover={false}
              actionGroup={bind(item, "actionGroup").as((ag) => [
                "dbusmenu",
                ag,
              ])}
              menuModel={bind(item, "menuModel")}
            >
              <icon gicon={bind(item, "gicon")} />
            </menubutton>
          ))
      )}
    </box>
  );
}

export function UpdatesIcon() {
  const updates: Variable<number> = Variable(-1).poll(100000, () =>
    fetchUpdates()
  );

  return (
    <box className="UpdatesIcon" onDestroy={() => updates.drop()}>
      {bind(updates).as((u) => {
        if (u < 0) return "";
        return ` ${u}`;
      })}
    </box>
  );
}

export function NetworkIcon() {
  const network = Network.get_default();
  const wifi = bind(network, "wifi");

  return (
    <box visible={wifi.as(Boolean)}>
      {wifi.as(
        (wifi) =>
          wifi && (
            <icon
              tooltipText={bind(wifi, "ssid").as(String)}
              className="Wifi"
              icon={bind(wifi, "iconName")}
            />
          )
      )}
    </box>
  );
}

export function BluetoothIcon() {
  const bluetooth = Bluetooth.get_default();

  return (
    <box className="BluetoothIcon">
      <icon
        // active only if its at least one connected device
        icon={bind(bluetooth, "devices").as(
          (devices) =>
            `bluetooth-${
              devices.filter((d) => d.connected).length > 0
                ? "active"
                : "disabled"
            }-symbolic`
        )}
        // for each connected device, show its name in the tooltip
        tooltipText={bind(bluetooth, "devices").as((devices) =>
          devices.map((d) => (d.connected ? d.name.concat("\n") : "")).join("")
        )}
      />
    </box>
  );
}

export function AudioIcon() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return (
    <box className="AudioIcon">
      <icon icon={bind(speaker, "volumeIcon")} />
    </box>
  );
}

export function BatteryIcon() {
  const bat = Battery.get_default();

  return (
    <box className="BatteryIcon" visible={bind(bat, "isPresent")}>
      <icon icon={bind(bat, "batteryIconName")} />
      <label
        label={bind(bat, "percentage").as((p) => `${Math.floor(p * 100)}%`)}
      />
    </box>
  );
}

export function Clock({ format = "%H:%M  %d-%m-%y" }: { format?: string }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <box className="Time">
      <label onDestroy={() => time.drop()} label={time()} />
    </box>
  );
}
