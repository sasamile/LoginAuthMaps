// app/_components/canchalist.tsx
import React from 'react';
import CanchaCard from './canchaCard';

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

interface CanchaListProps {  
  canchas: Court[];
}

const CanchaList: React.FC<CanchaListProps> = ({ canchas }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {canchas.map((cancha) => (
        <CanchaCard key={cancha.id} cancha={cancha} />
      ))}
    </div>
  );
};

export default CanchaList;