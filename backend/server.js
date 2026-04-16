const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

// 📁 storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// static folder
app.use("/uploads", express.static("uploads"));

let feedbacks = [];

// GET
app.get("/api/feedback", (req, res) => {
  res.json(feedbacks);
});

// POST (🔥 FIXED)
app.post("/api/feedback/add", upload.single("image"), (req, res) => {
  const { name, email, rating, message } = req.body;

  console.log(req.body);   // DEBUG
  console.log(req.file);   // DEBUG

  const newFeedback = {
    _id: Date.now().toString(),
    name,
    email,
    rating: Number(rating), // ⭐ IMPORTANT
    message,
    image: req.file ? req.file.filename : null,
  };

  feedbacks.push(newFeedback);

  res.json(newFeedback);
});

// DELETE
app.delete("/api/feedback/:id", (req, res) => {
  feedbacks = feedbacks.filter((f) => f._id !== req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));