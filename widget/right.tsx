import { App, Gtk } from "astal/gtk3";
import { bind } from "astal";
import { Gdk } from "astal/gtk3";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";

export default function Right() {
  return (
    <box className="Left" hexpand halign={Gtk.Align.END}>
      <SysTray />
      <Wifi />
      <AudioSlider />
      <BatteryLevel />
    </box>
  );
}

function SysTray() {
  const tray = Tray.get_default();

  return (
    <box>
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

function Wifi() {
  const { wifi } = Network.get_default();

  return (
    <icon
      tooltipText={bind(wifi, "ssid").as(String)}
      className="Wifi"
      icon={bind(wifi, "iconName")}
    />
  );
}

function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return (
    <box className="AudioSlider">
      <icon icon={bind(speaker, "volumeIcon")} />
      {/* <label
        label={bind(speaker, "volume").as(
          (v) => `${Math.round(Number(v.toPrecision()) * 100)}`
        )}
      /> */}
    </box>
  );
}

function BatteryLevel() {
  const bat = Battery.get_default();

  return (
    <box className="Battery" visible={bind(bat, "isPresent")}>
      <icon icon={bind(bat, "batteryIconName")} />
      {/* <label
        label={bind(bat, "percentage").as((p) => `${Math.floor(p * 100)}`)}
      /> */}
    </box>
  );
}
