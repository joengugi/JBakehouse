"use client"; 

import GlobalStyles from "@/components/GlobalStyles";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import MenuSection from "@/components/Menusection";
import AboutSection from "@/components/Aboutsection";
import ContactSection from "@/components/Contactsection";
import Footer from "@/components/Footer";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import useCart from "@/components/Carthook";
export default function App() {
  const { cart, addItem, removeItem, updateQty, total, count } = useCart();
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      <GlobalStyles />
      <Nav count={count} onCartOpen={() => setCartOpen(true)} />

      <Hero />
      <AboutSection />

      <MenuSection addItem={(item) => addItem({ ...item, id: String(item.id), qty: 1 })} />


      <ContactSection />
      <Footer />

      {cartOpen && (
        <CartDrawer
          cart={cart} total={total}
          updateQty={updateQty} removeItem={removeItem}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}
      {checkoutOpen && (
        <CheckoutModal
          cart={cart} total={total}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}