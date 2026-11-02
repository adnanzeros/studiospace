'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PrivateRoute from '../components/PrivateRoute';
import StudioForm from '../components/StudioForm';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

function AddStudio() {
  const router = useRouter();
  const { data } = useSession();
  const [busy, setBusy] = useState(false);

  const save = async payload => {
    setBusy(true);
    try {
      await apiFetch('/api/studios', { method: 'POST', body: payload });
      toast.success('Studio listed successfully!');
      router.push('/my-listings');
    } catch (err) {
      toast.error(
        err.status === 401
          ? 'Please log in again to add a studio.'
          : err.message,
      );
      setBusy(false);
    }
  };

  return (
    <section className="pg">
      <div className="container">
        <div className="form-card">
          <h1>Add a new studio</h1>
          <p className="auth-sub">
            Share your creative space with filmmakers, photographers, podcasters
            and musicians.
          </p>
          <StudioForm
            host={data?.user}
            submitLabel="Publish Studio"
            busy={busy}
            onSubmit={save}
          />
        </div>
      </div>
    </section>
  );
}

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <AddStudio />
    </PrivateRoute>
  );
}
