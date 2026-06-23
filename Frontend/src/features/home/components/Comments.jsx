import { useState } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { useComments } from "../hooks/useComments";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/comments.scss";

const Comments = ({ songId }) => {
  const { comments, loading, posting, error, addComment, handleLikeComment, handleReplyToComment } = useComments(songId);
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await addComment(text);
    if (ok) setText("");
  }

  async function handleReplySubmit(e, commentId) {
    e.preventDefault();
    const ok = await handleReplyToComment(commentId, replyText);
    if (ok) {
      setReplyText("");
      setActiveReplyId(null);
    }
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
              
              <div className="comments__item-actions">
                <button 
                  className={`comments__action-btn ${c.likes?.includes(user?.id) ? 'comments__action-btn--active' : ''}`}
                  onClick={() => handleLikeComment(c._id)}
                >
                  <ThumbsUp size={14} />
                  <span>{c.likes?.length || 0}</span>
                </button>
                <button 
                  className="comments__action-btn"
                  onClick={() => setActiveReplyId(activeReplyId === c._id ? null : c._id)}
                >
                  <MessageSquare size={14} />
                  <span>Reply</span>
                </button>
              </div>

              {activeReplyId === c._id && (
                <form className="comments__reply-form" onSubmit={(e) => handleReplySubmit(e, c._id)}>
                  <input
                    type="text"
                    className="comments__reply-input"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                  <button type="submit" className="comments__reply-submit">Send</button>
                </form>
              )}

              {c.replies && c.replies.length > 0 && (
                <ul className="comments__replies-list">
                  {c.replies.map((reply, i) => (
                    <li key={i} className="comments__reply-item">
                      <p className="comments__item-username">{reply.username}</p>
                      <p className="comments__item-text">{reply.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Comments;