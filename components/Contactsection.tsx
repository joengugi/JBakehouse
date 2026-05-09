"use client";

import { useState } from "react";

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

const BAKERY_INFO = {
  name: "Jomos Baker(S)",
  tagline: "Handcrafted with love, baked fresh every morning",
  phone: "+254 103 990 200",
  email: "hello@jomosbakers.co.ke",
  address: "108 Power Gachie, Nairobi",
  hours: "Mon – Sat: 6:30 AM – 7:00 PM  |  Sun: 7:00 AM – 4:00 PM",
  facebook: "Jomosbakers",
};

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [concerns, setConcerns] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email && concerns) {
      setSubmitted(true);
      setEmail("");
      setConcerns("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section id="contact" style={{ background: T.yellowPale, padding: "110px 2.5rem" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem", color: T.greenBrand, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.75rem" }}>◆ Find Us</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 700, color: T.greenDeep }}>
            Say Hello
          </h2>
        </div>

        {/* Contact Form */}
        <div style={{ maxWidth: "600px", margin: "0 auto 3rem", padding: "2rem", background: "#fff", borderRadius: "8px", border: `1px solid rgba(10,31,13,0.1)` }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: T.greenBrand, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                style={{
                  width: "100%", padding: "0.9rem 1rem", fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.95rem", color: T.greenDeep,
                  border: `1px solid rgba(10,31,13,0.15)`, borderRadius: "5px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: T.greenBrand, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>Your Message</label>
              <textarea
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
                placeholder="Tell us your concerns or feedback..."
                style={{
                  width: "100%", padding: "0.9rem 1rem", fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.95rem", color: T.greenDeep,
                  border: `1px solid rgba(10,31,13,0.15)`, borderRadius: "5px",
                  boxSizing: "border-box", minHeight: "140px", resize: "none",
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{
                background: T.greenBrand, color: "#fff",
                border: "none", borderRadius: "5px", padding: "1rem",
                cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: "0.95rem", transition: "background 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.greenLight}
              onMouseLeave={(e) => e.currentTarget.style.background = T.greenBrand}
            >
              Send Message
            </button>

            {submitted && (
              <div style={{ padding: "1rem", background: "#E8F5E9", borderRadius: "5px", textAlign: "center", fontFamily: "'Outfit', sans-serif", color: T.greenBrand, fontWeight: 600 }}>
                ✓ Thanks! We&apos;ll be in touch soon.
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              ["📍", "Address", BAKERY_INFO.address],
              ["📞", "Phone", BAKERY_INFO.phone],
              ["✉️", "Email", BAKERY_INFO.email],
              ["🕐", "Hours", BAKERY_INFO.hours],
              ["📸", "Facebook", BAKERY_INFO.facebook],
            ].map(([icon, label, val]) => (
              <div key={label} style={{
                background: "#fff", borderRadius: "5px",
                padding: "1.1rem 1.4rem",
                border: `1px solid rgba(10,31,13,0.08)`,
                display: "flex", alignItems: "flex-start", gap: "1rem",
              }}>
                <span style={{
                  background: "#E8F5E9", borderRadius: "4px",
                  padding: "8px 10px", fontSize: "1.2rem",
                  minWidth: "42px", textAlign: "center",
                }}>{icon}</span>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.72rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.93rem", color: T.greenDeep, fontWeight: 400, lineHeight: 1.5 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Map placeholder */}
            <div style={{
              background: `linear-gradient(160deg, ${T.greenDeep}, ${T.greenMid})`,
              borderRadius: "5px", flex: 1, minHeight: "280px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "2.5rem", textAlign: "center",
              border: `1px solid rgba(240,196,25,0.15)`,
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: T.offWhite, fontSize: "1.4rem", marginBottom: "0.6rem" }}>
                Gachie, Nairobi
              </h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,245,238,0.5)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Google Maps integrationnp
              </p>
              <button style={{
                background: T.yellowGold, color: T.black,
                border: "none", borderRadius: "3px",
                padding: "11px 28px", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "0.88rem",
              }}>Get Directions →</button>
            </div>

            {/* CTA */}
            <div style={{
              background: T.greenDeep, borderRadius: "5px",
              padding: "2rem", textAlign: "center",
              border: `1px solid rgba(240,196,25,0.12)`,
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: T.yellowGold, fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                Ready to Order?
              </h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,245,238,0.6)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                Order online, pay via M-Pesa, and we will deliver to your door or have it ready for pickup.
              </p>
              <button onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })} style={{
                background: T.yellowGold, color: T.black,
                border: "none", borderRadius: "3px",
                padding: "12px 28px", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "0.88rem",
              }}>Browse Menu →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}