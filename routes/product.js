const router = require("express").Router();
const Product = require("../models/Product");
const { ensureAuthenticated } = require("../modules/auth-tools");

//uncomment to protect all routes
// router.use(ensureAuthenticated);

//Get a singular product by ObjectID.
router.get("/:pid", async (req, res) => {
  Product.findById(req.params.pid, (err, product) => {
    if (err) {
      res.json({
        message: "Error",
        data: err,
      });
    } else {
      res.json({
        message: "Product",
        data: product,
      });
    }
  });
});

//Add a singular new product.
// TODO: validate and sanitize input; warning: dangerous straight collection of data from req.body
router.post("/add-one", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  let product = new Product({
    name: req.body.name, //string
    brand: req.body.brand, //string
    description: req.body.description, //string
    images: req.body.images, //string array of URLs
    categories: req.body.categories, //string array
    price: req.body.price, //number
    quantity: req.body.quantity, //number
  });
  product.save((err, product) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log("New product added:");
      console.log(product);
      res.json(product);
    }
  });
});

//Get a multiple products depending on the query.
//Usage: GET /product/?property=value
//For categories: GET /product/?categories=category1/category2/...
//TODO: https://docs.mongodb.com/manual/reference/operator/query/#std-label-query-selectors use this for more query options (price/reviews gt, lt, etc...)
router.get("/", async (req, res) => {
  let query = req.query;
  if (query.name) {
    //Mongoose regex case-insensetive matching
    query.name = { $regex: query.name, $options: "i" };
  }
  if (query.categories) {
    let categories = query.categories.split(";");
    query.categories = { $in: categories };
  }
  if (query.brand) {
    let brands = query.brand.split(";");
    query.brand = { $in: brands };
  }
  console.log("Product query:");
  console.log(query);
  Product.find(query)
    .then((products) => {
      res.json({
        message: "Products",
        data: products,
      });
    })
    .catch((error) => {
      res.json({
        message: "Error",
        data: error,
      });
    });
});

/*Update an existing product.
Usage:
PUT /product/:pid
{
  "whatToChange1": newValue1
  "..."
} */
router.put("/:pid", async (req, res) => {
  //add {returnOriginal: false} before callback to return the original doc instead of the old one.
  Product.findByIdAndUpdate(req.params.pid, req.body, (err, docs) => {
    if (err) {
      res.json({
        message: "Error",
        data: err,
      });
    } else {
      res.json({
        message: "Old Product",
        data: docs,
      });
    }
  });
});

//Delete a product.
router.delete("/:pid", async (req, res) => {
  Product.findByIdAndRemove(req.params.pid, (err, docs) => {
    if (err) {
      res.json({
        message: "Error",
        data: err,
      });
    } else {
      res.json({
        message: "Product",
        data: docs,
      });
    }
  });
});

//Add multiple new products.
// TODO: validate and sanitize input; warning: dangerous straight collection of data from req.body
router.post("/add-many", (req, res) => {
  let products = [];
  for (let i = 0; i < req.body.products.length; i++) {
    let product = new Product({
      name: req.body.products[i].name, //string
      brand: req.body.products[i].brand, //string
      description: req.body.products[i].description, //string
      images: req.body.products[i].images, //string array of URLs
      categories: req.body.products[i].categories, //string array
      price: req.body.products[i].price, //number
      quantity: req.body.products[i].quantity, //number
    });
    product.save((err, product) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
    });
    products.push(product);
  }

  res.json({
    success: true,
    message: "",
    data: products,
  });
});

module.exports = router;
