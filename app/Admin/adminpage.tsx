// "use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ═════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═════════════════════════════════════════════════════════════
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
  red:        "#ef4444",
  orange:     "#f97316",
  blue:       "#3b82f6",
};

// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════
interface OrderItem {
  menuItemId?: string;
  name:        string;
  price:       number;
  qty:         number;
}

interface Order {
  _id:              string;
  orderId:          string;
  customer:         { name: string; phone: string; address?: string };
  items:            OrderItem[];
  subtotal:         number;
  delivery:         number;
  total:            number;
  type:             "delivery" | "pickup";
  payment:          { status: "pending" | "paid" | "failed"; mpesaReceiptNumber?: string; paidAt?: string };
  status:           string;
  estimatedMinutes?: number;
  adminNotes?:      string;
  createdAt:        string;
}

type Tab = "orders" | "create" | "users";

// ═════════════════════════════════════════════════════════════
// UTILITY
// ═════════════════════════════════════════════════════════════
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending_payment:    T.orange,
    confirmed:          T.blue,
    preparing:          T.yellowGold,
    ready:              T.greenBrand,
    out_for_delivery:   T.greenBrand,
    delivered:          T.greenMid,
    cancelled:          T.red,
  };
  return map[status] ?? T.greenMid;
}

function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ═════════════════════════════════════════════════════════════
// 1. ORDERS TAB — View and manage orders
// ═════════════════════════════════════════════════════════════
function OrdersTab() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const url = filter === "all" ? "/api/orders" : `/api/orders?status=${filter}`;
//       const res = await fetch(url);
//       if (res.ok) setOrders(await res.json());
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => { fetchOrders();}, [filter]);

const fetchOrders = useCallback(async () => {
  setLoading(true);
  try {
    const url = filter === "all" ? "/api/orders" : `/api/orders?status=${filter}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setOrders(data); // Update state after fetching data
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false); // Ensure loading state is updated in finally block
  }
}, [filter]);

useEffect(() => { 
  fetchOrders(); // Call fetchOrders without direct state updates in useEffect
}, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        fetchOrders();
        setSelected(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedOrder = orders.find((o) => o.orderId === selected);

  return (
    <div>
      {/* Header + filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: T.greenDeep, margin: 0 }}>
          Orders
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "pending_payment", "confirmed", "preparing", "delivered"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 16px",
                background: filter === f ? T.greenDeep : "transparent",
                color: filter === f ? T.yellowGold : T.greenDeep,
                border: "1px solid",
                borderColor: filter === f ? T.greenDeep : "rgba(10,31,13,0.2)",
                borderRadius: "3px",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? "All" : statusLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(10,31,13,0.5)" }}>Loading orders...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedOrder ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
          {/* Orders list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {orders.length === 0 ? (
              <p style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(10,31,13,0.4)", textAlign: "center", padding: "2rem" }}>
                No orders found.
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelected(order.orderId)}
                  style={{
                    padding: "1rem 1.25rem",
                    background: selected === order.orderId ? T.yellowPale : "#fff",
                    border: `1px solid ${selected === order.orderId ? T.yellowGold : "rgba(10,31,13,0.1)"}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: T.greenDeep }}>
                        {order.orderId}
                      </div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "rgba(10,31,13,0.5)" }}>
                        {order.customer.name} · {order.customer.phone}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "3px 10px",
                        background: statusColor(order.status),
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        borderRadius: "3px",
                        textTransform: "uppercase",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "rgba(10,31,13,0.65)" }}>
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} · KES {order.total.toLocaleString()}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "rgba(10,31,13,0.4)", marginTop: "0.25rem" }}>
                    {formatDate(order.createdAt)} · {order.type === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order detail panel */}
          {selectedOrder && (
            <div style={{ background: "#fff", borderRadius: "8px", border: "1px solid rgba(10,31,13,0.1)", padding: "1.5rem", position: "sticky", top: "100px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: T.greenDeep, margin: "0 0 0.25rem" }}>
                    {selectedOrder.orderId}
                  </h3>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "rgba(10,31,13,0.5)", margin: 0 }}>
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(10,31,13,0.4)",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    padding: "4px",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Customer info */}
              <div style={{ marginBottom: "1.25rem", padding: "1rem", background: T.yellowPale, borderRadius: "4px" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                  Customer
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: T.greenDeep }}>
                  {selectedOrder.customer.name}
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "rgba(10,31,13,0.6)" }}>
                  {selectedOrder.customer.phone}
                </div>
                {selectedOrder.customer.address && (
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "rgba(10,31,13,0.6)", marginTop: "0.25rem" }}>
                    📍 {selectedOrder.customer.address}
                  </div>
                )}
              </div>

              {/* Items */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                  Items
                </div>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(10,31,13,0.06)" }}>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: T.greenDeep }}>
                      {item.name} × {item.qty}
                    </div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: T.greenDeep }}>
                      KES {(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0 0.5rem", fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem" }}>
                  <span style={{ color: "rgba(10,31,13,0.5)" }}>Subtotal</span>
                  <span style={{ color: T.greenDeep }}>KES {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0 0 0.5rem", fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem" }}>
                  <span style={{ color: "rgba(10,31,13,0.5)" }}>Delivery</span>
                  <span style={{ color: T.greenDeep }}>{selectedOrder.delivery === 0 ? "FREE" : `KES ${selectedOrder.delivery}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0 0", borderTop: "1px solid rgba(10,31,13,0.1)", fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: 700 }}>
                  <span style={{ color: T.greenDeep }}>Total</span>
                  <span style={{ color: T.greenBrand }}>KES {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment status */}
              <div style={{ marginBottom: "1.25rem", padding: "1rem", background: selectedOrder.payment.status === "paid" ? "rgba(45,122,56,0.08)" : "rgba(239,68,68,0.08)", borderRadius: "4px" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", color: selectedOrder.payment.status === "paid" ? T.greenBrand : T.red }}>
                  Payment: {selectedOrder.payment.status}
                </div>
                {selectedOrder.payment.mpesaReceiptNumber && (
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", color: "rgba(10,31,13,0.6)" }}>
                    M-Pesa: {selectedOrder.payment.mpesaReceiptNumber}
                  </div>
                )}
                {selectedOrder.payment.paidAt && (
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "rgba(10,31,13,0.5)" }}>
                    Paid: {formatDate(selectedOrder.payment.paidAt)}
                  </div>
                )}
              </div>

              {/* Status update */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.orderId, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid rgba(10,31,13,0.2)",
                    borderRadius: "4px",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.9rem",
                    color: T.greenDeep,
                  }}
                >
                  <option value="pending_payment">Pending Payment</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Delete order */}
              <button
                onClick={() => deleteOrder(selectedOrder.orderId)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: T.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 2. CREATE ORDER TAB — Manually add orders for walk-in/phone customers
// ═════════════════════════════════════════════════════════════
function CreateOrderTab() {
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("pickup");
  const [items, setItems] = useState<OrderItem[]>([{ name: "", price: 0, qty: 1 }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addItem = () => setItems([...items, { name: "", price: 0, qty: 1 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof OrderItem, value: string | number) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = orderType === "delivery" ? 150 : 0;
  const total = subtotal + delivery;

  const handleSubmit = async () => {
    if (!customer.name || !customer.phone) {
      alert("Customer name and phone are required.");
      return;
    }
    if (items.some((i) => !i.name || i.price <= 0)) {
      alert("All items must have a name and price.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items,
          type: orderType,
          notes: "Manual order created by admin",
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setCustomer({ name: "", phone: "", address: "" });
          setItems([{ name: "", price: 0, qty: 1 }]);
          setSuccess(false);
        }, 2000);
      } else {
        alert("Failed to create order");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating order");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: T.greenDeep, marginBottom: "1.5rem" }}>
        Create Manual Order
      </h2>

      {success && (
        <div style={{ padding: "1rem", background: "rgba(45,122,56,0.1)", border: `1px solid ${T.greenBrand}`, borderRadius: "6px", marginBottom: "1.5rem", fontFamily: "'Outfit', sans-serif", color: T.greenBrand }}>
          ✓ Order created successfully!
        </div>
      )}

      {/* Customer details */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
          Customer Name
        </label>
        <input
          type="text"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid rgba(10,31,13,0.2)",
            borderRadius: "4px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
          Phone Number
        </label>
        <input
          type="tel"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid rgba(10,31,13,0.2)",
            borderRadius: "4px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.9rem",
          }}
        />
      </div>

      {/* Order type */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {(["delivery", "pickup"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            style={{
              flex: 1,
              padding: "10px",
              background: orderType === type ? T.greenDeep : "transparent",
              color: orderType === type ? T.yellowGold : T.greenDeep,
              border: "1px solid",
              borderColor: orderType === type ? T.greenDeep : "rgba(10,31,13,0.2)",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              textTransform: "capitalize",
            }}
          >
            {type === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}
          </button>
        ))}
      </div>

      {orderType === "delivery" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
            Delivery Address
          </label>
          <input
            type="text"
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid rgba(10,31,13,0.2)",
              borderRadius: "4px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.9rem",
            }}
          />
        </div>
      )}

      {/* Items */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.75rem" }}>
          Order Items
        </label>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.75fr 40px", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <input
              type="text"
              placeholder="Item name"
              value={item.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
              style={{
                padding: "10px",
                border: "1px solid rgba(10,31,13,0.2)",
                borderRadius: "4px",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.9rem",
              }}
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price || ""}
              onChange={(e) => updateItem(idx, "price", parseFloat(e.target.value) || 0)}
              style={{
                padding: "10px",
                border: "1px solid rgba(10,31,13,0.2)",
                borderRadius: "4px",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.9rem",
              }}
            />
            <input
              type="number"
              placeholder="Qty"
              min="1"
              value={item.qty}
              onChange={(e) => updateItem(idx, "qty", parseInt(e.target.value) || 1)}
              style={{
                padding: "10px",
                border: "1px solid rgba(10,31,13,0.2)",
                borderRadius: "4px",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.9rem",
              }}
            />
            {items.length > 1 && (
              <button
                onClick={() => removeItem(idx)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(10,31,13,0.4)",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addItem}
          style={{
            padding: "8px 16px",
            background: "transparent",
            color: T.greenBrand,
            border: "1px dashed rgba(10,31,13,0.3)",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          + Add Item
        </button>
      </div>

      {/* Total */}
      <div style={{ padding: "1rem", background: T.yellowPale, borderRadius: "4px", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
          <span style={{ color: "rgba(10,31,13,0.6)" }}>Subtotal</span>
          <span style={{ color: T.greenDeep }}>KES {subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Outfit', sans-serif", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          <span style={{ color: "rgba(10,31,13,0.6)" }}>Delivery</span>
          <span style={{ color: T.greenDeep }}>{delivery === 0 ? "FREE" : `KES ${delivery}`}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 700, borderTop: "1px solid rgba(10,31,13,0.1)", paddingTop: "0.5rem" }}>
          <span style={{ color: T.greenDeep }}>Total</span>
          <span style={{ color: T.greenBrand }}>KES {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "rgba(45,122,56,0.5)" : T.greenBrand,
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
        }}
      >
        {loading ? "Creating..." : "Create Order"}
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// 3. USERS TAB — Delete customer accounts
// ═════════════════════════════════════════════════════════════
function UsersTab() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!phone.trim()) {
      setMessage("Please enter a phone number");
      return;
    }

    if (!confirm(`Delete all orders for ${phone}? This cannot be undone.`)) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ ${data.deletedCount} order(s) deleted for ${phone}`);
        setPhone("");
      } else {
        setMessage(`✕ ${data.error || "Failed to delete"}`);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("✕ Error deleting user data");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: T.greenDeep, marginBottom: "0.5rem" }}>
        Delete User Account
      </h2>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9rem", color: "rgba(10,31,13,0.6)", marginBottom: "2rem", lineHeight: 1.7 }}>
        This will permanently delete all orders associated with the provided phone number. Use this for customer account deletion requests per GDPR/data protection compliance.
      </p>

      {message && (
        <div
          style={{
            padding: "1rem",
            background: message.startsWith("✓") ? "rgba(45,122,56,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${message.startsWith("✓") ? T.greenBrand : T.red}`,
            borderRadius: "6px",
            marginBottom: "1.5rem",
            fontFamily: "'Outfit', sans-serif",
            color: message.startsWith("✓") ? T.greenBrand : T.red,
          }}
        >
          {message}
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: T.greenBrand, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
          Customer Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0712 345 678 or 254712345678"
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid rgba(10,31,13,0.2)",
            borderRadius: "4px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1rem",
          }}
        />
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "rgba(239,68,68,0.5)" : T.red,
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
        }}
      >
        {loading ? "Deleting..." : "Delete User Data"}
      </button>

      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "rgba(10,31,13,0.4)", marginTop: "1rem", fontStyle: "italic" }}>
        Note: This action is permanent and cannot be reversed. Make sure you have the correct phone number.
      </p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [session, setSession] = useState<{ user?: { name?: string; email?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session — redirect if not authenticated
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user) {
          router.push("/api/auth/signin");
        } else {
          setSession(data);
          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/api/auth/signin");
      });
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.yellowPale }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", color: T.greenDeep }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${T.yellowPale}; font-family: 'Outfit', sans-serif; }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.yellowPale }}>
        {/* Top nav */}
        <nav
          style={{
            background: T.greenDeep,
            borderBottom: `1px solid ${T.yellowGold}`,
            padding: "1rem 2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: T.yellowGold,
                margin: 0,
              }}
            >
              Jomo&apos;s Bakers Admin
            </h1>
            {session?.user?.email && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", color: "rgba(245,245,238,0.6)", marginTop: "2px" }}>
                {session.user.email}
              </p>
            )}
          </div>
          <button
            onClick={() => router.push("/api/auth/signout")}
            style={{
              padding: "8px 20px",
              background: "transparent",
              color: T.yellowGold,
              border: `1px solid ${T.yellowGold}`,
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            Sign Out
          </button>
        </nav>

        {/* Tab navigation */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid rgba(10,31,13,0.1)",
            padding: "0 2.5rem",
            display: "flex",
            gap: "2rem",
          }}
        >
          {(
            [
              ["orders", "Orders", "📦"],
              ["create", "Create Order", "➕"],
              ["users", "Manage Users", "👥"],
            ] as const
          ).map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "1rem 0",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === key ? T.yellowGold : "transparent"}`,
                color: activeTab === key ? T.greenDeep : "rgba(10,31,13,0.5)",
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.9rem",
                fontWeight: activeTab === key ? 700 : 500,
                transition: "all 0.2s",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "2.5rem" }}>
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "create" && <CreateOrderTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </div>
    </>
  );
}
