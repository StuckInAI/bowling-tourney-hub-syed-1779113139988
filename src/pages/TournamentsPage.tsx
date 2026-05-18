import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Trophy, Plus, Users, Calendar } from 'lucide-react';
import type { Tournament } from '@/types';

export default function TournamentsPage() {
  const { state, addTournament } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', maxParticipants: 16, entryFee: 0 });

  const handleSubmit = () => {
    if (!form.name || !form.date) return;
    const newTournament: Tournament = {
      id: crypto.randomUUID(),
      name: form.name,
      date: form.date,
      maxParticipants: form.maxParticipants,
      entryFee: form.entryFee,
      status: 'upcoming',
      participants: [],
      createdAt: new Date().toISOString(),
    };
    addTournament(newTournament);
    setShowModal(false);
    setForm({ name: '', date: '', maxParticipants: 16, entryFee: 0 });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Tournaments</h1>
        {(state.currentUser?.role === 'super_admin' || state.currentUser?.role === 'venue_manager') && (
          <Button onClick={() => setShowModal(true)}><Plus size={16} /> New Tournament</Button>
        )}
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {state.tournaments.length === 0 && <p style={{ color: 'var(--color-text-light)' }}>No tournaments yet.</p>}
        {state.tournaments.map((t) => (
          <Card key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Trophy size={20} />
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>{t.name}</h3>
                  <Badge label={t.status.replace('_', ' ')} variant={getStatusVariant(t.status) as any} />
                </div>
                <div style={{ display: 'flex', gap: 16, color: 'var(--color-text-light)', fontSize: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {new Date(t.date).toLocaleDateString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {t.participants.length}/{t.maxParticipants}</span>
                  {t.entryFee > 0 && <span>${t.entryFee} entry</span>}
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/tournaments/${t.id}`)}>View Details</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Tournament">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Name</label>
            <input
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tournament name"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Date</label>
            <input
              type="date"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Max Participants</label>
              <input
                type="number"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
                value={form.maxParticipants}
                onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Entry Fee ($)</label>
              <input
                type="number"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
                value={form.entryFee}
                onChange={(e) => setForm({ ...form, entryFee: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button fullWidth onClick={handleSubmit}>Create Tournament</Button>
        </div>
      </Modal>
    </div>
  );
}
