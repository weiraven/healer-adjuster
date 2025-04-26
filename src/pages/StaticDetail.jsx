import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../client';
import './StaticDetails.css';

export default function StaticDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [staticData, setStaticData] = useState(null);
  const [members, setMembers] = useState([]);

  const fetchStatic = async () => {
    const { data, error } = await supabase
      .from('statics')
      .select('*')
      .eq('id', id)
      .single();
    if (error) console.error('Error fetching static:', error);
    else setStaticData(data);
  };

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('static_members')
      .select(`character:characters (id, name, role)`)
      .eq('static_id', id);
    if (error) console.error('Error fetching members:', error);
    else setMembers(data || []);
  };

  useEffect(() => {
    fetchStatic();
    fetchMembers();
  }, [id]);

  const handleRemoveMember = async (characterId) => {
    if (!window.confirm('Remove this member from the static?')) return;
    const { error } = await supabase
      .from('static_members')
      .delete()
      .eq('static_id', id)
      .eq('character_id', characterId);
    if (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member: ' + error.message);
    } else {
      fetchMembers();
    }
  };

  if (!staticData) return <p>Loading…</p>;

  return (
    <div className="page page--static-detail">
      <header className="static-header">
        <h2 className="static-title">{staticData.name}</h2>
        {staticData.description && (
          <p className="static-description">{staticData.description}</p>
        )}
      </header>

      <section className="static-members">
        <h3>Members</h3>
        {members.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          <ul className="static-list">
            {members.map(({ character }) => (
              <li key={character.id} className="static-item">
                <Link
                  to={`/character/${character.id}`}
                  className="static-link"
                >
                  {character.name} ({character.role})
                </Link>
                {user?.id === staticData.created_by && (
                  <div className="static-item-actions">
                    <Link
                      to={`/character/${character.id}/edit`}
                      className="button button--secondary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => handleRemoveMember(character.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="static-actions">
        <Link
          to={`/schedule/${id}`}
          className="button button--primary"
        >
          View Schedule
        </Link>
        {user?.id === staticData.created_by && (
          <>
            <Link
              to={`/static/${id}/character/new`}
              className="button button--secondary"
            >
              Add Character
            </Link>
            <Link
              to={`/static/${id}/edit`}
              className="button button--secondary"
            >
              Edit Static
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
