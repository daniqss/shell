import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./app.scss";
import Bar from "./widget/bar/bar";
import OSD from "./widget/osd/osd";
import Applauncher from "widget/applauncher/applauncher";
// import NotificationPopups from "./widget/notifications/notification-popup";
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
  const windows: Array<(gdkmonitor: Gdk.Monitor) => Gtk.Widget> = [
    Bar,
    OSD,
    Applauncher,
    // NotificationPopups,
  ];

  for (const window of windows) {
    const windowMaps = new Map<Gdk.Monitor, Gtk.Widget>();
    for (const gdkmonitor of App.get_monitors()) {
      windowMaps.set(gdkmonitor, window(gdkmonitor));
    }
    App.connect("monitor-added", (_, gdkmonitor) =>
      windowMaps.set(gdkmonitor, window(gdkmonitor))
    );
    App.connect("monitor-removed", (_, gdkmonitor) => {
      windowMaps.get(gdkmonitor)?.destroy();
      windowMaps.delete(gdkmonitor);
    });
  }
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
