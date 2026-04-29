
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
export default function Footer() {
  return (
    <footer style={{
      background: T.black, borderTop: `1px solid rgba(240,196,25,0.1)`,
      padding: "3rem 2.5rem",
    }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", color: T.yellowGold, fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.3rem" }}>🥐 Jomos Bakehouse</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,245,238,0.35)", fontSize: "0.8rem" }}>Baked fresh in Nairobi since 2022</div>
        </div>
        <div style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,245,238,0.28)", fontSize: "0.78rem", textAlign: "center" }}>
          © 2025 Jomos Bakers. All rights reserved.<br />
          Built with Next.js · Payments by M-Pesa · Notifications via WhatsApp
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Facebook"].map(link => (
            <span key={link} style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,245,238,0.35)", fontSize: "0.82rem", cursor: "pointer" }}>{link}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}