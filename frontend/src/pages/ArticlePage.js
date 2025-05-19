import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import NotFoundPage from "./NotFoundPage";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ArticlePage = () => {
  const { name } = useParams();
  const [article, setArticle] = useState({});
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  useEffect(() => {
    const loadArticleInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/articles/${name}`);
        setArticle(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadArticleInfo();
  }, [name]);

  const addUpvote = async () => {
    const response = await axios.put(`${API_URL}/articles/${name}/upvotes`);
    const updatedArticle = response.data;
    setArticle(updatedArticle);
  };

  const addComment = async () => {
    if (!author.trim() || !text.trim()) {
      alert("Please enter both your name and comment.");
      return;
    }

    setLoadingComment(true);

    try {
      const response = await axios.post(`${API_URL}/articles/${name}/comments`, {
        author,
        text,
      });
      setArticle(response.data);
      setAuthor("");
      setText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setLoadingComment(false);
    }
  };

  if (!article.content) {
    return <NotFoundPage />;
  }

  return (
    <div className="pgbody">
      <h1>{article.title}</h1>

      <div id="upvotes-section">
        <button onClick={addUpvote}>Add Upvote</button>
        <p>This article has {article.upvotes} upvotes</p>
      </div>

      <div id="content-section">
        {article.content?.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <div id="add-comment-form">
        <h3>Add a comment</h3>
        <label htmlFor="commentAuthor">Name: </label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          id="commentAuthor"
        />

        <label htmlFor="commentText">Comment: </label>
        <textarea
          rows="4"
          cols="50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          id="commentText"
        ></textarea>

        <button onClick={addComment} disabled={loadingComment}>
          {loadingComment ? "Adding..." : "Add Comment"}
        </button>
      </div>

      <h3>Comments</h3>
      {article.comments?.length ? (
        article.comments.map((comment, idx) => (
          <div key={idx} className="comment">
            <h4>{comment.author}</h4>
            <p>{comment.text}</p>
          </div>
        ))
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
};

export default ArticlePage;
