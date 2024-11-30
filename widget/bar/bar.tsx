import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { FocusedClient, Workspaces } from "./left";
import { Clock } from "./center";
import {
  SysTray,
  UpdatesIcon,
  NetworkIcon,
  BluetoothIcon,
  BatteryIcon,
  AudioIcon,
} from "./right";

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
            <FocusedClient />
          </box>
        }
        centerWidget={
          <box className="Center" halign={Gtk.Align.CENTER}>
            <Clock />
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
                <BatteryIcon />
                <AudioIcon />
              </box>
            </eventbox>
          </box>
        }
      />
    </window>
  );
}
