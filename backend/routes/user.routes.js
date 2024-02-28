import { Router } from "express";
import { loginUser, registerUser ,logout ,ForgetPassword, VerifyToken,payment,verifypayment} from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const router =Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logout);
router.post('/forgot-password',ForgetPassword)
router.post('/forgot-password/verify',VerifyToken);
router.post('/payment',isLoggedIn, payment);
router.post('/payment/verifypayment',verifypayment)

export default router;