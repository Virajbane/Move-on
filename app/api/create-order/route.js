// pages/api/create-order.js (for Pages Router)
// OR app/api/create-order/route.js (for App Router)

import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// For Pages Router (pages/api/create-order.js)


// For App Router (app/api/create-order/route.js)

export async function POST(request) {
  try {
    const { amount, currency = 'INR' } = await request.json();

    // Validate input
    if (!amount || amount <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise (for INR) or cents (for USD)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    return Response.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return Response.json(
      { 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
