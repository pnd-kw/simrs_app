import {
  getAsuransi,
  getPerusahaan,
  getTipeAsuransi,
} from "@/api_disabled/master/asuransi";
import { getListBank } from "@/api_disabled/master/attribut";
import {
  getBed,
  getKelasKamarList,
  getKelasKamarListAplicares,
  getKelasKamarRsOnline,
  getListBed,
  getListKamar,
  getRuangAplicars,
  getRuangList,
  getTempatTidurRl,
} from "@/api_disabled/master/bed";
import { getListDokter } from "@/api_disabled/master/dokter";
import { getJadwalDokter } from "@/api_disabled/master/jadwalDokter";
import { getListLayanan } from "@/api_disabled/master/layanan";
import { getMasterJenisHargaList } from "@/api_disabled/master/masterJenisHarga";
import { getMovieList } from "@/api_disabled/master/movie";
import { getListPoliklinik, getPoliklinik } from "@/api_disabled/master/poliklinik";
import { getListSpesialis } from "@/api_disabled/master/spesialis";
import { getTextDisplayLoketList } from "@/api_disabled/master/textDisplay";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { create } from "zustand";

export const useBedStore = create((set, get) => ({
  isLoading: false,
  beds: [],
  tempatTidurRl: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  dropdown: {
    kelasKamar: [],
    aplicares: [],
    rsOnline: [],
    ruangAplicares: [],
    kamar: [],
  },
  selectedRow: {},
  selectedRowRl: {},
  rowsPerPage: 10,

  fetchBeds: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getBed(query);
      set({
        beds: data.data,
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

  fetchDropdowns: async () => {
    try {
      const [
        kelasKamar,
        aplicares,
        rsOnline,
        ruangAplicares,
        kamar,
        tempatTidurRl,
      ] = await Promise.all([
        getKelasKamarList(),
        getKelasKamarListAplicares(),
        getKelasKamarRsOnline(),
        getRuangAplicars(),
        getListKamar(),
        getTempatTidurRl(),
      ]);

      set({
        dropdown: {
          kelasKamar: kelasKamar.data.map((x) => ({
            label: x.name,
            value: x.id,
          })),
          aplicares: aplicares.data.map((x) => ({
            label: x.name,
            value: x.id,
          })),
          rsOnline: rsOnline.data.map((x) => ({ label: x.name, value: x.id })),
          ruangAplicares: ruangAplicares.data.map((x) => ({
            label: `${x.name} - ${x.kode}`,
            value: x.kode,
          })),
          kamar: kamar.data.map((x) => ({ label: x.name, value: x.id })),
        },
        tempatTidurRl: tempatTidurRl.data.map((x) => ({
          label: x.name,
          value: x.id,
        })),
      });
    } catch (err) {
      console.error("Gagal fetch dropdown:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil dropdown data.",
        type: "error",
      });
    }
  },

  setSelectedRow: (row) => set({ selectedRow: row }),
  setSelectedRowRl: (row) => set({ selectedRowRl: row }),
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

    get().fetchBeds(query.toString());
  },
}));

export const useKamarStore = create((set) => ({
  kamar: [],
  fetchKamar: async (params = "") => {
    try {
      const data = await getListKamar(params);
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ kamar: mapped });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data Kamar.",
        type: "error",
      });
    }
  },
}));

export const useKelasKamarStore = create((set, get) => ({
  kelasKamar: [],
  isFetched: false,
  fetchKelasKamar: async () => {
    if (get().isFetched && get().kelasKamar.length > 0) return;

    try {
      const data = await getKelasKamarList();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ kelasKamar: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data KelasKamar.",
        type: "error",
      });
    }
  },
}));

export const useListBedStore = create((set, get) => ({
  listBed: [],
  isFetched: false,
  fetchListBed: async () => {
    if (get().isFetched && get().listBed.length > 0) return;

    try {
      const data = await getListBed();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ listBed: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data List Bed.",
        type: "error",
      });
    }
  },
}));

export const useRuangListStore = create((set, get) => ({
  ruangList: [],
  isFetched: false,
  fetchRuangList: async () => {
    if (get().isFetched && get().ruangList.length > 0) return;

    try {
      const data = await getRuangList();
      const mapped = (data.data || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ ruangList: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data List Bed.",
        type: "error",
      });
    }
  },
}));

export const useBedTabStore = create((set) => ({
  selectedTab: 0,
  selectedTabName: "bed",
  setSelectedTab: (key, name) =>
    set({ selectedTab: key, selectedTabName: name }),
}));

export const useJenisHargaStore = create((set) => ({
  jenisHarga: [],
  fetchJenisHarga: async () => {
    try {
      const data = await getMasterJenisHargaList();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ jenisHarga: mapped });
    } catch (error) {
      console.log(err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil data.",
        type: "error",
      });
    }
  },
}));

export const useTipeAsuransiStore = create((set) => ({
  tipeAsuransi: [],
  fetchTipeAsuransi: async () => {
    try {
      const data = await getTipeAsuransi();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ tipeAsuransi: mapped });
    } catch (error) {
      console.error("Failed to get tipe asuransi data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil tipe asuransi data.",
        type: "error",
      });
    }
  },
}));

export const useBankStore = create((set) => ({
  bank: [],
  fetchBank: async () => {
    try {
      const data = await getListBank();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ bank: mapped });
    } catch (error) {
      console.error("Failed to get bank data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal Menggambil bank data.",
        type: "error",
      });
    }
  },
}));

export const useAsuransiStore = create((set, get) => ({
  isLoading: false,
  asuransi: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchAsuransi: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getAsuransi(query);
      set({
        asuransi: data.data,
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

    get().fetchAsuransi(query.toString());
  },
}));

export const usePerusahaanStore = create((set, get) => ({
  isLoading: false,
  perusahaan: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchPerusahaan: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getPerusahaan(query);
      set({
        perusahaan: data.data,
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

    get().fetchPerusahaan(query.toString());
  },
}));

export const useListLayananStore = create((set) => ({
  listLayanan: [],
  fetchListLayanan: async () => {
    try {
      const data = await getListLayanan();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ listLayanan: mapped });
    } catch (error) {
      console.error("Failed to get list layanan data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Failed to get list layanan data",
        type: "error",
      });
    }
  },
}));

export const useListPoliklinikStore = create((set) => ({
  listPoliklinik: [],
  fetchListPoliklinik: async () => {
    try {
      const data = await getListPoliklinik();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.name,
        kodebridge: item.kodebridge,
        code: item.code,
      }));
      set({ listPoliklinik: mapped });
    } catch (error) {
      console.error("Failed to get list Poliklinik data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Failed to get list Poliklinik data",
        type: "error",
      });
    }
  },
}));

export const useListSpesialisStore = create((set) => ({
  listSpesialis: [],
  fetchListSpesialis: async () => {
    try {
      const data = await getListSpesialis();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.name,
        spec_code: item.code,
      }));
      set({ listSpesialis: mapped });
    } catch (error) {
      console.error("Failed to get list Spesialis data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Failed to get list Spesialis data",
        type: "error",
      });
    }
  },
}));

export const useJadwalDokterStore = create((set, get) => ({
  isLoading: false,
  jadwalDokter: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchJadwalDokter: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getJadwalDokter(query);
      set({
        jadwalDokter: data.data,
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

    get().fetchJadwalDokter(query.toString());
  },
}));

export const useListDokterStore = create((set) => ({
  listDokter: [],
  fetchListDokter: async () => {
    try {
      const data = await getListDokter();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.fullname,
      }));
      set({ listDokter: mapped });
    } catch (error) {
      console.error("Failed to get list Dokter data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Failed to get list Dokter data.",
        type: "error",
      });
    }
  },
}));

export const usePoliklinikStore = create((set, get) => ({
  isLoading: false,
  poliklinik: [],
  pagination: {
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  },
  selectedRow: {},
  rowsPerPage: 10,

  fetchPoliklinik: async (query = "per_page=10") => {
    set({ isLoading: true });
    try {
      const data = await getPoliklinik(query);
      set({
        poliklinik: data.data,
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

    get().fetchPoliklinik(query.toString());
  },
}));

export const useTextDisplayListStore = create((set) => ({
  textDisplayList: [],
  fetchTextDisplayList: async () => {
    try {
      const data = await getTextDisplayLoketList();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.judul,
      }));
      set({ textDisplayList: mapped });
    } catch (error) {
      console.error("Failed to get list layanan data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Failed to get list layanan data",
        type: "error",
      });
    }
  },
}));

export const useMovieListStore = create((set) => ({
  movieList: [],
  fetchMovieList: async () => {
    try {
      const data = await getMovieList();

      const list = data.data || [];
      const mapped = list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      set({ movieList: mapped });
    } catch (error) {
      console.error("Failed to get list layanan data", error);
      toastWithProgress({
        title: "Gagal",
        description: "Failed to get list layanan data",
        type: "error",
      });
    }
  },
}));
