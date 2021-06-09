// Express setup
const express = require("express");
const app = express();
const peopleRoutes = require("./routes/people");
const port = process.env.PORT || 5000;

app.use("/api/person", peopleRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
