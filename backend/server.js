import express from "express"
import cors from "cors"
import bookRoutes from './routes/bookRoute.js'
import deviceRoutes from './routes/deviceRoute.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/api", bookRoutes);
app.use("/api", deviceRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});