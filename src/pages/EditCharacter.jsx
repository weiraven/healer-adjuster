import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const ROLE_OPTIONS = [
  { value: 'tank',            label: 'Tank' },
  { value: 'healer',          label: 'Healer' },
  { value: 'melee_dps',       label: 'Melee DPS' },
  { value: 'magic_dps',       label: 'Magic DPS' },
  { value: 'phys_ranged_dps', label: 'Physical Ranged DPS' },
];

const JOB_OPTIONS = {
  tank:             ['Warrior','Paladin','Dark Knight','Gunbreaker'],
  healer:           ['White Mage','Scholar','Astrologian','Sage'],
  melee_dps:        ['Dragoon','Ninja','Monk','Samurai'],
  magic_dps:        ['Black Mage','Summoner','Red Mage','Blue Mage'],
  phys_ranged_dps:  ['Bard','Machinist','Dancer','Archer'],
};

function EditCharacter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName]       = useState('');
  const [role, setRole]       = useState('healer');
  const [jobs, setJobs]       = useState([]);
  const [bio, setBio]         = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true);
      const { data, error: supaErr } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (supaErr) {
        setError(supaErr.message);
      } else {
        setName(data.name);
        setRole(data.role);
        setJobs(data.jobs);
        setBio(data.bio);
      }
      setLoading(false);
    };
    loadCharacter();
  }, [id]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setJobs([]); // clear jobs when role changes
  };

  const handleJobToggle = (e) => {
    const job = e.target.value;
    setJobs(prev =>
      e.target.checked
        ? [...prev, job]
        : prev.filter(j => j !== job)
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error: supaErr } = await supabase
      .from('characters')
      .update({ name, role, jobs, bio })
      .eq('id', id);

    setSaving(false);
    if (supaErr) {
      setError(supaErr.message);
    } else {
      navigate('/static');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this character?')) return;
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

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="form-error">Error: {error}</p>;

  return (
    <div className="page page--edit-character">
      <h2 className="page-title">Edit {name}</h2>

      <form className="form form--edit" onSubmit={handleUpdate}>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            id="name"
            className="form-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label className="form-label" htmlFor="role">Role</label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={handleRoleChange}
            required
          >
            {ROLE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Jobs */}
        <div className="form-group">
          <label className="form-label">Jobs</label>
          <div className="checkbox-group">
            {JOB_OPTIONS[role].map(job => (
              <label key={job} className="checkbox-label">
                <input
                  type="checkbox"
                  value={job}
                  checked={jobs.includes(job)}
                  onChange={handleJobToggle}
                />
                <span className="checkbox-text">{job}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="form-group">
          <label className="form-label" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            className="form-textarea"
            rows="4"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        <div className="static-actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={handleDelete}
          >
            Delete Character
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCharacter;