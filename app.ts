import { App } from "astal/gtk3";
import style from "./app.scss";
import Bar from "./widget/bar/bar";
// import Applauncher from "./widget/applauncher/applauncher";
import OSD from "./widget/osd/osd";
import defaultApp from "./lib/default_app";

App.start({
  css: style,
  icons: "./icons",
  main: () => {
    App.get_monitors().map(Bar);
    App.get_monitors().map(OSD);
    // Applauncher();
  },
  requestHandler(request: string, res: (response: any) => void) {
    if (request == "defaultApp") {
      defaultApp();
    }
    res("unknown command");
  },
});
