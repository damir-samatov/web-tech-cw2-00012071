# 00012071
## web-tech-cw2-00012071
## Heroku https://web-tech-cw2-00012071.herokuapp.com/
## GitHub https://github.com/damir-samatov/web-tech-cw2-00012071

## About 
### Any user can register by providing username and password, and use those credentials to login in future
### Sessions are implemented through saving session_id cookies in the backed for later authenticating users by session_id stored in the client browser
### Sessions do expire after 1 hour that can be configured by changing COOKIE_LIFETIME value, user no longer can access protected routes without relogining, as cookies get deleted both in the backed and client.
### User can read, add, edit, cancel or complete their own todos 


### dependencies 
#### bcrypt for hashing passwords
#### cookie-parser for implementing login/register functionality
#### dotenv for Heroku
#### express for backend
#### pug for generating html documents
#### lowdb .json database for storing user information
#### nanoid package for generating random IDs for session_ids and todo IDs

### dev-dependecies 
#### nodemon for restarting the server

### instructions
#### download the project

#### run "npm install" in the root folder to install dependencies

#### run "npm run dev" to run the project locally with nodemon

#### run "node server.js" for deployment
