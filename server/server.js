const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
app.get("/test-token", async (req, res) => {
  try {
    const token = await getAccessToken();

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

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
  try {
    const { phone, amount, service } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount are required",
      });
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

      console.log("✅ PAYMENT SUCCESS:");
      console.log({ amount, phone, receipt, checkoutRequestID });

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
