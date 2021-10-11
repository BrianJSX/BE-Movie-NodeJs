const router = require("express").Router();
const User = require("../models/User");
const verifyToken = require("../verifyToken");
const CryptoJS = require("crypto-js");

//Update
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.pasword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can update your account !");
  }
});
//Delete
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been delete");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can delete your account !");
  }
});
//Get
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json({ ...info });
  } catch (err) {
    res.status(500).json(err);
  }
});
//Get All
router.get("/", verifyToken, async (req, res) => {
  console.log(req.user.isAdmin);
  if (req.user.isAdmin) {
    try {
      const query = req.query.new;
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allows");
  }
});

//Get User Stat
router.get("/stat", async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {}
});

module.exports = router;
