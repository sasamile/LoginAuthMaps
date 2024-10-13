"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



const CanchasSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [canchas, setCanchas] = useState<{ id: number; name: string; image: string; location: string; type: string; price: number; }[]>([]);

  useEffect(() => {
    const canchasData = [
        {
            id: 1,
            name: "Cancha El Maracaná",
            image:
              "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            location: "Barrio La Esperanza, Villavicencio",
            type: "Fútbol 11",
            price: 100000,
          },
          {
            id: 2,
            name: "Complejo Deportivo Los Llanos",
            image:
              "https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            location: "Zona Industrial, Villavicencio",
            type: "Fútbol 5",
            price: 80000,
          },
          {
            id: 3,
            name: "Cancha Sintética El Gol",
            image:
              "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
            location: "Centro, Villavicencio",
            type: "Fútbol 7",
            price: 90000,
          },
          {
            id: 4,
            name: "Estadio Macal",
            image:
              "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            location: "Barrio El Buque, Villavicencio",
            type: "Fútbol 11",
            price: 120000,
          },
          {
            id: 5,
            name: "Cancha La Alborada",
            image:
              "https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            location: "Barrio La Alborada, Villavicencio",
            type: "Fútbol 5",
            price: 70000,
          },
          {
            id: 6,
            name: "Complejo Deportivo El Paraíso",
            image:
              "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            location: "Barrio El Paraíso, Villavicencio",
            type: "Fútbol 7",
            price: 85000,
          },
      // ...
    ];
    setCanchas(canchasData);
  }, []);

  const filteredCanchas = canchas.filter((cancha) => {
    return (
      cancha.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "" || cancha.type === selectedType)
    );
  });


  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          Nuestras Canchas
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Buscar canchas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de cancha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Fútbol 5">Fútbol 5</SelectItem>
                <SelectItem value="Fútbol 7">Fútbol 7</SelectItem>
                <SelectItem value="Fútbol 11">Fútbol 11</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCanchas.map((cancha) => (
            <div
              key={cancha.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={cancha.image}
                  alt={cancha.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{cancha.name}</h3>
                <p className="text-gray-600 mb-2">{cancha.location}</p>
                <p className="text-gray-600 mb-2">Tipo: {cancha.type}</p>
                <p className="text-gray-600 mb-4">
                  Precio: ${cancha.price.toLocaleString()} / hora
                </p>
                <Button className="w-full">Reservar</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CanchasSection;
