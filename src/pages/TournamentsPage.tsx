import { useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Tournament } from '@/types';

export default function TournamentsPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  const tournaments = state.tournaments.sort(
    (a: Tournament, b: Tournament) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Tournaments</h1>
      {tournaments.length === 0 ? (
        <p style={{ color: 'var(--color-text-light)' }}>No tournaments scheduled.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tournaments.map((t: Tournament) => (
            <Card key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{t.name}</h3>
                  <p style={{ color: 'var(--color-text-light)', fontSize: 14 }}>Date: {t.date}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Badge
                      label={t.status}
                      variant={
                        t.status === 'upcoming'
                          ? 'info'
                          : t.status === 'active'
                          ? 'success'
                          : 'default'
                      }
                    />
                    <Badge
                      label={`${t.participants.length}/${t.maxParticipants}`}
                      variant="purple"
                    />
                  </div>
                </div>
                <Button variant="secondary" onClick={() => navigate(`/tournaments/${t.id}`)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
