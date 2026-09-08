import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.dataset.theme !== "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#141321" : "#f8f5ff");
    try {
      localStorage.setItem("entrelinhas.theme", dark ? "dark" : "light");
    } catch {
      /* The toggle still works when storage is unavailable. */
    }
  }, [dark]);

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setDark(!dark)}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={dark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{dark ? "Modo claro" : "Modo escuro"}</span>
    </button>
  );
}
