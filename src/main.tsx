import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { productsReady } from "@/data/products";

productsReady.then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});