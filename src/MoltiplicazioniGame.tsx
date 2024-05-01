import { useEffect, useMemo, useRef, useState } from "react";
import { useFrameTime } from "./utils/hooks/useFrame";
import { Box, Button, Flex, Grid, Link, Text } from "@radix-ui/themes";
import { Link as LinkRouter } from "wouter";

function shuffle<T extends number[]>(array: T): T {
  array.sort(() => Math.random() - 0.5);
  return array;
}

// function random(seed: number) {
//   const x = Math.sin(seed++) * 10000;
//   return x - Math.floor(x);
// }

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// const tabelline = Array.from(Array(7).keys()+);
// const tabelline_b = Array.from(Array(10).keys());

// const formatTimer = (durationMs: number) => {
//   durationMs = Math.floor(durationMs);
//   const seconds = Math.floor(durationMs / 1000);
//   //   const ms = Math.floor(durationMs / 10) % 100;
//   //   return `${seconds}:${ms.toString().padStart(2)}`;
//   return seconds;
// };

function formatCountdown(milliseconds: number) {
  // Convert milliseconds to minutes and seconds
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Pad seconds with leading zero if needed
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  // Return formatted time string
  return `${minutes}:${formattedSeconds}`;
}

const millisecondleft = 30 * 1000;

type GameState = "begin" | "running" | "end" | "result";

export function MoltiplicazioniGame({
  params,
}: {
  params: { numero: string };
}) {
  const tick = useFrameTime();

  const [startTime, setStartTime] = useState(tick);
  const [answerTime, setAnswerTime] = useState(0);
  const [isPause, setPause] = useState(false);

  const [score, setScore] = useState(0);
  const [badScore, setBadScore] = useState(0);

  // const [indexA, setIndexA] = useState(getRandomArbitrary(0, 7) + 2);
  const [indexA, setIndexA] = useState(parseInt(params.numero, 10));
  const [indexB, setIndexB] = useState(getRandomArbitrary(0, 7) + 2);
  const [isRightResult, setIsRightResult] = useState(false);
  const [isWrongResult, setIsWrongResult] = useState(false);
  const [, setChoosedAnswer] = useState(0);
  const [gameState, setGameState] = useState<GameState>("begin");

  const timeRef = useRef<number>(0);

  const onResult = (s: number) => {
    timeRef.current = tick - startTime;
    if (s === indexA * indexB) {
      // Good
      setIsRightResult(true);
      setIsWrongResult(false);

      setAnswerTime(performance.now());

      setScore(score + 1);
      // setStartTime(startTime + 1000);
    } else {
      setIsRightResult(false);
      setIsWrongResult(true);
      setBadScore(badScore + 1);
    }

    setChoosedAnswer(s);
    setGameState("result");

    // setIndexA(getRandomArbitrary(0, 9) + 2);
  };

  const solutions = useMemo(
    () =>
      shuffle([
        indexA * indexB,
        indexA * indexB + 1,
        indexA * indexB + 3,
        indexA * indexB - 1,
        // (indexA + 1) * indexB,
        // (indexA + 2) * indexB - 2,
      ]),
    [indexA, indexB]
  );

  const startGame = () => {
    setStartTime(performance.now());
    setAnswerTime(tick - performance.now());
    setGameState("running");
    setScore(0);
    setBadScore(0);
    // setIndexA(getRandomArbitrary(0, 9) + 2);
    setIndexA(parseInt(params.numero, 10));
    setIndexB(getRandomArbitrary(0, 9) + 2);
  };
  const stopGame = () => {
    setStartTime(0);
    setGameState("end");
  };

  const nextStep = () => {
    setIndexA(parseInt(params.numero, 10));

    let nextIndexB = indexB;
    while (indexB === nextIndexB) {
      nextIndexB = getRandomArbitrary(0, 9) + 2;
    }

    setIndexB(nextIndexB);

    // Add 1 second if answer is correct
    if (isRightResult) {
      setStartTime(startTime + 1000);
    }

    // Add 1/2second if answer is quick
    const speed = performance.now() - answerTime;
    console.log(Math.floor(speed / 1000));

    setAnswerTime(tick - startTime);
    setGameState("running");
  };

  // useEffect(() => {
  //   console.log(gameState);
  //   if (gameState === "running") {
  //     // setStartTime((startTime) => {
  //     //   // add second during the pause
  //     //   const s = tick - timeRef.current;

  //     //   console.log(timeRef.current);

  //     //   return s;
  //     // });
  //     // } else {
  //     setTimeLeft((tl) => tl - 60);
  //   }
  // }, [tick, gameState]);

  useEffect(() => {
    if (gameState !== "running") {
      const s = tick - timeRef.current;
      setStartTime(s);
      // } else {
      // setTimeLeft((tl) => tl - 60);
    }
  }, [tick, gameState]);

  useEffect(() => {
    if (isPause) {
      const s = tick - timeRef.current;
      setStartTime(s);
      // } else {
      // setTimeLeft((tl) => tl - 60);
    }
  }, [tick, isPause]);

  useEffect(() => {
    // if (gameState === "running") {
    if (millisecondleft - (tick - startTime) <= 0) {
      stopGame();
    }
    // }
  }, [tick, startTime]);

  const onSetPause = () => {
    timeRef.current = tick - startTime;
    setPause(true);
  };
  const onSetPlay = () => {
    setPause(false);
  };
  // useEffect(() => {
  //   // if (gameState === "running") {
  //   if (timeLeft <= 0) {
  //     stopGame();
  //   }
  //   // }
  // }, [timeLeft]);

  // const timer = secondleft - formatTimer(tick - startTime);
  const timer = millisecondleft - (tick - startTime);

  return (
    <Flex
      direction={"column"}
      justify={"between"}
      gap={"4"}
      height={"100%"}
      p={"4"}
    >
      <Flex gap={"2"} justify={"between"}>
        <Box>
          {isPause ? (
            <Button onClick={() => onSetPlay()}>Play</Button>
          ) : (
            <Button onClick={() => onSetPause()}>Pausa</Button>
          )}
        </Box>
        <Box>
          <Text weight={"bold"} size={"4"}>
            Tempo: {timer < 0 ? formatCountdown(0) : formatCountdown(timer)}
          </Text>
        </Box>
        <Box>Punteggio: {score}</Box>
      </Flex>

      {gameState === "running" && (
        <Flex
          align={"center"}
          direction={"column"}
          justify={"center"}
          flexGrow={"1"}
        >
          {/* {isRightResult && !isWrongResult && <div>Bravo</div>} */}
          {/* {!isRightResult && isWrongResult && <div>Hai sbagliato!</div>} */}
          <Text as="div" size={"9"} mb={"4"}>
            {indexA} x {indexB}
          </Text>

          <Grid columns="2" gap="3" rows="repeat(2, 64px)" width="auto">
            {solutions.map((s) => {
              const sessionStep = `${indexA}_${indexB}_${s}`;

              return (
                <Button
                  key={sessionStep}
                  onClick={() => onResult(s)}
                  size={"4"}
                  variant="soft"
                >
                  {s}
                </Button>
              );
            })}
          </Grid>
        </Flex>
      )}

      {gameState === "result" && (
        <Flex
          align={"center"}
          direction={"column"}
          justify={"center"}
          flexGrow={"1"}
        >
          <Text as="div" size={"8"} mb={"2"}>
            {isRightResult && (
              <Text color="green" as="span">
                Ottimo
              </Text>
            )}
            {isWrongResult && (
              <Text color="red" as="span">
                Sbagliato
              </Text>
            )}
          </Text>

          <Text as="div" size={"9"} mb={"4"}>
            {indexA} x {indexB} = <Text color="green">{indexA * indexB}</Text>
            {/* {isWrongResult && <span>, non fa {choosedAnswer}</span>} */}
          </Text>
          <Button onClick={nextStep} size={"4"}>
            Continua
          </Button>
        </Flex>
      )}

      {gameState === "begin" && (
        <Flex align={"center"} justify={"center"} flexGrow={"1"}>
          <Button size={"4"} onClick={startGame}>
            Inizia
          </Button>{" "}
        </Flex>
      )}

      {gameState === "end" && (
        <Flex
          align={"center"}
          direction={"column"}
          justify={"center"}
          flexGrow={"1"}
          width={"70%"}
          mx={"auto"}
        >
          <Text align={"center"} as="div" size={"9"} mb={"4"}>
            Hai totalizzato
            <br /> <strong>{score}</strong> punti
          </Text>
          {badScore > 0 && (
            <Text as="div" size={"7"} mb={"4"} color="orange">
              Ne hai sbagliate {badScore}
            </Text>
          )}
          <Button onClick={startGame} size={"4"} mb={"4"}>
            Gioca ancora
          </Button>
          <Link asChild>
            <LinkRouter to="/">indietro</LinkRouter>
          </Link>
        </Flex>
      )}
    </Flex>
  );
}
