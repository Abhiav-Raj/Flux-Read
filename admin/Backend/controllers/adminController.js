import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email and populate the 'role' field
    const user = await User.findOne({ email }).populate('role');

    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid username, password, or role' });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Check if the user has an 'admin' role
      if (user.role && user.role.name === 'admin') {
        return res.status(200).json({ success: true, email: user.email, name: user.name });
      } else {
        return res.status(401).json({ message: 'Invalid username, password, or role' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid username, password, or role' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error: ' + err.message });
  }
};

export const update = async (req, res, next) => {
    return null;
}