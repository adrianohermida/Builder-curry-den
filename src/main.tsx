import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/globals.css";

// Ensure proper theme initialization
document.documentElement.setAttribute("data-theme", "default");

createRoot(document.getElementById("root")!).render(<App />);
