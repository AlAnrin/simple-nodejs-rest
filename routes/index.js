const express = require("express"),
    router = express.Router(),
    fileRoutes = require("./file.routes");

router.use('/files', fileRoutes);

module.exports = router;