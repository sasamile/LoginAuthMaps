import { Calendar, MapPin, Clock } from 'lucide-react';

const InfoSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          ¿Por qué reservar con nosotros?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reserva Fácil</h3>
            <p className="text-gray-600">
              Reserva tu cancha favorita en minutos, sin complicaciones.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-3 mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ubicaciones Estratégicas</h3>
            <p className="text-gray-600">
              Canchas en los mejores lugares de Villavicencio, fáciles de llegar.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-yellow-100 rounded-full p-3 mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Horarios Flexibles</h3>
            <p className="text-gray-600">
              Encuentra el horario perfecto para tu partido, mañana, tarde o noche.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;