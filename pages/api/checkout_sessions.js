const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);

  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "POST") {
    try {
      // create product
      const product = await stripe.products.create({
        name: body.product,
        images: [body.image],
      });

      // attribute price to product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: body.price * 100,
        currency: "eur",
      });

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        payment_method_types: ["card"],
        mode: "payment",
        locale: "fr",
        success_url: `${req.headers.origin}/checkout/${body.id}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout/${body.id}?canceled=true`,
      });

      res.json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
