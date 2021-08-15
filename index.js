const express = require("express");
const { open } = require("sqlite");
const Sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "users.js");
let db = null;

const intializerDbPath = async () => {
  try {
    app.listen(3000, () => {
      console.log("Server is running at https://localhost/3000");
    });
    db = await open({
      filename: dbPath,
      driver: Sqlite3.Database,
    });
  } catch (e) {
    console.log(`Db error ${e.message()}`);
    process.exit(e);
  }
};
intializerDbPath();

//converting dbobject to responseObject

const converting = (dbObj) => {
  return {
    user_id: dbObj.user_id,
    username: dbObj.username,
    name: dbObj.name,
    email: dbObj.email,
    password: dbObj.password,
    company: dbObj.company,
    about: dbObj.about,
  };
};

// api to get user
app.get("/users/", async (request, response) => {
  const getUsersQuery = `select * from users;`;
  const UserArray = await db.all(getUsersQuery);
  response.send(UserArray);
});

//register api
app.post("/register/", async (request, response) => {
  const { username, name, email, password, company, about } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `select * from users  where username ='${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
INSERT INTO users (username,name,email,password,company,about)
VALUES (
   '${username}' ,'${name}','${email}','${hashedPassword}','${company}',${about});`;
    await db.run(createUserQuery);
    response.send("User Created Succesfully");
  } else {
    response.status(400);
    response.send("user already exists");
  }
});

//login

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `select * from users  where username ='${username}';`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid Password");
  } else {
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatch === true) {
      response.send("login successful");
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

//get only an user by id
app.get("/user/:user_id/", async (request, response) => {
  const { user_id } = request.params;
  const getUserQuery = `select * from users where id=${id};`;
  const user = await db.get(getUserQuery);
  response.send(converting(user));
});

//update user
app.put("/update/:user_id/", async (request, response) => {
  const { username, name, email, password, company, about } = request.body;
  const { user_id } = request.params;
  const UpdateUserQuery = `UPDATE users SET username=${username},name=${name},email=${email},password=${password},company=${company},about=${about} where id=${id};`;
  await db.run(UpdateUserQuery);
  response.send("Query Updated");
});

//delete user query

app.delete("/delete/:user_id/", async (request, response) => {
  const { user_id } = request.params;
  const deleteUserQuery = `DELETE FROM users where id=${id};`;
  await db.run(deleteUserQuery);
  response.send("user removed");
});
