import { bind, execAsync } from "astal";
import Hyprland from "gi://AstalHyprland";

export default function Left() {
  const hypr = Hyprland.get_default();

  return (
    <box className="Left">
      <Workspaces hypr={hypr} />
      <FocusedClient hypr={hypr} />
    </box>
  );
}

function Workspaces({ hypr }: { hypr: Hyprland.Hyprland }) {
  return (
    <box className="Workspaces">
      {bind(hypr, "workspaces").as((wss) => {
        const workspaces = Array.from({ length: 9 }, (_, i) => i + 1);
        return workspaces.map((id) => {
          const workspace = wss.find((ws) => ws.id === id);

          return (
            <button
              className={bind(hypr, "focusedWorkspace").as((fw) =>
                workspace === fw ? "focused" : ""
              )}
              onClicked={() =>
                execAsync(["hyprqtile", "workspace", id.toString()])
              }
            >
              {id}
            </button>
          );
        });
      })}
    </box>
  );
}

function FocusedClient({ hypr }: { hypr: Hyprland.Hyprland }) {
  const focused = bind(hypr, "focusedClient");

  return (
    <box className="Focused" visible={focused.as(Boolean)}>
      {focused.as(
        (client) => client && <label label={bind(client, "class").as(String)} />
      )}
    </box>
  );
}
