import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ToastContainer, { showToast } from '@/components/ui/Toast';
import type { LaneStatus } from '@/types';
import styles from './LanesPage.module.css';

export default function LanesPage() {
  const { state, updateLane } = useApp();

  const handleToggle = (laneId: string, currentStatus: LaneStatus) => {
    let newStatus: LaneStatus;
    if (currentStatus === 'active') newStatus = 'maintenance';
    else if (currentStatus === 'maintenance') newStatus = 'disabled';
    else newStatus = 'active';
    updateLane(laneId, { status: newStatus });
    showToast(`Lane status changed to ${newStatus}.`, 'success');
  };

  return (
    <div className={styles.page}>
      <ToastContainer />
      <h1 className={styles.pageTitle}>Lane Management</h1>
      <p className={styles.subtitle}>16 lanes · 1-hour slots · Operating hours: 9 AM – 10 PM</p>
      <div className={styles.grid}>
        {state.lanes.map((lane) => (
          <Card key={lane.id}>
            <div className={styles.laneCard}>
              <div className={styles.laneHeader}>
                <span className={styles.laneNumber}>#{lane.number}</span>
                <Badge
                  label={lane.status}
                  variant={lane.status === 'active' ? 'success' : lane.status === 'maintenance' ? 'warning' : 'danger'}
                />
              </div>
              <div className={styles.laneName}>{lane.name}</div>
              <div className={styles.laneSlots}>
                {state.timeSlots.filter((s) => s.laneId === lane.id && s.date === new Date().toISOString().split('T')[0]).length} slots today
              </div>
              <Button size="sm" variant="secondary" onClick={() => handleToggle(lane.id, lane.status)}>
                Cycle Status
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
