import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import Left from "./Left";

const time = Variable("").poll(1000, "date");

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
      <centerbox>
        <Left />
        <button onClicked="echo hello" halign={Gtk.Align.CENTER}>
          Welcome to AGS!
        </button>
        <box />
        <button onClick={() => print("hello")} halign={Gtk.Align.CENTER}>
          <label label={time()} />
        </button>
        <box className="right box">
          <label label="battery" />
        </box>
      </centerbox>
    </window>
  );
}
