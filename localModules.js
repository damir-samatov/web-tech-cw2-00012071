import bcrypt from "bcrypt";
import cookies from "./data/cookies.js";
import { nanoid } from "nanoid";
import db from "./data/db.js";

const COOKIE_LIFETIME = 36000;

function validateNewUser(req, res, next) {
  const { username, password, confirmPassword } = req.body;

  if (
    username !== removeDisallowedCharacters(username) ||
    password !== removeDisallowedCharacters(password) ||
    confirmPassword !== removeDisallowedCharacters(confirmPassword)
  ) {
    res.json({
      msg: "Credentials can only include numbers and english letters",
      success: false,
    });
    return;
  }

  if (username.length < 1) {
    res.json({ msg: "Username can't be empty", success: false });
    return;
  }

  if (password.length < 8) {
    res.json({
      msg: "Password should be at least 8 characters",
      success: false,
    });
    return;
  }

  if (password !== confirmPassword) {
    res.json({ msg: "Passwords should match", success: false });
    return;
  }

  const userInDb = db.data.users.find((user) => {
    return user.username === username;
  });

  if (userInDb) {
    res.json({ msg: "Username is taken", success: false });
    return;
  }

  next();
}

async function createNewUser(req, res, next) {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username: username,
      password: hashedPassword,
      data: {
        username: username,
        todos: [],
      },
    };

    db.data.users.push(user);
    db.write();

    next();
  } catch {
    res.status(500).send({ msg: "Server error", success: false });
  }
}

async function loginUser(req, res, next) {
  const { username, password } = req.body;

  if (
    username !== removeDisallowedCharacters(username) ||
    password !== removeDisallowedCharacters(password)
  ) {
    res.json({ msg: "Wrong credentials", success: false });
    return;
  }

  const userInDb = db.data.users.find((user) => user.username === username);

  if (!userInDb) {
    res.json({ msg: "Wrong credentials", success: false });
    return;
  }

  try {
    const passwordsMatch = await bcrypt.compare(password, userInDb.password);

    if (!passwordsMatch) {
      res.json({ msg: "Wrong credentials", success: false });
      return;
    }

    const session_id = nanoid();

    cookies[session_id] = {
      username: userInDb.username,
      created: getCurrentTime(),
    };

    res.cookie("session_id", session_id);

    next();
  } catch {
    res.status(500).send({ msg: "Server error", success: false });
  }
}

function authenticateUser(req, res, next) {
  const sessionID = req.cookies.session_id;

  if (!sessionID || !cookies[sessionID]) {
    res.cookie("session_id", "");
    res.redirect("/login");
    return;
  }

  const cookieCreatedTime = cookies[sessionID].created;
  const expired = getCurrentTime() - cookieCreatedTime > COOKIE_LIFETIME;

  if (expired) {
    delete cookies[sessionID];
    res.cookie("session_id", "");
    res.redirect("/login");
    return;
  }

  next();
}

function findUser(sessionID) {
  return db.data.users.find(
    (user) => user.username === cookies[sessionID].username
  );
}

function cancelTodo(req, res, next) {
  const user = findUser(req.cookies.session_id);

  const cancelByID = req.params.id;

  const todo = user.data.todos.find((todo) => todo.id === cancelByID);

  todo.isCompleted = false;

  todo.isCanceled = true;

  db.write();

  next();
}

function completeTodo(req, res, next) {
  const user = findUser(req.cookies.session_id);

  const completeByID = req.params.id;

  const todo = user.data.todos.find((todo) => todo.id === completeByID);

  todo.isCompleted = true;

  todo.isCanceled = false;

  db.write();

  next();
}

function editTodo(req, res, next) {
  const user = findUser(req.cookies.session_id);

  const newTodo = req.body;

  const editByID = req.params.id;

  const todo = user.data.todos.find((todo) => todo.id === editByID);

  todo.title = newTodo.title;
  todo.task = newTodo.task;
  todo.priority = newTodo.priority;
  todo.isEdited = true;

  db.write();

  next();
}

function createTodo(req, res, next) {
  const user = findUser(req.cookies.session_id);

  const { title, task, priority } = req.body;

  const id = nanoid();

  const newTodo = {
    id: id,
    title: title,
    task: task,
    priority: priority,
    createdTime: getCurrentTime(),
    isCanceled: false,
    isCompleted: false,
    isEdited: true,
    finishedTime: null,
  };

  user.data.todos.push(newTodo);

  db.write();

  next();
}

function getCurrentTime() {
  return Math.round(new Date().getTime() / 1000);
}

function removeDisallowedCharacters(string) {
  return string.replace(/[^A-Za-z0-9_]/g, "");
}

export {
  validateNewUser,
  createNewUser,
  loginUser,
  authenticateUser,
  removeDisallowedCharacters,
  cancelTodo,
  findUser,
  editTodo,
  createTodo,
  completeTodo,
};
