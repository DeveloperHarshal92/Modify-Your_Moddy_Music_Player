import { useState } from "react";
import { useComments } from "../hooks/useComments";
import "../style/comments.scss";

const Comments = ({ songId }) => {
  const { comments, loading, posting, error, addComment } = useComments(songId);
  const [text, setText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await addComment(text);
    if (ok) setText("");
  }

  return (
    <section className="comments">
      <h2 className="comments__title">Reviews</h2>

      <form className="comments__form" onSubmit={handleSubmit}>
        <textarea
          className="comments__input"
          placeholder="Share your thoughts on this track…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          required
        />
        <button className="comments__submit" type="submit" disabled={posting}>
          {posting ? "Posting…" : "Post"}
        </button>
      </form>

      {error && <div className="comments__error">{error}</div>}

      {loading ? (
        <p className="comments__status">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="comments__status">No reviews yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="comments__list">
          {comments.map((c) => (
            <li key={c._id} className="comments__item">
              <p className="comments__item-username">{c.username}</p>
              <p className="comments__item-text">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Comments;