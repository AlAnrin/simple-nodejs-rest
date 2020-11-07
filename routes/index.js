const express = require("express"),
    router = express.Router()
    dirsRoutes = require("./dirs.routes");

router.use('/dirs', dirsRoutes)

module.exports = router;