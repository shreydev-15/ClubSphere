import { useState } from 'react';
import { Modal } from '../feedback/Modal';
import { Input } from '../feedback/Input';
import { Textarea } from '../feedback/Textarea';
import { Button } from '../feedback/Button';
import { Alert } from '../feedback/Alert';

export function CreateEventModal({ isOpen, onClose, clubId, clubName, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !startTime || !endTime || !location.trim()) {
      setError('All event fields (title, description, date, start time, end time, location) are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSuccess({
        title: title.trim(),
        description: description.trim(),
        date,
        startTime,
        endTime,
        location: location.trim(),
      });
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Club Event"
      description={`Organize an upcoming event for ${clubName || 'this club'}. Connected members will automatically receive a Google Calendar invitation.`}
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

        <Input
          id="event-title"
          label="Event Title"
          placeholder="e.g. Annual Tech Symposium & Hackathon"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Input
            id="event-date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            id="event-start-time"
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            id="event-end-time"
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <Input
          id="event-location"
          label="Location or Meeting Link"
          placeholder="e.g. Science Auditorium Hall B, or Google Meet URL"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <Textarea
          id="event-description"
          label="Event Description"
          placeholder="Agenda, prerequisites, speakers, and attendee expectations..."
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
            Publish Event
          </Button>
        </div>
      </form>
    </Modal>
  );
}
