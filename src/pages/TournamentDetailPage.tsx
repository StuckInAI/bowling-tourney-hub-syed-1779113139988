import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Trophy, Users, Calendar, DollarSign } from 'lucide-react';

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, joinTournament } = useApp();
  const navigate = useNavigate();
  const tournament = state.tournaments.find((t) => t.id === id);

  if (!tournament) {
    return (
      <div>
        <Button variant="ghost" onClick={() => navigate('/tournaments')}><ArrowLeft size={16} /> Back</Button>
        <p style={{ marginTop: 16, color: 'var(--color-text-light)' }}>Tournament not found.</p>
      </div>
    );
  }

  const user = state.currentUser;
  const isParticipant = user ? tournament.participants.includes(user.id) : false;
  const canJoin = user && !isParticipant && tournament.status === 'upcoming' && tournament.participants.length < tournament.maxParticipants;

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
      <Button variant="ghost" onClick={() => navigate('/tournaments')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to Tournaments
      </Button>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Trophy size={24} />
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>{tournament.name}</h1>
              <Badge label={tournament.status.replace('_', ' ')} variant={getStatusVariant(tournament.status) as any} />
            </div>
          </div>
          {canJoin && (
            <Button onClick={() => joinTournament(tournament.id)}>Join Tournament</Button>
          )}
          {isParticipant && <Badge label="Registered" variant="success" />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, background: 'var(--color-bg)', borderRadius: 8 }}>
            <Calendar size={20} />
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Date</div>
              <div style={{ fontWeight: 600 }}>{new Date(tournament.date).toLocaleDateString()}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, background: 'var(--color-bg)', borderRadius: 8 }}>
            <Users size={20} />
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Participants</div>
              <div style={{ fontWeight: 600 }}>{tournament.participants.length} / {tournament.maxParticipants}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, background: 'var(--color-bg)', borderRadius: 8 }}>
            <DollarSign size={20} />
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-light)' }}>Entry Fee</div>
              <div style={{ fontWeight: 600 }}>{tournament.entryFee > 0 ? `$${tournament.entryFee}` : 'Free'}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Participants</h3>
          {tournament.participants.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)' }}>No participants yet.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tournament.participants.map((pid) => {
                const member = state.members.find((m) => m.id === pid);
                return (
                  <span key={pid} style={{ padding: '4px 12px', background: 'var(--color-bg)', borderRadius: 999, fontSize: 13 }}>
                    {member ? member.name : pid}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
