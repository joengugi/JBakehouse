
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

export default function AboutSection() {
  return (
    <section id="about" style={{
      background: T.greenDeep, padding: "110px 2.5rem", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative line */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        width: "1px", height: "80px",
        background: `linear-gradient(to bottom, transparent, ${T.yellowGold})`,
      }} />

      <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>

        {/* Left: visual */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: "100%", aspectRatio: "3/4", borderRadius: "6px",
            background: `linear-gradient(160deg, ${T.greenMid}, ${T.greenDark})`,
            border: `1px solid rgba(240,196,25,0.15)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "9rem",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)",
          }}>🧑‍🍳</div>

          {/* Accent box */}
          <div style={{
            position: "absolute", bottom: "-2rem", right: "-2rem",
            background: T.yellowGold, borderRadius: "4px",
            padding: "1.5rem 2rem", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 700, color: T.black, lineHeight: 1 }}>2022</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.72rem", color: T.greenDeep, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Est. Nairobi</div>
          </div>

          {/* Side label */}
          <div style={{
            position: "absolute", top: "50%", left: "-2.5rem",
            transform: "translateY(-50%) rotate(-90deg)",
            fontFamily: "'Outfit', sans-serif", fontSize: "0.72rem",
            color: "rgba(240,196,25,0.5)", letterSpacing: "0.2em",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>Artisan · Nairobi · Since 2022</div>
        </div>

        {/* Right: copy */}
        <div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem",
            color: T.yellowGold, fontWeight: 600, letterSpacing: "0.14em",
            textTransform: "uppercase", marginBottom: "1rem",
          }}>◆ Our Story</div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
            fontWeight: 700, color: T.offWhite, lineHeight: 1.1,
            marginBottom: "1.75rem",
          }}>
            A Labour of Love,<br />
            <em style={{ color: T.yellowGold }}>One baked good at a Time</em>
          </h2>

          <p style={{
            fontFamily: "'Outfit', sans-serif",
            color: "rgba(245,245,238,0.62)", lineHeight: 1.85, fontSize: "0.98rem",
            marginBottom: "1.25rem",
          }}>
            Jomos Bakehouse was born from a simple obsession: the perfect crust. What started as weekend baking in a small Gachie kitchen grew into Nairobis most loved artisan bakery.
          </p>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            color: "rgba(245,245,238,0.62)", lineHeight: 1.85, fontSize: "0.98rem",
            marginBottom: "2.5rem",
          }}>
            Every product that leaves our kitchen has been made with patience, one that you can taste.
          </p>

          {/* Values */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              ["🌾", "Locally Sourced Kenyan Ingredients"],
              ["⏳", "Slow Fermentation — Never Rushed"],
              ["♻️", "Zero Food Waste Policy"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{
                  background: "rgba(240,196,25,0.1)",
                  border: `1px solid rgba(240,196,25,0.2)`,
                  borderRadius: "4px", padding: "8px 12px", fontSize: "1.1rem",
                }}>{icon}</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,245,238,0.75)", fontWeight: 400, fontSize: "0.95rem" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}