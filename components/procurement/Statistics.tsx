// Statistics.tsx
import React from 'react';
import { useSession, Session } from '@supabase/auth-helpers-react';

interface Statistics {
  session: Session | null;
}

const Statistics: React.FC<Statistics> = ({session}) => {
  return <div>Statistics Content</div>;
};

export default Statistics;