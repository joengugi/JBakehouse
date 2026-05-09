"use client";

import { useState } from "react";

interface Variant {
  label: string;   // e.g. "1 Kg", "Chocolate", "Large"
  price: number;
}

interface CartItem {
  id: string | number;
  name: string;
  emoji: string;
  variants: Variant[];
  qty: number;
}

interface CheckoutModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
}

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

export default function CheckoutModal({ cart, total, onClose }: CheckoutModalProps) {
  const [step, setStep]   = useState(1);
  const [type, setType]   = useState("delivery");   // FIX 7: split out
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr]   = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    setStep(2);
    setTimeout(() => setStep(3), 2400);
  };

  // FIX 8: controlled field list — no bracket notation on state object
  const fields = [
    { key:"name",  label:"Full Name",       placeholder:"Jane Wanjiku",          value:name,  setter:setName  },
    { key:"phone", label:"M-Pesa Phone",    placeholder:"0712 345 678",          value:phone, setter:setPhone },
    ...(type === "delivery"
      ? [{ key:"addr", label:"Delivery Address", placeholder:"e.g. Kilimani, Nairobi", value:addr, setter:setAddr }]
      : []
    ),
  ];

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:400 }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%, -50%)", background:T.yellowPale, borderRadius:"8px", width:"500px", maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto", zIndex:401, boxShadow:"0 32px 80px rgba(0,0,0,0.5)" }}>

        {/* Modal header */}
        <div style={{ background:T.greenDeep, padding:"1.5rem 2rem", borderRadius:"8px 8px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", color:T.offWhite, fontSize:"1.5rem", fontWeight:700, margin:0 }}>
            {step === 1 ? "Complete Your Order" : step === 2 ? "Processing Payment…" : "Order Confirmed! 🎉"}
          </h2>
          <button onClick={onClose} style={{ background:"rgba(245,245,238,0.1)", border:"none", color:T.offWhite, borderRadius:"50%", width:"32px", height:"32px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        <div style={{ padding:"2rem" }}>
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {/* Type toggle */}
              <div style={{ display:"flex", gap:"0.75rem" }}>
                {["delivery","pickup"].map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex:1, padding:"11px",
                    background:   type === t ? T.greenDeep : "transparent",
                    color:        type === t ? T.yellowGold : T.greenDeep,
                    border:       "1.5px solid",
                    borderColor:  type === t ? T.greenDeep : "rgba(10,31,13,0.2)",
                    borderRadius: "3px", cursor:"pointer",
                    fontFamily:"'Outfit', sans-serif", fontWeight:600, fontSize:"0.9rem",
                  }}>{t === "delivery" ? "🛵 Delivery" : "🏪 Pickup"}</button>
                ))}
              </div>

              {/* FIX 8: each field has its own value + setter — no bracket access */}
              {fields.map(({ key, label, placeholder, value, setter }) => (
                <div key={key}>
                  <label style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.75rem", color:T.greenBrand, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>{label}</label>
                  <input
                    value={value}
                    onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    style={{ width:"100%", padding:"11px 14px", background:"#fff", border:"1.5px solid rgba(10,31,13,0.15)", borderRadius:"3px", fontSize:"0.93rem", fontFamily:"'Outfit', sans-serif", color:T.greenDeep, outline:"none", boxSizing:"border-box" }}
                  />
                </div>
              ))}

              {/* Order summary */}
              <div style={{ background:"#fff", borderRadius:"4px", padding:"1.2rem", border:"1px solid rgba(10,31,13,0.07)" }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.72rem", color:T.greenBrand, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.75rem" }}>Order Summary</div>
                {cart.map(item => (
                  <div key={item.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.4rem" }}>
                    <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.88rem", color:T.greenDeep }}>{item.emoji} {item.name} × {item.qty}</span>
                    <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.88rem", fontWeight:700, color:T.greenDeep }}>KES {(item.variants[0].price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ borderTop:"1px solid rgba(10,31,13,0.09)", marginTop:"0.75rem", paddingTop:"0.75rem", display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:600, color:T.greenDeep }}>Total</span>
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:800, color:T.greenBrand, fontSize:"1.05rem" }}>KES {total.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handleSubmit} style={{ background:T.greenDeep, color:T.yellowGold, border:"none", borderRadius:"4px", padding:"15px", cursor:"pointer", fontFamily:"'Outfit', sans-serif", fontWeight:600, fontSize:"0.95rem", marginTop:"0.25rem" }}>
                Pay KES {total.toLocaleString()} via M-Pesa →
              </button>
              <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.72rem", color:"rgba(10,31,13,0.4)", textAlign:"center" }}>You&apos;ll receive an STK push prompt on your phone</p>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign:"center", padding:"2.5rem 0" }}>
              {/* FIX 9: spinner uses className not inline animation string */}
              <div className="anim-spin" style={{ fontSize:"3rem", marginBottom:"1rem", display:"inline-block" }}>⏳</div>
              <p style={{ fontFamily:"'Outfit', sans-serif", color:T.greenDeep, fontSize:"1rem", marginBottom:"0.5rem" }}>
                Sending M-Pesa prompt to <strong>{phone}</strong>
              </p>
              <p style={{ fontFamily:"'Outfit', sans-serif", color:"rgba(10,31,13,0.5)", fontSize:"0.88rem" }}>Check your phone and enter your M-Pesa PIN to confirm</p>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign:"center", padding:"2rem 0" }}>
              <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>✅</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond', serif", color:T.greenDeep, fontSize:"1.7rem", marginBottom:"0.75rem" }}>Order Confirmed!</h3>
              <p style={{ fontFamily:"'Outfit', sans-serif", color:"rgba(10,31,13,0.6)", marginBottom:"1.5rem", lineHeight:1.7 }}>
                Your order <strong style={{ color:T.greenBrand }}>#BK-1042</strong> has been placed.<br />
                A WhatsApp confirmation is on its way to {phone}.
              </p>
              <div style={{ background:"#E8F5E9", borderRadius:"4px", padding:"1.2rem", border:"1px solid rgba(45,122,56,0.2)", marginBottom:"1.5rem", textAlign:"left" }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.88rem", color:T.greenDeep, lineHeight:1.75 }}>
                  Estimated time: <strong>30–45 minutes</strong><br />
                  {type === "delivery" ? `Delivering to: ${addr}` : "Ready for pickup at Westlands"}
                </div>
              </div>
              <button onClick={onClose} style={{ background:T.greenDeep, color:T.yellowGold, border:"none", borderRadius:"4px", padding:"13px 32px", cursor:"pointer", fontFamily:"'Outfit', sans-serif", fontWeight:600, fontSize:"0.93rem" }}>
                Track My Order →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}