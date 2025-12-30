import {
  deleteeProfileRekamMedis,
  getProfileRekamMedis,
  postProfileRekamMedis,
  updateProfileRekamMedis,
} from "@/api_disabled/management/profileRekamMedis";
import {
  getListAgama,
  getListGolonganDarah,
  getListPekerjaan,
  getListPenaggungJawab,
  getListPendidikan,
  getListSukuBangsa,
} from "@/api_disabled/master/attribut";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { create } from "zustand";

export const useProfileRekamMedisStore = create((set, get) => ({
  isLoading: false,
  dataProfileRM: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: null,
  rowsPerPage: 10,
  searchQuery: "",

  fetchProfileRekamMedis: async (query = "") => {
    set({ isLoading: true });
    try {
      const data = await getProfileRekamMedis(
        query || `per_page=${get().rowsPerPage}`
      );
      set({
        dataProfileRM: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
      console.error(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addProfileRekamMedis: async (payload) => {
    try {
      const res = await postProfileRekamMedis(payload);
      set((state) => ({
        dataProfileRM: [res.data, ...state.dataProfileRM],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil menambahkan Rekam Medis.",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal menambahkan Rekam Medis.",
        type: "error",
      });
      throw err;
    }
  },

  updateProfileRekamMedis: async (payload) => {
    try {
      const res = await updateProfileRekamMedis(payload);
      set((state) => ({
        dataProfileRM: state.dataProfileRM.map((item) =>
          item.id === payload.id ? res.data : item
        ),
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil update Rekam Medis.",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal update Rekam Medis.",
        type: "error",
      });
      throw err;
    }
  },

  deleteProfileRekamMedis: async (id) => {
    try {
      const res = await deleteeProfileRekamMedis(id);
      set((state) => ({
        dataProfileRM: state.dataProfileRM.filter((item) => item.id !== id),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil menghapus Rekam Medis.",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal menghapus Rekam Medis.",
        type: "error",
      });
      throw err;
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row?.original || row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  setPage: (page) => {
    const query = new URLSearchParams({
      page: String(page),
      per_page: String(get().rowsPerPage),
    });

    const { searchQuery } = get();
    if (searchQuery) {
      const extraParams = new URLSearchParams(searchQuery);
      extraParams.forEach((value, key) => {
        if (!["page", "per_page"].includes(key)) {
          query.append(key, value);
        }
      });
    }

    get().fetchProfileRekamMedis(query.toString());
  },
}));

export const useAgamaStore = create((set, get) => ({
  agama: [],
  isFetched: false,
  fetchAgama: async () => {
    if (get().isFetched && get().agama.length > 0) return;

    try {
      const data = await getListAgama();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ agama: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data Agama.",
        type: "error",
      });
    }
  },
}));

export const useGolonganDarahStore = create((set, get) => ({
  golonganDarah: [],
  isFetched: false,
  fetchGolonganDarah: async () => {
    if (get().isFetched && get().golonganDarah.length > 0) return;

    try {
      const data = await getListGolonganDarah();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ golonganDarah: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data GolonganDarah.",
        type: "error",
      });
    }
  },
}));

export const useSukuBangsaStore = create((set, get) => ({
  sukuBangsa: [],
  isFetched: false,
  fetchSukuBangsa: async () => {
    if (get().isFetched && get().sukuBangsa.length > 0) return;

    try {
      const data = await getListSukuBangsa();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ sukuBangsa: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data SukuBangsa.",
        type: "error",
      });
    }
  },
}));

export const usePekerjaanStore = create((set, get) => ({
  pekerjaan: [],
  isFetched: false,
  fetchPekerjaan: async () => {
    if (get().isFetched && get().pekerjaan.length > 0) return;

    try {
      const data = await getListPekerjaan();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ pekerjaan: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data Pekerjaan.",
        type: "error",
      });
    }
  },
}));

export const useListPendidikanStore = create((set, get) => ({
  listPendidikan: [],
  isFetched: false,
  fetchListPendidikan: async () => {
    if (get().isFetched && get().listPendidikan.length > 0) return;

    try {
      const data = await getListPendidikan();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ listPendidikan: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data ListPendidikan.",
        type: "error",
      });
    }
  },
}));

export const usePenanggungJawabStore = create((set, get) => ({
  penanggungJawab: [],
  isFetched: false,
  fetchPenanggungJawab: async () => {
    if (get().isFetched && get().penanggungJawab.length > 0) return;

    try {
      const data = await getListPenaggungJawab();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ penanggungJawab: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data Penanggung Jawab.",
        type: "error",
      });
    }
  },
}));
