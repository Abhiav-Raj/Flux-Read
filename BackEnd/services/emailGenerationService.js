import nodemailer from "nodemailer";
import crypto from "crypto";

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Password:", process.env.EMAIL_PASSWORD);

// Template for Email Verification
function verificationEmailTemplate(verificationUrl, token) {
  const urlWithToken = `${verificationUrl}?token=${token}`;

  return `
    <!DOCTYPE html>
    <html>
      <body>
        <p>Welcome to our CHDT!</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${urlWithToken}">Verify Email</a>
      </body>
    </html>
  `;
}

// Create Transporter for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,  // Use App Password
    },
});


// Generate a Unique Token for Email Verification
const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

export const handleEmailGeneration = async (req, res) => {
    const token = generateVerificationToken();
    const verificationURL = `http://localhost:${process.env.PORT || 8081}/verifyEmail`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Email Verification",
      html: verificationEmailTemplate(verificationURL, token),
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully");
  
      // Save token in your database or memory store for later verification
      res.status(200).send({ message: "Verification email sent successfully." });
    } catch (error) {
      console.error("Error sending email:", error);  // Add more detailed error logs
      res.status(500).send({ error: "Error sending email." });
    }
  };
  