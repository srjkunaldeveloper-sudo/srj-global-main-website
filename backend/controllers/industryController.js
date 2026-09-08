const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// Get all industries
exports.getIndustries = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM industries ORDER BY created_at DESC");
  
  const formattedIndustries = rows.map(ind => {
    let parsedFeatures = [];
    let parsedBenefits = [];
    try {
      parsedFeatures = JSON.parse(ind.features);
    } catch {
      parsedFeatures = ind.features ? ind.features.split(",") : [];
    }
    try {
      parsedBenefits = JSON.parse(ind.benefits);
    } catch {
      parsedBenefits = ind.benefits ? ind.benefits.split(",") : [];
    }
    return {
      ...ind,
      features: parsedFeatures,
      benefits: parsedBenefits
    };
  });

  res.json(formattedIndustries);
});

// Get single industry by ID
exports.getIndustryById = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM industries WHERE id = ?", [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Industry not found"
    });
  }

  const ind = rows[0];
  let parsedFeatures = [];
  let parsedBenefits = [];
  try {
    parsedFeatures = JSON.parse(ind.features);
  } catch {
    parsedFeatures = ind.features ? ind.features.split(",") : [];
  }
  try {
    parsedBenefits = JSON.parse(ind.benefits);
  } catch {
    parsedBenefits = ind.benefits ? ind.benefits.split(",") : [];
  }

  res.json({
    ...ind,
    features: parsedFeatures,
    benefits: parsedBenefits
  });
});
