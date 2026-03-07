// const dns = require("dns");
// dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();

const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`server is running on this ${process.env.PORT} port`);
});