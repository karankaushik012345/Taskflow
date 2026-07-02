const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 1. Set secure HTTP headers
app.use(helmet());

// 2. Configure CORS
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

// 3. Body parser with payload limit (protect against DoS)
app.use(express.json({ limit: "10kb" }));

// 4. Sanitize against NoSQL injection
app.use(mongoSanitize());

// 5. Custom XSS protection middleware (recursively strips HTML tags)
const stripHtml = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(/<[^>]*>/g, ''); // strip HTML tags
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      stripHtml(obj[key]);
    }
  }
};
app.use((req, res, next) => {
  if (req.body) stripHtml(req.body);
  if (req.query) stripHtml(req.query);
  if (req.params) stripHtml(req.params);
  next();
});

app.use("/api/auth",  require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.get("/api/health", (_req, res) => res.json({ status: "OK" }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));