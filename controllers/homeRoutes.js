const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", (req, res) => {
  Post.findAll({
    include: [User],
  }).then((data) => {
    const posts = data.map((post) => post.get({ plain: true }));
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  });
});

router.get("/", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["name", "ASC"]],
    });

    const users = userData.map((data) => data.get({ plain: true }));

    res.render("homepage", {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [User],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/createnewpost", (req, res) => {
  res.render("post");
});

router.get("/createnewcomment/:id", async (req, res) => {
  const postData = await Post.findOne({
    where: { id: req.params.id },
    include: [User],
  });
  const post = postData.get({ plain: true });

  const commentsData = await Comment.findAll({
    where: { post_id: req.params.id },
  });
  // console.log(commentsData);
  const comments = commentsData.map((comments) =>
    comments.get({ plain: true })
  );

  res.render("comment", { post, comments, logged_in: req.session.logged_in });
});

router.get("/editpost/:id", async (req, res) => {
  const postData = await Post.findOne({
    where: { id: req.params.id },
    include: [User],
  });
  const post = postData.get({ plain: true });

  res.render("editpost", { post, logged_in: req.session.logged_in });
});

module.exports = router;
