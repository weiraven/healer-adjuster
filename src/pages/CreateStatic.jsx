import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';

export default function CreateStatic() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error: supaError } = await supabase
      .from('statics')
      .insert({ name, description })
      .select()
      .single();

    if (supaError) {
      console.error('Insert static error:', supaError);
      setError(supaError.message);
    } else {
      // Navigate to the newly created static's detail page
      navigate(`/static/${data.id}`);
    }
  };

  return (
    <div className="page page--form">
      <h2>Create New Static</h2>
      {error && <p className="form-error">Error: {error}</p>}
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

        <button
          type="submit"
          className="button button--primary"
          disabled={!name.trim()}
        >
          Create Static
        </button>
      </form>
    </div>
  );
}
