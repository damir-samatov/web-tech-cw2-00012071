import { Router } from "express";
import { authenticateUser } from "../utilities/helperFunctions.js";
import cookies from "../data/cookies.js";
import db from "../data/db.js";

const router = Router();

router.get("/", authenticateUser, (req, res) => {
  const user = db.data.users.find(
    (user) => user.username === cookies[req.cookies.session_id].username
  );

  const currentDate = new Date().toISOString().split("T")[0];
  const currentDateYearMonth = currentDate.slice(0, 7);
  const currentMonthSpendings = user.data.spendings.filter((record) => {
    return record.date.slice(0, 7) === currentDateYearMonth;
  });
  const data = {
    username: user.username,
    spendings: currentMonthSpendings,
  };

  res.render("spendings", { data: data });
});

export default router;
