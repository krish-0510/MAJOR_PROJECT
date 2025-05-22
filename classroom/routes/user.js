const express = require("express");
const router = express.Router();

//Index route.. -Users
router.get("/", (req, res) => {
  res.send("Get for Users");
});

//show route..-Users
router.get("/:id", (req, res) => {
  res.send("Get for show Users");
});

//post route..-Users
router.post("/", (req, res) => {
  res.send("Post for Users");
});

//delete route..-Users
router.delete("/:id", (req, res) => {
  res.send("delete for User id");
});


module.exports = router;
