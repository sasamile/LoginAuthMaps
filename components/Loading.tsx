import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-600 to-yellow-300">
      <div className="bg-white p-8 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="mt-4 text-xl font-bold text-gray-800 animate-pulse">Cargando...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;