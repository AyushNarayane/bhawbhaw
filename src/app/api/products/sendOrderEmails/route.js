import nodemailer from "nodemailer";
import { db } from "firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function POST(request) {
  try {
    const { userEmail, vendorEmail, orderDetails } = await request.json();

    // Validate required fields
    if (!userEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Customer email is required" }),
        { status: 400 }
      );
    }

    if (!orderDetails?.items || !orderDetails?.shippingAddress) {
      return new Response(
        JSON.stringify({ success: false, error: "Order details are incomplete" }),
        { status: 400 }
      );
    }

    // Fetch all admin emails from the admins collection
    const adminsRef = collection(db, "admins");
    const adminSnapshot = await getDocs(adminsRef);
    const adminEmails = adminSnapshot.docs.map(doc => doc.data().email).filter(email => email);

    if (adminEmails.length === 0) {
      console.warn("No admin emails found in the admins collection");
    }

    console.log('Attempting to send emails to:', { userEmail, vendorEmail, adminEmails });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Common email styles
    const emailStyles = `
      <style>
        .header {
          background-color: #ffffff;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        .company-name {
          color: #FF0000;
          font-size: 32px;
          font-weight: bold;
          margin: 0;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        h2 {
          color: #333333;
          margin-bottom: 15px;
        }
        h3 {
          color: #666666;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          padding: 8px 0;
          border-bottom: 1px solid #eeeeee;
        }
        p {
          color: #555555;
          line-height: 1.5;
        }
        .product-list {
          margin-top: 15px;
        }
        .product-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eeeeee;
        }
        .total {
          margin-top: 20px;
          font-weight: bold;
          text-align: right;
        }
      </style>
    `;

    // Prepare email templates
    const emails = [];

    // User email
    if (userEmail) {
      emails.push({
        from: `"BhawBhaw Services" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: "Your Order Confirmation",
        html: `
          ${emailStyles}
          <div class="header">
            <h1 class="company-name">BhawBhaw</h1>
          </div>
          <div class="content">
            <h2>Order Confirmation</h2>
            <p>Thank you for your order with BhawBhaw!</p>
            <h3>Order Details:</h3>
            <div class="product-list">
              ${orderDetails.items.map(item => `
                <div class="product-item">
                  <span>${item.title} x ${item.quantity}</span>
                  <span>₹${item.sellingPrice * item.quantity}</span>
                </div>
              `).join('')}
              <div class="product-item">
                <span>Delivery Fee</span>
                <span>₹${orderDetails.deliveryFee}</span>
              </div>
              <div class="total">
                Total: ₹${orderDetails.totalAmount}
              </div>
            </div>
            <h3>Shipping Address:</h3>
            <ul>
              <li><strong>Name:</strong> ${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}</li>
              <li><strong>Address:</strong> ${orderDetails.shippingAddress.address}</li>
              <li><strong>City:</strong> ${orderDetails.shippingAddress.city}</li>
              <li><strong>State:</strong> ${orderDetails.shippingAddress.state}</li>
              <li><strong>Postal Code:</strong> ${orderDetails.shippingAddress.postalCode}</li>
            </ul>
            <p>We'll process your order shortly!</p>
          </div>
        `,
      });
    }

    // Vendor email
    if (vendorEmail) {
      emails.push({
        from: `"BhawBhaw Services" <${process.env.GMAIL_USER}>`,
        to: vendorEmail,
        subject: "New Order Received",
        html: `
          ${emailStyles}
          <div class="header">
            <h1 class="company-name">BhawBhaw</h1>
          </div>
          <div class="content">
            <h2>New Order Alert</h2>
            <p>You have received a new order!</p>
            <h3>Order Details:</h3>
            <div class="product-list">
              ${orderDetails.items.map(item => `
                <div class="product-item">
                  <span>${item.title} x ${item.quantity}</span>
                  <span>₹${item.sellingPrice * item.quantity}</span>
                </div>
              `).join('')}
              <div class="product-item">
                <span>Delivery Fee</span>
                <span>₹${orderDetails.deliveryFee}</span>
              </div>
              <div class="total">
                Total: ₹${orderDetails.totalAmount}
              </div>
            </div>
            <h3>Customer Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}</li>
              <li><strong>Email:</strong> ${userEmail}</li>
              <li><strong>Phone:</strong> ${orderDetails.userDetails?.phoneNumber || 'Not provided'}</li>
            </ul>
            <h3>Shipping Address:</h3>
            <ul>
              <li><strong>Address:</strong> ${orderDetails.shippingAddress.address}</li>
              <li><strong>City:</strong> ${orderDetails.shippingAddress.city}</li>
              <li><strong>State:</strong> ${orderDetails.shippingAddress.state}</li>
              <li><strong>Postal Code:</strong> ${orderDetails.shippingAddress.postalCode}</li>
            </ul>
          </div>
        `,
      });
    }

    // Admin emails - send to all admins
    adminEmails.forEach(adminEmail => {
      emails.push({
        from: `"BhawBhaw Services" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject: "New Order Notification",
        html: `
          ${emailStyles}
          <div class="header">
            <h1 class="company-name">BhawBhaw</h1>
          </div>
          <div class="content">
            <h2>New Order Notification</h2>
            <h3>Order Details:</h3>
            <div class="product-list">
              ${orderDetails.items.map(item => `
                <div class="product-item">
                  <span>${item.title} x ${item.quantity}</span>
                  <span>₹${item.sellingPrice * item.quantity}</span>
                </div>
              `).join('')}
              <div class="product-item">
                <span>Delivery Fee</span>
                <span>₹${orderDetails.deliveryFee}</span>
              </div>
              <div class="total">
                Total: ₹${orderDetails.totalAmount}
              </div>
            </div>
            <h3>Customer Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}</li>
              <li><strong>Email:</strong> ${userEmail}</li>
              <li><strong>Phone:</strong> ${orderDetails.userDetails?.phoneNumber || 'Not provided'}</li>
            </ul>
            <h3>Shipping Address:</h3>
            <ul>
              <li><strong>Address:</strong> ${orderDetails.shippingAddress.address}</li>
              <li><strong>City:</strong> ${orderDetails.shippingAddress.city}</li>
              <li><strong>State:</strong> ${orderDetails.shippingAddress.state}</li>
              <li><strong>Postal Code:</strong> ${orderDetails.shippingAddress.postalCode}</li>
            </ul>
            <h3>Vendor Information:</h3>
            <ul>
              <li><strong>Email:</strong> ${vendorEmail || 'Not assigned'}</li>
              <li><strong>Store:</strong> ${orderDetails.storeInfo?.contactName || 'Not specified'}</li>
            </ul>
          </div>
        `,
      });
    });

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No valid recipients found" }),
        { status: 400 }
      );
    }

    // Verify SMTP connection
    await transporter.verify();

    // Send all emails concurrently
    const results = await Promise.all(
      emails.map(email => transporter.sendMail(email))
    );

    console.log('Emails sent successfully:', results.map(r => r.messageId));

    return new Response(JSON.stringify({ 
      success: true,
      results: results.map(r => ({ messageId: r.messageId }))
    }), { status: 200 });
  } catch (error) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.response || error.code || 'Unknown error'
      }),
      { status: 500 }
    );
  }
} 