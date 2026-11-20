import { tallyAlibiVotes } from "./alibi";

export type AlibiChoice = "colou" | "furado";
export type AlibiPhase = "presentation" | "timer" | "surprise" | "answers" | "reveal" | "vote" | "result" | "cancelled";
export type AlibiRound = {
  id: string;
  host: string;
  suspects: [string, string];
  investigator: string | null;
  jurors: string[];
  phase: AlibiPhase;
  deadline: number | null;
  questions: [string, string, string];
  answers: Record<string, [string, string, string]>;
  votes: Record<string, AlibiChoice>;
  result: ReturnType<typeof tallyAlibiVotes> | null;
};

export type AlibiAction =
  | { type: "start" }
  | { type: "tick" }
  | { type: "question"; question: string }
  | { type: "answer"; answers: [string, string, string] }
  | { type: "beginVote" }
  | { type: "vote"; choice: AlibiChoice }
  | { type: "skipVerdict" }
  | { type: "cancel" };

/** Apply inside a trusted transaction. `now` must come from the trusted service, never the client. */
export function applyAlibiAction(round: AlibiRound, roundId: string, actor: string, now: number, action: AlibiAction): AlibiRound {
  if (round.id !== roundId) throw new Error("Rodada anterior.");
  if (!Number.isFinite(now)) throw new Error("Horário inválido.");
  if (![...round.suspects, ...round.jurors, ...(round.investigator ? [round.investigator] : [])].includes(actor)) throw new Error("Participante não pertence à rodada.");
  const next: AlibiRound = { ...round, questions: [...round.questions], answers: { ...round.answers }, votes: { ...round.votes } };
  const host = () => { if (actor !== round.host) throw new Error("Somente o anfitrião."); };
  const phase = (expected: AlibiPhase) => { if (round.phase !== expected) throw new Error("Fase inválida."); };
  const finish = () => { next.result = tallyAlibiVotes(Object.values(next.votes)); next.phase = "result"; next.deadline = null; };
  switch (action.type) {
    case "start":
      host(); phase("presentation"); next.phase = "timer"; next.deadline = now + 30_000; break;
    case "tick":
      if (round.deadline === null || now < round.deadline) throw new Error("Prazo ainda não terminou.");
      if (round.phase === "timer") {
        next.phase = round.investigator ? "surprise" : "answers";
        next.deadline = round.investigator ? round.deadline + 15_000 : null;
        // A client returning late must advance immediately to the current phase.
        if (next.deadline !== null && now >= next.deadline) { next.phase = "answers"; next.deadline = null; }
      } else if (round.phase === "surprise") { next.phase = "answers"; next.deadline = null; }
      else if (round.phase === "vote") finish();
      else throw new Error("Fase sem prazo.");
      break;
    case "question": {
      phase("surprise");
      if (actor !== round.investigator || round.deadline === null || now >= round.deadline) throw new Error("Pergunta não permitida.");
      const question = action.question.trim();
      if (question.length > 200) throw new Error("Pergunta longa demais.");
      if (question) next.questions[2] = question;
      next.phase = "answers"; next.deadline = null; break;
    }
    case "answer": {
      phase("answers");
      if (!round.suspects.includes(actor) || round.answers[actor]) throw new Error("Resposta não permitida.");
      const answers = action.answers.map((a) => a.trim());
      if (answers.length !== 3 || answers.some((a) => !a || a.length > 500)) throw new Error("Preencha as três respostas.");
      next.answers[actor] = answers as [string, string, string];
      if (round.suspects.every((id) => next.answers[id])) next.phase = "reveal";
      break;
    }
    case "beginVote":
      host(); phase("reveal"); next.phase = "vote"; next.deadline = round.investigator ? now + 30_000 : null; break;
    case "vote": {
      phase("vote");
      const eligible = round.jurors.length ? round.jurors : [round.investigator ?? round.host];
      if (!eligible.includes(actor) || round.votes[actor] || (round.deadline !== null && now >= round.deadline) || !["colou", "furado"].includes(action.choice)) throw new Error("Voto não permitido.");
      next.votes[actor] = action.choice;
      if (eligible.every((id) => next.votes[id])) finish();
      break;
    }
    case "skipVerdict":
      host(); phase("vote"); if (round.investigator) throw new Error("Apenas na dupla."); finish(); break;
    case "cancel": host(); if (["result", "cancelled"].includes(round.phase)) throw new Error("Rodada encerrada."); next.phase = "cancelled"; next.deadline = null; break;
  }
  return next;
}

/** Projection for a trusted service; never publish the underlying round object. */
export function alibiView(round: AlibiRound, actor: string) {
  if (![...round.suspects, ...round.jurors, ...(round.investigator ? [round.investigator] : [])].includes(actor)) throw new Error("Participante não pertence à rodada.");
  const revealed = ["reveal", "vote", "result"].includes(round.phase);
  const questions = ["answers", "reveal", "vote", "result"].includes(round.phase)
    ? round.questions
    : round.phase === "surprise" && actor === round.investigator
      ? round.questions.slice(0, 2)
      : [];
  return {
    id: round.id, host: round.host, suspects: round.suspects,
    investigator: round.investigator, jurors: round.jurors,
    phase: round.phase, deadline: round.deadline, questions,
    submitted: Object.keys(round.answers),
    answers: revealed ? round.answers : round.answers[actor] ? { [actor]: round.answers[actor] } : {},
    voted: Object.keys(round.votes),
    result: round.phase === "result" ? round.result : null,
  };
}
