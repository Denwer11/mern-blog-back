import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  const sortBy = req.query.sortBy;
  const sortOptions = {};
  sortOptions[sortBy] = -1;

  try {
    const posts = await PostModel.find()
      .populate({ path: "user", select: ["name", "avatar"] })
      .sort(sortOptions)
      .exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: "user", select: ["name", "avatar"] })
      .limit(5)
      .exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить теги" });
  }
};

export const getPostsByTag = async (req, res) => {

  try {
    const posts = await PostModel.find({ tags: req.params.tag  })
      .populate({ path: "user", select: ["name", "avatar"] })
      .exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({ message: "Не удалось вернуть статью" });
        }

        if (!doc) {
          return res.status(404), json({ message: "Статья не найдена" });
        }

        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({ message: "Не удалось удалить статью" });
        }

        if (!doc) {
          return res.status(404), json({ message: "Статья не найдена" });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Не удалось обновить статью" });
  }
};
