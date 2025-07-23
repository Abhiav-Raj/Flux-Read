import express from "express";
import { 
    registerUser, 
    loginUser, 
    getAllDetails, 
    updateUser, 
    forgotPassword,
    getUserResults
} from '../controllers/userController.js';
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/getAllDetails', checkAuth, getAllDetails);
router.put('/update', checkAuth, updateUser);
router.post('/forgotPassword', forgotPassword);
router.get("/results/:userId", getUserResults);

export default router;
