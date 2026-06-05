"use client";

import React, { useEffect, useState } from 'react';
import { TextureCard } from '@/components/ui/TextureCard';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExempt = async (familyId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-exemption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId, exempt: !currentStatus })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Users & Families</h1>
      <TextureCard>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Family</th>
                <th style={{ padding: '1rem' }}>Stripe Exempt</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem' }}>{user.name || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>{user.role}</td>
                  <td style={{ padding: '1rem' }}>{user.family?.name || 'None'}</td>
                  <td style={{ padding: '1rem' }}>{user.family?.stripeExempt ? '✅ Yes' : '❌ No'}</td>
                  <td style={{ padding: '1rem' }}>
                    {user.family && (
                      <button 
                        onClick={() => toggleExempt(user.family.id, user.family.stripeExempt)}
                        style={{
                          background: user.family.stripeExempt ? '#333' : '#0071e3',
                          color: '#fff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {user.family.stripeExempt ? 'Revoke Exemption' : 'Grant Exemption'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TextureCard>
    </div>
  );
}
