import React, { useState, useEffect } from 'react';
import { supabase }                   from '../client';
import { useAuth }                   from '../auth/AuthProvider';
import './Comments.css';

export default function Comments({ staticId }) {
  const { user } = useAuth();
  const [comments,  setComments] = useState([]);
  const [userMap,   setUserMap]  = useState({});     // id → username
  const [newComment, setNewComment] = useState('');
  const [loading,    setLoading]  = useState(true);

  // fetch comments, then load usernames
  const fetchComments = async () => {
    setLoading(true);
  
    const { data: cmts, error: cmterr } = await supabase
      .from('comments')
      .select('id, content, user_id, created_at, upvotes')
      .eq('static_id', staticId)
      .order('created_at', { ascending: true });

    if (cmterr) {
      console.error('Fetch comments error:', cmterr);
      alert('Failed to load comments: ' + cmterr.message);
      setLoading(false);
      return;
    }
    setComments(cmts);

    const ids = Array.from(new Set(cmts.map(c => c.user_id)));
    if (ids.length > 0) {

      const { data: profiles, error: profErr } = await supabase
        .from('users')
        .select('id, username')
        .in('id', ids);

      if (profErr) {
        console.error('Fetch profiles error:', profErr);
      } else {

        const map = {};
        profiles.forEach(p => { map[p.id] = p.username; });
        setUserMap(map);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (staticId) fetchComments();
  }, [staticId]);

  // post new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        content:  newComment.trim(),
        user_id:  user.id,
        static_id: staticId
      }])
      .select('id');

    if (error) {
        console.error('Insert comment error:', error);
        alert('Failed to post comment: ' + error.message);
    } else {
        // data is an array of inserted rows; data[0].id is the new comment's id
        setNewComment('');
        fetchComments();
        // e.g. you could scroll to data[0].id here if you wanted
    }
  };

  // delete your own comment
  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else fetchComments();
  };

  // upvote handler
  const handleUpvote = async (commentId, currentUpvotes) => {
    // optimistic UI
    setComments(prev =>
      prev.map(c =>
        c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
      )
    );
    const { error } = await supabase
      .from('comments')
      .update({ upvotes: currentUpvotes + 1 })
      .eq('id', commentId);
    if (error) alert('Upvote failed: ' + error.message);
  };

  return (
    <div className="comments-section">
      <h3>Discussion</h3>
      {loading ? (
        <p>Loading comments…</p>
      ) : (
        comments.map(c => (
          <div key={c.id} className="comment">
            <div className="comment-content">{c.content}</div>
            <div className="comment-meta">
              {/* lookup username, fallback to 'You' or the UUID */}
              <span className="comment-author">
                {c.user_id === user?.id
                  ? 'You'
                  : userMap[c.user_id] || c.user_id}
              </span>
              <span className="comment-time">
                {new Date(c.created_at).toLocaleString()}
              </span>
              <button
                className="comment-upvote"
                onClick={() => handleUpvote(c.id, c.upvotes)}
              >
                🔥 {c.upvotes}
              </button>
              {user?.id === c.user_id && (
                <button
                  className="comment-delete"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            className="comment-input"
            placeholder="Share your thoughts…"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button type="submit" className="button button--primary">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="comments-login-prompt">
          Please log in to join the discussion.
        </p>
      )}
    </div>
  );
}
