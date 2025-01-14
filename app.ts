import { App } from "astal/gtk3";
import style from "./app.scss";
import Bar from "./widget/bar/bar";
import Applauncher from "./widget/applauncher/applauncher";
import defaultApp from "./service/default_app";

App.start({
  css: style,
  main: () => {
    App.get_monitors().map(Bar);
    Applauncher();
  },
  requestHandler(request: string, res: (response: any) => void) {
    if (request == "defaultApp") {
      defaultApp();
    }
    res("unknown command");
  },
});
