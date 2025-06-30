'use client';

import { Suspense } from 'react';
import SearchResultsPage from './SearchResultsPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Chargement des résultats...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}
