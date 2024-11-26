import { bind } from "astal";
import Hyprland from "gi://AstalHyprland";
import defaultApp from "../logic/default_app";
import { moveToWorkspaceSilent } from "../logic/workspace";

export function Workspaces() {
  const hypr = Hyprland.get_default();

  return (
    <box className="Workspaces">
      {bind(hypr, "workspaces").as((wss) => {
        const workspaces = Array.from({ length: 9 }, (_, i) => i + 1);
        return workspaces.map((id) => {
          const workspace = wss.find((ws) => ws.id === id);

          return (
            <button
              className={bind(hypr, "focusedWorkspace").as((focused) =>
                workspace === focused ? "focused" : ""
              )}
              onClick={(_, event) => {
                if (event.button === 1) {
                  moveToWorkspaceSilent(id);
                }
                if (event.button === 3) {
                  defaultApp(id);
                }
              }}
            >
              {id}
            </button>
          );
        });
      })}
    </box>
  );
}

export function FocusedClient() {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  return (
    <box className="Focused" visible={focused.as(Boolean)}>
      {focused.as(
        (client) => client && <label label={bind(client, "class").as(String)} />
      )}
    </box>
  );
}
