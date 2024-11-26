import { execAsync } from "astal";

export default async function fetchUpdates(): Promise<number> {
  console.log("fetching updates");
  return execAsync("checkupdates")
    .then((stdout) => stdout.trim().split("\n").length)
    .catch(() => 0);
}
