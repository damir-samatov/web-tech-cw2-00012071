import { Router } from "express";
import {
  validateNewUser,
  createNewUser,
  loginUser,
} from "../utilities/helperFunctions.js";

const router = Router();

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

export default router;
