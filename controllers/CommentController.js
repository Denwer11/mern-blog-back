import CommentModel from "../models/Comment.js";

export const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await CommentModel.find({
      post: req.params.postId,
    })
      .populate("author", "username")
      .exec();

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить комментарии" });
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const postId = req.params.id;

    CommentModel.findOneAndDelete(
      {
        _id: commentId,
        post: postId,
      },
      (err, doc) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Не удалось удалить комментарий" });
        }

        if (!doc) {
          return res.status(404), json({ message: "Комментарий не найден" });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить комментарий" });
  }
};

export const create = async (req, res) => {
  const postId = req.params.id;

  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: postId,
      user: req.userId,
    });

    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Не удалось создать комментарий" });
  }
};

export const update = async (req, res) => {
  try {
    const commentId = req.params.id;
    const postId = req.params.id;

    await CommentModel.updateOne(
      {
        _id: commentId,
      },
      {
        text: req.body.text,
        post: postId,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Не удалось обновить комментарий" });
  }
};
