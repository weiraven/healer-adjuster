import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

export default function EditStatic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatic = async () => {
      setLoading(true);
      const { data, error: supaErr } = await supabase
        .from('statics')
        .select('name, description, created_by')
        .eq('id', id)
        .single();

      if (supaErr) {
        setError(supaErr.message);
      } else {
        setName(data.name);
        setDescription(data.description || '');
      }
      setLoading(false);
    };
    fetchStatic();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { error: supaErr } = await supabase
      .from('statics')
      .update({ name, description })
      .eq('id', id);

    if (supaErr) {
      console.error('Update static error:', supaErr);
      setError(supaErr.message);
    } else {
      navigate(`/static/${id}`);
    }
  };

  if (loading) return <p>Loading static…</p>;
  if (error)   return <p className="form-error">Error: {error}</p>;

  return (
    <div className="page page--form">
      <h2>Edit Static</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="static-name" className="form-label">Name</label>
          <input
            id="static-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="static-description" className="form-label">Description</label>
          <textarea
            id="static-description"
            className="form-textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            Save Changes
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => navigate(`/static/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}