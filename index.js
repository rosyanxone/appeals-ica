const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log(req.query);
  res.status(201).json({
    status: "success",
    data: "Hello! server is running",
  });
});

// Listen
const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port: " + port);
