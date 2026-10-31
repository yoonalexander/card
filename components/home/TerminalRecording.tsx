"use client";

import { useEffect, useRef, useState } from "react";

type Recording = { duration: number; events: [number, "o", string][] };

export default function TerminalRecording({ src, name }: { src: string; name: string }) {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const positionRef = useRef(0);
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setRecording(null);
    setError(false);
    setPlaying(false);
    setPosition(0);
    positionRef.current = 0;
    async function load() {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error("Recording unavailable");
        const [headerLine, ...eventLines] = (await response.text()).trim().split("\n");
        const header = JSON.parse(headerLine);
        if (header.version !== 2 || !Number.isFinite(header.duration)) throw new Error("Invalid recording");
        const events: Recording["events"] = eventLines.map((line) => JSON.parse(line));
        if (!controller.signal.aborted) setRecording({ duration: header.duration, events });
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [src]);

  useEffect(() => {
    if (!playing || !recording) return;
    const start = performance.now();
    const from = positionRef.current;
    const timer = window.setInterval(() => {
      const next = Math.min(recording.duration, from + (performance.now() - start) / 1000);
      positionRef.current = next;
      setPosition(next);
      if (next >= recording.duration) setPlaying(false);
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, recording]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [position]);

  function seek(value: number) {
    setPlaying(false);
    positionRef.current = value;
    setPosition(value);
  }

  const output = recording?.events.filter(([time]) => time <= position).map(([, , text]) => text).join("");

  return (
    <div className="terminal-recording">
      <p className="terminal-recording-caption">Captured CLI 0.2.0 output · playback paced for readability</p>
      {error ? <p role="alert">The replay could not load. The transcript and original JSON are available below.</p> : (
        <>
          <pre ref={outputRef} className="terminal-recording-output" tabIndex={0} aria-label={`${name} recorded terminal output`}>
            {recording ? output : "Loading recording…"}
          </pre>
          <div className="terminal-recording-controls">
            <button type="button" disabled={!recording} onClick={() => {
              if (recording && position >= recording.duration) seek(0);
              setPlaying((current) => !current);
            }}>{playing ? "Pause" : position >= (recording?.duration || Infinity) ? "Replay" : "Play"}</button>
            <button type="button" disabled={!recording} onClick={() => seek(recording?.duration || 0)}>Show result</button>
            <label className="terminal-recording-seek">
              <span className="sr-only">Recording position</span>
              <input type="range" min={0} max={recording?.duration || 1} step={0.1} value={position}
                disabled={!recording} onChange={(event) => seek(Number(event.target.value))} />
            </label>
            <span>{Math.floor(position)} / {Math.ceil(recording?.duration || 0)}s</span>
          </div>
        </>
      )}
      <p className="terminal-recording-caption">Reject an incomplete proposal → exact solve → recheck. Classical Sudoku tooling; no learned model.</p>
      <div className="terminal-recording-downloads">
        <a href={src} download>Download recording</a>
        <a href="/assets/projects/concept-firewall/sudoku-demo.txt" target="_blank" rel="noopener noreferrer">Read transcript</a>
        <a href="/assets/projects/concept-firewall/sudoku-demo.json" target="_blank" rel="noopener noreferrer">Original JSON</a>
      </div>
    </div>
  );
}
