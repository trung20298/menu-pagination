const mongoose = require("mongoose");
const { aggregatePaginate } = require("../models/order");
const fs = require("fs");

const Order = require("../models/order");
const { json } = require("body-parser");

// const limit_ = 10;

// @route GET api/event
// @desc Returns all events with pagination
// @access Public
exports.index = async function (req, res) {
  //PAGINATION -- set the options for pagination
  const options = {
    page: parseInt(req.query.page) || 1,
    // limit: limit_,
    limit: parseInt(req.query.limit_) || 10,
    collation: { locale: "en" },
    customLabels: {
      totalDocs: "totalResults",
      docs: "orders",
    },
  };

  if (req.query.id) {
    aggregate_options.push({
      $match: {
        _id: mongoose.Types.ObjectId(req.query.id),
      },
    });
  }
  // query co gi
  console.log("request:", JSON.stringify(req.query));

  //FILTERING AND PARTIAL TEXT SEARCH -- FIRST STAGE
  const aggregate_options = [];

  const fromDate = req.query.from_date;
  const toDate = req.query.to_date;

  // req.query lúc này là text_search
  // điều kiện bây giờ
  //  orderId = req.query.text_search  OR trackNumber ==  req.query.text_search OR carRegis =  req.query.text_search
  const condition = {
    $match: {
      // { $or: [ <expression1>, <expression2>, ... ] }
      $or: [
        { order_id: req.query.text_search },
        { track_number: req.query.text_search },
        { car_regis_number: req.query.text_search },
      ],
    },
  };

  //  DIEU KIEN THEM
  //   $match: {
  //     date_created: { $gt: new Date(fromDate), $lt: new Date(toDate) },

  if (req.query.text_search) aggregate_options.push(condition);
  if (req.query.from_date && req.query.to_date)
    aggregate_options.push({
      $match: {
        date_created: { $gt: new Date(fromDate), $lt: new Date(toDate) },
      },
    });

  // Set up the aggregation
  const myAggregate = Order.aggregate(aggregate_options); // aggregate_options được dùng để query
  const result = await Order.aggregatePaginate(myAggregate, options);
  res.status(200).json(result);

  //SORTING -- FIFTH STAGE
  let sort_order =
    req.query.sort_order && req.query.sort_order === "asc" ? 1 : -1;
  let sort_by = req.query.sort_by || "date_created";
  aggregate_options.push({
    $sort: {
      [sort_by]: sort_order,
      _id: -1,
    },
  });
};

// @route GET api/event/{id}
// @desc Returns a specific event
// @access Public

//get an order
exports.show = async function (req, res) {
  try {
    const id = req.params.id;

    const order = await Order.findById(id);

    if (!order)
      return res.status(401).json({ message: "Order does not exist" });

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//download an order
exports.download = async function (req, res) {
  try {
    // TEST DOWNLOAD THEO FILE PATH

    // var filePath = "./src/controllers/sample.txt"; // Or format the path using the `id` rest param
    // console.log("filePath:", filePath);
    // var fileName = "sample.txt"; // The default name the browser will use
    // console.log("fileName:", fileName);
    // res.download(filePath, fileName, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log("FILE [" + filePatch + "] WAS DOWNLOAD");
    // });

    // TEST DOWNLOAD THEO REQ PARAMS

    const id = req.params.id;

    const order = await Order.findById(id);

    if (!order)
      return res.status(401).json({
        message: " Order does not exist so you can't download",
      });

    // res.json({ order });

    const filePatch = "./src/controllers/delete.txt";
    const data = JSON.stringify(order);

    const fileName = "order.txt"; // The default name the browser will use

    fs.writeFile(filePatch, data, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("FILE [" + filePatch + "] WAS CREATED");
      res.download(filePatch, fileName, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("FILE [" + filePatch + "] WAS DOWNLOAD");
        fs.unlink(filePatch, (err) => {
          if (err) {
            console.log(err);
          }
          console.log("FILE [" + filePatch + "] WAS REMOVED!");
        });
      });
    });

    // DELETE A FILE
    // fs.unlink(filePatch, (err) => {
    //   if (err) throw err;
    //   console.log("filePatch was deleted");
    // });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
