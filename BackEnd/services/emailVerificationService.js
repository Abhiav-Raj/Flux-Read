import nodemailer from "nodemailer";
import Verification from "../models/VerificationModel.js";
import User from "../models/UserModel.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function generateAndStoreOTP(email) {
  const otp = Math.round(Math.random() * 10000 + 1000);
  const now = new Date();
  const expiry = new Date(now.getTime() + 10 * 60 * 1000);

  // Check for existing verification object and delete it
  await Verification.deleteOne({ email });

  const verification = new Verification({ email, otp, otpExpiry: expiry });
  await verification.save();

  return otp;
}

export const generateEmail1 = async (req, res) => {
  try {
    const { email } = req.body;
    const userObj = await User.findOne({ email: email });
    if (!email) {
      return res.status(401).json({ error: "Invalid email" });
    }
    if (!userObj) {
      return res.status(404).json({ error: "User not found" });
    }
    const otp = await generateAndStoreOTP(email);
    const info = await transporter.sendMail({
      from: '"Rapid Read"<${process.env.EMAIL_USER}>',
      to: email,
      subject: "OTP For Email Verification",
      text: `Dear ${userObj.name}, Your One Time Password for Email Verification is ${otp}`,
      // html: `${process.env.HTML_CONTENT_FOR_EMAIL_VERIFICATION}<br><b>${otp}</b>`
    });
    console.log(`Email Send Successfully`);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const emailVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const now = Date.now();
    const verificationObj = await Verification.findOne({
      email: email,
      otp: otp,
    });
    const userObject = await User.findOne({ email });
    if (!verificationObj) {
      return res.status(401).json({ message: "Invalid Email or OTP" });
    } else if (verificationObj.otpExpiry <= now) {
      const deletedObj = await Verification.deleteOne({
        email: email,
      });
      return res.status(401).json({ message: "OTP Expired" });
    } else if (!userObject) {
      return res.status(401).json({ message: "User not found" });
    } else {
      if (verificationObj.otp === otp) {
        userObject.isEmailVerified = true;
        await User.updateOne({ email }, { $set: { isEmailVerified: true } });
        const deletedObject = await Verification.deleteOne({
          email: verificationObj.email,
        });
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ error: "Invalid" });
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
