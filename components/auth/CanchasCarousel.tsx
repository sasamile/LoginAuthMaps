"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const canchas = [
  {
    id: 1,
    name: "Cancha El Maracaná",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Barrio La Esperanza, Villavicencio",
  },
  {
    id: 2,
    name: "Complejo Deportivo Los Llanos",
    image:
      "https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Zona Industrial, Villavicencio",
  },
  {
    id: 3,
    name: "Cancha Sintética El Gol",
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    location: "Centro, Villavicencio",
  },
];

const CanchasCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % canchas.length);
  }, [canchas.length]);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + canchas.length) % canchas.length
    );
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 3000);
    return () => clearInterval(slideInterval);
  }, [3000, nextSlide]);

  return (
    <div className="relative w-full overflow-hidden h-screen">
      {canchas.map((cancha, index) => (
        <div
          key={cancha.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={cancha.image}
            alt={cancha.name}
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute top-0 left-0 p-8">
            <svg
              id="logo-70"
              width="78"
              height="30"
              viewBox="0 0 78 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                d="M18.5147 0C15.4686 0 12.5473 1.21005 10.3934 3.36396L3.36396 10.3934C1.21005 12.5473 0 15.4686 0 18.5147C0 24.8579 5.14214 30 11.4853 30C14.5314 30 17.4527 28.7899 19.6066 26.636L24.4689 21.7737C24.469 21.7738 24.4689 21.7736 24.4689 21.7737L38.636 7.6066C39.6647 6.57791 41.0599 6 42.5147 6C44.9503 6 47.0152 7.58741 47.7311 9.78407L52.2022 5.31296C50.1625 2.11834 46.586 0 42.5147 0C39.4686 0 36.5473 1.21005 34.3934 3.36396L15.364 22.3934C14.3353 23.4221 12.9401 24 11.4853 24C8.45584 24 6 21.5442 6 18.5147C6 17.0599 6.57791 15.6647 7.6066 14.636L14.636 7.6066C15.6647 6.57791 17.0599 6 18.5147 6C20.9504 6 23.0152 7.58748 23.7311 9.78421L28.2023 5.31307C26.1626 2.1184 22.5861 0 18.5147 0Z"
                fill="#3b82f5ff"
              ></path>{" "}
              <path
                d="M39.364 22.3934C38.3353 23.4221 36.9401 24 35.4853 24C33.05 24 30.9853 22.413 30.2692 20.2167L25.7982 24.6877C27.838 27.8819 31.4143 30 35.4853 30C38.5314 30 41.4527 28.7899 43.6066 26.636L62.636 7.6066C63.6647 6.57791 65.0599 6 66.5147 6C69.5442 6 72 8.45584 72 11.4853C72 12.9401 71.4221 14.3353 70.3934 15.364L63.364 22.3934C62.3353 23.4221 60.9401 24 59.4853 24C57.0498 24 54.985 22.4127 54.269 20.2162L49.798 24.6873C51.8377 27.8818 55.4141 30 59.4853 30C62.5314 30 65.4527 28.7899 67.6066 26.636L74.636 19.6066C76.7899 17.4527 78 14.5314 78 11.4853C78 5.14214 72.8579 0 66.5147 0C63.4686 0 60.5473 1.21005 58.3934 3.36396L39.364 22.3934Z"
                fill="#3b82f5ff"
              ></path>{" "}
            </svg>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-8">
            <h2 className="text-4xl font-bold text-white mb-2">
              {cancha.name}
            </h2>
            <p className="text-xl text-white mb-4">{cancha.location}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-5">
          {Array(canchas.length)
            .fill(0)
            .map((_, i) => (
              <div
                onClick={() => setCurrentIndex(i)}
                key={i}
                className={cn(
                  "transition-all w-12  h-3 rounded-full bg-gray-200 cursor-pointer border border-gray-500",
                  currentIndex !== i && "bg-opacity-50"
                )}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CanchasCarousel;
