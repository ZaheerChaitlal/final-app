import { Router } from "express";
import Article from "../models/Article.js";

const router = Router();

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Get one article by name
router.get("/:name", async (req, res) => {
  try {
    const article = await Article.findOne({ name: req.params.name });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Upvote an article
router.put("/:name/upvotes", async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { name: req.params.name },
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Failed to update upvotes" });
  }
});

// Create a new article
router.post("/", async (req, res) => {
  const { name, title, content } = req.body;

  if (!name || !title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newArticle = new Article({
      name,
      title,
      content: Array.isArray(content) ? content : [content],
      comments: [],
      upvotes: 0,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: "Failed to create article" });
  }
});

// Add a comment to an article
router.post("/:name/comments", async (req, res) => {
  const { author, text } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: "Missing author or text in comment" });
  }

  try {
    const article = await Article.findOne({ name: req.params.name });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    article.comments.push({ author, text });
    await article.save();

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

export default router;
