// app/api/sendEmail/route.js
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to, subject, text } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // CHANGE THIS MAIL TO RECIPIENT'S MAIL
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
