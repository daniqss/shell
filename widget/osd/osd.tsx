import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { timeout } from "astal/time";
import Variable from "astal/variable";
import Brightness from "../../service/brightness";
import Wp from "gi://AstalWp";

export default function OSD(monitor: Gdk.Monitor) {
  const visible = Variable(false);

  return (
    <window
      gdkmonitor={monitor}
      className="OSD"
      namespace="osd"
      application={App}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      anchor={Astal.WindowAnchor.BOTTOM}
    >
      <eventbox valign={Gtk.Align.END} onClick={() => visible.set(false)}>
        <OnScreenProgress visible={visible} />
      </eventbox>
    </window>
  );
}

function OnScreenProgress({ visible }: { visible: Variable<boolean> }) {
  const brightness = Brightness.get_default();
  const speaker = Wp.get_default()?.get_default_speaker();

  const iconName = Variable("");
  const value = Variable(0);
  const muted = Variable(false);
  const volumeOrBrightness = Variable(false);

  let count = 0;
  function show(v: number, icon: string, isMuted: boolean = false) {
    visible.set(true);
    value.set(v);
    iconName.set(icon);
    muted.set(isMuted);
    volumeOrBrightness.set(icon === "display-brightness-symbolic");
    count++;
    timeout(2000, () => {
      count--;
      if (count === 0) visible.set(false);
    });
  }

  return (
    <revealer
      valign={Gtk.Align.END}
      transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
      revealChild={visible()}
      setup={(self) => {
        self.hook(brightness, "notify::screen", () =>
          show(brightness.screen, "display-brightness-symbolic")
        );

        if (speaker) {
          self.hook(speaker, "notify::volume", () =>
            show(speaker.volume, speaker.volumeIcon, speaker.mute)
          );
          self.hook(speaker, "notify::mute", () =>
            show(speaker.volume, speaker.volumeIcon, speaker.mute)
          );
        }
      }}
    >
      <box className="OSDContainer" vertical={true}>
        <centerbox
          className="OSDTitle"
          startWidget={
            <label
              hexpand={true}
              halign={Gtk.Align.START}
              label={volumeOrBrightness((vOrB) =>
                vOrB ? "Brightness" : "Volume"
              )}
            />
          }
          endWidget={
            <label
              hexpand={true}
              halign={Gtk.Align.END}
              label={value((v) => `${Math.round(v * 100)}%`)}
            />
          }
        ></centerbox>
        <box className="OSD" vertical={true}>
          <box>
            <icon icon={iconName()} />
            <levelbar
              valign={Gtk.Align.CENTER}
              hexpand={true}
              widthRequest={140}
              value={value()}
              className={muted() ? "muted" : ""}
            />
          </box>
        </box>
      </box>
    </revealer>
  );
}
