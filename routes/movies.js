const router = require("express").Router();
const Movie = require("../models/Movie");
const verifyToken = require("../verifyToken");

//Create
router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const newMovie = new Movie(req.body);
      const saveMovie = await newMovie.save();
      res.status(201).json(saveMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allows");
  }
});

// Update
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updateMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allows");
  }
});

router.put("/comments/:id", async (req, res) => {
  let response = {
    userId: req.body.userId,
    message: req.body.message,
  };
  const updateMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $push: { comments: { userId: req.body.userId, message: req.body.message } },
    },
    { new: true }
  );

  res.status(200).json(response);
});

//Delete
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("the movie has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you are not allowed");
  }
});

//GET
router.get("/find/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//search
router.get("/search/", async (req, res) => {
  try {
    const { title } = req.query;
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(title);
    console.log(searchRgx);
    const movie = await Movie.find({
      title: { $regex: searchRgx, $options: "i" },
      isSeries: false,
    }).limit(6);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Best Movie
router.get("/bestMovie", async (req, res) => {
  try {
    const movie = await Movie.aggregate([
      {
        $match: { isSeries: false },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//new
router.get("/newMovie", async (req, res) => {
  try {
    const movie = await Movie.aggregate([
      {
        $match: { isSeries: false },
      },
      { $sort: { updatedAt: -1 } },
      {
        $limit: 10,
      },
    ]);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/allMovies", async (req, res) => {
  try {
    const movie = await Movie.find();
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get movie series
router.get("/movieList", async (req, res) => {
  try {
    const movie = await Movie.aggregate([
      {
        $match: { isSeries: true },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Random
router.get("/random/", async (req, res) => {
  try {
    const type = req.query.type;
    if (type === "series") {
      const movie = await Movie.aggregate([
        {
          $match: { isSeries: true },
        },
        {
          $sample: { size: 1 },
        },
      ]);
      res.status(200).json(movie);
    } else {
      const movie = await Movie.aggregate([
        {
          $match: { isSeries: false },
        },
        {
          $sample: { size: 1 },
        },
      ]);
      res.status(200).json(movie);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
