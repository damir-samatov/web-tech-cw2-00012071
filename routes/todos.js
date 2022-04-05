import { Router } from "express";
import {
  authenticateUser,
  cancelTodo,
  editTodo,
  findUser,
  createTodo,
  completeTodo,
} from "../localModules.js";

const router = Router();

router.get("/", authenticateUser, (req, res) => {
  const user = findUser(req.cookies.session_id);

  const todos = user.data.todos.filter(
    (todo) => !todo.isCompleted && !todo.isCanceled
  );

  const data = {
    username: user.username,
    todos: todos,
  };

  res.render("todos", { data: data, title: "Todos", path: req.path });
});

router.get("/finished", authenticateUser, (req, res) => {
  const user = findUser(req.cookies.session_id);

  const completedTodos = user.data.todos.filter((todo) => todo.isCompleted);

  const data = {
    username: user.username,
    todos: completedTodos,
  };

  res.render("todos", { data: data, title: "Finished Todos", path: req.path });
});

router.get("/cancelled", authenticateUser, (req, res) => {
  const user = findUser(req.cookies.session_id);

  const canceledTodos = user.data.todos.filter((todo) => todo.isCanceled);

  const data = {
    username: user.username,
    todos: canceledTodos,
  };

  res.render("todos", { data: data, title: "Cancelled Todos", path: req.path });
});

router.get("/:id", authenticateUser, (req, res) => {
  const user = findUser(req.cookies.session_id);

  const getByID = req.params.id;

  const todos = user.data.todos.filter(
    (todo) => !todo.isFinshed && !todo.isCanceled
  );

  const todo = todos.find((todo) => todo.id === getByID);

  if (!todo) return req.json({ msg: "The todo doesn't exist", success: false });

  res.json({ msg: "Todo found", success: true, todo: todo });
});

router.post("/create", authenticateUser, createTodo, (req, res) => {
  res.json({ msg: "Successfully created", success: true });
});

router.delete("/cancel/:id", authenticateUser, cancelTodo, (req, res) => {
  res.json({ msg: "Succesfully cancelled", success: true });
});

router.delete("/complete/:id", authenticateUser, completeTodo, (req, res) => {
  res.json({ msg: "Succesfully completed", success: true });
});

router.put("/edit/:id", authenticateUser, editTodo, (req, res) => {
  res.json({ msg: "Successfully edited", success: true });
});

export default router;
