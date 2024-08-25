var express = require('express');
var router = express.Router();
const userModel = require("./users");
const ProjectTask = require("./task")
const passport = require("passport")
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", isLoggedIn, function (req, res) {
  userModel.find()
    .then(function (all) {
      res.render("index", { all })
    })
})

router.post("/register", function (req, res) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
  })
  userModel.register(userData, req.body.password)
    .then(function (registerUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
        console.log("Done")
      })
    }).catch(function (err) {
      res.send(err)
      res.redirect("/login")
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function (req, res) { })

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) throw err;
    res.redirect("/login")
  });
})

router.get("/login", function (req, res) {
  res.render("login")
})

router.get("/task", async function (req, res) {
  res.render("task")
})

router.post("/task", isLoggedIn, async function (req, res) {
  const projectTask = await ProjectTask.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
  })

  const UserUpdate = await projectTask.save();
  console.log(UserUpdate);
  res.redirect("/profile")

})

router.get("/list", isLoggedIn, function (req, res) {
  task.find()
    .then(function (data) {
      res.render("list", { data })
    })
})

router.get('/task/:id', async function (req, res, next) {
  ProjectTask.findOneAndDelete({ _id: req.params.id })
    .then(function (data) {
      res.redirect("/profile")
    })
});

router.get('/view/:id', isLoggedIn, async function (req, res, next) {
  task.findOne({ _id: req.params.id })
    .then(function (acc) {
      res.render("view", { acc })
    })
});



router.get("/task/:id/update", async function (req, res) {
  const Task = await ProjectTask.findById(req.params.id);
  res.render("update", { Task })
})

router.post('/task/:id/update', isLoggedIn, async function (req, res, next) {
  ProjectTask.updateOne(
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate
    }
  )
    .then(function (data) {
      res.redirect("/profile")
    })
})


router.get("/register", function (req, res) {
  res.render("register")
})

router.get("/profile", isLoggedIn, async function (req, res) {
  const founduser = await userModel.findOne({ username: req.session.passport.user })
  const Task = await ProjectTask.find()
  res.render("profile", { founduser, Task })
})

router.get("/viwe", isLoggedIn, async function (req, res) {
  const founduser = await userModel.findOne({ username: req.session.passport.user })
  const Task = await ProjectTask.find({ id: req.session.passport.user.userId });
  res.render("view", { founduser, Task })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) throw err;
    res.redirect("/")
  });
});


module.exports = router;