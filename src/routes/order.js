const express = require("express");

const Order = require("../controllers/order");

const router = express.Router();

//INDEX
router.get("/", Order.index);

//SHOW
router.get("/:id", Order.show);

//DOWNLOAD
router.get("/:id/download", Order.download);

module.exports = router;
