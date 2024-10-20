// app/_components/ClientWrapper.tsx
'use client';

import { useState } from 'react';
import FilterForm from './filterForm';
import CanchaList from './canchalist';

interface Court {
  id: string;
  name: string;
  address: string;
  description: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  price: number;
  imageUrl: string;
  coordinates: any;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface ClientWrapperProps {
  initialCanchas: Court[];
}

export default function ClientWrapper({ initialCanchas }: ClientWrapperProps) {
  const [filteredCanchas, setFilteredCanchas] = useState(initialCanchas);

  return (
    <>
      <FilterForm canchas={initialCanchas} onFilter={setFilteredCanchas} />
      <CanchaList canchas={filteredCanchas} />
    </>
  );
}
