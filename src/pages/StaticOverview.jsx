import React, { useState, useEffect } from 'react';
import { formatRole } from '../utils/format';
import { Link } from 'react-router-dom';
import { supabase } from '../client';

function StaticOverview() {
  const [raidmates, setRaidmates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchRaidmates = async () => {
    setLoading(true);
    setError(null);

    const { data, error: supaErr } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false });

    if (supaErr) {
      setError(supaErr.message);
    } else {
      setRaidmates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRaidmates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this character?')) return;
    const { error: supaErr } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (supaErr) {
      alert('Delete failed: ' + supaErr.message);
    } else {
      fetchRaidmates();
    }
  };

  return (
    <div className="page page--static-overview">
      <h2 className="page-title">My Static</h2>

      {loading && <p>Loading raidmates…</p>}
      {error && <p className="form-error">Error: {error}</p>}

      {!loading && !raidmates.length && (
        <p>No raidmates found. <Link to="/character/new">Create one!</Link></p>
      )}

      {!loading && raidmates.length > 0 && (
        <ul className="static-list">
          {raidmates.map((c) => (
            <li key={c.id} className="static-item">
              <Link to={`/character/${c.id}`} className="static-link">
                <strong>{c.name}</strong> — <span className="role-label">{formatRole(c.role)}</span>
              </Link>

              <div className="static-actions">
                <Link
                  to={`/character/${c.id}/edit`}
                  className="button button--secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="button button--danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StaticOverview;