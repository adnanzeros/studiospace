'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { ensureJwt } from '@/lib/session';
import Spinner from './Spinner';

// Private page wrapper.
// Session load hoyar age redirect kore na, tai reload dile Login e fele dey na.
export default function PrivateRoute({ children }) {
  const { data, isPending } = useSession();
  const router = useRouter();
  const path = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!data?.user) {
      router.replace(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    let alive = true;
    // JWT cookie set hoye gele tarpor page API call korbe
    ensureJwt().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [isPending, data, path, router]);

  if (isPending || !data?.user || !ready)
    return <Spinner label="Checking your session..." />;
  return children;
}
