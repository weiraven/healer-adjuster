import React, { useState, useEffect } from 'react';

function toLocalInputString(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear(),
        m = pad(date.getMonth() + 1),
        d = pad(date.getDate()),
        h = pad(date.getHours()),
        min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

export default function EventModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData
}) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd]     = useState('');

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || '');

    if (initialData.start) {
      const d = new Date(initialData.start);
      if (!isNaN(d)) setStart(toLocalInputString(d));
    } else {
      setStart('');
    }

    if (initialData.end) {
      const d2 = new Date(initialData.end);
      if (!isNaN(d2)) setEnd(toLocalInputString(d2));
    } else {
      setEnd('');
    }
  }, [initialData]);

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          {initialData.id ? 'Edit Event' : 'New Event'}
        </h3>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Start</label>
          <input
            type="datetime-local"
            value={start}
            onChange={e => setStart(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>End</label>
          <input
            type="datetime-local"
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="modal-actions">
          <button
            className="button button--primary"
            onClick={() => onSubmit({ id: initialData.id, title, start, end })}
            disabled={!title || !start || !end}
          >
            {initialData.id ? 'Save' : 'Create'}
          </button>
          {initialData.id && onDelete && (
            <button
              className="button button--danger"
              onClick={() => onDelete(initialData.id)}
            >
              Delete
            </button>
          )}
          <button className="button button--secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
