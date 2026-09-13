import { characterRows } from "./identities/characters";
import { screenRows } from "./identities/screen";
import { bibleRows } from "./identities/bible";
export type IdentityCategory = "characters" | "screen" | "bible";
export interface Identity {
  id: string;
  category: IdentityCategory;
  name: string;
  description: string;
  hints: [string, string, string];
  source?: string;
}
export const identityCategories: {
  id: IdentityCategory;
  label: string;
  detail: string;
  icon: string;
}[] = [
  {
    id: "characters",
    label: "Personagens",
    detail: "Animações e super-heróis",
    icon: "✳",
  },
  {
    id: "screen",
    label: "Filmes e séries",
    detail: "Histórias que todo mundo conhece",
    icon: "▶",
  },
  {
    id: "bible",
    label: "Personagens bíblicos",
    detail: "Descrições com fonte no jw.org",
    icon: "✦",
  },
];

function catalog(category: IdentityCategory, rows: string): Identity[] {
  return rows
    .trim()
    .split("\n")
    .map((line) => {
      const fields = line.trim().split("|");
      if (
        fields.length !== (category === "bible" ? 5 : 4) ||
        fields.some((field) => !field.trim())
      )
        throw new Error("Carta inválida: " + line);
      const [name, hard, medium, easy, reference] = fields;
      const slug = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return {
      id: category + "-v2-" + slug,
        category,
        name,
        description: medium + " " + easy,
        hints: [hard, medium, easy],
        ...(reference
          ? {
              source:
                "https://www.jw.org/pt/biblioteca/biblia/biblia-de-estudo/livros/" +
                reference +
                "/",
            }
          : {}),
      };
    });
}
export const identities: Identity[] = [
  ...catalog("characters", characterRows),
  ...catalog("screen", screenRows),
  ...catalog("bible", bibleRows),
];
