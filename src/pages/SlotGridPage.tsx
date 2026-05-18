import { useState } from 'react';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import { formatHour, getToday, getTomorrow } from '@/lib/utils';
import type { Lane, TimeSlot } from '@/types';
import styles from './SlotGridPage.module.css';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

export default function SlotGridPage() {
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState(getToday());

  const activeLanes = state.lanes.filter((l: Lane) => l.status === 'available' || l.status === 'occupied');

  const getSlotStatus = (laneId: string, hour: number): string => {
    const slot = state.timeSlots.find(
      (s: TimeSlot) => s.laneId === laneId && s.date === selectedDate && s.startHour === hour
    );
    return slot ? slot.status : 'available';
  };

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Slot Grid</h1>
      <div className={styles.dateSelector}>
        <button
          className={selectedDate === getToday() ? styles.activeDate : styles.dateBtn}
          onClick={() => setSelectedDate(getToday())}
        >
          Today
        </button>
        <button
          className={selectedDate === getTomorrow() ? styles.activeDate : styles.dateBtn}
          onClick={() => setSelectedDate(getTomorrow())}
        >
          Tomorrow
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.dateInput}
        />
      </div>
      <Card>
        <div className={styles.gridWrapper}>
          <table className={styles.grid}>
            <thead>
              <tr>
                <th>Lane / Hour</th>
                {HOURS.map((h) => (
                  <th key={h}>{formatHour(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeLanes.map((lane: Lane) => (
                <tr key={lane.id}>
                  <td className={styles.laneName}>{lane.name}</td>
                  {HOURS.map((h) => {
                    const status = getSlotStatus(lane.id, h);
                    return (
                      <td
                        key={h}
                        className={`${styles.cell} ${styles[status] || ''}`}
                        title={`${lane.name} ${formatHour(h)} - ${status}`}
                      >
                        {status === 'booked' ? '✕' : status === 'blocked' ? '—' : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.legend}>
          <span><span className={`${styles.dot} ${styles.availableDot}`} /> Available</span>
          <span><span className={`${styles.dot} ${styles.bookedDot}`} /> Booked</span>
          <span><span className={`${styles.dot} ${styles.blockedDot}`} /> Blocked</span>
        </div>
      </Card>
    </div>
  );
}
