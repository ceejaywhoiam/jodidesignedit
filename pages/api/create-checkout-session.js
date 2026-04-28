
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { email, details, service } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: service.name,
          description: details,
        },
        unit_amount: service.price * 100,
      },
      quantity: 1,
    }],
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/cancel`,
  });

  res.json({ id: session.id });
}
