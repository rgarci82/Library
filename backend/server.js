import express from "express"
import cors from "cors"
import pool from './config/db.js'
import { getBooks  } from "./controllers/bookController.js";

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

app.get('/books', getBooks)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});