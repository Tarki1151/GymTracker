import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n"; // i18n konfigürasyonunu içe aktar

createRoot(document.getElementById("root")!).render(<App />);
