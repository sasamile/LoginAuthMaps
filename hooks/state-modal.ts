import { create } from "zustand";

// Define el estado usando Zustand
const useStore = create<{
  isToggled: boolean;
  toggle: () => void;
}>((set) => ({
  isToggled: false, // Estado booleano inicial
  toggle: () => set((state) => ({ isToggled: !state.isToggled })), // Función para cambiar el estado
}));

export default useStore;
