'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PrivateRoute from '../../../components/PrivateRoute';
import Spinner from '../../../components/Spinner';
import StudioForm from '../../../components/StudioForm';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

function EditStudio() {
  const { id } = useParams();
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;

  const [studio, setStudio] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound | forbidden
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch(`/api/studios/${id}`)
      .then(s => {
        if (s.ownerEmail !== user?.email) return setStatus('forbidden');
        setStudio(s);
        setStatus('ok');
      })
      .catch(() => setStatus('notfound'));
  }, [id, user?.email]);

  const save = async payload => {
    setBusy(true);
    try {
      await apiFetch(`/api/studios/${id}`, { method: 'PUT', body: payload });
      toast.success('Studio updated successfully!');
      router.push('/my-listings');
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  };

  if (status === 'loading') return <Spinner label="Loading your listing..." />;

  if (status !== 'ok') {
    return (
      <section className="pg">
        <div className="container">
          <div className="empty">
            <h3>
              {status === 'forbidden'
                ? 'You can only edit your own listings'
                : 'Studio not found'}
            </h3>
            <p>Head back to your listings to pick a studio to update.</p>
            <Link href="/my-listings" className="btn btn-primary">
              My Studio Listings
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pg">
      <div className="container">
        <div className="form-card">
          <h1>Update studio</h1>
          <p className="auth-sub">Changes go live as soon as you save.</p>
          <StudioForm
            initial={studio}
            host={{ name: studio.ownerName, email: studio.ownerEmail }}
            submitLabel="Save Changes"
            busy={busy}
            onSubmit={save}
          />
        </div>
      </div>
    </section>
  );
}

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditStudio />
    </PrivateRoute>
  );
}
