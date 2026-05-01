"use client";
import { useState, useEffect, useCallback, SetStateAction } from "react";

// ── Design tokens (unchanged from v3) ───────────────────────
const T = {
  greenDeep:  "#0A1F0D",
  greenDark:  "#122A16",
  greenMid:   "#1E4D24",
  greenBrand: "#2D7A38",
  yellowGold: "#F0C419",
  yellowWarm: "#E8A900",
  yellowPale: "#FFFBDF",
  offWhite:   "#F5F5EE",
  black:      "#080C08",
};

// ── Ticker (unchanged) ───────────────────────────────────────
const TICKER_LABELS = ["🍞 SOURDOUGH","🥐 CROISSANTS","🎂 CUSTOM CAKES","☕ COLD BREW","🍓 TARTS","🌀 CINNAMON ROLLS"];
const TICKER_ITEMS  = [
  ...TICKER_LABELS.map((t, i) => ({ label: t, key: `a-${i}` })),
  ...TICKER_LABELS.map((t, i) => ({ label: t, key: `b-${i}` })),
];

// ── Carousel slides ──────────────────────────────────────────
// Each slide has its own hero image + headline + sub-copy.
// Images are loaded from /public — Next.js serves them at the root path.
const SLIDES = [
  {
    image:    "/Baked1.jpg",
    eyebrow:  "Baked fresh every morning in Nairobi",
    headline: ["Savor", "Every", "Moment."],
    // "Every" renders in italic gold — matched by highlightLine index
    highlightLine: 1,
    body: "Artisan breads, flaky pastries and decadent cakes — handcrafted with patience and baked to perfection at our Westlands kitchen.",
    cta:  "View Our Menu →",
  },
  {
    image:    "/Baked2.jpg",
    eyebrow:  "72-hour slow fermentation",
    headline: ["Bread as it", "Was Always", "Meant to Be."],
    highlightLine: 2,
    body: "Our sourdoughs are cold-fermented for 72 hours using heritage Kenyan wheat flour. No shortcuts. No preservatives. Just flour, water, salt and time.",
    cta:  "Browse our baked goods →",
  },
  {
    image:    "/Baked4.jpg",
    eyebrow:  "Custom cakes · pastries · tarts",
    headline: ["Every Occasion", "Deserves", "Something Special."],
    highlightLine: 1,
    body: "From birthday cakes to wedding pastries — each piece is crafted to order, with the same care and artistry we bring to everything that leaves our kitchen.",
    cta:  "Order a Custom Cake →",
  },
];

const AUTO_PLAY_MS = 6500; // auto-advance interval

// ── Inline styles injected once ─────────────────────────────
const HERO_CSS = `
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes heroPulse {
    0%,100% { transform: scale(1);    }
    50%     { transform: scale(1.06); }
  }
  @keyframes heroMarquee {
    from { transform: translateX(0);    }
    to   { transform: translateX(-50%); }
  }
  @keyframes imgZoomIn {
    from { transform: scale(1.08); }
    to   { transform: scale(1);    }
  }

  /* Slide images */
  .hero-img-enter {
    opacity: 0;
    transition: opacity 0.9s ease;
  }
  .hero-img-enter-active {
    opacity: 1;
  }
  .hero-img-exit {
    opacity: 1;
    transition: opacity 0.9s ease;
  }
  .hero-img-exit-active {
    opacity: 0;
  }

  /* Copy crossfade */
  .hero-copy-enter {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.55s ease 0.2s, transform 0.55s ease 0.2s;
  }
  .hero-copy-enter-active {
    opacity: 1;
    transform: translateY(0);
  }

  /* Zoom in on active image */
  .hero-img-zoom {
    animation: imgZoomIn 6s ease forwards;
  }

  /* Ticker */
  .hero-marquee { animation: heroMarquee 28s linear infinite; }

  /* Pulse badge */
  .hero-pulse { animation: heroPulse 3s ease infinite; }

  /* Dot indicators */
  .hero-dot {
    width: 8px; height: 8px; border-radius: 50%;
    border: 1.5px solid rgba(240,196,25,0.6);
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
  }
  .hero-dot.active {
    background: ${T.yellowGold};
    border-color: ${T.yellowGold};
    width: 28px;
    border-radius: 4px;
  }

  /* Progress bar */
  @keyframes progressFill {
    from { width: 0%; }
    to   { width: 100%; }
  }
  .hero-progress-bar {
    animation: progressFill ${AUTO_PLAY_MS}ms linear forwards;
  }

  /* Nav arrow buttons */
  .hero-arrow {
    background: rgba(245,245,238,0.08);
    border: 1.5px solid rgba(245,245,238,0.15);
    color: ${T.offWhite};
    width: 44px; height: 44px;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .hero-arrow:hover {
    background: ${T.yellowGold};
    border-color: ${T.yellowGold};
    color: ${T.black};
  }

  /* Primary CTA */
  .hero-btn-primary {
    background: ${T.yellowGold}; color: ${T.black};
    border: none; border-radius: 4px;
    padding: 15px 36px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 600;
    font-size: 0.95rem; letter-spacing: 0.04em;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .hero-btn-primary:hover { background: ${T.yellowWarm}; }

  /* Outline CTA */
  .hero-btn-outline {
    background: transparent; color: ${T.offWhite};
    border: 1px solid rgba(245,245,238,0.25); border-radius: 4px;
    padding: 15px 36px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-weight: 400; font-size: 0.95rem;
    transition: border-color 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .hero-btn-outline:hover {
    border-color: ${T.yellowGold};
    color: ${T.yellowGold};
  }
`;

// ── Helper: inject styles once ───────────────────────────────
function useHeroStyles() {
  useEffect(() => {
    if (document.getElementById("hero-carousel-styles")) return;
    const tag = document.createElement("style");
    tag.id          = "hero-carousel-styles";
    tag.textContent = HERO_CSS;
    document.head.appendChild(tag);
  }, []);
}

// ============================================================
// HERO COMPONENT
// ============================================================
export default function Hero() {
  const [current,  setCurrent]  = useState(0);
  const [prev,     setPrev]     = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [progressKey, setProgressKey] = useState(0); // remount to restart anim

  useHeroStyles();

  // ── Transition to a new slide ──────────────────────────────
  const goTo = useCallback((next: SetStateAction<number>) => {
    if (next === current) return;
    setPrev(current);
    setIsExiting(true);

    // After image fades out, swap and fade in
    setTimeout(() => {
      setCurrent(next);
      setPrev(null);
      setIsExiting(false);
      setProgressKey(k => k + 1);
    }, 500); // half the transition duration
  }, [current]);

  const goNext = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  // ── Auto-play ──────────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(goNext, AUTO_PLAY_MS);
    return () => clearTimeout(id);
  }, [current, goNext]);

  const slide = SLIDES[current];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh", position: "relative",
        display: "flex", flexDirection: "column", justifyContent: "center",
        overflow: "hidden",
        background: T.greenDeep, // fallback while image loads
      }}
    >

      {/* ── BACKGROUND IMAGE LAYER ──────────────────────────── */}
      {/* Previous image (fading out) */}
      {prev !== null && (
        <div
          key={`img-prev-${prev}`}
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage:    `url(${SLIDES[prev].image})`,
            backgroundSize:     "cover",
            backgroundPosition: "center",
            opacity: isExiting ? 0 : 1,
            transition: "opacity 0.9s ease",
          }}
        />
      )}

      {/* Current image (fading in + slow zoom) */}
      <div
        key={`img-curr-${current}`}
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage:    `url(${slide.image})`,
          backgroundSize:     "cover",
          backgroundPosition: "center",
          opacity: 1,
          transition: "opacity 0.9s ease",
          // Subtle Ken Burns zoom — resets each slide change via key
          animation: "imgZoomIn 6s ease forwards",
        }}
      />

      {/* Dark overlay — keeps text readable over any photo */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: `linear-gradient(
          110deg,
          rgba(8,12,8,0.82)  0%,
          rgba(10,31,13,0.7) 50%,
          rgba(8,12,8,0.45)  100%
        )`,
      }} />

      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, opacity: 0.04, pointerEvents: "none",
        backgroundImage: `linear-gradient(${T.yellowGold} 1px, transparent 1px), linear-gradient(90deg, ${T.yellowGold} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div style={{
        maxWidth: "1240px", margin: "0 auto",
        padding: "120px 2.5rem 100px",
        position: "relative", zIndex: 4, width: "100%",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "4rem", alignItems: "center" }}>

          {/* LEFT: copy — fades + slides up on slide change */}
          <div
            key={`copy-${current}`}
            style={{
              opacity: 0,
              transform: "translateY(14px)",
              animation: "heroFadeUp 0.6s ease 0.15s forwards",
            }}
          >
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              border: "1px solid rgba(240,196,25,0.35)",
              borderRadius: "50px", padding: "6px 18px", marginBottom: "2rem",
              color: T.yellowGold,
              fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem",
              fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.yellowGold, display: "inline-block" }} />
              {slide.eyebrow}
            </div>

            {/* Headline — each line is plain text except the highlighted one */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3.4rem, 6.5vw, 6rem)",
              fontWeight: 700, lineHeight: 1.05,
              color: T.offWhite, margin: "0 0 0.15em",
            }}>
              {slide.headline.map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === slide.highlightLine
                    ? <em style={{ color: T.yellowGold, fontStyle: "italic" }}>{line}</em>
                    : line
                  }
                </span>
              ))}
            </h1>

            {/* Body */}
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontSize: "1.05rem",
              color: "rgba(245,245,238,0.65)", lineHeight: 1.8,
              maxWidth: "440px", margin: "1.75rem 0 2.5rem",
            }}>
              {slide.body}
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                className="hero-btn-primary"
                onClick={() => scrollTo("menu")}
              >
                {slide.cta}
              </button>
              <button
                className="hero-btn-outline"
                onClick={() => scrollTo("about")}
              >
                Our Story
              </button>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: "0", marginTop: "3.5rem",
              borderTop: "1px solid rgba(245,245,238,0.08)", paddingTop: "2rem",
            }}>
              {[["6+","Years"], ["40+","Menu Items"], ["4.9★","Rating"]].map(([num, label], i) => (
                <div key={label} style={{
                  flex: 1, paddingRight: "2rem",
                  borderRight: i < 2 ? "1px solid rgba(245,245,238,0.1)" : "none",
                  marginRight: i < 2 ? "2rem" : 0,
                }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 700, color: T.yellowGold, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: "rgba(245,245,238,0.45)", marginTop: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: carousel controls panel */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "2rem" }}>

            {/* Slide counter */}
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "rgba(245,245,238,0.35)", fontSize: "1rem",
              letterSpacing: "0.1em",
            }}>
              <span style={{ color: T.yellowGold, fontSize: "2rem", fontWeight: 700 }}>
                {String(current + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(SLIDES.length).padStart(2, "0")}
            </div>

            {/* Slide title preview cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    background:   i === current ? "rgba(240,196,25,0.1)"  : "rgba(245,245,238,0.04)",
                    border:       `1.5px solid ${i === current ? "rgba(240,196,25,0.4)" : "rgba(245,245,238,0.08)"}`,
                    borderRadius: "6px",
                    padding:      "0.85rem 1.1rem",
                    cursor:       "pointer",
                    textAlign:    "left",
                    transition:   "all 0.25s ease",
                    // Left accent bar for active
                    borderLeft: i === current
                      ? `3px solid ${T.yellowGold}`
                      : "3px solid transparent",
                  }}
                >
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.68rem", color: i === current ? T.yellowGold : "rgba(245,245,238,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px", fontWeight: 600 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: i === current ? T.offWhite : "rgba(245,245,238,0.4)", lineHeight: 1.2 }}>
                    {s.headline.join(" ")}
                  </div>
                </button>
              ))}
            </div>

            {/* Prev / Next arrows */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.5rem" }}>
              <button className="hero-arrow" onClick={goPrev} aria-label="Previous slide">←</button>
              <button className="hero-arrow" onClick={goNext} aria-label="Next slide">→</button>

              {/* Progress bar */}
              <div style={{ flex: 1, height: "2px", background: "rgba(245,245,238,0.1)", borderRadius: "1px", overflow: "hidden" }}>
                <div
                  key={`progress-${progressKey}`}
                  className="hero-progress-bar"
                  style={{ height: "100%", background: T.yellowGold, borderRadius: "1px", width: "0%" }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── DOT INDICATORS (bottom center) ──────────────────── */}
      <div style={{
        position: "absolute", bottom: "60px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "8px", alignItems: "center",
        zIndex: 5,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? " active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── TICKER ──────────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: T.yellowGold, overflow: "hidden",
        height: "42px", display: "flex", alignItems: "center",
        zIndex: 5,
      }}>
        <div className="hero-marquee" style={{ display: "flex", whiteSpace: "nowrap" }}>
          {TICKER_ITEMS.map(({ label, key }) => (
            <span key={key} style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700,
              fontSize: "0.82rem", color: T.black,
              letterSpacing: "0.1em", padding: "0 2rem",
            }}>
              {label}
              <span style={{ color: T.greenBrand, marginLeft: "2rem" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
