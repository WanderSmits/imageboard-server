const User = require("../models").user;
const { toData } = require("./jwt");
async function auth(req, res, next) {
  console.log("Req headers:", req.headers.authorization);
  // 1. check for authorization header and "split" it.
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  console.log("Auth test:", auth);
  // 2. if authorization header is there, auth type is Bearer and we have something at auth[1] we proceed to check the token.
  //    If not, we return a 401 status and the message: 'Please supply some valid credentials
  //    Remember to try/catch the call to "toData()".
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      // 3. Use the value returned from "toData()" to look for that user in your database with User.findByPk
      const data = toData(auth[1]);
      const user = await User.findByPk(data.userId);
      if (!user) {
        // 4. If not found, call next();
        return next("User does not exist");
      } else {
        // 5. If user is found, set it to `req.user = user` and call next();
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
}
module.exports = auth;
