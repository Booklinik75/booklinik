/* eslint-disable import/no-anonymous-default-export */
const mail = require("@sendgrid/mail");
mail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  const body = JSON.parse(req.body);

  const data = {
    to: body.recipient,
    from: "info@booklinik.com",
    template_id: body.templateId,
    categories: ["Transactional"],
  };

  if (body.attachments) {
    data = { ...data, attachments: [...body.attachments] };
  }

  await mail.send(data).catch((err) => console.log(err.response.body));

  res.status(200).json({ status: "OK" });
};
