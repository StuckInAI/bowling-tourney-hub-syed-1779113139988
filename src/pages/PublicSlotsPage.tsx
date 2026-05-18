import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Clock, MapPin } from 'lucide-react';

export default function PublicSlotsPage() {
  const { state } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const availableSlots = state.slots.filter(
    (s) => s.date >= today && s.status === 'available'
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🎳 Available Bowling Slots</h1>
        <p style={{ color: 'var(--color-text-light)' }}>View available time slots for booking</p>
      </div>

      {availableSlots.length === 0 ? (
        <Card>
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: 32 }}>No available slots at this time. Please check back later.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {availableSlots.map((slot) => {
            const lane = state.lanes.find((l) => l.id === slot.laneId);
            return (
              <Card key={slot.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <MapPin size={16} />
                      <span style={{ fontWeight: 600 }}>{lane ? lane.name : 'Unknown Lane'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-light)', fontSize: 14 }}>
                      <Clock size={14} />
                      <span>{new Date(slot.date).toLocaleDateString()} — {slot.startTime} to {slot.endTime}</span>
                    </div>
                  </div>
                  <Badge label="Available" variant="success" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
