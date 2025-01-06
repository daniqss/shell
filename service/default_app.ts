import { execAsync } from "astal";

export default function defaultApp(id: number) {
  const apps: { [key: number]: string } = {
    1: "code",
    2: "chromium",
    3: `alacritty --working-directory /home/daniqss/`,
    4: "obsidian",
    5: "nautilus",
    6: "vesktop",
    7: "steam",
    8: "spotify-launcher",
    9: "google-chrome-stable",
  };
  console.log(`executing ${id} ${apps[id]}`);
  execAsync(apps[id])
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}
