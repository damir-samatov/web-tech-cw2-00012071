const PORT = 3000;
const express = require("express");
const session = require("express-session");
const store = new session.MemoryStore();
const bodyParser = require("body-parser");
const path = require("path");

// Init app
const app = express();

// Load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Middlewar
app.use(
  session({
    secret: "asd",
    cookie: { maxAge: 30000 },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/static", express.static("assets"));

// Routes
app.get("/", (req, res) => {
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", (req, res) => {
});

app.post("/register", (req, res) => {
  res.redirect("/login");
});

// Start server
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server on port: http://localhost:${PORT}/`);
});
