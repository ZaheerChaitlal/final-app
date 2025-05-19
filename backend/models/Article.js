import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  name: String,
  title: String,
  upvotes: Number,
  comments: [
    {
      author: String,
      text: String,
    },
  ],
  content: [String],
});

const Article = mongoose.model("Article", articleSchema);
export default Article;
