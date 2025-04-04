import express from "express";
import { signup, login } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);


//Auth test
router.post("/test", authenticate, (req, res) => {
    res.send("Only logged-in users can see this!");
});

export default router;
