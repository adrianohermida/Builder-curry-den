import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme system
import { initializeTheme } from "./utils/themeUtils";

// Initialize theme before rendering
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
