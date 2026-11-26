
require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const SHORTCODE = process.env.SHORTCODE || '174379';

// Generate Daraja access token
async function getAccessToken() {
  const key = process.env.CONSUMER_KEY;
  const secret = process.env.CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error('M-Pesa credentials are missing');
  }

  const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

  const response = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data.errorMessage || 'M-Pesa authentication failed');
  }

  return data.access_token;
}

// Generate timestamp
function getTimestamp() {
  const date = new Date();

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);

  const values = {};
  parts.forEach(part => {
    values[part.type] = part.value;
  });

  return `${values.year}${values.month}${values.day}${values.hour}${values.minute}${values.second}`;
}

// Home route
app.get('/', (req, res) => {
  res.json({
    app: 'WorldLink Backend',
    status: 'running'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// M-Pesa STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Phone and amount are required'
      });
    }

    const normalizedPhone = String(phone).replace(/\D/g, '');
    const finalPhone = normalizedPhone.startsWith('0')
      ? '254' + normalizedPhone.slice(1)
      : normalizedPhone;

    if (!/^254[17]\d{8}$/.test(finalPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Kenyan phone number'
      });
    }

    const paymentAmount = Number(amount);

    if (!Number.isSafeInteger(paymentAmount) || paymentAmount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid whole-number amount'
      });
    }

    const passkey = process.env.PASSKEY;
    const callbackUrl = process.env.CALLBACK_URL;

    if (!passkey || !callbackUrl) {
      throw new Error('M-Pesa configuration is incomplete');
    }

    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();

    const password = Buffer.from(
      SHORTCODE + passkey + timestamp
    ).toString('base64');

    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: paymentAmount,
          PartyA: finalPhone,
          PartyB: SHORTCODE,
          PhoneNumber: finalPhone,
          CallBackURL: callbackUrl,
          AccountReference: 'WorldLink',
          TransactionDesc: 'WorldLink Buy Data'
        })
      }
    );

    const result = await stkResponse.json();

    if (!stkResponse.ok) {
      return res.status(400).json({
        success: false,
        message: result.errorMessage || 'STK Push request failed'
      });
    }

    return res.json({
      success: true,
      message: 'STK Push request submitted',
      data: result
    });

  } catch (error) {
    console.error('STK Push error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Payment request could not be processed'
    });
  }
});

// M-Pesa callback
app.post('/api/mpesa/callback', (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;

    if (!callback) {
      return res.status(400).json({
        ResultCode: 1,
        ResultDesc: 'Invalid callback'
      });
    }

    console.log('WorldLink M-Pesa callback:', {
      CheckoutRequestID: callback.CheckoutRequestID,
      ResultCode: callback.ResultCode,
      ResultDesc: callback.ResultDesc
    });

    // Payment must be independently verified before
    // crediting a customer or delivering data bundles.

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Accepted'
    });

  } catch (error) {
    console.error('Callback error:', error.message);

    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Callback processing failed'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
