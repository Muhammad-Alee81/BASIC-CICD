import { useEffect, useRef, useState } from "react";

export const STAGES = [
  { id: "commit", name: "Commit", note: "You push to GitHub" },
  { id: "test", name: "Test", note: "Vitest runs every check" },
  { id: "build", name: "Build", note: "Docker image is created" },
  { id: "ship", name: "Ship", note: "Image is published, ready to run" },
];

export function usePipeline(stepMs = 1100) {
  // active: -1 = idle, 0..3 = running that stage, 4 = finished
  const [active, setActive] = useState(-1);
  const timer = useRef(null);

  const run = () => {
    clearInterval(timer.current);
    setActive(0);
    timer.current = setInterval(() => {
      setActive((a) => {
        if (a >= STAGES.length) {
          clearInterval(timer.current);
          return a;
        }
        return a + 1;
      });
    }, stepMs);
  };

  useEffect(() => () => clearInterval(timer.current), []);
  return { active, run };
}

function Stack({ active }) {
  return (
    <ol className="stack" aria-label="Pipeline stages">
      {STAGES.map((s, i) => {
        const state = active > i ? "done" : active === i ? "running" : "idle";
        return (
          <li key={s.id} className={`box ${s.id} ${state}`}>
            <span className="box-name">{s.name}</span>
            <span className="box-note">{state === "done" ? "Passed" : s.note}</span>
          </li>
        );
      })}
    </ol>
  );
}

function CopyCommand({ command }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: ignore */
    }
  };
  return (
    <div className="terminal">
      <code>$ {command}</code>
      <button onClick={copy}>{copied ? "Copied" : "Copy command"}</button>
    </div>
  );
}

export default function App() {
  const { active, run } = usePipeline();
  const finished = active >= STAGES.length;

  return (
    <>
      <header className="nav">
        <span className="logo">Dockyard</span>
        <a href="#how">How it works</a>
        <a href="#run">Run it</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <h1>Push your code. The harbor does the rest.</h1>
            <p>
              Every push is tested, built into a Docker image and shipped
              automatically. You only type one command to run it.
            </p>
            <button className="cta" onClick={run} disabled={active >= 0 && !finished}>
              {active < 0 ? "Run the pipeline" : finished ? "Run it again" : "Shipping…"}
            </button>
            <p className="status" role="status">
              {finished ? "Build passed. Your app is ready to run." : "\u00A0"}
            </p>
          </div>
          <Stack active={active} />
        </section>

        <section id="how" className="how">
          <h2>What happens after git push</h2>
          <ol className="steps">
            <li><b>1. GitHub Actions wakes up.</b> It installs your packages and runs the tests.</li>
            <li><b>2. The build is checked.</b> If tests or the build fail, nothing is shipped.</li>
            <li><b>3. Docker packs the app.</b> Nginx serves the finished site inside a small image.</li>
            <li><b>4. The image is published.</b> It goes to GitHub Container Registry, ready for any server.</li>
          </ol>
        </section>

        <section id="run" className="run">
          <h2>Run it on your machine</h2>
          <p>Docker is the only thing you need installed. Then open localhost:8080.</p>
          <CopyCommand command="docker compose up --build" />
        </section>
      </main>

      <footer>Built with React, Docker and GitHub Actions.</footer>
    </>
  );
}
