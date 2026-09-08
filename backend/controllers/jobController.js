const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// Get all jobs
exports.getJobs = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM jobs ORDER BY id DESC");
  
  // Format tags back from JSON string or comma-separated to array if needed
  const formattedJobs = rows.map(job => {
    let parsedTags = [];
    try {
      parsedTags = JSON.parse(job.tags);
    } catch {
      parsedTags = job.tags ? job.tags.split(",").map(t => t.trim()) : [];
    }
    return {
      ...job,
      tags: parsedTags
    };
  });

  res.json(formattedJobs);
});

// Create a new job post
exports.createJob = asyncHandler(async (req, res) => {
  const { title, location, experience, type, salary, category, tags } = req.body;

  if (!title || !location || !experience || !type || !salary || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : (tags || "");

  const [result] = await db.query(
    "INSERT INTO jobs (title, location, experience, type, salary, category, tags) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, location, experience, type, salary, category, tagsString]
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
  const { title, location, experience, type, salary, category, tags } = req.body;
  const jobId = req.params.id;

  if (!title || !location || !experience || !type || !salary || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : (tags || "");

  await db.query(
    "UPDATE jobs SET title = ?, location = ?, experience = ?, type = ?, salary = ?, category = ?, tags = ? WHERE id = ?",
    [title, location, experience, type, salary, category, tagsString, jobId]
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

  const [result] = await db.query(
    "INSERT INTO job_applications (job_title, full_name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
    [job_title, full_name, email, phone, message]
  );

  res.status(201).json({
    success: true,
    message: "Application submitted successfully!",
    applicationId: result.insertId
  });
});

// Get all job applications (Admin only)
exports.getApplications = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM job_applications ORDER BY id DESC");
  res.json(rows);
});
