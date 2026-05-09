"use client";

import { useState } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Variant {
  label: string;   // e.g. "1 Kg", "Chocolate", "Large"
  price: number;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;      // top-level tab
  subcategory: string;   // group header inside tab
  desc: string;
  image: string;         // path in /public e.g. "/menu/bbq-chicken.jpg"
  emoji: string;         // fallback when image is absent
  badge: string | null;
  variants: Variant[];   // sizes / flavours — first is the default shown price
}

interface MenuSectionProps {
  addItem: (item: MenuItem & { selectedVariant: Variant }) => void;
}

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS  (unchanged from v3)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// FULL MENU DATA
// image: point to /public/menu/<filename>.jpg
//        → replace with real photos; emoji shows as fallback
// ─────────────────────────────────────────────────────────────
const MENU_ITEMS: MenuItem[] = [
  // ── SPECIAL ORDERS : Pizza ───────────────────────────────
  {
    id: 101, name: "Barbeque Chicken Pizza", category: "Special Orders",
    subcategory: "Pizza Collection",
    desc: "Tender BBQ chicken, red onions, peppers, and smoky sauce on a hand-stretched base.",
    image: "", emoji: "🍕", badge: "Fan Fave",
    variants: [{ label: "Regular (8\")", price: 850 }, { label: "Large (12\")", price: 1350 }, { label: "XL (16\")", price: 1850 }],
  },
  {
    id: 102, name: "Beef Barbeque Pizza", category: "Special Orders",
    subcategory: "Pizza Collection",
    desc: "Seasoned minced beef, caramelised onions and tangy BBQ sauce, loaded on a crispy crust.",
    image: "", emoji: "🍕", badge: null,
    variants: [{ label: "Regular (8\")", price: 850 }, { label: "Large (12\")", price: 1350 }, { label: "XL (16\")", price: 1850 }],
  },
  {
    id: 103, name: "Hawaiian Pizza", category: "Special Orders",
    subcategory: "Pizza Collection",
    desc: "Classic ham and pineapple with mozzarella and a golden tomato base.",
    image: "", emoji: "🍕", badge: null,
    variants: [{ label: "Regular (8\")", price: 800 }, { label: "Large (12\")", price: 1300 }, { label: "XL (16\")", price: 1750 }],
  },
  {
    id: 104, name: "Veg Pizza", category: "Special Orders",
    subcategory: "Pizza Collection",
    desc: "Garden-fresh capsicum, mushrooms, olives, and sweet corn on a herb-infused base.",
    image: "", emoji: "🍕", badge: null,
    variants: [{ label: "Regular (8\")", price: 750 }, { label: "Large (12\")", price: 1200 }, { label: "XL (16\")", price: 1650 }],
  },
  {
    id: 105, name: "Pizza Margherita", category: "Special Orders",
    subcategory: "Pizza Collection",
    desc: "San Marzano tomato, fresh mozzarella, and basil. The original. The timeless.",
    image: "", emoji: "🍕", badge: "Classic",
    variants: [{ label: "Regular (8\")", price: 700 }, { label: "Large (12\")", price: 1100 }, { label: "XL (16\")", price: 1550 }],
  },

  // ── SNACK PACKAGES ────────────────────────────────────────
  {
    id: 201, name: "Mahamri", category: "Snack Packages",
    subcategory: "Fresh Snack Packs",
    desc: "Light, fluffy Swahili doughnuts laced with coconut milk and cardamom. Pair with chai.",
    image: "", emoji: "🫓", badge: "Bestseller",
    variants: [{ label: "Pack of 4", price: 120 }, { label: "Pack of 8", price: 220 }, { label: "Pack of 16", price: 400 }],
  },
  {
    id: 202, name: "Doughnuts", category: "Snack Packages",
    subcategory: "Fresh Snack Packs",
    desc: "Golden fried doughnuts — glazed, sugared, or chocolate-dipped. Fresh from the fryer.",
    image: "", emoji: "🍩", badge: "Fresh Daily",
    variants: [{ label: "Single", price: 60 }, { label: "Pack of 6", price: 320 }, { label: "Pack of 12", price: 600 }],
  },
  {
    id: 203, name: "Mini Mandazis", category: "Snack Packages",
    subcategory: "Fresh Snack Packs",
    desc: "Bite-sized, lightly sweetened East African fried bread. Perfect for events and tea breaks.",
    image: "", emoji: "🫓", badge: null,
    variants: [{ label: "Pack of 10", price: 150 }, { label: "Pack of 20", price: 280 }, { label: "Pack of 40", price: 520 }],
  },
  {
    id: 204, name: "KDFs", category: "Snack Packages",
    subcategory: "Fresh Snack Packs",
    desc: "Soft, pillowy Kenyan doughnuts — a nostalgic classic for every occasion.",
    image: "", emoji: "🍞", badge: null,
    variants: [{ label: "Pack of 6", price: 180 }, { label: "Pack of 12", price: 340 }],
  },
  {
    id: 205, name: "Cake Packets", category: "Snack Packages",
    subcategory: "Fresh Snack Packs",
    desc: "Pre-packed assorted cake slices — ideal for goody bags, events, and corporate meetings.",
    image: "", emoji: "🎁", badge: "Events",
    variants: [{ label: "Pack of 5 slices", price: 350 }, { label: "Pack of 10 slices", price: 650 }, { label: "Pack of 20 slices", price: 1200 }],
  },
  {
    id: 206, name: "Samosas", category: "Snack Packages",
    subcategory: "Fresh Snack Packs",
    desc: "Crispy pastry pockets filled with spiced beef or veg — fried golden and served hot.",
    image: "", emoji: "🥟", badge: null,
    variants: [{ label: "Beef (6 pcs)", price: 240 }, { label: "Veg (6 pcs)", price: 200 }, { label: "Mixed (12 pcs)", price: 420 }],
  },
  {
    id: 207, name: "Kebabs", category: "Snack Packages",
    subcategory: "Fresh Snack Packs",
    desc: "Juicy, spiced minced beef kebabs — skewered and grilled to smoky perfection.",
    image: "", emoji: "🍢", badge: null,
    variants: [{ label: "4 pieces", price: 280 }, { label: "8 pieces", price: 520 }],
  },

  // ── CAKES ─────────────────────────────────────────────────
  {
    id: 301, name: "Banana Cake", category: "Cakes",
    subcategory: "Cakes",
    desc: "Soft, moist banana cake baked with rich homemade flavour. A Jomo's signature.",
    image: "", emoji: "🍌", badge: null,
    variants: [{ label: "Slice", price: 180 }, { label: "1 Kg", price: 1400 }],
  },


  {
    id: 302, name: "Pound Cake", category: "Cakes",
    subcategory: "Cakes",
    desc: "Classic rich cake with a smooth, buttery crumb. Timeless and deeply satisfying.",
    image: "", emoji: "🍰", badge: null,
    variants: [{ label: "1 Kg", price: 1600 }, { label: "2 Kg", price: 3000 }],
  },


  {
    id: 303, name: "Black Forest Cake", category: "Cakes",
    subcategory: "Cakes",
    desc: "Chocolate sponge layered with whipped cream, cherries, and rich chocolate shavings.",
    image: "", emoji: "🎂", badge: "Order Ahead",
    variants: [{ label: "1 Kg", price: 2200 }, { label: "2 Kg", price: 4000 }],
  },


  {
    id: 304, name: "White Forest Cake", category: "Cakes",
    subcategory: "Cakes",
    desc: "Light vanilla sponge, cream, and white chocolate layers for a beautiful celebration.",
    image: "", emoji: "🎂", badge: null,
    variants: [{ label: "1 Kg", price: 2200 }, { label: "2 Kg", price: 4000 }],
  },


  {
    id: 305, name: "Marble Cake", category: "Cakes",
    subcategory: "Cakes",
    desc: "A stunning swirl of chocolate and vanilla — as beautiful to look at as it is to eat.",
    image: "", emoji: "🍰", badge: null,
    variants: [{ label: "Slice", price: 180 }, { label: "1 Kg", price: 1500 }, { label: "Family Pack", price: 2800 }],
  },


  {
    id: 306, name: "Muffins", category: "Cakes",
    subcategory: "Cakes",
    desc: "Generously domed muffins in chocolate, blueberry, and banana variants. Small joy, big flavour.",
    image: "", emoji: "🧁", badge: "Daily",
    variants: [{ label: "Single", price: 120 }, { label: "Box of 6", price: 650 }, { label: "Box of 12", price: 1200 }],
  },
  {
    id: 307, name: "Cupcakes", category: "Cakes",
    subcategory: "Cakes",
    desc: "Frosted cupcakes with swirled buttercream — perfect for parties and gifting.",
    image: "", emoji: "🧁", badge: "Gift-Ready",
    variants: [{ label: "Single", price: 130 }, { label: "Box of 6", price: 720 }, { label: "Box of 12", price: 1350 }],
  },
  {
    id: 308, name: "Queen Cakes", category: "Cakes",
    subcategory: "Cakes",
    desc: "Light, buttery mini cakes with a delicate vanilla crumb. A nostalgic East African classic.",
    image: "", emoji: "👑", badge: null,
    variants: [{ label: "Pack of 6", price: 350 }, { label: "Pack of 12", price: 650 }],
  },


  {
    id: 309, name: "Red Velvet Cake", category: "Cakes",
    subcategory: "Red Velvet Collection",
    desc: "Velvety rich cake layered with cream cheese frosting — choose your favourite flavour twist.",
    image: "", emoji: "❤️", badge: "Bestseller",
    variants: [
      { label: "Chocolate",  price: 2400 },
      { label: "Lemon",      price: 2400 },
      { label: "Orange",     price: 2400 },
      { label: "Mint",       price: 2400 },
      { label: "Pineapple",  price: 2400 },
      { label: "Passion",    price: 2400 },
    ],
  },

  // ── REFRESHMENTS ──────────────────────────────────────────
  {
    id: 401, name: "Fresh Coffee", category: "Refreshments",
    subcategory: "Café Favorites",
    desc: "Rich, smooth, and freshly brewed to kickstart your day. Single origin Kenyan beans.",
    image: "", emoji: "☕", badge: null,
    variants: [{ label: "Small", price: 180 }, { label: "Regular", price: 250 }, { label: "Large", price: 320 }],
  },
  {
    id: 402, name: "Cappuccino", category: "Refreshments",
    subcategory: "Café Favorites",
    desc: "Creamy espresso topped with silky steamed milk foam. Café quality, bakery warmth.",
    image: "", emoji: "☕", badge: null,
    variants: [{ label: "Regular", price: 280 }, { label: "Large", price: 350 }],
  },
  {
    id: 403, name: "Hot Chocolate", category: "Refreshments",
    subcategory: "Café Favorites",
    desc: "Warm, velvety chocolate goodness in every sip — made with real cocoa.",
    image: "", emoji: "🍫", badge: "Cozy",
    variants: [{ label: "Regular", price: 280 }, { label: "Large", price: 350 }],
  },
  {
    id: 404, name: "Fresh Juice", category: "Refreshments",
    subcategory: "Café Favorites",
    desc: "Refreshing natural juice — squeezed to order, served chilled with no added sugar.",
    image: "", emoji: "🍊", badge: null,
    variants: [
      { label: "Orange",     price: 250 },
      { label: "Passion",    price: 250 },
      { label: "Watermelon", price: 250 },
      { label: "Mango",      price: 270 },
    ],
  },
  {
    id: 405, name: "Milkshake", category: "Refreshments",
    subcategory: "Café Favorites",
    desc: "Creamy, thick blended shakes in classic flavours. Indulge and enjoy.",
    image: "", emoji: "🥛", badge: null,
    variants: [
      { label: "Chocolate",  price: 380 },
      { label: "Vanilla",    price: 360 },
      { label: "Strawberry", price: 380 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// CATEGORY METADATA  — tab order, icon, tagline
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: "All",
    icon: "✦",
    tagline: "Everything we bake, brew, and create.",
  },
  {
    key: "Special Orders",
    icon: "🍕",
    tagline: "Perfect for family nights, celebrations, and random 'I deserve this' moments.",
  },
  {
    key: "Snack Packages",
    icon: "🥟",
    tagline: "Perfect for events, meetings, parties, tea time, or everyday cravings.",
  },
  {
    key: "Cakes",
    icon: "🎂",
    tagline: "Handcrafted cakes and pastries made with love in our Nairobi kitchen.",
  },
  {
    key: "Refreshments",
    icon: "☕",
    tagline: "Perfectly paired with your favorite meals, pastries, and snacks.",
  },
];

// Group items by subcategory for section headers
function groupBySubcategory(items: MenuItem[]) {
  const map: Record<string, MenuItem[]> = {};
  items.forEach((item) => {
    if (!map[item.subcategory]) map[item.subcategory] = [];
    map[item.subcategory].push(item);
  });
  return map;
}

// ─────────────────────────────────────────────────────────────
// SUBCATEGORY DESCRIPTIONS
// ─────────────────────────────────────────────────────────────
const SUBCAT_META: Record<string, { desc: string; icon: string }> = {
  "Pizza Collection":              { icon: "🍕", desc: "Hand-stretched bases, premium toppings, baked to order." },
  "Fresh Snack Packs":             { icon: "🥟", desc: "Made fresh daily — ideal for any gathering." },
  "Cakes":                         { icon: "🎂", desc: "Banana, pound, black & white forest, marble, muffins, cupcakes, and queen cakes — all handcrafted fresh daily." },
  "Red Velvet Collection":         { icon: "❤️", desc: "Rich, colourful, and flavour-packed in exciting variations." },
  "Drinks":                { icon: "☕", desc: "Freshly brewed and blended to complement every bite." },
};

// ─────────────────────────────────────────────────────────────
// MENU CARD
// ─────────────────────────────────────────────────────────────
function MenuCard({
  item,
  onAdd,
  justAdded,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem, variant: Variant) => void;
  justAdded: boolean;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  // FIX 2a — track image load/error for graceful emoji fallback
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError,  setImgError]  = useState(false);

  const selectedVariant = item.variants[selectedIdx];
  const hasVariants     = item.variants.length > 1;
  const isFlavour       = hasVariants && isNaN(Number(item.variants[0].label.charAt(0)));

  return (
    <div
      className="menu-card"
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid rgba(10,31,13,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Image area ───────────────────────────────────── */}
      <div
        style={{
          height: "160px",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg, #E8F5E9, #C8E6C9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Emoji fallback — always visible, fades out once photo loads */}
        <span
          style={{
            fontSize: "5rem",
            position: "absolute",
            opacity: imgLoaded && !imgError ? 0 : 0.55,
            transition: "opacity 0.4s ease",
            userSelect: "none",
          }}
        >
          {item.emoji}
        </span>

        {/* FIX 2b — Next.js <Image> replaces raw <img> to satisfy
            @next/next/no-img-element. `fill` sizes it to the parent
            container (which has position:relative + fixed height).
            Rendered only when no 404; emoji fallback covers the gap. */}
        {!imgError && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
            style={{
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {/* Badge */}
        {item.badge && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: T.greenDeep,
              color: T.yellowGold,
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "2px",
              padding: "3px 9px",
              fontFamily: "'Outfit', sans-serif",
              zIndex: 1,
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div
        style={{
          padding: "1.1rem 1.1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Name + price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.35rem",
            gap: "0.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: T.greenDeep,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {item.name}
          </h3>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: T.greenBrand,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            KES {selectedVariant.price.toLocaleString()}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.81rem",
            color: "rgba(10,31,13,0.52)",
            lineHeight: 1.55,
            margin: "0 0 0.9rem",
            flex: 1,
          }}
        >
          {item.desc}
        </p>

        {/* ── Variant selector ──────────────────────────── */}
        {hasVariants && (
          <div style={{ marginBottom: "0.9rem" }}>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: T.greenBrand,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.45rem",
              }}
            >
              {isFlavour ? "Choose Flavour" : "Choose Size"}
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                flexWrap: "wrap",
              }}
            >
              {item.variants.map((v, i) => (
                <button
                  key={v.label}
                  onClick={() => setSelectedIdx(i)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "3px",
                    border: "1.5px solid",
                    borderColor:
                      i === selectedIdx
                        ? T.greenDeep
                        : "rgba(10,31,13,0.18)",
                    background:
                      i === selectedIdx ? T.greenDeep : "transparent",
                    color:
                      i === selectedIdx
                        ? T.yellowGold
                        : "rgba(10,31,13,0.65)",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Add to order button ──────────────────────── */}
        <button
          className="btn-menu-add"
          onClick={() => onAdd(item, selectedVariant)}
          style={{
            width: "100%",
            background: justAdded ? T.greenDeep : "transparent",
            color: justAdded ? T.yellowGold : T.greenDeep,
            border: "1.5px solid",
            borderColor: justAdded ? T.greenDeep : "rgba(10,31,13,0.2)",
            borderRadius: "3px",
            padding: "10px",
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: "0.88rem",
            transition: "all 0.22s ease",
            marginTop: "auto",
          }}
        >
          {justAdded ? "✓ Added" : `+ Add to Order`}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function MenuSection({ addItem }: MenuSectionProps) {
  const [activeCat, setActiveCat] = useState("All");
  const [added, setAdded] = useState<Record<number, boolean>>({});

  const handleAdd = (item: MenuItem, variant: Variant) => {
    addItem({ ...item, selectedVariant: variant });
    setAdded((p) => ({ ...p, [item.id]: true }));
    setTimeout(
      () => setAdded((p) => ({ ...p, [item.id]: false })),
      1400
    );
  };

  // Items filtered by active tab
  const filtered =
    activeCat === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((i) => i.category === activeCat);

  // Group filtered items by subcategory
  const grouped = groupBySubcategory(filtered);

  // Active category meta for tagline
  const activeMeta =
    CATEGORIES.find((c) => c.key === activeCat) ?? CATEGORIES[0];

  return (
    <section id="menu" style={{ background: T.yellowPale, padding: "110px 2.5rem" }}>
      {/* ── Scoped styles ───────────────────────────────── */}
      <style>{`
        .menu-card {
          transition: transform 0.28s cubic-bezier(.2,.8,.4,1), box-shadow 0.28s ease;
        }
        .menu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(10,31,13,0.13);
        }
        .btn-menu-add:hover {
          background: ${T.yellowGold} !important;
          color: ${T.black} !important;
          border-color: ${T.yellowGold} !important;
        }
        .cat-tab:hover {
          border-color: ${T.yellowGold} !important;
          color: ${T.yellowGold} !important;
        }
        .variant-btn:hover {
          border-color: ${T.greenBrand} !important;
          color: ${T.greenBrand} !important;
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* ── Section header ────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "flex-end",
            marginBottom: "2.5rem",
            gap: "2rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.78rem",
                color: T.greenBrand,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              ◆ Our Menu
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 700,
                color: T.greenDeep,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Made Fresh,{" "}
              <em style={{ color: T.greenBrand }}>Every Single Day</em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.93rem",
              color: "rgba(10,31,13,0.58)",
              lineHeight: 1.7,
              maxWidth: "300px",
              textAlign: "right",
              margin: 0,
            }}
          >
            Everything is baked in small batches each morning — no frozen
            doughs, no shortcuts.
          </p>
        </div>

        {/* ── Category tabs ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className="cat-tab"
              onClick={() => setActiveCat(cat.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background:
                  activeCat === cat.key ? T.greenDeep : "transparent",
                color:
                  activeCat === cat.key
                    ? T.yellowGold
                    : T.greenDeep,
                border: "1.5px solid",
                borderColor:
                  activeCat === cat.key
                    ? T.greenDeep
                    : "rgba(10,31,13,0.22)",
                borderRadius: "3px",
                padding: "8px 20px",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "0.86rem",
                letterSpacing: "0.03em",
                transition: "all 0.22s ease",
              }}
            >
              <span>{cat.icon}</span>
              {cat.key}
            </button>
          ))}
        </div>

        {/* Active category tagline */}
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.88rem",
            color: "rgba(10,31,13,0.5)",
            marginBottom: "2.5rem",
            fontStyle: "italic",
          }}
        >
          {activeMeta.tagline}
        </p>

        {/* ── Subcategory groups ────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
          {Object.entries(grouped).map(([subcat, items]) => {
            const meta = SUBCAT_META[subcat];
            return (
              <div key={subcat}>
                {/* Subcategory header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: `2px solid rgba(10,31,13,0.08)`,
                  }}
                >
                  {meta && (
                    <span
                      style={{
                        fontSize: "1.8rem",
                        background: "linear-gradient(145deg,#E8F5E9,#C8E6C9)",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        lineHeight: 1,
                      }}
                    >
                      {meta.icon}
                    </span>
                  )}
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.55rem",
                        fontWeight: 700,
                        color: T.greenDeep,
                        margin: 0,
                        lineHeight: 1.1,
                      }}
                    >
                      {subcat}
                    </h3>
                    {meta?.desc && (
                      <p
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: "0.83rem",
                          color: "rgba(10,31,13,0.5)",
                          margin: "3px 0 0",
                          lineHeight: 1.5,
                        }}
                      >
                        {meta.desc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cards grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "1.25rem",
                  }}
                >
                  {items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      onAdd={handleAdd}
                      justAdded={!!added[item.id]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom note ───────────────────────────────── */}
        <div
          style={{
            marginTop: "3.5rem",
            padding: "1.5rem 2rem",
            background: T.greenDeep,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "1.8rem" }}>📦</span>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: T.yellowGold,
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "2px",
              }}
            >
              Bulk & Custom Orders Welcome
            </div>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: "rgba(245,245,238,0.65)",
                fontSize: "0.85rem",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Planning an event, meeting, or celebration? Contact us for
              custom packages, wedding cakes, and corporate snack packs.
            </p>
          </div>
          <a
            href="https://wa.me/254712345678"
            target="_blank"
            rel="noreferrer"
            style={{
              marginLeft: "auto",
              background: T.yellowGold,
              color: T.black,
              border: "none",
              borderRadius: "3px",
              padding: "11px 24px",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "0.88rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
