const sqlite = require("sqlite3").verbose();

let db = new sqlite.Database(":memory:");
db.run(
  "CREATE TABLE users(user_id INTEGER PRIMARY KEY,username text NOT NULL, name text NOT NULL,age INTEGER,password text,company text, destination text,about text, email text NOT NULL, gender text);",
  function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log("Table Created");
  }
);

db.close();
