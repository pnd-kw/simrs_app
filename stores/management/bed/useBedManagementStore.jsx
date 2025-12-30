import {
  deleteCheckinBed,
  deleteHistoriBed,
  deleteMonitoringBed,
  getDataExistingBed,
  getDataWaitingListBed,
  getHistoriBed,
  getMonitoringBed,
  getVisualisasiBed,
  postCheckinWaitingListBed,
  postDataWaitingListBed,
  postMonitoringBed,
  updateDataWaitingListBed,
  updateHistoriBed,
  updateKondisiBed,
  updateMonitoringBed,
} from "@/api_disabled/management/managementBed";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { create } from "zustand";

export const useBedManagementTabStore = create((set) => ({
  selectedTab: 0,
  selectedTabName: "managemenet bed",
  setSelectedTab: (key, name) =>
    set({ selectedTab: key, selectedTabName: name }),
}));

export const useMonitoringBedStore = create((set, get) => ({
  isLoading: false,
  dataMonitoringBed: [],
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

  fetchMonitoringBed: async (query = "") => {
    set({ isLoading: true });
    try {
      const data = await getMonitoringBed(
        query || `per_page=${get().rowsPerPage}`
      );
      set({
        dataMonitoringBed: data.data,
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

  addMonitoringBed: async (payload) => {
    try {
      const res = await postMonitoringBed(payload);
      set((state) => ({
        dataMonitoringBed: [res.data, ...state.dataMonitoringBed],
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

  updateMonitoringBed: async (payload) => {
    try {
      const res = await updateMonitoringBed(payload);
      set((state) => ({
        dataMonitoringBed: state.dataMonitoringBed.map((item) =>
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

  updateKondisiBed: async (payload) => {
    try {
      const res = await updateKondisiBed(payload);
      set((state) => ({
        dataMonitoringBed: state.dataMonitoringBed.map((item) =>
          item.id === payload.id ? { ...item, ...res.data } : item
        ),
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil update kondisi bed.",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal update kondisi bed.",
        type: "error",
      });
      throw err;
    }
  },

  deleteMonitoringBed: async (id) => {
    try {
      const res = await deleteMonitoringBed(id);
      set((state) => ({
        dataMonitoringBed: state.dataMonitoringBed.filter(
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

    get().fetchMonitoringBed(query.toString());
  },
}));

export const useWaitingListBedStore = create((set, get) => ({
  isLoading: false,
  dataWaitingListBed: [],
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

  fetchWaitingListBed: async (query = "") => {
    set({ isLoading: true });
    try {
      const data = await getDataWaitingListBed(
        query || `per_page=${get().rowsPerPage}`
      );
      set({
        dataWaitingListBed: data.data,
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

  addWaitingListBed: async (payload) => {
    try {
      const res = await postDataWaitingListBed(payload);
      set((state) => ({
        dataWaitingListBed: [res.data, ...state.dataWaitingListBed],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil menambahkan waiting list.",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal menambahkan waiting list.",
        type: "error",
      });
      throw err;
    }
  },

  checkinWaitingListBed: async (payload) => {
    try {
      const res = await postCheckinWaitingListBed(payload);
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil checkin waiting list.",
        type: "success",
      });
      set((state) => ({
        dataWaitingListBed: state.dataWaitingListBed.filter(
          (item) => item.id !== payload.id
        ),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      }));

      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal checkin waiting list.",
        type: "error",
      });
      throw err;
    }
  },

  deleteWaitingListBed: async (id) => {
    try {
      const res = await deleteCheckinBed(id);
      set((state) => ({
        dataWaitingListBed: state.dataWaitingListBed.filter(
          (item) => item.id !== id
        ),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil menghapus waiting list.",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal menghapus waiting list.",
        type: "error",
      });
      throw err;
    }
  },

  updateWaitingListBed: async (payload) => {
    try {
      const res = await updateDataWaitingListBed(payload);
      set((state) => ({
        dataWaitingListBed: state.dataWaitingListBed.map((item) =>
          item.id === payload.id ? res.data : item
        ),
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil update waiting list.",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal update waiting list.",
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

    get().fetchWaitingListBed(query.toString());
  },
}));

export const useHistoriBedStore = create((set, get) => ({
  isLoading: false,
  dataHistoriBed: [],
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

  fetchHistoriBed: async (query = "") => {
    set({ isLoading: true });
    try {
      const data = await getHistoriBed(
        query || `per_page=${get().rowsPerPage}`
      );
      set({
        dataHistoriBed: data.data,
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

  updateHistoriBed: async (payload) => {
    try {
      const res = await updateHistoriBed(payload);
      set((state) => ({
        dataHistoriBed: state.dataHistoriBed.map((item) =>
          item.id === payload.id ? res.data : item
        ),
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil update histori bed",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description: err?.response?.data?.message || "Gagal update histori bed",
        type: "error",
      });
      throw err;
    }
  },

  deleteHistoriBed: async (id) => {
    try {
      const res = await deleteHistoriBed(id);
      set((state) => ({
        dataHistoriBed: state.dataHistoriBed.filter((item) => item.id !== id),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1,
        },
      }));
      toastWithProgress({
        title: "Sukses",
        description: res?.message || "Berhasil menghapus histori bed",
        type: "success",
      });
      return res;
    } catch (err) {
      toastWithProgress({
        title: "Error",
        description:
          err?.response?.data?.message || "Gagal menghapus histori bed",
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

    get().fetchHistoriBed(query.toString());
  },
}));

export const useBedEditStore = create((set) => ({
  selectedRow: null,
  bedExist: null,
  bedWaiting: [],
  loading: false,
  error: null,

  setSelectedRow: (row) => set({ selectedRow: row }),
  setBedWaiting: (newList) => set({ bedWaiting: newList }),

  fetchBedExist: async (bedId) => {
    set({ loading: true, error: null });
    try {
      const res = await getDataExistingBed(`bed_id=${bedId}`);
      set({ bedExist: res.data, loading: false });
    } catch (err) {
      set({ error: err?.message, loading: false });
    }
  },

  fetchBedWaiting: async (bedId) => {
    set({ loading: true, error: null });
    try {
      const res = await getDataWaitingListBed(`bed_id=${bedId}`);
      set({ bedWaiting: res.data, loading: false });
    } catch (err) {
      set({ error: err?.message, loading: false });
    }
  },

  reset: () =>
    set({
      selectedRow: null,
      bedExist: null,
      bedWaiting: [],
      loading: false,
      error: null,
    }),
}));

export const useWaitingListBedUpdateStore = create((set) => ({
  selectedWaitingList: null,
  open: false,
  setSelectedWaitingList: (item) =>
    set({ selectedWaitingList: item, open: true }),
  clearSelectedWaitingList: () =>
    set({ selectedWaitingList: null, open: false }),
  setOpen: (val) => set({ open: val }),
}));

export const useVisualisasiBedStore = create((set, get) => ({
  isLoading: false,
  dataVisualisasiBed: [],
  summary: [],
  selectedRow: null,
  detailBed: null,
  rowsPerPage: 10,
  searchQuery: "",

  fetchVisualisasiBed: async (query = "") => {
    set({ isLoading: true });
    try {
      const data = await getVisualisasiBed(query);
      set({
        dataVisualisasiBed: data,
        summary: data.summary,
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

  setSelectedRow: (row) => set({ selectedRow: row?.original || row }),

  fetchDetailBed: async (bedId) => {
    set({ isLoading: true, detailBed: null });
    try {
      const res = await getDataExistingBed(`bed_id=${bedId}`);
      set({ detailBed: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },

  resetDetail: () => set({ selectedRow: null, detailBed: null }),

  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
