import { useState } from 'react';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import { formatHour, getToday, getTomorrow } from '@/lib/utils';
import clsx from 'clsx';
import styles from './SlotGridPage.module.css';

export default function SlotGridPage() {
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState(getToday());

  const activeLanes = state.lanes.filter((l) => l.status === 'active');
  const hours = Array.from({ length: 13 }, (_, i) => 9 + i);

  const getSlotStatus = (laneId: string, hour: number) => {
    const slot = state.timeSlots.find(
      (s) => s.laneId === laneId && s.date === selectedDate && s.startHour === hour
    );
    return slot?.status || 'available';
  };

  const statusColors: Record<string, string> = {
    available: styles.available,
    booked_member: styles.bookedMember,
    booked_outsider: styles.bookedOutsider,
    reserved_tournament: styles.reservedTournament,
    publicly_available: styles.publiclyAvailable,
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Slot Grid</h1>
      <div className={styles.dateSelector}>
        <button
          className={clsx(styles.dateBtn, selectedDate === getToday() && styles.dateActive)}
          onClick={() => setSelectedDate(getToday())}
        >Today</button>
        <button
          className={clsx(styles.dateBtn, selectedDate === getTomorrow() && styles.dateActive)}
          onClick={() => setSelectedDate(getTomorrow())}
        >Tomorrow</button>
      </div>

      <div className={styles.legend}>
        <span className={clsx(styles.legendItem, styles.available)}>Available</span>
        <span className={clsx(styles.legendItem, styles.bookedMember)}>Member</span>
        <span className={clsx(styles.legendItem, styles.bookedOutsider)}>Outsider</span>
        <span className={clsx(styles.legendItem, styles.reservedTournament)}>Tournament</span>
        <span className={clsx(styles.legendItem, styles.publiclyAvailable)}>Public</span>
      </div>

      <Card>
        <div className={styles.gridWrap}>
          <div className={styles.grid}>
            <div className={styles.cornerCell}>Lane / Time</div>
            {hours.map((h) => (
              <div key={h} className={styles.headerCell}>{formatHour(h)}</div>
            ))}
            {activeLanes.map((lane) => (
              <div key={lane.id} className={styles.row}>
                <div className={styles.laneCell}>Lane {lane.number}</div>
                {hours.map((h) => {
                  const status = getSlotStatus(lane.id, h);
                  return (
                    <div
                      key={h}
                      className={clsx(styles.slotCell, statusColors[status] || styles.available)}
                      title={`Lane ${lane.number} - ${formatHour(h)} - ${status.replace('_', ' ')}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
