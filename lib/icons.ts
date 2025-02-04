import { Gtk } from "astal/gtk3";
import { sustitutions } from "../utils/sustitutions";

export const iconFallback = "application-x-executable";

export function lookupIcon(iconName: string, size = 24): Gtk.IconInfo | null {
  return Gtk.IconTheme.get_default().lookup_icon(
    iconName,
    size,
    Gtk.IconLookupFlags.USE_BUILTIN
  );
}

export const iconSustitutions: sustitutions = {
  "code-url-handler": "visual-studio-code",
  code: "visual-studio-code",
  spotify: "spotify-launcher",
};
