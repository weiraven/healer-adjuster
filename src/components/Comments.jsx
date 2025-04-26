import React, { useState, useEffect } from 'react';
import { supabase }                   from '../client';
import { useAuth }                   from '../auth/AuthProvider';
import './Comments.css';

export default function Comments({ staticId }) {
  const { user } = useAuth();
  const [comments,  setComments] = useState([]);
  const [userMap,   setUserMap]  = useState({});
  const [newComment, setNewComment] = useState('');
  const [loading,    setLoading]  = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText]   = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

    const { error } = await supabase
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
        setNewComment('');
        fetchComments();
    }
  };

  // delete comment
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else fetchComments();
  };

  // edit workflow
  const startEdit = cmt => {
    setEditingId(cmt.id);
    setEditText(cmt.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async id => {
    const { error } = await supabase
      .from('comments')
      .update({ content: editText })
      .eq('id', id);
    if (error) {
      alert('Edit failed: ' + error.message);
    } else {
      cancelEdit();
      fetchComments();
    }
  };

  // upvote handler
  const handleUpvote = async (commentId, currentUpvotes) => {
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
            {editingId === c.id ? (
                <textarea
                  className="comment-input"
                  value={editText}
                  onChange={e => setEditText(e.target.value)} 
                />
              ) : (
                <div className="comment-content">
                  {c.content}
                </div>
              )} 

            <div className="comment-meta">
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

              {user?.id === c.user_id && editingId !== c.id && (
                <button
                  className="comment-edit"
                  onClick={() => startEdit(c)}
                >
                  Edit
                </button>
              )}

              {editingId === c.id && (
                <>
                  <button
                    className="comment-save"
                    onClick={() => saveEdit(c.id)}
                    disabled={!editText.trim()}
                  >
                    Save
                  </button>
                  <button
                    className="comment-cancel"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </>
              )}

              {user?.id === c.user_id && editingId !== c.id && (
                <button
                  className="comment-delete"
                  onClick={() => setConfirmDeleteId(c.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}

{confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <p>Are you sure you want to delete? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="button button--danger"
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Delete
              </button>
              <button
                className="button button--secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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