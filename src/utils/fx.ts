import type { PointerEvent } from "react";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// Guarda a posição do ponteiro em variáveis CSS para o brilho e a inclinação dos cards.
export function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  el.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((x - 0.5) * 8).toFixed(2)}deg`);
}

export function resetPointer(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

const confettiColors = ["#bf9aff", "#7bdcc0", "#ffbd90", "#92c5ff", "#ff9a8a", "#ffe08a"];

// Confete leve, feito com elementos DOM e Web Animations; some sozinho.
export function burst(origin: Element | null, amount = 28) {
  if (!origin || prefersReducedMotion() || !document.body.animate) return;
  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.setAttribute("aria-hidden", "true");
    const size = 6 + Math.random() * 7;
    piece.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size * (Math.random() > 0.5 ? 1 : 0.45)}px;background:${confettiColors[i % confettiColors.length]};border-radius:${Math.random() > 0.6 ? "50%" : "2px"}`;
    document.body.appendChild(piece);
    const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.5;
    const distance = 90 + Math.random() * 140;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 60;
    const spin = (Math.random() - 0.5) * 720;
    piece
      .animate(
        [
          { transform: "translate(-50%, -50%) scale(0.4)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin / 2}deg) scale(1)`,
            opacity: 1,
            offset: 0.45,
          },
          {
            transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 160}px)) rotate(${spin}deg) scale(0.9)`,
            opacity: 0,
          },
        ],
        {
          duration: 900 + Math.random() * 500,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
      )
      .finished.finally(() => piece.remove());
  }
}
