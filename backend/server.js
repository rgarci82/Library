import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoute.js";
import deviceRoutes from "./routes/deviceRoute.js";
import usersRoutes from "./routes/userRoute.js";
import mediaRoutes from "./routes/mediaRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import dotenv from "dotenv";

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/api", bookRoutes);
app.use("/api", mediaRoutes);
app.use("/api", deviceRoutes);
app.use("/api", usersRoutes);
app.use("/api", adminRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
