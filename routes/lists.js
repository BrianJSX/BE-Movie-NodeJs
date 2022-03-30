const router = require("express").Router();
const List = require("../models/List");
const verifyToken = require("../verifyToken");

//New
router.get("/newList", async (req, res) => {
  try {
    let list = await List.aggregate([
      { $sort: { updatedAt: -1 }},
      { $limit: 8 }
    ]);
    return res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create
router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const newList = new List(req.body);
      const saveList = await newList.save();
      res.status(201).json(saveList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allows");
  }
});

//Update
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updateList = await List.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allows");
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const lists = await List.findById(req.params.id);
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("the lists has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allowed");
  }
});

//GET
router.get("/", async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    return res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
