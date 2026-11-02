'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Pencil, Plus, Store, Trash2 } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';
import { apiFetch, resolveImage } from '@/lib/api';
import { categoryLabel } from '@/lib/categories';

function MyListings() {
  const [list, setList] = useState(null);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState(null); // delete confirmation
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch('/api/studios/mine')
      .then(setList)
      .catch(err => {
        setError(true);
        toast.error(err.message);
      });
  }, []);

  const remove = async () => {
    setBusy(true);
    try {
      await apiFetch(`/api/studios/${target._id}`, { method: 'DELETE' });
      setList(l => l.filter(s => s._id !== target._id));
      toast.success('Studio deleted successfully.');
      setTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!list && !error) return <Spinner label="Loading your listings..." />;

  return (
    <section className="pg">
      <div className="container">
        <div className="pg-head">
          <div>
            <h1>My Studio Listings</h1>
            <p>Manage the spaces you host on StudioSpace.</p>
          </div>
          <Link href="/add-studio" className="btn btn-primary">
            <Plus size={18} /> Add New Studio
          </Link>
        </div>

        {error && (
          <div className="empty">
            <h3>We couldn&apos;t load your listings</h3>
            <p>Please refresh the page or log in again.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {list && list.length === 0 && (
          <div className="empty">
            <Store size={36} />
            <h3>You haven&apos;t listed a studio yet</h3>
            <p>
              List your first space and start receiving booking requests from
              creators.
            </p>
            <Link href="/add-studio" className="btn btn-primary">
              Host Your Space
            </Link>
          </div>
        )}

        {list && list.length > 0 && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Studio</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div className="tbl-studio">
                        <div className="tbl-thumb">
                          <img src={resolveImage(s.image)} alt={s.title} />
                        </div>
                        <div>
                          <Link href={`/studios/${s._id}`}>
                            <strong>{s.title}</strong>
                          </Link>
                          <small>{s.location}</small>
                        </div>
                      </div>
                    </td>
                    <td>{categoryLabel(s.category)}</td>
                    <td>${s.hourlyRate} / hr</td>
                    <td>{s.maxCapacity} people</td>
                    <td>
                      <div className="row-actions">
                        <Link
                          href={`/studios/edit/${s._id}`}
                          className="btn-ghost-sm"
                        >
                          <Pencil size={14} /> Update
                        </Link>
                        <button
                          className="btn-ghost-sm danger"
                          onClick={() => setTarget(s)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {target && (
        <ConfirmModal
          danger
          busy={busy}
          title="Delete this studio?"
          message={`"${target.title}" will be permanently removed and its pending bookings will be cancelled. This cannot be undone.`}
          confirmLabel="Yes, delete"
          cancelLabel="Keep it"
          onConfirm={remove}
          onClose={() => setTarget(null)}
        />
      )}
    </section>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListings />
    </PrivateRoute>
  );
}
