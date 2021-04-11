let express = require("express");

const app = express();

app.use(function (req, res, next) {
  next();
});

app.use(express.static("./dist"));

app.listen(4000, () => console.log("Example app listening on port 4000!"));
