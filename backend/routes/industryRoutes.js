const express = require("express");
const router = express.Router();
const { getIndustries, getIndustryById } = require("../controllers/industryController");

router.get("/", getIndustries);
router.get("/:id", getIndustryById);

module.exports = router;
