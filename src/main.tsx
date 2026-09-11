import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Shell, Notice } from "./components/UI";
import { Home } from "./pages/Home";
import { RoomPage } from "./pages/Room";
import { useAuth } from "./hooks/useAuth";
import { configured } from "./lib/firebase";
import "./styles.css";
import "./theme.css";
import "./inPerson.css";
function App() {
  const { user, error } = useAuth();
  useEffect(() => {
    const previous = localStorage.getItem("entrelinhas.room");
    if (
      configured &&
      previous &&
      /^[A-HJ-NP-Z2-9]{5}$/.test(previous) &&
      (!window.location.hash || window.location.hash === "#/")
    ) {
      window.location.hash = `/room/${previous}`;
    }
  }, []);
  return (
    <HashRouter>
      <Shell>
        <Routes>
          <Route
            path="/"
            element={<Home uid={user?.uid} authError={error} />}
          />
          <Route
            path="/room/:code"
            element={
              user ? (
                <RoomPage uid={user.uid} />
              ) : (
                <Notice>
                  {error ||
                    (!configured
                      ? "Configure o Firebase no .env para jogar."
                      : "Recuperando sua sessão…")}{" "}
                  <a href="#/">Voltar</a>
                </Notice>
              )
            }
          />
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
