const express = require("express"),
  app = express();

app.get("/", (req, res) => {
  res.json({ page: "main", otherData: null });
});

app.get("/test_01", (req, res) => {
  res.json({
    page: "test01",
    otherData: { username: "root", password: "1234" }
  });
});

app.listen(8080, "localhost", err => {
  console.log("server are running and listento port | 8080 |");
});
