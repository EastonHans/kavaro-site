const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "https://kavaro-site.pages.dev",
    "https://kavaroagency.com",
    "https://www.kavaroagency.com",
    // allow localhost during development
    /^http:\/\/localhost:\d+$/,
  ],
  methods: ["GET", "POST"],
  credentials: false,
}));
app.use(express.json({ limit: "10kb" })); // prevent oversized request bodies

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || "https://sandbox.safaricom.co.ke";

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.send("Kavaro M-Pesa Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
// /test-token removed — it returned live M-Pesa OAuth tokens publicly

/**
 * =========================
 * GET ACCESS TOKEN (DARAJA)
 * =========================
 */
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString(
      "base64",
    );

    const response = await axios.get(
      `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    return response.data.access_token;
  } catch (error) {
    console.error("TOKEN ERROR:", error.response?.data || error.message);
    throw new Error("Failed to generate access token");
  }
};

/**
 * =========================
 * REAL STK PUSH (CLEAN + SAFE)
 * =========================
 */
app.post("/mpesa/stkpush", async (req, res) => {
  // Require a server-side API key so only your frontend can trigger payments
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.MPESA_API_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { phone, amount, service } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount are required",
      });
    }

    // Basic phone format check (Safaricom format: 2547XXXXXXXX)
    if (!/^2547\d{8}$/.test(String(phone))) {
      return res.status(400).json({ success: false, message: "Invalid phone format. Use 2547XXXXXXXX" });
    }

    // Reasonable amount bounds
    const amt = Number(amount);
    if (isNaN(amt) || amt < 1 || amt > 300000) {
      return res.status(400).json({ success: false, message: "Amount must be between 1 and 300,000 KES" });
    }

    const token = await getAccessToken();

    // Daraja-safe timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.BUSINESS_SHORT_CODE}${process.env.PASSKEY}${timestamp}`,
    ).toString("base64");

    const stkRequest = {
      BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: phone,
      PartyB: process.env.BUSINESS_SHORT_CODE,
      PhoneNumber: phone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: service || "Kavaro",
      TransactionDesc: "Kavaro Service Payment",
    };

    const response = await axios.post(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, stkRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    console.log("STK SUCCESS:", data);

    return res.json({
      success: true,
      message: "STK Push sent",
      checkoutRequestID: data.CheckoutRequestID,
      merchantRequestID: data.MerchantRequestID,
      response: data,
    });
  } catch (error) {
    console.error("STK ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "STK Push failed",
      error: error.response?.data || error.message,
    });
  }
});

/**
 * =========================
 * CALLBACK (PRODUCTION SAFE)
 * =========================
 */
app.post("/mpesa/callback", (req, res) => {
  try {
    console.log("=== MPESA CALLBACK RECEIVED ===");
    console.log(JSON.stringify(req.body, null, 2));

    const stkCallback = req.body?.Body?.stkCallback;

    const resultCode = stkCallback?.ResultCode;
    const checkoutRequestID = stkCallback?.CheckoutRequestID;

    if (resultCode === 0) {
      const metadata = stkCallback?.CallbackMetadata?.Item || [];

      const amount = metadata.find((i) => i.Name === "Amount")?.Value;
      const phone = metadata.find((i) => i.Name === "PhoneNumber")?.Value;
      const receipt = metadata.find((i) => i.Name === "MpesaReceiptNumber")?.Value;

      console.log("✅ PAYMENT SUCCESS — receipt:", receipt, "amount:", amount);

      // TODO: SAVE TO DATABASE (important for SaaS)
    } else {
      console.log("❌ PAYMENT FAILED:", checkoutRequestID);
    }

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("CALLBACK ERROR:", error);

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
});

/**
 * =========================
 * STATUS (OPTIONAL PLACEHOLDER)
 * =========================
 */
app.get("/mpesa/status/:id", (req, res) => {
  res.json({
    success: true,
    message: "Use callback for real payment verification",
  });
});

/**
 * =========================
 * START SERVER
 * =========================
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
