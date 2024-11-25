import { App, Astal, Gdk } from "astal/gtk3";
import Left from "./left";
import Center from "./center";
import Right from "./right";

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
        <Center />
        <Right />
      </centerbox>
    </window>
  );
}
