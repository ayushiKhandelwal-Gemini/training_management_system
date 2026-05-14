import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes";
import sequelize from "./config/db";
import path from "path";
import taskRoutes from "./routes/task.routes";
import taskAssignmentRoutes from "./routes/taskAssignment.routes";
import submissionRoutes from "./routes/submission.routes";
import "./models"; // Import to initialize associations

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/task-assignments", taskAssignmentRoutes);

app.use("/api/submission", submissionRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});