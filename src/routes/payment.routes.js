const express = require("express");
const router = express.Router();
const app = express();
const {
  createorder,
  captureorder,
  cancelorder,
} = require("../controllers/payment.controllers");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.get("/create-order/:price/:centauripoints/:user", async (req, res) => {
  console.log(req.params);
  var url = await createorder(
    req.params.centauripoints,
    req.params.price,
    req.params.user
  );
  res.redirect(url);
});

router.get("/capture-order/:centauripoints/:user", captureorder);
router.get("/cancel-order", cancelorder);

module.exports = router;
