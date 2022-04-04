import { Router } from "express";
import { validateNewUser, createNewUser, loginUser } from "../localModules.js";

const router = Router();

router.get("/", (req, res) => {
  res.redirect("/todos");
});

router.get("/login", (req, res) => {
  res.render("login", { path: req.path });
});

router.get("/register", (req, res) => {
  res.render("register", { path: req.path });
});

router.post("/login", loginUser, (req, res) => {
  res.json({ msg: "Logged in successfully", success: true });
});

router.post("/register", validateNewUser, createNewUser, (req, res) => {
  res.json({ msg: "Registered successfully", success: true });
});

export default router;
