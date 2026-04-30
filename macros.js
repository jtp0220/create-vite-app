import os from "node:os";
import path from "node:path";
const home = os.homedir();

// Shortcuts for common project folders
export const macros = new Map();
macros.set("desktop", path.join(home, "Desktop"));
macros.set("documents", path.join(home, "Documents"));
macros.set("github", path.join(home, "Documents", "github"));
