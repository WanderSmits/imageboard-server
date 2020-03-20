const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT, toData } = require("../auth/jwt");
const router = new Router();
const User = require("../models").user;
const authMiddleware = require("../auth/middleware");

router.get("/test-auth", authMiddleware, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`,
    profilePicture: `blabla.png`
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({
      message: "Please supply a valid email and password"
    });
  } else {
    // 1. find user based on email address
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    console.log("Password:", password);
    console.log("user.password:", user.password);
    const condition = bcrypt.compareSync(password, user.password);
    console.log("Condition test:", condition);
    if (!user) {
      res.status(400).send({
        message: "User with that email does not exist"
      });
    }
    // 2. use bcrypt.compareSync to check the recieved password against the stored hash
    else if (condition) {
      // 3. if the password is correct, return a JWT with the userId of the user (user.id)
      const jwt = toJWT({ userId: user.id });
      res.send({
        jwt
      });
    } else {
      res.status(400).send({
        message: "Password was incorrect"
      });
    }
  }
});

module.exports = router;
