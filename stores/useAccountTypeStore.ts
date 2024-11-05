import { create } from "zustand";
import { Role } from "@prisma/client";

interface AccountTypeState {
  accountType: Role | null;
  setAccountType: (role: Role | null) => void;
}

export const useAccountTypeStore = create<AccountTypeState>((set) => ({
  accountType: null,
  setAccountType: (role) => set({ accountType: role }),
}));
