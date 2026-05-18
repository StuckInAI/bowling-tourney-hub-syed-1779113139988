import { useState } from 'react';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { generateId, isSubscriptionActive } from '@/lib/utils';
import type { SubscriptionStatus, User, Subscription } from '@/types';
import styles from './MembersPage.module.css';

export default function MembersPage() {
  const { state, addUser, addSubscription, updateSubscription } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const members = state.users.filter((u: User) => u.role === 'member');

  const filtered = members.filter((m: User) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const sub = state.subscriptions.find((s: Subscription) => s.userId === m.id);
    if (statusFilter === 'active' && (!sub || !isSubscriptionActive(sub.endDate))) return false;
    if (statusFilter === 'expired' && sub && isSubscriptionActive(sub.endDate)) return false;
    return matchesSearch;
  });

  const handleAddMember = () => {
    if (!newName || !newEmail) return;
    const newUser: User = {
      id: generateId(),
      name: newName,
      email: newEmail,
      role: 'member',
      phone: newPhone || undefined,
      createdAt: new Date().toISOString(),
    };
    addUser(newUser);
    const newSub: Subscription = {
      id: generateId(),
      userId: newUser.id,
      plan: 'Monthly',
      status: 'active' as SubscriptionStatus,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    addSubscription(newSub);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleToggleSubscription = (sub: Subscription) => {
    const newStatus: SubscriptionStatus = sub.status === 'active' ? 'expired' : 'active';
    updateSubscription(sub.id, {
      status: newStatus,
      endDate: newStatus === 'active'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Members</h1>
        <Button onClick={() => setShowAddModal(true)}>+ Add Member</Button>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'expired')}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m: User) => {
              const sub = state.subscriptions.find((s: Subscription) => s.userId === m.id);
              return (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone || '—'}</td>
                  <td>
                    {sub ? (
                      <Badge
                        label={sub.status}
                        variant={sub.status === 'active' ? 'success' : 'danger'}
                      />
                    ) : (
                      <Badge label="None" variant="default" />
                    )}
                  </td>
                  <td>
                    {sub && (
                      <Button
                        size="sm"
                        variant={sub.status === 'active' ? 'danger' : 'success'}
                        onClick={() => handleToggleSubscription(sub)}
                      >
                        {sub.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Member">
        <div className={styles.formGroup}>
          <label>Name</label>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email address" type="email" />
        </div>
        <div className={styles.formGroup}>
          <label>Phone</label>
          <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone number" />
        </div>
        <Button onClick={handleAddMember} fullWidth>
          Add Member
        </Button>
      </Modal>
    </div>
  );
}
