import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./app.scss";
import Bar from "./widget/bar/bar";
// import Applauncher from "./widget/applauncher/applauncher";
import OSD from "./widget/osd/osd";
import defaultApp from "./lib/default_app";

// entry point of the shell, where we determine
//  - the stylesheet
//  - the custom icon path
//  - the main function
//  - the request handler
App.start({
  css: style,
  icons: "./icons",
  main: main,
  requestHandler,
});

// main function where must be created the used widgets
function main() {
  const bars = new Map<Gdk.Monitor, Gtk.Widget>();
  const osds = new Map<Gdk.Monitor, Gtk.Widget>();

  // for each monitor, asoociate the monitor with its widgets
  for (const gdkmonitor of App.get_monitors()) {
    bars.set(gdkmonitor, Bar(gdkmonitor));
    osds.set(gdkmonitor, OSD(gdkmonitor));
  }

  // when a monitor is connected, it creates and associates the monitor with its widgets
  App.connect("monitor-added", (_, gdkmonitor) => {
    bars.set(gdkmonitor, Bar(gdkmonitor));
    osds.set(gdkmonitor, OSD(gdkmonitor));
  });

  // when its unplugged, it destroys the widgets associated with the monitor
  App.connect("monitor-removed", (_, gdkmonitor) => {
    bars.get(gdkmonitor)?.destroy();
    osds.get(gdkmonitor)?.destroy();
    bars.delete(gdkmonitor);
    osds.delete(gdkmonitor);
  });
}

// request handler, with which we can send messages like
// ```bash
// astal defaultApp --instance astal
// ```
function requestHandler(request: string, res: (response: any) => void) {
  if (request == "defaultApp") {
    defaultApp();
  }
  res("unknown command");
}
