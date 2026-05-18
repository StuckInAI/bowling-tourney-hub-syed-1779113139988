import { useState } from 'react';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ToastContainer, { showToast } from '@/components/ui/Toast';
import { generateId, formatDate, formatHour, getToday, getTomorrow, isSubscriptionActive } from '@/lib/utils';
import styles from './BookingsPage.module.css';

export default function BookingsPage() {
  const { state, addBooking, cancelBooking, addNotification } = useApp();
  const user = state.currentUser;
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [selectedLane, setSelectedLane] = useState('');
  const [selectedHour, setSelectedHour] = useState<number>(9);

  if (!user) return null;

  const isMember = user.role === 'member';
  const isAdminOrStaff = user.role === 'super_admin' || user.role === 'venue_manager' || user.role === 'staff';

  const myBookings = isMember
    ? state.bookings.filter((b) => b.userId === user.id)
    : state.bookings;

  const sortedBookings = [...myBookings].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + String(a.startHour).padStart(2, '0') + ':00:00');
    const dateB = new Date(b.date + 'T' + String(b.startHour).padStart(2, '0') + ':00:00');
    return dateB.getTime() - dateA.getTime();
  });

  const activeLanes = state.lanes.filter((l) => l.status === 'active');

  const availableHours = (): number[] => {
    if (!selectedLane) return [];
    const hours: number[] = [];
    for (let h = 9; h < 22; h++) {
      const slot = state.timeSlots.find(
        (s) => s.laneId === selectedLane && s.date === selectedDate && s.startHour === h
      );
      if (slot && slot.status === 'available') {
        hours.push(h);
      }
    }
    return hours;
  };

  const handleBook = () => {
    if (!selectedLane || selectedHour === undefined) {
      showToast('Select a lane and time.', 'error');
      return;
    }

    if (isMember) {
      const sub = state.subscriptions.find((s) => s.userId === user.id);
      if (!isSubscriptionActive(sub)) {
        showToast('Your subscription is not active.', 'error');
        return;
      }
    }

    const slot = state.timeSlots.find(
      (s) => s.laneId === selectedLane && s.date === selectedDate && s.startHour === selectedHour
    );
    if (!slot || slot.status !== 'available') {
      showToast('This slot is no longer available.', 'error');
      return;
    }

    const bookingId = generateId();
    addBooking({
      id: bookingId,
      slotId: slot.id,
      laneId: selectedLane,
      date: selectedDate,
      startHour: selectedHour,
      endHour: selectedHour + 1,
      type: 'member',
      status: 'confirmed',
      userId: user.id,
      outsiderName: null,
      outsiderEmail: null,
      outsiderPhone: null,
      paymentMethod: null,
      createdAt: new Date().toISOString(),
    });

    addNotification({
      id: generateId(),
      userId: user.id,
      type: 'booking_confirmation',
      title: 'Booking Confirmed',
      message: `Lane ${state.lanes.find((l) => l.id === selectedLane)?.number} booked for ${formatDate(selectedDate)} at ${formatHour(selectedHour)}.`,
      read: false,
      link: '/bookings',
      createdAt: new Date().toISOString(),
    });

    showToast('Booking confirmed!', 'success');
    setShowBookModal(false);
  };

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    showToast('Booking cancelled.', 'info');
  };

  return (
    <div className={styles.page}>
      <ToastContainer />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isMember ? 'My Bookings' : 'All Bookings'}</h1>
        {isMember && <Button onClick={() => setShowBookModal(true)}>Book a Lane</Button>}
      </div>

      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Lane</th>
                <th>Type</th>
                {isAdminOrStaff && <th>Booked By</th>}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBookings.map((b) => (
                <tr key={b.id}>
                  <td>{formatDate(b.date)}</td>
                  <td>{formatHour(b.startHour)} - {formatHour(b.endHour)}</td>
                  <td>Lane {state.lanes.find((l) => l.id === b.laneId)?.number}</td>
                  <td><Badge label={b.type} variant={b.type === 'member' ? 'info' : 'purple'} /></td>
                  {isAdminOrStaff && (
                    <td>
                      {b.type === 'member'
                        ? state.users.find((u) => u.id === b.userId)?.name || '—'
                        : b.outsiderName || '—'}
                    </td>
                  )}
                  <td>
                    <Badge
                      label={b.status.replace('_', ' ')}
                      variant={b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}
                    />
                  </td>
                  <td>
                    {b.status === 'confirmed' && (
                      <Button size="sm" variant="danger" onClick={() => handleCancel(b.id)}>Cancel</Button>
                    )}
                  </td>
                </tr>
              ))}
              {sortedBookings.length === 0 && (
                <tr><td colSpan={isAdminOrStaff ? 7 : 6} className={styles.emptyRow}>No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showBookModal} onClose={() => setShowBookModal(false)} title="Book a Lane">
        <div className={styles.formFields}>
          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <select
              className={styles.select}
              value={selectedDate}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDate(e.target.value)}
            >
              <option value={getToday()}>Today ({getToday()})</option>
              <option value={getTomorrow()}>Tomorrow ({getTomorrow()})</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Lane</label>
            <select
              className={styles.select}
              value={selectedLane}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLane(e.target.value)}
            >
              <option value="">Select a lane</option>
              {activeLanes.map((l) => (
                <option key={l.id} value={l.id}>Lane {l.number}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Time Slot</label>
            <select
              className={styles.select}
              value={selectedHour}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedHour(parseInt(e.target.value, 10))}
            >
              {availableHours().length === 0 && <option>No available slots</option>}
              {availableHours().map((h) => (
                <option key={h} value={h}>{formatHour(h)} - {formatHour(h + 1)}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleBook} fullWidth>Confirm Booking</Button>
        </div>
      </Modal>
    </div>
  );
}
