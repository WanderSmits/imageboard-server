const { Router } = require("express");
const User = require("../models").user;
const bcrypt = require("bcrypt");

const router = new Router();

const users = [
  {
    email: "Herman@herman.com",
    password: "abc",
    fullName: "Herman de Scherman"
  }
];

// router.get(() => (req, res) => res.send(User));
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    //the params after the post
    const { email, password, fullName } = req.body;
    //if there arent given any params
    if (!email || !password || !fullName) {
      res.status(400).send("missing parameters");
    } else {
      //makes the password hashed
      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        fullName
      });
      res.json(newUser);
    }
  } catch (e) {
    next(e);
  }
});

// router.delete("/", async (req, res, next) => {
//   try {
//     const { email, password, fullName } = req.body;
//     if (!email || !password || !fullName) {
//       res.status(400).send("missing parameters");
//     } else {
//       const deleteUser = await User.destroy({
//         email,
//         password,
//         fullName
//       });
//       res.json(deleteUser);
//     }
//   } catch (e) {
//     next(e);
//   }
// });

module.exports = router;
