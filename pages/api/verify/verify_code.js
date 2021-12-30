/* eslint-disable import/no-anonymous-default-export */

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const account_sid = process.env.TWILIO_ACCOUNT_SID;
  const auth_token = process.env.TWILIO_AUTH_TOKEN;
  const service_sid = process.env.TWILIO_SERVICE_SID;
  const client = require("twilio")(account_sid, auth_token);

  // format the phone number to E.164 format and use french country code
  const phone = body.recipient;

  // verify the passed in verification code
  client.verify
    .services(service_sid)
    .verificationChecks.create({
      to: phone,
      code: body.code,
    })
    .then((verification) => {
      // send back verification status
      res.status(200).json({ status: "OK", status: verification.status });
    })
    .catch((err) => {
      // if server error, send 500 response
      res.status(500);
    });
};
