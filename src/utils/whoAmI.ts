import { identities, type IdentityCategory } from "../data/whoAmI";
import { randomInt } from "./game";

export function drawIdentity(
  category: IdentityCategory,
  seen: string[],
  previous?: string,
) {
  const pool = identities.filter((item) => item.category === category);
  let used = seen.filter((id) => pool.some((item) => item.id === id));
  let available = pool.filter((item) => !used.includes(item.id));
  if (!available.length) {
    used = [];
    available = pool.filter((item) => item.id !== previous);
  }
  const entry = available[randomInt(available.length)];
  return { entry, seen: [...used, entry.id] };
}
