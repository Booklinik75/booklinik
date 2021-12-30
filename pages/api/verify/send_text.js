/* eslint-disable import/no-anonymous-default-export */

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const account_sid = process.env.TWILIO_ACCOUNT_SID;
  const auth_token = process.env.TWILIO_AUTH_TOKEN;
  const service_sid = process.env.TWILIO_SERVICE_SID;
  const client = require("twilio")(account_sid, auth_token);

  // format the phone number to E.164 format and use french country code
  const phone = body.recipient;

  // send verification code to user's phone number
  client.verify
    .services(service_sid)
    .verifications.create({
      to: phone,
      channel: "sms",
    })
    .then((verification) => {
      // send 200 response with verification SID
      res.status(200).json({ status: "OK", verificationSID: verification.sid });
    })
    .catch((err) => {
      res.status(500).json({ status: "ERROR" });
    });
};
