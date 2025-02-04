import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { bind } from "astal";
import { timeout } from "astal/time";
import Variable from "astal/variable";
import Brightness from "../../service/Brightness";
import Progress from "./progress";
import Wp from "gi://AstalWp";

const DELAY = 1000;

function OnScreenProgress(window: Astal.Window, vertical: boolean) {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  const indicator = new Widget.Icon({
    pixelSize: 20,
    valign: Gtk.Align.CENTER,
    icon: bind(speaker, "volumeIcon"),
  });

  const progress = Progress({
    vertical,
    width: vertical ? 48 : 400,
    height: vertical ? 400 : 48,
    child: indicator,
  });

  let count = 0;

  function show(value: number, icon: string, muted: boolean) {
    window.visible = true;
    indicator.icon = icon;
    progress.setValue(value, muted);
    count++;
    timeout(DELAY, () => {
      count--;
      if (count === 0) window.visible = false;
    });
  }

  return (
    <box
      className="indicator"
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.END}
      css="min-height: 2px;"
      child={progress}
      setup={() => {
        progress.hook(speaker, "notify::mute", () => {
          progress.setMute(speaker.mute);
        });
        progress.hook(speaker, "notify::volume", () => {
          return show(speaker.volume, speaker.volumeIcon, speaker.mute);
        });

        if (Brightness) {
          progress.hook(Brightness, () =>
            show(Brightness!.screen, "display-brightness-symbolic", false)
          );
        }
      }}
    ></box>
  );
}

export default function OSD(monitor: Gdk.Monitor) {
  // const visible = Variable(false);

  return (
    <window
      visible={false}
      className="OSD"
      namespace="osd"
      gdkmonitor={monitor}
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.BOTTOM}
      setup={(self) => {
        self.add(
          <box className="osd" vertical={true}>
            {OnScreenProgress(self, false)}
          </box>
        );
      }}
    ></window>
  );
}
