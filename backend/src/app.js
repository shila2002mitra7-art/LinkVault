import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import linkRoutes from "./routes/link.routes.js";

const app = express();   
// middleware
app.use(cors());
app.use(express.json());

// base route
app.get("/", (req, res) => {
  res.send("LinkVault backend is running");
});

// routes
app.use("/api/health", healthRoutes);
app.use("/api", linkRoutes);

export default app;
