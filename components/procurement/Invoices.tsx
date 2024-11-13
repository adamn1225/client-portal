// Invoices.tsx
import React from 'react';
import { useSession, Session } from '@supabase/auth-helpers-react';

interface Invoices {
  session: Session | null;
}

const Invoices: React.FC<Invoices> = ({session}) => {
  return <div>Invoices Content</div>;
};

export default Invoices;