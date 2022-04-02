const { Router } = require("express");
const router = Router();
const { validateNewUser, createNewUser, loginUser, authenticateUser} = require("../utilities/helperFunctions.js");
const users = require("../data/users.js");
const cookies = require("../data/cookies.js");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", loginUser, (req, res) => {
  res.redirect("/spendings");
});

router.post("/register", validateNewUser, createNewUser, (req, res) => {
  res.redirect("/login");
});

module.exports = router;
