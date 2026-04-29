"use client";  

import { useEffect } from "react";

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

export default function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
      html { scroll-behavior: smooth; }
      body { overflow-x: hidden; background: ${T.greenDeep}; }

      @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
      @keyframes marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @keyframes pulse    { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
      @keyframes spin     { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

      .fade-up  { animation: fadeUp  0.7s ease both; }
      .fade-in  { animation: fadeIn  0.5s ease both; }
      .d1 { animation-delay: 0.1s; }
      .d2 { animation-delay: 0.25s; }
      .d3 { animation-delay: 0.4s; }
      .d4 { animation-delay: 0.55s; }
      .d5 { animation-delay: 0.7s; }

      .menu-card { transition: transform 0.28s cubic-bezier(.2,.8,.4,1), box-shadow 0.28s ease; }
      .menu-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.35); }

      .add-btn { transition: all 0.2s ease; }
      .add-btn:hover { background: ${T.yellowGold} !important; color: ${T.black} !important; border-color: ${T.yellowGold} !important; }

      .cat-btn { transition: all 0.22s ease; }
      .cat-btn:hover { border-color: ${T.yellowGold} !important; color: ${T.yellowGold} !important; }

      .nav-link { transition: color 0.18s ease; }
      .nav-link:hover { color: ${T.yellowGold} !important; }

      input:focus { outline: 2px solid ${T.yellowGold}; outline-offset: 1px; }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${T.greenDark}; }
      ::-webkit-scrollbar-thumb { background: ${T.greenBrand}; border-radius: 3px; }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}