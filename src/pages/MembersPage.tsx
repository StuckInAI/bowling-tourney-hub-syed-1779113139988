import { useState } from 'react';
import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { showToast } from '@/components/ui/Toast';
import ToastContainer from '@/components/ui/Toast';
import { generateId, isSubscriptionActive } from '@/lib/utils';
import type { SubscriptionStatus } from '@/types';
import { UserPlus, Search } from 'lucide-react';
import styles from './MembersPage.module.css';

export default function MembersPage() {
  const { state, addUser, addSubscription, updateSubscription } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'suspended'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const members = state.users.filter((u) => u.role === 'member');

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filterStatus === 'all') return true;
    const sub = state.subscriptions.find((s) => s.userId === m.id);
    if (filterStatus === 'active') return isSubscriptionActive(sub);
    if (!sub) return filterStatus === 'expired';
    return sub.status === filterStatus;
  });

  const handleAddMember = () => {
    if (!newName || !newEmail) {
      showToast('Please fill in name and email.', 'error');
      return;
    }
    const userId = generateId();
    addUser({
      id: userId,
      name: newName,
      email: newEmail,
      password: 'member123',
      role: 'member',
      phone: newPhone,
      createdAt: new Date().toISOString(),
    });
    const now = new Date();
    const endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    addSubscription({
      id: generateId(),
      userId,
      status: 'active',
      startDate: now.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      activatedBy: state.currentUser?.id || '',
      createdAt: now.toISOString(),
    });
    showToast('Member added successfully!', 'success');
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const toggleSubStatus = (subId: string, currentStatus: SubscriptionStatus) => {
    const newStatus: SubscriptionStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateSubscription(subId, { status: newStatus });
    showToast(`Subscription ${newStatus}.`, 'success');
  };

  return (
    <div className={styles.page}>
      <ToastContainer />
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Members</h1>
        <Button onClick={() => setShowAddModal(true)}><UserPlus size={16} /> Add Member</Button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search members..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.select}
          value={filterStatus}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as typeof filterStatus)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subscription</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const sub = state.subscriptions.find((s) => s.userId === m.id);
                const active = isSubscriptionActive(sub);
                return (
                  <tr key={m.id}>
                    <td className={styles.nameCell}>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone}</td>
                    <td>
                      <Badge
                        label={sub ? sub.status : 'none'}
                        variant={active ? 'success' : sub?.status === 'suspended' ? 'danger' : 'warning'}
                      />
                    </td>
                    <td>{sub?.endDate || '—'}</td>
                    <td>
                      {sub && (
                        <Button
                          size="sm"
                          variant={sub.status === 'active' ? 'danger' : 'success'}
                          onClick={() => toggleSubStatus(sub.id, sub.status)}
                        >
                          {sub.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className={styles.emptyRow}>No members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Member">
        <div className={styles.formFields}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input className={styles.input} value={newName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={newEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone</label>
            <input className={styles.input} value={newPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPhone(e.target.value)} placeholder="555-0100" />
          </div>
          <p className={styles.note}>Default password: member123. Subscription will be activated for 1 year.</p>
          <Button onClick={handleAddMember} fullWidth>Add Member</Button>
        </div>
      </Modal>
    </div>
  );
}
