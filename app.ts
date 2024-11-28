import { App } from "astal/gtk3";
import style from "./app.scss";
import Bar from "./widget/bar/bar";
import Applauncher from "./widget/applauncher/applauncher";

App.start({
  instanceName: "shell",
  css: style,
  main() {
    App.get_monitors().map(Bar);
  },
  requestHandler(req: string, res: (response: any) => void) {
    const args = req.split(" ");
    if (args[0] === "applauncher") {
      Applauncher();
      res("ok");
    } else {
      res("unknown request");
    }
  },
});
