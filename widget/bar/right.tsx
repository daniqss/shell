import { App, Gtk } from "astal/gtk3";
import { bind, Variable } from "astal";
import { Gdk } from "astal/gtk3";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import Bluetooth from "gi://AstalBluetooth";
import fetchUpdates from "../../logic/updates";

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
      <icon
        icon={bind(bat, "batteryIconName")}
        tooltipText={bind(bat, "batteryLevel").as((l) =>
          Math.round(Number(l.toPrecision()) * 100).toString()
        )}
      />
    </box>
  );
}
