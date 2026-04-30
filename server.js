require("dotenv").config();
const connectDB = require("./db/db");
const app = require("./src/app");

connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} `);
});
