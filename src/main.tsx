import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Shell, Notice } from "./components/UI";
import { Home } from "./pages/Home";
import { RoomPage } from "./pages/Room";
import { GameHub } from "./pages/GameHub";
import { WhoAmI } from "./pages/WhoAmI";
import { useAuth } from "./hooks/useAuth";
import { configured } from "./lib/firebase";
import "./styles.css";
import "./theme.css";
import "./inPerson.css";
import "./games.css";
function ConnectedGame({ room = false }: { room?: boolean }) {
  const { user, error } = useAuth();
  if (!room) return <Home uid={user?.uid} authError={error} />;
  if (user) return <RoomPage uid={user.uid} />;
  return (
    <Notice>
      {error ||
        (!configured
          ? "Configure o Firebase no .env para jogar em salas."
          : "Recuperando sua sessão…")}{" "}
      <a href="#/">Voltar</a>
    </Notice>
  );
}
function App() {
  return (
    <HashRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<GameHub />} />
          <Route path="/entrelinhas" element={<ConnectedGame />} />
          <Route path="/quem-sou-eu" element={<WhoAmI />} />
          <Route path="/room/:code" element={<ConnectedGame room />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </HashRouter>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
