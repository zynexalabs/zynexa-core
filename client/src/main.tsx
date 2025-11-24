import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Buffer } from "buffer";

window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);

// feat: configure vite and react runtime
