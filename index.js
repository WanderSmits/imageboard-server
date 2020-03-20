const express = require("express");
const userRouter = require("./routers/user");
const imageRouter = require("./routers/image");
const authRouter = require("./routers/auth");
const authMiddleware = require("./auth/middleware");

const app = express();
const jsonParser = express.json();

app.use(jsonParser);
app.use("/users", userRouter);
app.use("/images", authMiddleware, imageRouter);
app.use("/", authRouter);

const port = 4000;

app.listen(port, () => console.log("Listening on port", port));
