import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars except spaces and hyphen
    .replace(/\s+/g, "-"); // replace spaces with hyphens
};

const NewPostPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, name: generateSlug(prev.title) }));
  }, [form.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contentArray = form.content.split("\n\n");

    try {
      const response = await fetch("http://localhost:5000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, content: contentArray }),
      });

      if (response.ok) {
        navigate("/articles");
      } else {
        console.error("Error posting article");
      }
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  if (!user) {
    return (
      <div className="pgbody">
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="pgbody">
      <h1>Create New Article</h1>
      <form id="new-article-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Article Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="URL-friendly name is auto-generated from the title"
          value={form.name}
          readOnly
          style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
        />
        <textarea
          name="content"
          placeholder="Article content (separate paragraphs with two line breaks)"
          value={form.content}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewPostPage;
