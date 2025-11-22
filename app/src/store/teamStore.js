import { create } from "zustand";

const useTeamStore = create((set, get) => ({
	myTeamName: null,
	setMyTeamName: (myTeamName) => set({ myTeamName }),
	getMyTeamName: () => get().myTeamName,

	teamNames: [],
	setTeamNames: (teamNames) => set({ teamNames }),
	getTeamNames: () => get().teamNames
}));

export {useTeamStore};
