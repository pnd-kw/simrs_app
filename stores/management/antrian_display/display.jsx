import { deleteManagementDisplay, getManagementDisplay, postManagementDisplay, updateManagementDisplay } from "@/api/management/managementDisplay";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { create } from "zustand";

export const useManagementDisplayStore = create((set, get) => ({
  isLoading: false,
  dataManagementDisplay: [],
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

  fetchManagementDisplay: async (query = "") => {
    set({ isLoading: true });
    try {
      const data = await getManagementDisplay(
        query || `per_page=${get().rowsPerPage}`
      );
      set({
        dataManagementDisplay: data.data,
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

  addManagementDisplay: async (payload) => {
    try {
      const res = await postManagementDisplay(payload);
      set((state) => ({
        dataManagementDisplay: [res.data, ...state.dataManagementDisplay],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil menambahkan Display",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal menambahkan Display",
        type: "error",
      });
      throw err;
    }
  },

  updateManagementDisplay: async (payload) => {
    try {
      const res = await updateManagementDisplay(payload);
      set((state) => ({
        dataManagementDisplay: state.dataManagementDisplay.map((item) =>
          item.id === payload.id ? res.data : item
        ),
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil update Display",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal update Display",
        type: "error",
      });
      throw err;
    }
  },

  deleteManagementDisplay: async (id) => {
    try {
      const res = await deleteManagementDisplay(id);
      set((state) => ({
        dataManagementDisplay: state.dataManagementDisplay.filter(
          (item) => item.id !== id
        ),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil menghapus Display",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal menghapus Display",
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

    get().fetchManagementDisplay(query.toString());
  },
}));