import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { formatRole } from '../utils/format';

function CharacterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      const { data, error: supaErr } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (supaErr) setError(supaErr.message);
      else setCharacter(data);
      setLoading(false);
    };

    fetchCharacter();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this character?')) return;
    const { error: supaErr } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (supaErr) {
      alert('Delete failed: ' + supaErr.message);
    } else {
      navigate('/static');
    }
  };

  if (loading) return <p>Loading character…</p>;
  if (error) return <p className="form-error">Error: {error}</p>;
  if (!character) return <p>Character not found.</p>;

  return (
    <div className="page page--character-profile">
      <h2 className="page-title">{character.name}</h2>

      <div className="profile-card">
        <div className="profile-field">
          <span className="profile-label">Role:</span>
          <span className="profile-value">{formatRole(character.role)}</span>
        </div>
        <div className="profile-field">
          <span className="profile-label">Jobs:</span>
          <span className="profile-value">{character.jobs.join(', ')}</span>
        </div>
        <div className="profile-field">
          <span className="profile-label">Bio:</span>
          <span className="profile-value">{character.bio || '—'}</span>
        </div>
      </div>

      <div className="profile-actions">
        <Link to={`/character/${id}/edit`} className="button button--secondary">
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="button button--danger"
        >
          Delete
        </button>
      </div>

      <div className="profile-back">
        <Link to="/static" className="profile-back-link">
          Back to Static
        </Link>
      </div>
    </div>
  );
}

export default CharacterProfile;