const router = require("express").Router();
const { Post, User, Comment } = require("../../models");

router.post("/createNewPost", (req, res) => {
  req.body.user_id = req.session.user_id;

  Post.create(req.body).then((data) => {
    res.redirect("/dashboard");
  });
});

router.post("/createNewComment/:id", (req, res) => {
  req.body.user_name = req.session.user_name;
  req.body.post_id = req.params.id;

  Comment.create(req.body).then((data) => {
    res.redirect("back");
  });
});

router.get("/updatePost/:id", (req, res) => {
  Post.update(
    {
      title: req.query.title,
      body: req.query.body,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((updateData) => {
      if (!updateData) {
        res.status(404).json({ message: "No data" });
        return;
      }
      res.redirect("/dashboard");
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/deletePost/:id", (req, res) => {
  Post.destroy({
    where: { id: req.params.id },
  })
    .then((data) => {
      if (!data) {
        res.status(404).json({ message: "No data" });
        return;
      }
      res.redirect("/dashboard");
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
