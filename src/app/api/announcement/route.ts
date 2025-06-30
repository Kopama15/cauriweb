import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  message: string;
  startDate: string;
  endDate: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAdd = () => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      message,
      startDate,
      endDate,
    };
    setAnnouncements((prev) => [...prev, newAnnouncement]);
    setMessage('');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const now = new Date();
  const activeAnnouncements = announcements.filter((a) => {
    const start = new Date(a.startDate);
    const end = new Date(a.endDate);
    return now >= start && now <= end;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('announcements');
      if (saved) setAnnouncements(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('announcements', JSON.stringify(announcements));
    }
  }, [announcements]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Announcement Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2"
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Ajouter</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Message</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => (
            <tr key={a.id}>
              <td className="border p-2">{a.message}</td>
              <td className="border p-2">{format(new Date(a.startDate), 'Pp')}</td>
              <td className="border p-2">{format(new Date(a.endDate), 'Pp')}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {announcements.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4">Aucune annonce disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
