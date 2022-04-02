const COOKIE_LIFETIME = 20;
const bcrypt = require("bcrypt");
const users = require("../data/users.js");
const cookies = require("../data/cookies.js");
const {v4: uniqueID} = require("uuid")

function validateNewUser(req, res, next) {
  const {username, password} = req.body;

  if(username.length < 1) {
    res.json({msg: "Username cant be empty"})
    return;
  };

  if(password.length < 8) {
    res.json({msg: "Password should be at least 8 characters"});
    return;
  };

  const userInDb = users.find(user => {
    return user.username === username;
  });
  
  if(userInDb) {
    res.json({msg: "Username is taken"});
    return;
  };

  next();
};

async function createNewUser(req, res, next) {
  const {username, password} = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      "username": username,
      "password": hashedPassword,
      "data": {
        "username": username,
        "spendings": [
          {
            "time": "12:23",
            "date": "2022-01-31",
            "day": "1",
            "month": "April",
            "year": "2022",
            "amount": "98000",
            "currency": "SUM",
            "for": "Netflix monthly subscription.",
          }
        ]
      }
    }

    users.push(user);
    
    next();
  } catch {
    res.status(500).send({msg: "Error"})
  }
};

async function loginUser(req, res, next) {
  const {username, password} = req.body;

  const userInDb = users.find(user => user.username === username);

  if(!userInDb) {
    res.json({msg: "Wrong credentials"});
    return;
  };

  try {
    const passwordsMatch = await bcrypt.compare(password, userInDb.password);

    if(!passwordsMatch) {
      res.json({msg: "Wrong credentials"});
      return;
    }; 

    const session_id = uniqueID();

    cookies[session_id] = {
      "username": userInDb.username,
      "created": getCurrentTime()
    };

    res.cookie("session_id", session_id);

    next();
  } catch {
    res.status(500).send({msg: "Error"});
  };
};

function authenticateUser(req, res, next) {
  const sessionID = req.cookies.session_id;

  if(!sessionID || !cookies[sessionID]) {
    res.cookie("session_id", "");
    res.redirect("/login");
    return;
  };

  const cookieCreatedTime = cookies[sessionID].created;
  const expired = (getCurrentTime() - cookieCreatedTime) > COOKIE_LIFETIME;

  if(expired) {
    delete cookies[sessionID];
    res.cookie("session_id", "");
    res.redirect("/login");
    return;
  };

  next();
};

function getCurrentTime() {
  return Math.round((new Date().getTime()) / 1000); 
};

module.exports = {
  validateNewUser,
  createNewUser,
  loginUser,
  authenticateUser
};
