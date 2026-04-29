"use client"; 

import { useState, useEffect } from "react";


const T = {
  greenDeep:   "#0A1F0D",
  greenDark:   "#122A16",
  greenMid:    "#1E4D24",
  greenBrand:  "#2D7A38",
  greenLight:  "#4CAF57",
  yellowGold:  "#F0C419",
  yellowWarm:  "#E8A900",
  yellowPale:  "#FFFBDF",
  offWhite:    "#F5F5EE",
  black:       "#080C08",
};


type NavProps = {
  count: number;
  onCartOpen: () => void;
};

const NAV_CSS = `
  .btn-nav-link:hover {
    color: ${T.yellowGold} !important;
    text-decoration: underline solid #ffffff;
    text-underline-offset: 0.15rem;
  }
`;

function useNavStyles() {
  useEffect(() => {
    if (document.getElementById("nav-link-styles")) return;
    const tag = document.createElement("style");
    tag.id = "nav-link-styles";
    tag.textContent = NAV_CSS;
    document.head.appendChild(tag);
  }, []);
}

export default function Nav({ count, onCartOpen }: NavProps) {
  useNavStyles();

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem",
      background: scrolled ? "rgba(8,12,8,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(240,196,25,0.15)" : "none",
      transition: "all 0.4s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        onClick={() => scrollTo("home")}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: T.yellowGold,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
        }}>🥐</div>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.45rem", fontWeight: 700, color: T.offWhite,
          letterSpacing: "0.03em",
        }}>Jomo&apos;s Bakehouse</span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {[["home","Home"],["menu","Menu"],["about","Our Story"],["contact","Contact"]].map(([id, label]) => (
          <button
            key={id}
            className="btn-nav-link"
            onClick={() => scrollTo(id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.88rem",
              fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
              color: "rgba(245,245,238,0.72)",
              transition: "color 0.18s ease",
            }}
          >{label}</button>
        ))}

        <button
          className="btn-cart"
          onClick={onCartOpen}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: T.yellowGold, border: "none",
            borderRadius: "50px", padding: "9px 20px",
            cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            fontWeight: 600, fontSize: "0.88rem", color: T.black,
            transition: "background 0.2s",
          }}
        >
          🛒 Order
          {count > 0 && (
            <span style={{
              background: T.black, color: T.yellowGold,
              borderRadius: "50%", width: "22px", height: "22px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.72rem", fontWeight: 700,
            }}>{count}</span>
          )}
        </button>
      </div>
    </nav>
  );
}