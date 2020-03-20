const { Router } = require("express");
const { toData } = require("../auth/jwt");
const Image = require("../models").image;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { url, title } = req.body;

    if (!url || !title) {
      res.status(401).send("missing parameters");
    } else {
      //create a new image
      const createImage = await Image.create({ url, title });
      res.send(createImage);
    }
  } catch (e) {
    next(e);
  }
});

router.get("/messy", async (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      console.log(auth);
      const data = toData(auth[1]);
      console.log(data);
    } catch (e) {
      res.status(400).send("Invalid JWT token");
    }
    const allImages = await Image.findAll();
    res.json(allImages);
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
});

//get image by id
router.get("/:id", async (req, res, next) => {
  //get id param
  const { id } = req.params;
  console.log("Id", id);
  //findbypk
  try {
    const image = await Image.findByPk(id);
    //send it back

    if (!image) {
      res.status(404).send("no image found");
    } else {
      res.json(image);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
