import { execAsync } from "astal";
import Hyprland from "gi://AstalHyprland";

export default function defaultApp(id?: number) {
  const workspace =
    id ??
    ((): number => {
      const hypr = Hyprland.get_default();
      return hypr.get_focused_workspace().id;
    })();

  const apps: { [key: number]: string } = {
    1: "code",
    2: "chromium",
    3: `alacritty --working-directory /home/daniqss/`,
    4: "obsidian --enable-features=UseOzonePlatform, WaylandWindowDecorations --ozone-platform=wayland",
    5: "nautilus",
    6: "vesktop --enable-features=UseOzonePlatform, WaylandWindowDecorations --ozone-platform=wayland",
    7: "steam",
    8: "spotify-launcher",
    9: "google-chrome-stable",
  };

  execAsync([
    "bash",
    "-c",
    `hyprctl dispatch -- exec [workspace ${workspace} silent] ${apps[workspace]}`,
  ]).catch((err) => console.error(err));
}
