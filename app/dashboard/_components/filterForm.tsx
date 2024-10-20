// app/_components/filterForm.tsx
'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface FilterFormProps {
  canchas: Court[];
  onFilter: (filtered: Court[]) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ canchas, onFilter }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = canchas.filter((cancha) => {
      const nameMatch = cancha.name.toLowerCase().includes(name.toLowerCase());
      const addressMatch = cancha.address.toLowerCase().includes(address.toLowerCase());
      const dateMatch = !date || cancha.dates.some(d => 
        new Date(d).toISOString().split('T')[0] === date
      );
      
      return nameMatch && addressMatch && dateMatch;
    });
    
    onFilter(filtered);
  };

  const handleReset = () => {
    setName('');
    setAddress('');
    setDate('');
    onFilter(canchas);
  };

  return (
    <form onSubmit={handleFilter} className="mb-8 bg-card text-card-foreground shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Nombre de la cancha"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Ubicación"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <Button type="submit" className="flex-1">
          Filtrar
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
          Resetear Filtros
        </Button>
      </div>
    </form>
  );
};

export default FilterForm;