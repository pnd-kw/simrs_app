import {
  getDataJaminan,
  getDataKlaim,
  getDataKunjungan,
  getDataPelayanan,
} from "@/api_disabled/ws_bridging/monitoring";
import { getDataBPJS, getDataNIK } from "@/api_disabled/ws_bridging/peserta";
import { getDataDokter } from "@/api_disabled/ws_bridging/rencanaKontrol";
import { getKeluarRs, getMultiRecordPcare } from "@/api_disabled/ws_bridging/rujukan";
import { getSarana } from "@/api_disabled/ws_bridging/sarana";
import { getSepBridging } from "@/api_disabled/ws_bridging/sep";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { create } from "zustand";

export const useWsSEPStore = create((set, get) => ({
  isLoading: false,
  wsSep: [],
  pagination: {
    current_page: 1,
    total: 1,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchWsSEP: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getSepBridging(query);
      set({
        wsSep: data.data,
        pagination: {
          current_page: 1,
          total: 1,
          next_page_url: null,
          prev_page_url: null,
          last_page: 1,
        },
      });
    } catch (err) {
      console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchWsSEP(query.toString());
  },
}));

export const useCariSEPRencanaKontrolStore = create((set, get) => ({
  isLoading: false,
  cariSEPRencanaKontrol: [],
  pagination: {
    current_page: 1,
    total: 1,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchCariSEPRencanaKontrol: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getSepBridging(query);
      set({
        cariSEPRencanaKontrol: data.data,
        pagination: {
          current_page: 1,
          total: 1,
          next_page_url: null,
          prev_page_url: null,
          last_page: 1,
        },
      });
    } catch (err) {
      console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchCariSEPRencanaKontrol(query.toString());
  },
}));

export const useMultiRecordPcareStore = create((set, get) => ({
  isLoading: false,
  multiRecordPcare: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchMultiRecordPcare: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getMultiRecordPcare(query);
      set({
        multiRecordPcare: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
        console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchMultiRecordPcare(query.toString());
  },
}));

export const useSaranaStore = create((set, get) => ({
  isLoading: false,
  sarana: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchSarana: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getSarana(query);
      set({
        sarana: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
      console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchSarana(query.toString());
  },
}));

export const useDataDokterStore = create((set, get) => ({
  isLoading: false,
  dataDokter: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchDataDokter: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getDataDokter(query);
      set({
        dataDokter: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
        console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchDataDokter(query.toString());
  },
}));

export const useDataKunjunganStore = create((set, get) => ({
  isLoading: false,
  dataKunjungan: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchDataKunjungan: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getDataKunjungan(query);
      set({
        dataKunjungan: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
       console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchDataKunjungan(query.toString());
  },
}));

export const useDataKlaimStore = create((set, get) => ({
  isLoading: false,
  dataKlaim: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchDataKlaim: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getDataKlaim(query);
      set({
        dataKlaim: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
           console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchDataKlaim(query.toString());
  },
}));

export const useKeluarRsStore = create((set, get) => ({
  isLoading: false,
  keluarRs: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchKeluarRs: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getKeluarRs(query);
      set({
        keluarRs: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
       console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchKeluarRs(query.toString());
  },
}));

export const useDataPelayananStore = create((set, get) => ({
  isLoading: false,
  dataPelayanan: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchDataPelayanan: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getDataPelayanan(query);
      set({
        dataPelayanan: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
      console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchDataPelayanan(query.toString());
  },
}));

export const useDataJaminanStore = create((set, get) => ({
  isLoading: false,
  dataJaminan: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchDataJaminan: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getDataJaminan(query);
      set({
        dataJaminan: data.data,
        pagination: {
          current_page: data.meta.current_page,
          total: data.meta.total,
          next_page_url: data.meta.next_page_url,
          prev_page_url: data.meta.prev_page_url,
          last_page: data.meta.last_page,
        },
      });
    } catch (err) {
      console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchDataJaminan(query.toString());
  },
}));

export const useDataBPJSStore = create((set, get) => ({
  isLoading: false,
  dataBPJS: [],
  pagination: {
    current_page: 1,
    total: 1,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchDataBPJS: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getDataBPJS(query);
      set({
        dataBPJS: data.data,
        pagination: {
          current_page: 1,
          total: 1,
          next_page_url: null,
          prev_page_url: null,
          last_page: 1,
        },
      });
    } catch (err) {
      console.log(err);

      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchDataBPJS(query.toString());
  },
}));

export const useDataNIKStore = create((set, get) => ({
  isLoading: false,
  dataNIK: [],
  pagination: {
    current_page: 1,
    total: 1,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchDataNIK: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getDataNIK(query);
      set({
        dataNIK: data.data,
        pagination: {
          current_page: 1,
          total: 1,
          next_page_url: null,
          prev_page_url: null,
          last_page: 1,
        },
      });
    } catch (err) {
      console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),
  searchQuery: "",
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

    get().fetchDataNIK(query.toString());
  },
}));
