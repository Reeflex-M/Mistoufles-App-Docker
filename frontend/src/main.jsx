import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Configuration de dayjs en français
dayjs.locale('fr');

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
