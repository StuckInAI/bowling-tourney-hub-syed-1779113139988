import { useState } from 'react';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import { formatHour, getToday } from '@/lib/utils';
import type { Lane, TimeSlot } from '@/types';

export default function PublicSlotsPage() {
  const { state } = useApp();
  const [date, setDate] = useState(getToday());

  const availableLanes = state.lanes.filter((l: Lane) => l.status === 'available');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>🎳 BowlBook – Available Slots</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: 16 }}>Check lane availability for your visit</p>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginBottom: 16, padding: 8, borderRadius: 8, border: '1px solid var(--color-border)' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {availableLanes.map((lane: Lane) => {
          const slots = state.timeSlots.filter(
            (s: TimeSlot) => s.laneId === lane.id && s.date === date && s.status === 'available'
          );
          return (
            <Card key={lane.id}>
              <h3>{lane.name}</h3>
              {slots.length === 0 ? (
                <p style={{ color: 'var(--color-text-light)' }}>No available slots</p>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {slots.map((s: TimeSlot) => (
                    <span
                      key={s.id}
                      style={{
                        padding: '4px 12px',
                        background: '#dcfce7',
                        color: '#15803d',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {formatHour(s.startHour)} - {formatHour(s.endHour)}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
