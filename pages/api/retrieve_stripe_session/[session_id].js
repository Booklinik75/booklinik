const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  const { session_id } = req.query;

  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "GET") {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      res.json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
