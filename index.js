import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from "./validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";
import multer from "multer";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://denwer:dasha558@mern-blog.xexz2bl.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts/:id/comments", CommentController.getCommentsByPostId);
app.post(
  "/posts/:id/comments",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.create
);
app.delete(
  "/posts/:id/comments/:commentId",
  checkAuth,
  handleValidationErrors,
  CommentController.remove
);
app.patch(
  "/posts/:id/comments/:commentId",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.update
);

app.get("/tags", PostController.getLastTags);
app.get("/tags/:tag", PostController.getPostsByTag);

app.get("/posts", PostController.getAll);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
