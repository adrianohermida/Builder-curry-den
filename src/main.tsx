import { createRoot } from "react-dom/client";
import AppRouter from "./router/index.tsx";
import "./index.css";

// Initialize theme system
import { initializeTheme } from "./utils/themeUtils";

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById("root")!).render(<AppRouter />);
