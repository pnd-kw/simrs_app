import { deleteRawatInap, getRawatInap, postRawatInap, updateRawatInap } from "@/api_disabled/registrasi/ranap";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { create } from "zustand";

export const useRawatInapStore = create((set, get) => ({
  isLoading: false,
  dataRawatInap: [],
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

  fetchRawatInap: async (query = "") => {

    set({ isLoading: true });
    try {
      const data = await getRawatInap(
        query || `per_page=${get().rowsPerPage}`
      );
      set({
        dataRawatInap: data.data,
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

  addRawatInap: async (payload) => {
    try {
      const res = await postRawatInap(payload);
      set((state) => ({
        dataRawatInap: [res.data, ...state.dataRawatInap],
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

  updateRawatInap: async (payload) => {
    try {
      const res = await updateRawatInap(payload);
      set((state) => ({
        dataRawatInap: state.dataRawatInap.map((item) =>
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

  deleteRawatInap: async (id) => {
    try {
      const res = await deleteRawatInap(id);
      set((state) => ({
        dataRawatInap: state.dataRawatInap.filter(
          (item) => item.id !== id
        ),
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

    get().fetchRawatInap(query.toString());
  },
}));