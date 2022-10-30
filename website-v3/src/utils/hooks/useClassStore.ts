import create from "zustand";
import { inferQueryOutput } from "../trpc";
import { trpc as trpcVanilla } from "../trpcVanilla";

type MapType = inferQueryOutput<"people.get-people-by-id">;

interface State {
  map: MapType;
  isFetching: boolean;
}
interface Actions {
  setMap: (map: MapType) => void;
  addId: (id: number) => Promise<void>;
  addIds: (ids: number[]) => Promise<void>;
  getIds: (ids: number[]) => Promise<void>;
}
const useClassStore = create<State & Actions>((set) => ({
  map: new Map(),
  isFetching: false,
  setMap: (map) => set({ map }),
  addId: async (id) => {
    set({ isFetching: true });
    const data = await trpcVanilla.query("people.get-person-by-id", id);
    set((state) => {
      const newMap = new Map(state.map).set(id, data);
      return { map: newMap, isFetching: false };
    });
  },
  addIds: async (ids) => {
    set({ isFetching: true });
    const data = await trpcVanilla.query("people.get-people-by-id", ids);
    set((state) => {
      const newMap = new Map(state.map);
      data.forEach((value, key) => newMap.set(key, value));

      return { map: newMap, isFetching: false };
    });
  },
  getIds: async (ids) => {
    set({ isFetching: true });
    const data = await trpcVanilla.query("people.get-people-by-id", ids);
    set((state) => {
      const newMap = new Map(state.map);
      data.forEach((value, key) => newMap.set(key, value));

      return { map: newMap, isFetching: false };
    });
  },
}));

export default useClassStore;
