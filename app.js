const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const PORT = 3000;
const users = require("./data/users.js");
const cookies = require("./data/cookies.js");

const { validateNewUser, createNewUser, loginUser, authenticateUser} = require("./utilities/helperFunctions");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static("assets"));
app.use((req, res, next) => {
  console.log("Request cookies: ", req.cookies);
  console.log("Saved cookies: ", cookies);
  console.log("Users: ", users);

  next();
});

app.get("/", authenticateUser, (req, res) => {
  const user = users.find(user => user.username === cookies[req.cookies.session_id].username);

  res.render("index", {data: user.data});
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", loginUser, (req, res) => {
  res.status(200).redirect("/");
});

app.post("/register", validateNewUser, createNewUser, (req, res) => {
  res.status(200).redirect("/login");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  
  console.log(`Server on: http://localhost:${PORT}/`);
});
