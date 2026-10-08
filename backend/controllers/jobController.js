const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// Helper to safely parse string/JSON arrays
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  if (typeof field === "string") {
    return field
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

// Helper to format array for storage
const stringifyArrayField = (field) => {
  if (!field) return null;
  if (Array.isArray(field)) return JSON.stringify(field);
  if (typeof field === "string") {
    const lines = field.split("\n").map(l => l.trim()).filter(Boolean);
    return JSON.stringify(lines);
  }
  return String(field);
};

// Get all jobs
exports.getJobs = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM jobs ORDER BY id DESC");
  
  const formattedJobs = rows.map(job => {
    let parsedTags = [];
    if (job.tags) {
      try {
        const parsed = JSON.parse(job.tags);
        parsedTags = Array.isArray(parsed) ? parsed : [String(parsed)];
      } catch {
        parsedTags = typeof job.tags === "string" 
          ? job.tags.split(",").map(t => t.trim()).filter(Boolean) 
          : [];
      }
    }

    return {
      ...job,
      tags: parsedTags,
      responsibilities: parseArrayField(job.responsibilities),
      requirements: parseArrayField(job.requirements),
      perks: parseArrayField(job.perks)
    };
  });

  res.json(formattedJobs);
});

// Create a new job post
exports.createJob = asyncHandler(async (req, res) => {
  const { 
    title, location, experience, type, salary, category, tags,
    description, responsibilities, requirements, perks
  } = req.body;

  if (!title?.trim() || !location?.trim() || !experience?.trim() || !type?.trim() || !salary?.trim() || !category?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Required fields: title, location, experience, type, salary, category"
    });
  }

  const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : (tags || "");
  const respString = stringifyArrayField(responsibilities);
  const reqString = stringifyArrayField(requirements);
  const perksString = stringifyArrayField(perks);

  const [result] = await db.query(
    `INSERT INTO jobs 
     (title, location, experience, type, salary, category, tags, description, responsibilities, requirements, perks) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title.trim(), 
      location.trim(), 
      experience.trim(), 
      type.trim(), 
      salary.trim(), 
      category.trim(), 
      tagsString,
      description?.trim() || null,
      respString,
      reqString,
      perksString
    ]
  );

  res.status(201).json({
    success: true,
    message: "Job posted successfully",
    jobId: result.insertId
  });
});

// Delete a job
exports.deleteJob = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM jobs WHERE id = ?", [req.params.id]);

  res.json({
    success: true,
    message: "Job deleted successfully"
  });
});

// Update a job
exports.updateJob = asyncHandler(async (req, res) => {
  const { 
    title, location, experience, type, salary, category, tags,
    description, responsibilities, requirements, perks
  } = req.body;
  const jobId = req.params.id;

  if (!title?.trim() || !location?.trim() || !experience?.trim() || !type?.trim() || !salary?.trim() || !category?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Required fields: title, location, experience, type, salary, category"
    });
  }

  const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : (tags || "");
  const respString = stringifyArrayField(responsibilities);
  const reqString = stringifyArrayField(requirements);
  const perksString = stringifyArrayField(perks);

  await db.query(
    `UPDATE jobs 
     SET title = ?, 
         location = ?, 
         experience = ?, 
         type = ?, 
         salary = ?, 
         category = ?, 
         tags = ?,
         description = ?,
         responsibilities = ?,
         requirements = ?,
         perks = ?
     WHERE id = ?`,
    [
      title.trim(), 
      location.trim(), 
      experience.trim(), 
      type.trim(), 
      salary.trim(), 
      category.trim(), 
      tagsString,
      description?.trim() || null,
      respString,
      reqString,
      perksString,
      jobId
    ]
  );

  res.json({
    success: true,
    message: "Job updated successfully"
  });
});

// Submit a job application
exports.applyJob = asyncHandler(async (req, res) => {
  const { job_title, full_name, email, phone, message } = req.body;

  if (!job_title || !full_name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const resume = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

  const [result] = await db.query(
    "INSERT INTO job_applications (job_title, full_name, email, phone, message, resume) VALUES (?, ?, ?, ?, ?, ?)",
    [job_title, full_name, email, phone, message, resume]
  );

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    applicationId: result.insertId
  });
});

// Get all applications (Admin only)
exports.getApplications = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM job_applications ORDER BY id DESC");
  res.json(rows);
});
