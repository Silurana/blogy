const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// router.get("/:id", async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id)
//       .populate("createdBy", "fullName profileImageURL");

//     if (!blog) return res.status(404).send("Blog not found");

//     res.render("blog", {
//       blog,
//       user: req.user
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "createdBy",
    "fullName profileImageURL"
  );
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy",
    "fullName profileImageURL"
  );
  return res.render("blog", {
    blog,
    user: req.user,
    comments,
  });
});

router.post("/comment/:blogId/comment", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    content: body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
