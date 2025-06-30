'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const emojilist = ['🔥', '🎯', '⚡', '📢', '🛍️', '💡', '🚀', '🎉', '📣', '💬'];

export default function AdminAnnouncement() {
  const [text, setText] = useState('');
  const [schedule, setSchedule] = useState('');
  const [emoji, setEmoji] = useState('📣');
  const [announcements, setAnnouncements] = useState<{ text: string; scheduledAt: string | null }[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('announcements');
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = () => {
    if (!text.trim()) return toast.error('Message required');
    const newItem = {
      text: `${emoji} ${text.trim()}`,
      scheduledAt: schedule || null,
    };
    const updated = [newItem, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
    setText('');
    setSchedule('');
    toast.success('Announcement added');
  };

  const handleDelete = (index: number) => {
    const updated = [...announcements];
    updated.splice(index, 1);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold text-center mb-4">📢 Admin Announcement Panel</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your announcement here..."
        className="mb-2 w-full p-2 border rounded"
      />

      <div className="flex gap-2 mb-2">
        <select
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="border p-2 rounded w-24"
        >
          {emojilist.map((emo, idx) => (
            <option key={idx} value={emo}>{emo}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="flex-grow border rounded p-2"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {announcements.map((item, i) => (
          <div
            key={i}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>{item.text}</div>
            <button
              onClick={() => handleDelete(i)}
              className="text-red-500 hover:underline"
            >
              Delete 🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
