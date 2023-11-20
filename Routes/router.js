const router = require("express").Router();

const serviceRouter = require("./service.js");

router.use("/", serviceRouter)


module.exports = router;