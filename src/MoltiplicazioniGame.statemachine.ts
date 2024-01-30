import { createMachine, assign, createActor } from "xstate";

const gameMachine = createMachine({
  context: {
    count: 0,
  },
  initial: "begin",
  on: {
    begin: {
      actions: assign({
        start: ({ context }) => context.count + 1,
      }),
    },
    DEC: {
      actions: assign({
        count: ({ context }) => context.count - 1,
      }),
    },
    SET: {
      actions: assign({
        count: ({ event }) => event.value,
      }),
    },
  },
});

export function createGame() {
  return createActor(gameMachine);
}
