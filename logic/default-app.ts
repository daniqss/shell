import { execAsync } from "astal";
import Process from "gi://AstalIO";

export default function defaultApp(id: number) {
  const apps: { [key: number]: string } = {
    1: "code",
    2: "chromium",
    3: `alacritty --working-directory /home/daniqss/`,
    4: "obsidian",
    5: "nautilus",
    6: "vesktop",
    7: "steam",
    8: "spotify",
    9: "google-chrome",
  };
  execAsync(apps[id]);
}
