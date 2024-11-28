import { bind } from "astal";
import Hyprland from "gi://AstalHyprland";
import defaultApp from "../../service/default_app";
import { moveToWorkspaceSilent } from "../../service/workspace";

export function Workspaces() {
  const hypr = Hyprland.get_default();

  return (
    <box className="Workspaces" vexpand={false} visible={true}>
      {bind(hypr, "workspaces").as((wss) => {
        const workspaces = Array.from({ length: 9 }, (_, i) => i + 1);
        return workspaces.map((id) => {
          const workspace = wss.find((ws) => ws.id === id);

          return (
            <button
              className={bind(hypr, "focusedWorkspace").as((focused) =>
                workspace === focused
                  ? "FocusedWorkspace Workspace"
                  : workspace && workspace.get_clients().length > 0
                  ? "Workspace ActiveWorkspace"
                  : "Workspace"
              )}
              onClick={(_, event) => {
                if (event.button === 1) {
                  moveToWorkspaceSilent(id);
                }
                if (event.button === 3) {
                  defaultApp(id);
                }
              }}
            />
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
    <box className="FocusedClient" visible={focused.as(Boolean)}>
      {focused.as(
        (client) => client && <label label={bind(client, "class").as(String)} />
      )}
    </box>
  );
}
