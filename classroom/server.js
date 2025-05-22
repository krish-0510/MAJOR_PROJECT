const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

// const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysupersecretsstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;

  if (name === "anonymous") {
    req.flash("error", "user not registered!");
  } else {
    req.flash("success", "user registerd successfully!");
  }

  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  // res.send(`hello,${req.session.name}`);
  res.render("page.ejs", { name: req.session.name });
});

// app.use("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }

//   res.send(`You sent a request ${req.session.count}times`);
// });

// app.get("/test",(req,res)=>{
//     res.send("test successfull")
// })

// app.use(cookieParser("secretcode"));

// app.get("/getsingedcookie",(req,res)=>{
//     res.cookie("madeIn","India",{signed:true})
//     res.send("singed cookie sent.");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified")
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");  // sending cookie response..
//     res.cookie("madeIn","India");  // sending cookie response..
//     res.send("sent you some cookies");
// })

// // usage of cookie by parser method..
// app.use("/greet",(req,res)=>{
//     let{name = anonymous}=req.cookies;
//     res.send(`hi,${name}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I Am Root");
// })

// app.use("/users",users); // it show us the common part in the route.
// app.use("/posts",posts);

app.listen(3000, () => {
  console.log("server is listing on port 3000");
});
