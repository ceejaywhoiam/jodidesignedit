
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [service, setService] = useState(null);
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [agreement, setAgreement] = useState(false);

  const services = [
    { name: "Flyers", price: 15 },
    { name: "Website Designs", price: 20 },
    { name: "Logos/Emotes", price: 10 },
  ];

  const handleCheckout = async () => {
    if (!email || !agreement || !service) {
      alert("Please complete required fields");
      return;
    }

    const stripe = await stripePromise;

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, details, service }),
    });

    const data = await res.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div style={{padding: 40, fontFamily: "Arial"}}>
      <h1>Jodi Designed It</h1>

      <div style={{display:"flex", gap:20}}>
        {services.map((s) => (
          <div key={s.name} onClick={()=>setService(s)} style={{border:"1px solid gray", padding:20, cursor:"pointer"}}>
            <h3>{s.name}</h3>
            <p>${s.price}.00+</p>
          </div>
        ))}
      </div>

      <div style={{marginTop:30}}>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><br/><br/>
        <textarea placeholder="Describe design" value={details} onChange={(e)=>setDetails(e.target.value)} /><br/><br/>
        <label>
          <input type="checkbox" checked={agreement} onChange={(e)=>setAgreement(e.target.checked)} />
          Accept Agreement
        </label><br/><br/>

        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}
