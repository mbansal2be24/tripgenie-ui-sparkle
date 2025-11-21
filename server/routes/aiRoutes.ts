import express from "express";
import { generateTripPlan, shufflePlace, chatWithAI } from "../controllers/aiController";
import { aiRateLimiter, chatRateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/trip-plan", aiRateLimiter, generateTripPlan);
router.post("/shuffle", aiRateLimiter, shufflePlace);
router.post("/chat", chatRateLimiter, chatWithAI);

export default router;
