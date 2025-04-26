import React, { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';
import { useAuth }             from '../auth/AuthProvider';
import { supabase }            from '../client';

export default function StaticOverview() {
  const { user } = useAuth();
  const [statics, setStatics] = useState([]);

  // load all statics
  useEffect(() => {
    supabase
      .from('statics')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setStatics(data || []));
  }, []);

  // delete a static and remove it from state
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this static?')) return;
    const { error } = await supabase.from('statics').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      setStatics(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="page">
      <h2>All Statics</h2>
      <ul className="static-list">
        {statics.map(s => (
          <li key={s.id} className="static-item">
            <Link to={`/static/${s.id}`} className="static-link">
              {s.name}
            </Link>
            <div className="static-actions">
              {user?.id === s.created_by && (
                <>
                  <Link
                    to={`/static/${s.id}/edit`}
                    className="button button--secondary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="button button--danger"
                  >
                    Delete
                  </button>
                </>
              )}
              <Link
                to={`/schedule/${s.id}`}
                className="button button--primary"
              >
                View Schedule
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
