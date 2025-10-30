import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// base route
app.use("/api", routes);

// app.get("/api/health", (_req, res) => {
//   res.status(200).json({ status: "healthy", timestamp: new Date() });
// });

export default app;
