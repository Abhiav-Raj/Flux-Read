import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const checkAuth = async (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization Header Missing or Invalid" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token Missing, Access Denied" });
        }

        // Decode and verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "No User Found" });
        }

        next();
    } catch (err) {
        console.error("Authentication Error:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token Expired. Please log in again." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid Token." });
        }

        return res.status(500).json({ message: "Server Error" });
    }
};
const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:8080/auth/login", {
      email,
      password,
    });

    console.log("Login Response Data:", response.data);

    const token = response.data.token;
    const user = response.data.user; // Get user details

    if (token && user) {
      // ✅ Store token and user details in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userDetails", JSON.stringify(user));

      console.log("Auth Token Saved:", localStorage.getItem("authToken"));
      console.log("User Details Saved:", localStorage.getItem("userDetails"));
    } else {
      console.error("Token or User Details missing in response!");
    }
  } catch (error) {
    console.error("Login Error:", error);
  }
};
