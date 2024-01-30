import { useEffect, useMemo, useState } from "react";
import { useFrameTime } from "./utils/hooks/useFrame";

function shuffle<T extends number[]>(array: T): T {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function random(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// const tabelline = Array.from(Array(7).keys()+);
// const tabelline_b = Array.from(Array(10).keys());

const formatTimer = (durationMs: number) => {
  durationMs = Math.floor(durationMs);
  const seconds = Math.floor(durationMs / 1000);
  //   const ms = Math.floor(durationMs / 10) % 100;
  //   return `${seconds}:${ms.toString().padStart(2)}`;
  return seconds;
};

const secondleft = 30;

type GameState = "begin" | "running" | "end";

export function MoltiplicazioniGame() {
  const tick = useFrameTime();

  const [startTime, setStartTime] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);

  const [score, setScore] = useState(0);
  const [badScore, setBadScore] = useState(0);

  const [indexA, setIndexA] = useState(getRandomArbitrary(0, 7) + 2);
  const [indexB, setIndexB] = useState(getRandomArbitrary(0, 7) + 2);
  const [isRightResult, setIsRightResult] = useState(false);
  const [isWrongResult, setIsWrongResult] = useState(false);
  const [gameState, setGameState] = useState<GameState>("begin");

  const onResult = (s: number) => {
    if (s === indexA * indexB) {
      // Good
      setIsRightResult(true);
      setIsWrongResult(false);

      const speed = performance.now() - answerTime;
      console.log(Math.floor(speed / 1000));

      setScore(score + 1);
      setStartTime(startTime + 1000);
    } else {
      setIsRightResult(false);
      setIsWrongResult(true);
      setBadScore(badScore + 1);
    }

    setIndexA(getRandomArbitrary(0, 9) + 2);
    setIndexB(getRandomArbitrary(0, 9) + 2);
    setAnswerTime(tick - startTime);
  };

  const solutions = useMemo(
    () =>
      shuffle([
        indexA * indexB,
        (indexA + 1) * indexB,
        indexA * (indexB + 1),
        (indexA + 2) * indexB - 2,
      ]),
    [indexA, indexB]
  );

  const startGame = () => {
    setStartTime(performance.now());
    setAnswerTime(tick - performance.now());
    setGameState("running");
    setScore(0);
    setBadScore(0);
    setIndexA(getRandomArbitrary(0, 9) + 2);
    setIndexB(getRandomArbitrary(0, 9) + 2);
  };
  const stopGame = () => {
    setStartTime(0);
    setGameState("end");
  };

  useEffect(() => {
    // console.log(timeLeft);

    if (secondleft - formatTimer(tick - startTime) <= 0) {
      stopGame();
    }
  }, [tick, startTime]);

  const timeLeft = secondleft - formatTimer(tick - startTime);

  return (
    <div>
      {gameState === "running" && (
        <div>
          <div>Punteggio: {score}</div>
          <div>Tempo: {timeLeft}</div>
          {isRightResult && !isWrongResult && <div>Bravo</div>}
          {!isRightResult && isWrongResult && <div>Hai sbagliato!</div>}
          <div>
            {indexA} x {indexB}
          </div>
          {solutions.map((s) => (
            <button key={s} onClick={() => onResult(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {gameState === "begin" && (
        <div>
          {" "}
          <button onClick={startGame}>Inizia</button>{" "}
        </div>
      )}
      {gameState === "end" && (
        <div>
          <div>
            Hai totalizzato un punteggio di <strong>{score}</strong>
            <br />
            Ne hai sbagliate {badScore}
          </div>
          <button onClick={startGame}>Gioca ancora</button>{" "}
        </div>
      )}
    </div>
  );
}
