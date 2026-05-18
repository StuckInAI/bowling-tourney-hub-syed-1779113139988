import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { User } from '@/types';
import styles from './LanesPage.module.css';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, joinTournament, leaveTournament } = useApp();

  const tournament = state.tournaments.find((t) => t.id === id);
  if (!tournament) {
    return (
      <div>
        <Button variant="ghost" onClick={() => navigate('/tournaments')}>
          ← Back
        </Button>
        <p>Tournament not found.</p>
      </div>
    );
  }

  const user = state.currentUser;
  const isParticipant = user ? tournament.participants.includes(user.id) : false;
  const isFull = tournament.participants.length >= tournament.maxParticipants;

  const participantUsers = tournament.participants
    .map((pid) => state.users.find((u: User) => u.id === pid))
    .filter(Boolean) as User[];

  const handleJoin = () => {
    if (user) joinTournament(tournament.id, user.id);
  };

  const handleLeave = () => {
    if (user) leaveTournament(tournament.id, user.id);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button variant="ghost" onClick={() => navigate('/tournaments')}>
          ← Back to Tournaments
        </Button>
      </div>
      <Card>
        <h1 style={{ marginBottom: 8 }}>{tournament.name}</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Badge label={tournament.status} variant={tournament.status === 'upcoming' ? 'info' : tournament.status === 'active' ? 'success' : 'default'} />
          <Badge label={`${tournament.participants.length}/${tournament.maxParticipants} participants`} variant="purple" />
        </div>
        {tournament.description && <p style={{ marginBottom: 16, color: 'var(--color-text-light)' }}>{tournament.description}</p>}
        <p style={{ marginBottom: 16 }}>Date: {tournament.date}</p>

        {user && tournament.status === 'upcoming' && (
          <div style={{ marginBottom: 16 }}>
            {isParticipant ? (
              <Button variant="danger" onClick={handleLeave}>Leave Tournament</Button>
            ) : (
              <Button disabled={isFull} onClick={handleJoin}>{isFull ? 'Tournament Full' : 'Join Tournament'}</Button>
            )}
          </div>
        )}

        <h3 style={{ marginBottom: 8 }}>Participants</h3>
        {participantUsers.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)' }}>No participants yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {participantUsers.map((p) => (
              <li key={p.id} style={{ padding: '4px 0' }}>
                {p.name} ({p.email})
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
