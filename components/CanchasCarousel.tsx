"use client"

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const canchas = [
  {
    id: 1,
    name: 'Cancha El Maracaná',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'Barrio La Esperanza, Villavicencio',
  },
  {
    id: 2,
    name: 'Complejo Deportivo Los Llanos',
    image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    location: 'Zona Industrial, Villavicencio',
  },
  {
    id: 3,
    name: 'Cancha Sintética El Gol',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
    location: 'Centro, Villavicencio',
  },
];

const CanchasCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % canchas.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + canchas.length) % canchas.length);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {canchas.map((cancha, index) => (
        <div
          key={cancha.id}
          className={`absolute top-0 left-0 w-full h-[85%] transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={cancha.image}
            alt={cancha.name}
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-8">
            <h2 className="text-4xl font-bold text-white mb-2">{cancha.name}</h2>
            <p className="text-xl text-white mb-4">{cancha.location}</p>
            <Button className="w-40">Reservar Ahora</Button>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
};

export default CanchasCarousel;