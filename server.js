import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookies from "./data/cookies.js";
import indexRoute from "./routes/index.js";
import spendingsRoute from "./routes/spendings.js";
import db from "./data/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const PORT = 1337;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static("public"));
app.use((req, res, next) => {
  console.log("Request cookies: ", req.cookies);
  console.log("Saved cookies: ", cookies);
  console.log("Users: ", db.data);
  next();
});

app.use("/", indexRoute);

app.use("/spendings", spendingsRoute);

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server on: http://localhost:${PORT}/`);
});
