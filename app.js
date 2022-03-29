const PORT = 3000;
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

//Fake store
const users = [];
const cookieStore = {};

// Init app
const app = express();

// Load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Middlewar
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(`${req.method}-${req.url}`);
  console.log(users);
  console.log(cookieStore);
  next();
});

app.use("/static", express.static("assets"));

// Routes
app.get("/", (req, res) => {
  if ("session_id" in req.cookies && cookieStore[`${req.cookies.session_id}`]) {
    res.render("index", {
      username: cookieStore[`${req.cookies.session_id}`].username,
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  delete cookieStore[`${req.cookies.session_id}`];
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const userInDb = users.find((user) => user.username === username);
    if (userInDb && userInDb.password === password) {
      cookieStore[`${username}cookie`] = userInDb;
      res.cookie("session_id", `${username}cookie`);
      res.redirect("/");
    } else res.send("Wrong credentials");
  } else res.send("Wrong credentials");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  users.push({ ...req.body });
  res.redirect("/login");
});

// Start server
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server on port: http://localhost:${PORT}/`);
});
