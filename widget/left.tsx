import { bind } from "astal";
import { Gtk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import defaultApp from "../logic/default-app";
import { moveToWorkspaceSilent } from "../logic/workspace";

export default function Left() {
  const hypr = Hyprland.get_default();

  return (
    <box className="Left" hexpand halign={Gtk.Align.START}>
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
              className={bind(hypr, "focusedWorkspace").as((focused) =>
                workspace === focused ? "focused" : ""
              )}
              onClick={(_, event) => {
                console.log(event.button);
                switch (event.button) {
                  case 1:
                    moveToWorkspaceSilent(id);
                  case 3:
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
