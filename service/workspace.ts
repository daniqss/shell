import { execAsync } from "astal";
import Hyprland from "gi://AstalHyprland";

export function moveToWorkspaceSilent(id: number) {
  execAsync(["hyprqtile", "--workspace", id.toString()]).catch(() =>
    Hyprland.get_default().dispatch("workspace", `${id}`)
  );
}
