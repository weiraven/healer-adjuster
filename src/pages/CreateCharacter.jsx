import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../client';

const ROLE_OPTIONS = [
  { value: 'tank', label: 'Tank' },
  { value: 'healer', label: 'Healer' },
  { value: 'melee_dps', label: 'Melee DPS' },
  { value: 'magic_dps', label: 'Magic DPS' },
  { value: 'phys_ranged_dps', label: 'Physical Ranged DPS' },
];

const JOB_OPTIONS = {
  tank:            ['Warrior', 'Paladin', 'Dark Knight', 'Gunbreaker'],
  healer:          ['White Mage', 'Scholar', 'Astrologian', 'Sage'],
  melee_dps:       ['Dragoon', 'Monk', 'Ninja', 'Samurai', 'Reaper', 'Viper'],
  magic_dps:       ['Black Mage', 'Summoner', 'Red Mage', 'Pictomancer'],
  phys_ranged_dps: ['Bard', 'Machinist', 'Dancer']
};

function CreateCharacter() {
  const { staticId } = useParams();
  const navigate = useNavigate();

  const [name, setName]       = useState('');
  const [role, setRole]       = useState('healer');
  const [jobs, setJobs]       = useState([]);
  const [bio, setBio]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setJobs([]);
  };

  const handleJobToggle = (e) => {
    const job = e.target.value;
    setJobs(prev =>
      e.target.checked
        ? [...prev, job]
        : prev.filter(j => j !== job)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: charData, error: charErr } = await supabase
    .from('characters')
    .insert([{ name, role, jobs, bio }])
    .select()       // ask Supabase to return the new row
    .single();

    if (charErr) {
      setError(charErr.message);
      setLoading(false);
      return;
    }

    const { error: linkErr } = await supabase
      .from('static_members')
      .insert([{ static_id: staticId, character_id: charData.id }]);

    setLoading(false);

    if (linkErr) {
      console.error('Link to static failed:', linkErr);
      setError(linkErr.message);
    } else {
      // 3) On success, go back to the static detail page
      navigate(`/static/${staticId}`);
    }
  };

  return (
    <div className="page page--create-character">
      <h2 className="page-title">Add Character to Static</h2>

      <form className="form form--create" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            id="name"
            className="form-input"
            type="text"
            placeholder="e.g. G'raha Tia"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="role">Role</label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={handleRoleChange}
            required
          >
            {ROLE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

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

        <div className="form-group">
          <label className="form-label" htmlFor="bio">Bio (Optional)</label>
          <textarea
            id="bio"
            className="form-textarea"
            rows="4"
            placeholder="Something about you or your character"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="button button--primary"
          disabled={loading}
        >
          {loading ? 'Saving…' : 'Create Character'}
        </button>
      </form>
    </div>
  );
}

export default CreateCharacter;