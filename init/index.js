const mongoose = require("mongoose");
const Listing = require("../Models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "683c695ce0440b78966d2066",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB(); // function calling
