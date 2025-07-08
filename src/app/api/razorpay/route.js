import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';

export async function POST(req) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
