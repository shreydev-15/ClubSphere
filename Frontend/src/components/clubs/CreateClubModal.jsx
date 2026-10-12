import { useState } from 'react';
import { Modal } from '../feedback/Modal';
import { Input } from '../feedback/Input';
import { Textarea } from '../feedback/Textarea';
import { Button } from '../feedback/Button';
import { Alert } from '../feedback/Alert';

const CATEGORIES = [
  'Technology & Engineering',
  'Arts & Culture',
  'Sports & Fitness',
  'Academic & Career',
  'Social & Community',
  'Entrepreneurship',
  'Other',
];

export function CreateClubModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !category) {
      setError('Please provide a club name, description, and category.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSuccess({ name: name.trim(), description: description.trim(), category });
      setName('');
      setDescription('');
      setCategory(CATEGORIES[0]);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Club"
      description="Register an official student organization on ClubSphere. You will automatically become the club administrator."
    >
      <form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

        <Input
          id="club-name"
          label="Club Name"
          placeholder="e.g. Artificial Intelligence Student Society"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="form-group">
          <label htmlFor="club-category" className="form-label">
            Category <span className="text-required">*</span>
          </label>
          <select
            id="club-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          id="club-description"
          label="Description"
          placeholder="Describe your club's mission, scheduled activities, and expectations for new members..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={1000}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Create Club
          </Button>
        </div>
      </form>
    </Modal>
  );
}
