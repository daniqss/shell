import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { bind, Variable, GLib } from "astal";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import Bluetooth from "gi://AstalBluetooth";
import fetchUpdates from "../../service/updates";
import Hyprland from "gi://AstalHyprland";
import defaultApp from "../../service/default_app";
import { moveToWorkspaceSilent } from "../../service/workspace";

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
        startWidget={
          <box className="Left" hexpand halign={Gtk.Align.START}>
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
            <UpdatesIcon />
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
// workspaces widget
export function Workspaces(): Gtk.Widget {
  const hypr = Hyprland.get_default();

  // executed when workspaces container is clicked
  function onContainerClick(event: Astal.ClickEvent) {
    if (event.button === 1) {
      console.log("TODO: show workspace alt tab menu");
    }
  }

  // generate workspace buttons
  function bindWorkspaces(wss: Hyprland.Workspace[]): Gtk.Widget[] {
    const workspaces = Array.from({ length: 9 }, (_, i) => i + 1);

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

    return workspaces.map((id) => {
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
    });
  }

  return (
    <eventbox
      onClick={(_, event) => onContainerClick(event)}
      className="WorkspacesContainer"
    >
      <box className="Workspaces" vexpand={false} visible={true}>
        {bind(hypr, "workspaces").as((wss) => bindWorkspaces(wss))}
      </box>
    </eventbox>
  );
}

// center
// focused client widget
export function FocusedClient(): Gtk.Widget {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  return (
    <box className="FocusedClient" visible={focused.as(Boolean)}>
      {focused.as(
        (client) => client && <label label={bind(client, "class").as(String)} />
      )}
    </box>
  );
}

// right
export function SysTray() {
  const tray = Tray.get_default();

  return (
    <box className="SysTray">
      {bind(tray, "items").as((items) =>
        items.map((item) => {
          if (item.iconThemePath) App.add_icons(item.iconThemePath);

          const menu = item.create_menu();

          return (
            <button
              tooltipMarkup={bind(item, "tooltipMarkup")}
              onDestroy={() => menu?.destroy()}
              onClickRelease={(self) => {
                menu?.popup_at_widget(
                  self,
                  Gdk.Gravity.SOUTH,
                  Gdk.Gravity.NORTH,
                  null
                );
              }}
            >
              <icon gIcon={bind(item, "gicon")} />
            </button>
          );
        })
      )}
    </box>
  );
}

export function UpdatesIcon() {
  const updates: Variable<number> = Variable(-1).poll(100000, () =>
    fetchUpdates()
  );

  return (
    <box
      className="UpdatesIcon"
      onDestroy={() => {
        updates.drop();
      }}
    >
      {bind(updates).as((u) => {
        if (u < 0) return "";
        return ` ${u}`;
      })}
    </box>
  );
}

export function NetworkIcon() {
  const { wifi } = Network.get_default();

  return (
    <box className="NetworkIcon">
      <icon
        tooltipText={bind(wifi, "ssid").as(String)}
        className="Wifi"
        icon={bind(wifi, "iconName")}
      />
    </box>
  );
}

export function BluetoothIcon() {
  const bluetooth = Bluetooth.get_default();

  return (
    <box className="BluetoothIcon">
      <icon
        icon="bluetooth-active-symbolic"
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

export function Clock({ format = "%d-%m-%y %H:%M" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <label className="Time" onDestroy={() => time.drop()} label={time()} />
  );
}
