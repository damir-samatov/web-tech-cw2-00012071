const COOKIE_LIFETIME = 10;

const users = require("../data/users.js");
const cookies = require("../data/cookies.js");


function randomID() {
  return Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 11);
};

function getCurrentTime() {
  return Math.round((new Date().getTime()) / 1000) 
};

function validateNewUser(req, res, next) {
  const {username, password} = req.body;

  if(password.length < 8) {
    res.json({msg: "Password should be at least 8 characters"})
  };

  if(username.length < 1) {
    res.json({msg: "Username cant be empty"})
  }

  const userInDb = users.find(user => {
    return user.username === username
  });
  
  if(userInDb) {
    res.json({msg: "Username is taken"})
  };

  next();
};

function createNewUser(req, res, next) {
  const {username, password} = req.body;
  const user = {
    "username": username,
    "password": password,
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
        },
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
};

function loginUser(req, res, next) {
  const {username, password} = req.body;

  const userInDb = users.find(user => user.username === username);

  if(!userInDb || userInDb?.password !== password) {
    res.json({msg: "Wrong credentials"});
  };

  const session_id = randomID();

  cookies[session_id] = {
    "username": userInDb.username,
    "created": getCurrentTime()
  }
  
  res.cookie("session_id", session_id);
  
  next();
};

function authenticateUser(req, res, next) {
  const sessionID = req.cookies.session_id;

  if(!sessionID || !cookies[sessionID]) {
    res.cookie("session_id", "");
    res.redirect("/login");
  };
  
  const cookieCreatedTime = cookies[sessionID].created;
  
  const expired = (getCurrentTime() - cookieCreatedTime) > COOKIE_LIFETIME;
  
  if(expired) {
    delete cookies[sessionID];
    res.cookie("session_id", "");
    res.redirect("/login");
  };

  next();
}

module.exports = {
  randomID,
  validateNewUser,
  createNewUser,
  loginUser,
  authenticateUser
}
