const { Router } = require("express");
const router = Router();
const { authenticateUser} = require("../utilities/helperFunctions.js");
const users = require("../data/users.js");
const cookies = require("../data/cookies.js");

router.get("/", authenticateUser, (req, res) => {
  const user = users.find(user => user.username === cookies[req.cookies.session_id].username);
  const currentDate = new Date().toISOString().split('T')[0];
  const currentDateYearMonth = currentDate.slice(0, 7);
  const currentMonthSpendings = user.data.spendings.filter(record => {
    console.log(record.date.slice(0, 7), currentDateYearMonth);
    return record.date.slice(0, 7) === currentDateYearMonth;
  });
  console.log(currentMonthSpendings);
  const data = {
    username: user.username,
    spendings: currentMonthSpendings
  };

  res.render("spendings", {data: data});
});

module.exports = router;
