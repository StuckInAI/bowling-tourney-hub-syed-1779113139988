import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Lane } from '@/types';
import styles from './LanesPage.module.css';

export default function LanesPage() {
  const { state, updateLane } = useApp();

  const toggleStatus = (lane: Lane) => {
    const next: Lane['status'] =
      lane.status === 'available' ? 'maintenance' : lane.status === 'maintenance' ? 'occupied' : 'available';
    updateLane({ ...lane, status: next });
  };

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Lanes Management</h1>
      <div className={styles.grid}>
        {state.lanes.map((lane) => (
          <Card key={lane.id}>
            <div className={styles.laneCard}>
              <div className={styles.laneHeader}>
                <h3>{lane.name}</h3>
                <Badge
                  label={lane.status}
                  variant={
                    lane.status === 'available'
                      ? 'success'
                      : lane.status === 'maintenance'
                      ? 'warning'
                      : 'danger'
                  }
                />
              </div>
              <p className={styles.laneInfo}>
                {state.timeSlots.filter(
                  (s: import('@/types').TimeSlot) =>
                    s.laneId === lane.id && s.date === new Date().toISOString().split('T')[0]
                ).length}{' '}
                slots today
              </p>
              <button className={styles.toggleBtn} onClick={() => toggleStatus(lane)}>
                Toggle Status
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
