const express = require("express");
const http = require("http");
const app = express();

const homeRouter = require("./routes/home"); // Change to homeRouter
const eventRouter = require("./routes/event"); // Change to eventRouter

app.use(homeRouter); // Mount the homeRouter
app.use(eventRouter); // Mount the eventRouter

const PORT = 3000; // Corrected the port number
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
