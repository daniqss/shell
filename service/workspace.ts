import { execAsync } from "astal";

export function moveToWorkspaceSilent(id: number) {
  execAsync(["hyprqtile", "--workspace", id.toString()]);
}
