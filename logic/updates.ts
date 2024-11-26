import { execAsync } from "astal";

export default async function fetchUpdates(): Promise<number> {
  return execAsync("checkupdates")
    .then((stdout) => stdout.trim().split("\n").length)
    .catch(() => 0);
}
