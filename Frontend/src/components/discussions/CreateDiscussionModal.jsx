import { useState } from 'react';
import { Modal } from '../feedback/Modal';
import { Input } from '../feedback/Input';
import { Textarea } from '../feedback/Textarea';
import { Button } from '../feedback/Button';
import { Alert } from '../feedback/Alert';

export function CreateDiscussionModal({ isOpen, onClose, clubId, clubName, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Both a title and topic content are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSuccess({
        title: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create discussion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Club Discussion"
      description={`Post a new discussion topic for members of ${clubName || 'this club'}.`}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

        <Input
          id="discussion-title"
          label="Topic Title"
          placeholder="e.g. Planning our upcoming spring hackathon workshops"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          id="discussion-content"
          label="Opening Statement / Question"
          placeholder="Share context, questions, proposals, or announcements for club members to discuss..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Post Discussion
          </Button>
        </div>
      </form>
    </Modal>
  );
}
