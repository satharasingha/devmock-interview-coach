import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure Nodemailer transporter with proper SSL settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true, // Log info
  });
};

// Send contact email
router.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log("Received contact request:", { name, email, subject });

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  try {
    const transporter = createTransporter();

    // Verify connection configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // Email to Admin/Owner
    const adminMailOptions = {
      from: `"DevMock Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #2563EB; margin: 0;">DevMock</h2>
            <p style="color: #666; margin: 5px 0 0;">New Contact Form Submission</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 120px; color: #333;">Name:</td>
              <td style="padding: 10px 0; color: #555;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 10px 0; color: #555;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #333;">Subject:</td>
              <td style="padding: 10px 0; color: #555;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #333; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0; color: #555; line-height: 1.5;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              Sent from DevMock Contact Form<br>
              IP Address: ${req.ip || "Unknown"}<br>
              Time: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      text: `New Contact Message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    };

    // Auto-reply to User
    const userMailOptions = {
      from: `"DevMock Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting DevMock!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2563EB, #06B6D4); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
              <span style="font-size: 30px;">✨</span>
            </div>
            <h2 style="color: #2563EB; margin: 0 0 5px;">DevMock</h2>
            <p style="color: #666; margin-top: 0;">AI-Powered Career Support Platform</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Dear ${name},</p>
          
          <p>Thank you for reaching out to us! We have received your message and one of our team members will get back to you within <strong>24 hours</strong>.</p>
          
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #2563EB;">
            <p style="font-weight: bold; margin: 0 0 10px; color: #2563EB;">Your Message Summary:</p>
            <p style="margin: 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 10px 0 0; color: #555;"><strong>Message:</strong></p>
            <p style="margin: 5px 0 0; color: #666; font-style: italic;">${message.substring(0, 200)}${message.length > 200 ? "..." : ""}</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul style="color: #555;">
            <li>Explore our <a href="http://localhost:5173/interviewlibrary" style="color: #2563EB;">Interview Library</a></li>
            <li>Check out our <a href="http://localhost:5173/about" style="color: #2563EB;">About Us</a> page</li>
            <li>Follow us for updates and interview tips</li>
          </ul>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Best regards,<br>
            <strong style="color: #2563EB;">DevMock Support Team</strong><br>
            <span style="font-size: 11px;">AI-Powered Interview Preparation Platform</span>
          </p>
        </div>
      `,
      text: `Thank you for contacting DevMock!\n\nDear ${name},\n\nWe have received your message and will get back to you within 24 hours.\n\nYour message: ${message}\n\nBest regards,\nDevMock Support Team`,
    };

    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent successfully");

    // Send auto-reply to user
    await transporter.sendMail(userMailOptions);
    console.log("User auto-reply sent successfully");

    res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Email error details:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to send email. Please try again.";

    if (error.code === "EAUTH") {
      errorMessage =
        "Email authentication failed. Please check your email credentials.";
    } else if (error.code === "ESOCKET") {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.message.includes("self-signed certificate")) {
      errorMessage = "SSL certificate error. Please try again later.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Test endpoint to check email configuration
router.get("/test", async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({ success: true, message: "Email configuration is working!" });
  } catch (error) {
    console.error("Email test failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
