import { useState } from 'react';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { generateId, formatHour } from '@/lib/utils';
import type { Booking, User, Lane } from '@/types';
import styles from './BookingsPage.module.css';

export default function BookingsPage() {
  const { state, addBooking, cancelBooking } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [newLane, setNewLane] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStart, setNewStart] = useState(10);
  const [newEnd, setNewEnd] = useState(11);
  const [newPlayers, setNewPlayers] = useState(2);

  const user = state.currentUser;

  const bookings = state.bookings
    .filter((b: Booking) => {
      if (user?.role === 'member') return b.userId === user.id;
      return true;
    })
    .filter((b: Booking) => filterStatus === 'all' || b.status === filterStatus)
    .sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreate = () => {
    if (!user || !newLane || !newDate) return;
    const booking: Booking = {
      id: generateId(),
      userId: user.id,
      laneId: newLane,
      date: newDate,
      startHour: newStart,
      endHour: newEnd,
      status: 'confirmed',
      players: newPlayers,
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    setShowModal(false);
    setNewLane('');
    setNewDate('');
    setNewStart(10);
    setNewEnd(11);
    setNewPlayers(2);
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Bookings</h1>
        <Button onClick={() => setShowModal(true)}>+ New Booking</Button>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Lane</th>
              <th>Date</th>
              <th>Time</th>
              <th>Players</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: Booking) => {
              const member = state.users.find((u: User) => u.id === b.userId);
              const lane = state.lanes.find((l: Lane) => l.id === b.laneId);
              return (
                <tr key={b.id}>
                  <td>{member?.name || 'Unknown'}</td>
                  <td>{lane?.name || 'Unknown'}</td>
                  <td>{b.date}</td>
                  <td>{formatHour(b.startHour)} - {formatHour(b.endHour)}</td>
                  <td>{b.players}</td>
                  <td>
                    <Badge
                      label={b.status}
                      variant={b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'}
                    />
                  </td>
                  <td>
                    {b.status !== 'cancelled' && (
                      <Button size="sm" variant="danger" onClick={() => cancelBooking(b.id)}>
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Booking">
        <div className={styles.formGroup}>
          <label>Lane</label>
          <select value={newLane} onChange={(e) => setNewLane(e.target.value)}>
            <option value="">Select lane</option>
            {state.lanes
              .filter((l: Lane) => l.status === 'available')
              .map((l: Lane) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Start Hour</label>
          <select value={newStart} onChange={(e) => setNewStart(Number(e.target.value))}>
            {Array.from({ length: 14 }, (_, i) => i + 8).map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>End Hour</label>
          <select value={newEnd} onChange={(e) => setNewEnd(Number(e.target.value))}>
            {Array.from({ length: 14 }, (_, i) => i + 8).map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Players</label>
          <input
            type="number"
            min={1}
            max={8}
            value={newPlayers}
            onChange={(e) => setNewPlayers(Number(e.target.value))}
          />
        </div>
        <Button onClick={handleCreate} fullWidth>
          Create Booking
        </Button>
      </Modal>
    </div>
  );
}
