export type Phase =
  | "WAITING_FOR_THEME"
  | "DISTRIBUTING_NUMBERS"
  | "PRESENTING"
  | "ORDERING"
  | "READY_FOR_RESULT"
  | "RESULT";
export interface Room {
  mode?: "ONLINE" | "IN_PERSON";
  deal?: number;
  code: string;
  hostId: string;
  status: "LOBBY" | "PLAYING" | "CLOSED";
  roundNo: number;
  currentRoundId: string;
  createdAt: unknown;
}
export interface Player {
  uid: string;
  name: string;
  connected: boolean;
  joinedAt: unknown;
}
export interface Round {
  state: Phase;
  theme: string;
  lowLabel: string;
  highLabel: string;
  playerIds: string[];
  presentationOrder: string[];
  currentPresentationIndex: number;
  groupOrder: string[];
  createdAt: unknown;
}
export interface Answer {
  playerId: string;
  playerName: string;
  answer: string;
  skipped: boolean;
}
export interface Secret {
  playerId: string;
  number: number;
}
