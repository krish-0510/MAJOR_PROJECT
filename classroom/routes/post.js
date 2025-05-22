const express = require("express");
const router = express.Router();


//Posts..
router.get("/",(req,res)=>{
    res.send("Post for Users")
})

//show route..

router.get("/:id",(req,res)=>{
    res.send("Post for show Users")
})

//post route..

router.post("/",(req,res)=>{
    res.send("Post for Users")
})

//delete route..

router.delete("/:id",(req,res)=>{
    res.send("delete for Post id")
})

module.exports=router;