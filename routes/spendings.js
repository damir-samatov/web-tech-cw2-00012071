const { Router } = require("express");
const router = Router();
const { authenticateUser} = require("../utilities/helperFunctions.js");
const users = require("../data/users.js");
const cookies = require("../data/cookies.js");

router.get("/", authenticateUser, (req, res) => {
  const user = users.find(user => user.username === cookies[req.cookies.session_id].username);
  res.render("spendings", {data: user.data});
});

module.exports = router;
