"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import ParticleField from "./particle-field";
import { CTA_TEXT, CTA_URL, LOAD_MS, STATUS_MESSAGES } from "@/lib/constants";

// Uneven, believable loading curve (0..1 -> 0..1)
function ease(x: number) {
  return x < 0.6 ? x * x * 1.1 : 0.396 + (x - 0.6) * 1.51 * (1 - (x - 0.6) * 0.2);
}

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<string>(STATUS_MESSAGES[0]);
  const [statusVisible, setStatusVisible] = useState(true);

  // Pointer: spotlight + logo tilt
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => {
      const root = rootRef.current;
      const logo = logoRef.current;
      if (root) {
        root.style.setProperty("--mx", `${e.clientX}px`);
        root.style.setProperty("--my", `${e.clientY}px`);
      }
      if (logo && !reduce) {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        logo.style.setProperty("--ry", `${nx * 20}deg`);
        logo.style.setProperty("--rx", `${-ny * 16}deg`);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Loading sequence
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 600 : LOAD_MS;
    const timers: number[] = [];
    let raf = 0;
    let start: number | null = null;
    let cancelled = false;
    let lastMsg = -1;

    const finish = () => {
      setDone(true);
      timers.push(window.setTimeout(() => ctaRef.current?.focus({ preventScroll: true }), 1800));
    };

    const frame = (ts: number) => {
      if (cancelled) return;
      if (start === null) start = ts;
      const x = Math.min((ts - start) / duration, 1);
      const p = x >= 1 ? 1 : Math.min(ease(x), 1);
      const pct = Math.round(p * 100);

      logoRef.current?.style.setProperty("--p", `${p * 100}%`);
      rootRef.current?.style.setProperty("--p01", String(p));
      fillRef.current?.style.setProperty("--s", String(p));
      if (countRef.current) countRef.current.textContent = String(pct).padStart(3, "0");
      meterRef.current?.setAttribute("aria-valuenow", String(pct));

      const k = Math.min(STATUS_MESSAGES.length - 1, Math.floor(p * STATUS_MESSAGES.length));
      if (k !== lastMsg) {
        lastMsg = k;
        setStatusVisible(false);
        timers.push(
          window.setTimeout(() => {
            setStatus(STATUS_MESSAGES[k]);
            setStatusVisible(true);
          }, 180),
        );
      }

      if (x < 1) raf = requestAnimationFrame(frame);
      else timers.push(window.setTimeout(finish, 450));
    };

    // Wait for the logo + font so the sequence never starts on a half-loaded page
    const imgs = Array.from(document.images).map((img) =>
      img.decode().catch(() => undefined),
    );
    const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise<void>((resolve) => {
      timers.push(window.setTimeout(resolve, 2500));
    });

    Promise.race([Promise.all([...imgs, fonts]), timeout]).then(() => {
      if (cancelled) return;
      setReady(true);
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const onCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2;
    const y = e.clientY || r.top + r.height / 2;
    const ring = document.createElement("div");
    ring.className = "ring";
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    document.body.appendChild(ring);
    window.setTimeout(() => ring.remove(), 1200);
  };

  return (
    <div ref={rootRef} className={`root${ready ? " is-ready" : ""}${done ? " done" : ""}`}>
      <ParticleField />
      <div className="spot" aria-hidden="true" />
      <div className="vig" aria-hidden="true" />

      <main>
        <div className="stage">
          <div className="tilt">
            <div ref={logoRef} className="logo" role="img" aria-label="MO logo">
              <div className="halo" />
              <Image className="dim" src="/logo.jpg" alt="" width={400} height={400} priority unoptimized />
              <Image className="lit" src="/logo.jpg" alt="" width={400} height={400} priority unoptimized />
              <div className="scan" />
            </div>
          </div>

          <div
            ref={meterRef}
            className="meter"
            role="progressbar"
            aria-label="Loading"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <div ref={countRef} className="count">000</div>
            <div className="bar"><i ref={fillRef} /></div>
            <div className="status" style={{ opacity: statusVisible ? 1 : 0 }}>{status}</div>
          </div>
        </div>

        <a
          ref={ctaRef}
          className="cta"
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Click here to visit m0.org (opens in a new tab)"
          tabIndex={done ? 0 : -1}
          onClick={onCtaClick}
        >
          <span className="t" aria-hidden="true">
            {CTA_TEXT.split("").map((c, i) =>
              c === " " ? (
                <span key={i} className="sp">&nbsp;</span>
              ) : (
                <span
                  key={i}
                  style={{ transitionDelay: `${0.9 + i * 0.06}s`, "--i": i } as CSSProperties}
                >
                  {c}
                </span>
              ),
            )}
          </span>
        </a>
      </main>
    </div>
  );
}
