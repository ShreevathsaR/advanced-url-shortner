import { create } from 'zustand'
import type { User } from '../types/user'

interface StoreType {
    user: User | null;
    setUser: (newUser: User) => void
}

export const useStore = create<StoreType>((set) => ({
    user: null,
    setUser: (newUser: User) => set({user: newUser})
}))