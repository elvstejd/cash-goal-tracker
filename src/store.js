import create from 'zustand';
import { persist } from "zustand/middleware"
import currency from 'currency.js';

const useStore = create(persist((set, get) => ({
    entries: [],
    goal: 500,
    setGoal: (goal) => set({ goal: currency(goal).value }),
    addEntry: (entryObj) => set((state) => ({ entries: [entryObj, ...state.entries] })),
    getTotal: () => {
        const entries = get().entries;
        if (entries.length === 0) return '$0';
        const total = entries.reduce((prev, entry) => currency(prev).add(currency(entry.amount)), 0);
        return total.format();
    },
    getCompletionPercent: () => {
        const goal = get().goal;
        const total = currency(get().getTotal()).value;
        const result = (total / goal) * 100
        return result < 100 ? result : 100;
    }
})));

export { useStore };