import { bind } from "astal";
import { Astal, Gtk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import defaultApp from "../../service/default_app";
import { moveToWorkspaceSilent } from "../../service/workspace";

// workspaces widget
export function Workspaces(): Gtk.Widget {
  const hypr = Hyprland.get_default();

  // executed when workspaces container is clicked
  function onContainerClick(event: Astal.ClickEvent) {
    if (event.button === 1) {
      console.log("TODO: show workspace alt tab menu");
    }
  }

  // generate workspace buttons
  function bindWorkspaces(wss: Hyprland.Workspace[]): Gtk.Widget[] {
    const workspaces = Array.from({ length: 9 }, (_, i) => i + 1);

    // determine workspace class depending on if it's active, focused or empty
    function bindWorkspaceClass(
      workspace: Hyprland.Workspace | undefined,
      focused: Hyprland.Workspace
    ): string {
      return workspace === focused
        ? "FocusedWorkspace Workspace"
        : workspace && workspace.get_clients().length > 0
        ? "Workspace ActiveWorkspace"
        : "Workspace";
    }

    // executed when workspace is clicked
    function onWorkspaceClick(id: number, event: Astal.ClickEvent) {
      // left click
      if (event.button === 1) {
        moveToWorkspaceSilent(id);
      }
      // right click
      else if (event.button === 3) {
        defaultApp(id);
      }
    }

    return workspaces.map((id) => {
      const workspace = wss.find((ws) => ws.id === id);

      return (
        <button
          vexpand={false}
          className={bind(hypr, "focusedWorkspace").as((focused) =>
            bindWorkspaceClass(workspace, focused)
          )}
          onClick={(_, event) => onWorkspaceClick(id, event)}
        />
      );
    });
  }

  return (
    <eventbox
      onClick={(_, event) => onContainerClick(event)}
      className="WorkspacesContainer"
    >
      <box className="Workspaces" vexpand={false} visible={true}>
        {bind(hypr, "workspaces").as((wss) => bindWorkspaces(wss))}
      </box>
    </eventbox>
  );
}

// focused client widget
export function FocusedClient(): Gtk.Widget {
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
