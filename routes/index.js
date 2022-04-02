const { Router } = require("express");
const router = Router();
const { validateNewUser, createNewUser, loginUser, authenticateUser} = require("../utilities/helperFunctions.js");
const users = require("../data/users.js");
const cookies = require("../data/cookies.js");

router.get("/", authenticateUser, (req, res) => {
  const user = users.find(user => user.username === cookies[req.cookies.session_id].username);
  res.render("index", {data: user.data});
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", loginUser, (req, res) => {
  res.redirect("/");
});

router.post("/register", validateNewUser, createNewUser, (req, res) => {
  res.redirect("/login");
});

module.exports = router;
