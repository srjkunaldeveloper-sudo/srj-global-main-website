const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const { validateSendMeeting } = require("../middleware/validators");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { meetingLimiter } = require("../config/rateLimits");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

router.post("/send-meeting", meetingLimiter, validateSendMeeting, asyncHandler(async (req, res) => {
  const { name, phone, plan } = req.body;

  await client.messages.create({
    from: "whatsapp:+14155238886",
    to: `whatsapp:+91${phone}`,
    body: `Hello ${name},

Your meeting for ${plan} has been scheduled successfully.

SRJ Global Technologies Team`,
  });

  res.json({
    success: true,
    message: "WhatsApp sent successfully",
  });
}));

module.exports = router;
