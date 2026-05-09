
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

// export default function CartDrawer({ cart, total, updateQty, removeItem, onClose, onCheckout })
interface Variant {
  label: string;   // e.g. "1 Kg", "Chocolate", "Large"
  price: number;
}

interface CartItem {
  id: string | number;
  name: string;
  variants: Variant[];
  qty: number;
  emoji: string;
};

type CartDrawerProps = {
  cart: CartItem[];
  total: number;
  updateQty: (id: string | number, delta: number) => void;
  removeItem: (id: string | number) => void;
  onClose: () => void;
  onCheckout: () => void;
};

export default function CartDrawer({ cart, total, updateQty, removeItem, onClose, onCheckout }: CartDrawerProps) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:300 }} />
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:"420px", maxWidth:"95vw", background:T.yellowPale, zIndex:301, display:"flex", flexDirection:"column", boxShadow:"-8px 0 40px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div style={{ padding:"1.5rem 1.75rem", borderBottom:"1px solid rgba(10,31,13,0.1)", display:"flex", justifyContent:"space-between", alignItems:"center", background:T.greenDeep }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", color:T.offWhite, fontSize:"1.5rem", fontWeight:700, margin:0 }}>Your Order</h2>
          <button onClick={onClose} style={{ background:"rgba(245,245,238,0.1)", border:"none", color:T.offWhite, borderRadius:"50%", width:"34px", height:"34px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:"auto", padding:"1.5rem 1.75rem" }}>
          {cart.length === 0
            ? <div style={{ textAlign:"center", padding:"3rem 0" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🛒</div>
                <p style={{ fontFamily:"'Outfit', sans-serif", color:"rgba(10,31,13,0.4)", fontSize:"0.95rem" }}>Your cart is empty.<br />Browse our menu to get started!</p>
              </div>
            : <div style={{ display:"flex", flexDirection:"column", gap:"0.9rem" }}>
                {cart.map(item => (
                  <div key={item.id} style={{ background:"#fff", borderRadius:"5px", padding:"1rem 1.2rem", display:"flex", alignItems:"center", gap:"0.9rem", border:"1px solid rgba(10,31,13,0.07)" }}>
                    <span style={{ fontSize:"2rem" }}>{item.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Outfit', sans-serif", fontWeight:600, color:T.greenDeep, fontSize:"0.93rem" }}>{item.name}</div>
                      <div style={{ fontFamily:"'Outfit', sans-serif", color:T.greenBrand, fontWeight:700, fontSize:"0.88rem" }}>KES {item.variants[0]?.price * item.qty}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ background:"#E8F5E9", border:"none", borderRadius:"50%", width:"26px", height:"26px", cursor:"pointer", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", color:T.greenDeep }}>−</button>
                      <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:700, minWidth:"18px", textAlign:"center", color:T.greenDeep }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}  style={{ background:"#E8F5E9", border:"none", borderRadius:"50%", width:"26px", height:"26px", cursor:"pointer", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", color:T.greenDeep }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background:"none", border:"none", color:"rgba(10,31,13,0.25)", cursor:"pointer", fontSize:"1rem", padding:"4px" }}>🗑</button>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding:"1.5rem 1.75rem", borderTop:"1px solid rgba(10,31,13,0.1)", background:"#fff" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.4rem" }}>
              <span style={{ fontFamily:"'Outfit', sans-serif", color:"rgba(10,31,13,0.55)", fontSize:"0.88rem" }}>Subtotal</span>
              <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:700, color:T.greenDeep }}>KES {total.toLocaleString()}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"1.4rem" }}>
              <span style={{ fontFamily:"'Outfit', sans-serif", color:"rgba(10,31,13,0.55)", fontSize:"0.88rem" }}>Delivery fee</span>
              <span style={{ fontFamily:"'Outfit', sans-serif", color:"rgba(10,31,13,0.45)", fontSize:"0.88rem" }}>Calculated at checkout</span>
            </div>
            <button onClick={onCheckout} style={{ width:"100%", background:T.greenDeep, color:T.yellowGold, border:"none", borderRadius:"4px", padding:"15px", cursor:"pointer", fontFamily:"'Outfit', sans-serif", fontWeight:600, fontSize:"0.95rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
              Proceed to Checkout — KES {total.toLocaleString()}
            </button>
            <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:"0.72rem", color:"rgba(10,31,13,0.38)", textAlign:"center", marginTop:"0.75rem" }}>Secure payment via M-Pesa STK Push</p>
          </div>
        )}
      </div>
    </>
  );
}