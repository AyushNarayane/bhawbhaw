import nodemailer from "nodemailer";
import { db } from "firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function POST(request) {
  try {
    const { userEmail, serviceProviderEmail, bookingDetails } = await request.json();

    // Validate required fields
    if (!userEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Customer email is required" }),
        { status: 400 }
      );
    }

    if (!bookingDetails?.selectedService || !bookingDetails?.contactInfo || !bookingDetails?.calendarAndSlot) {
      return new Response(
        JSON.stringify({ success: false, error: "Booking details are incomplete" }),
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

    console.log('Attempting to send emails to:', { userEmail, serviceProviderEmail, adminEmails });

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
      </style>
    `;

    // Prepare email templates
    const emails = [];

    // User email
    if (userEmail) {
      emails.push({
        from: `"BhawBhaw Services" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: "Your Service Booking Confirmation",
        html: `
          ${emailStyles}
          <div class="header">
            <h1 class="company-name">BhawBhaw</h1>
          </div>
          <div class="content">
            <h2>Booking Confirmation</h2>
            <p>Thank you for booking with BhawBhaw!</p>
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Service:</strong> ${bookingDetails.selectedService.specialization}</li>
              <li><strong>Date:</strong> ${bookingDetails.calendarAndSlot.selectedDate}</li>
              <li><strong>Time Slot:</strong> ${bookingDetails.calendarAndSlot.selectedSlot}</li>
              <li><strong>Location:</strong> ${bookingDetails.contactInfo.address}, ${bookingDetails.contactInfo.city}</li>
            </ul>
            <p>We'll see you soon!</p>
          </div>
        `,
      });
    }

    // Service provider email
    if (serviceProviderEmail) {
      emails.push({
        from: `"BhawBhaw Services" <${process.env.GMAIL_USER}>`,
        to: serviceProviderEmail,
        subject: "New Service Booking",
        html: `
          ${emailStyles}
          <div class="header">
            <h1 class="company-name">BhawBhaw</h1>
          </div>
          <div class="content">
            <h2>New Booking Alert</h2>
            <p>You have a new service booking!</p>
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Service:</strong> ${bookingDetails.selectedService.specialization}</li>
              <li><strong>Date:</strong> ${bookingDetails.calendarAndSlot.selectedDate}</li>
              <li><strong>Time Slot:</strong> ${bookingDetails.calendarAndSlot.selectedSlot}</li>
              <li><strong>Location:</strong> ${bookingDetails.contactInfo.address}, ${bookingDetails.contactInfo.city}</li>
            </ul>
            <h3>Customer Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${bookingDetails.contactInfo.firstName} ${bookingDetails.contactInfo.lastName}</li>
              <li><strong>Phone:</strong> ${bookingDetails.contactInfo.phoneNumber}</li>
              <li><strong>Email:</strong> ${userEmail}</li>
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
        subject: "New Service Booking Notification",
        html: `
          ${emailStyles}
          <div class="header">
            <h1 class="company-name">BhawBhaw</h1>
          </div>
          <div class="content">
            <h2>New Booking Notification</h2>
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Service:</strong> ${bookingDetails.selectedService.specialization}</li>
              <li><strong>Date:</strong> ${bookingDetails.calendarAndSlot.selectedDate}</li>
              <li><strong>Time Slot:</strong> ${bookingDetails.calendarAndSlot.selectedSlot}</li>
              <li><strong>Location:</strong> ${bookingDetails.contactInfo.address}, ${bookingDetails.contactInfo.city}</li>
            </ul>
            <h3>Customer Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${bookingDetails.contactInfo.firstName} ${bookingDetails.contactInfo.lastName}</li>
              <li><strong>Phone:</strong> ${bookingDetails.contactInfo.phoneNumber}</li>
              <li><strong>Email:</strong> ${userEmail}</li>
            </ul>
            <h3>Service Provider Information:</h3>
            <ul>
              <li><strong>Email:</strong> ${serviceProviderEmail || 'Not assigned'}</li>
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