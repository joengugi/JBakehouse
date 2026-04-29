"use client";

import { useState } from "react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  desc: string;
  badge: string | null;
}

interface MenuSectionProps {
  addItem: (item: MenuItem) => void;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 1,  name: "Sourdough Loaf",     category: "Breads",   price: 550,  emoji: "🍞", desc: "72-hour cold ferment, crispy crust",        badge: "Bestseller"  },
  { id: 2,  name: "Rosemary Focaccia",  category: "Breads",   price: 420,  emoji: "🫓", desc: "Olive oil, sea salt & fresh rosemary",       badge: null          },
  { id: 3,  name: "Whole Wheat Tin",    category: "Breads",   price: 380,  emoji: "🍞", desc: "100% whole grain, soft crumb",               badge: null          },
  { id: 4,  name: "Butter Croissant",   category: "Pastries", price: 180,  emoji: "🥐", desc: "48-layer laminated dough",                   badge: "Fresh Daily" },
  { id: 5,  name: "Almond Danish",      category: "Pastries", price: 210,  emoji: "🥐", desc: "Frangipane filling, flaked almonds",          badge: null          },
  { id: 6,  name: "Pain au Chocolat",   category: "Pastries", price: 200,  emoji: "🍫", desc: "Valrhona dark chocolate sticks",             badge: null          },
  { id: 7,  name: "Cinnamon Roll",      category: "Pastries", price: 190,  emoji: "🌀", desc: "Cream cheese glaze, warm spices",            badge: "Fan Fave"    },
  { id: 8,  name: "Strawberry Tart",    category: "Pastries", price: 320,  emoji: "🍓", desc: "Vanilla custard, fresh strawberries",        badge: null          },
  { id: 9,  name: "Black Forest Cake",  category: "Cakes",    price: 2800, emoji: "🎂", desc: "Whole cake, 8 slices — order 24hrs ahead",  badge: "Order Ahead" },
  { id: 10, name: "Lemon Drizzle",      category: "Cakes",    price: 2400, emoji: "🍋", desc: "Whole cake, zingy citrus glaze",             badge: null          },
  { id: 11, name: "Slice of the Day",   category: "Cakes",    price: 280,  emoji: "🍰", desc: "Ask us what's fresh today",                 badge: "Daily"       },
  { id: 12, name: "Cold Brew Coffee",   category: "Drinks",   price: 320,  emoji: "☕", desc: "18-hour steep, smooth & bold",              badge: null          },
  { id: 13, name: "Masala Chai Latte",  category: "Drinks",   price: 280,  emoji: "🍵", desc: "House spice blend, oat milk",               badge: "House Fave"  },
  { id: 14, name: "Fresh Orange Juice", category: "Drinks",   price: 250,  emoji: "🍊", desc: "Squeezed to order",                         badge: null          },
];

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

const CATEGORIES = ["All", "Breads", "Pastries", "Cakes", "Drinks"];

export default function MenuSection({ addItem }: MenuSectionProps) {
  const [activeCat, setActiveCat] = useState("All");
  const [added,     setAdded]     = useState<Record<number, boolean>>({});

  const filtered = activeCat === "All"
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.category === activeCat);

  const handleAdd = (item:MenuItem) => {
    addItem(item);
    setAdded(p => ({ ...p, [item.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [item.id]: false })), 1400);
  };

  return (
    <section id="menu" style={{ background:T.yellowPale, padding:"110px 2.5rem" }}>
      <div style={{ maxWidth:"1240px", margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"flex-end", marginBottom:"3.5rem", gap:"2rem" }}>
          <div>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.78rem", color:T.greenBrand, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:"0.75rem" }}>◆ Our Menu</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.5rem, 5vw, 4rem)", fontWeight:700, color:T.greenDeep, lineHeight:1.05 }}>
              Made Fresh,<br />
              <em style={{ color:T.greenBrand }}>Every Single Day</em>
            </h2>
          </div>
          <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.95rem", color:"rgba(10,31,13,0.6)", lineHeight:1.7, maxWidth:"320px", textAlign:"right" }}>
            Everything is baked in small batches each morning — no frozen doughs, no shortcuts.
          </p>
        </div>

        {/* Category filter */}
        <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"3rem" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className="btn-cat"
              onClick={() => setActiveCat(cat)}
              style={{
                background: activeCat === cat ? T.greenDeep : "transparent",
                color:       activeCat === cat ? T.yellowGold : T.greenDeep,
                border:      "1.5px solid",
                borderColor: activeCat === cat ? T.greenDeep : "rgba(10,31,13,0.25)",
                borderRadius:"3px", padding:"8px 24px",
                cursor:"pointer", fontFamily:"'Outfit', sans-serif",
                fontWeight:600, fontSize:"0.88rem", letterSpacing:"0.04em",
                transition:"all 0.22s ease",
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(270px, 1fr))", gap:"1.5rem" }}>
          {filtered.map(item => (
            <div key={item.id} className="menu-card" style={{ background:"#fff", borderRadius:"6px", border:"1px solid rgba(10,31,13,0.08)", overflow:"hidden" }}>
              {/* Image area */}
              <div style={{ background:"linear-gradient(145deg, #E8F5E9, #C8E6C9)", height:"150px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"5rem", position:"relative" }}>
                {item.emoji}
                {item.badge && (
                  <span style={{ position:"absolute", top:"12px", right:"12px", background:T.greenDeep, color:T.yellowGold, fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", borderRadius:"2px", padding:"3px 10px", fontFamily:"'Outfit', sans-serif" }}>
                    {item.badge}
                  </span>
                )}
              </div>
              {/* Body */}
              <div style={{ padding:"1.25rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.4rem" }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.15rem", fontWeight:700, color:T.greenDeep, margin:0 }}>{item.name}</h3>
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:700, fontSize:"1rem", color:T.greenBrand, whiteSpace:"nowrap", marginLeft:"0.5rem" }}>KES {item.price}</span>
                </div>
                <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.83rem", color:"rgba(10,31,13,0.5)", marginBottom:"1.1rem", lineHeight:1.5, margin:"0 0 1.1rem" }}>{item.desc}</p>
                <button
                  className="btn-menu-add"
                  onClick={() => handleAdd(item)}
                  style={{
                    width:"100%",
                    background:   added[item.id] ? T.greenDeep : "transparent",
                    color:        added[item.id] ? T.yellowGold : T.greenDeep,
                    border:       "1.5px solid",
                    borderColor:  added[item.id] ? T.greenDeep : "rgba(10,31,13,0.2)",
                    borderRadius: "3px", padding:"10px",
                    cursor:"pointer",
                    fontFamily:"'Outfit', sans-serif", fontWeight:600, fontSize:"0.88rem",
                    transition:"all 0.22s ease",
                  }}
                >
                  {added[item.id] ? "✓ Added" : "+ Add to Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}