import { createMachine, assign, createActor } from "xstate";

const gameMachine = createMachine({
  context: {
    count: 0,
  },
  initial: "begin",
  states: {
    begins: {
      on: {
        start: { target: "running" },
      },
    },
    running: {},
  },
});

export function createGame() {
  return createActor(gameMachine);
}
