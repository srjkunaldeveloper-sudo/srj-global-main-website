const express = require("express");
const router = express.Router();
const pricingController = require("../controllers/pricingController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// PUBLIC ROUTES
router.get("/public", pricingController.getPublicPricing);

// ADMIN PRICING PLANS CRUD
router.get("/plans", verifyToken, isAdmin, pricingController.getAllPlans);
router.post("/plans", verifyToken, isAdmin, pricingController.createPlan);
router.put("/plans/:id", verifyToken, isAdmin, pricingController.updatePlan);
router.delete("/plans/:id", verifyToken, isAdmin, pricingController.deletePlan);

// ADMIN ADD-ONS CRUD
router.get("/addons", verifyToken, isAdmin, pricingController.getAllAddons);
router.post("/addons", verifyToken, isAdmin, pricingController.createAddon);
router.put("/addons/:id", verifyToken, isAdmin, pricingController.updateAddon);
router.delete("/addons/:id", verifyToken, isAdmin, pricingController.deleteAddon);

module.exports = router;
