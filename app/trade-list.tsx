"use client";

import { Figtree } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const figtree = Figtree({ subsets: ["latin"], display: "swap" });

const STORAGE_KEY = "zb-trade-list";
const SHOW_AFTER_MS = 8000;
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

type Status = "idle" | "sending" | "joined" | "error";

declare global {
  interface Window {
    klaviyo?: { identify: (props: Record<string, unknown>) => unknown };
  }
}

// Stored as "joined" (never show again) or the dismissal timestamp (show again after SNOOZE_MS).
function readState() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeState(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}

export default function TradeList() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [audience, setAudience] = useState<"trade" | "collector">("trade");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const state = readState();
    if (state === "joined") return;
    if (state && Date.now() - Number(state) < SNOOZE_MS) return;

    const timer = setTimeout(() => dialog.current?.showModal(), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    if (status !== "joined") writeState(String(Date.now()));
    dialog.current?.close();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, audience }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      writeState("joined");
      window.klaviyo?.identify({ email, audience });
      setStatus("joined");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={dialog}
      className={`trade-list ${figtree.className}`}
      aria-labelledby="trade-list-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <div className="tl-art">
        <p className="tl-wordmark">Zollman Blue</p>
        <div className="tl-photo" />
        <p className="tl-place">Johnson City, Texas</p>
      </div>

      <div className="tl-body">
        <span className="tl-grip" aria-hidden="true" />
        <button type="button" className="tl-close" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 5 14 14M19 5 5 19" />
          </svg>
        </button>
        <div className="tl-photo-wide" />

        <p className="tl-eyebrow">The Trade List</p>
        <h2 id="trade-list-title" className="tl-title">
          First look, <br className="tl-break" />
          <em>before the floor.</em>
        </h2>

        {status === "joined" ? (
          <>
            <p className="tl-copy">
              You&rsquo;re on the list. Watch your inbox for the next arrivals from Hill Country
              estates.
            </p>
            <div className="tl-footer">
              <span />
              <button type="button" className="tl-skip" onClick={close}>
                Close
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submit}>
            <p className="tl-copy">
              New finds arrive each week from Hill Country estates. Join for early previews, trade
              pricing, and the pieces we hold for designers.
            </p>

            <fieldset className="tl-audience">
              <legend className="tl-sr">I am a</legend>
              <label>
                <input
                  type="radio"
                  name="audience"
                  value="trade"
                  checked={audience === "trade"}
                  onChange={() => setAudience("trade")}
                />
                Designer or trade
              </label>
              <label>
                <input
                  type="radio"
                  name="audience"
                  value="collector"
                  checked={audience === "collector"}
                  onChange={() => setAudience("collector")}
                />
                Collector
              </label>
            </fieldset>

            <div className="tl-field">
              <label htmlFor="trade-list-email" className="tl-sr">
                Email address
              </label>
              <input
                id="trade-list-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? (
                  "Joining…"
                ) : (
                  <>
                    <span className="tl-desktop-only">Join</span>
                    <span className="tl-mobile-only">Join the list</span>
                  </>
                )}
              </button>
            </div>
            <p className="tl-error" role="alert">
              {status === "error" ? error : ""}
            </p>

            <div className="tl-footer">
              <span>A few notes a month. Never shared.</span>
              <button type="button" className="tl-skip" onClick={close}>
                <span className="tl-desktop-only">No thank you</span>
                <span className="tl-mobile-only">No thanks</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
