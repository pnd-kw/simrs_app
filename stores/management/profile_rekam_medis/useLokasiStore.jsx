import { create } from "zustand";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import {
  getNegara,
  getProvinsi,
  getKecamatan,
  getKelurahan,
  getKabupaten,
} from "@/api_disabled/management/lokasi";

export const useNegaraStore = create((set, get) => ({
  negara: [],
  isFetched: false,
  fetchNegara: async () => {
    if (get().isFetched && get().negara.length > 0) return;

    try {
      const data = await getNegara();
      const mapped = (data.data || []).map((item) => ({
        id: item.code,
        name: item.name,
      }));
      set({ negara: mapped, isFetched: true });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data negara.",
        type: "error",
      });
    }
  },
}));

export const useProvinsiStore = create((set) => ({
  provinsi: [],
  fetchProvinsi: async (negaraId) => {
    try {
      const data = await getProvinsi(negaraId);
      const mapped = (data.data || []).map((item) => ({
        id: item.code,
        name: item.name,
      }));
      set({ provinsi: mapped });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data provinsi.",
        type: "error",
      });
    }
  },
}));

export const useKotaStore = create((set) => ({
  kota: [],
  fetchKota: async (provinsiId) => {
    try {
      const data = await getKabupaten(provinsiId);
      const mapped = (data.data || []).map((item) => ({
        id: item.code,
        name: item.name,
      }));
      set({ kota: mapped });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data kota.",
        type: "error",
      });
    }
  },
}));

export const useKecamatanStore = create((set) => ({
  kecamatan: [],
  fetchKecamatan: async (kotaId) => {
    try {
      const data = await getKecamatan(kotaId);
      const mapped = (data.data || []).map((item) => ({
        id: item.code,
        name: item.name,
      }));
      set({ kecamatan: mapped });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data kecamatan.",
        type: "error",
      });
    }
  },
}));

export const useKelurahanStore = create((set) => ({
  kelurahan: [],
  fetchKelurahan: async (kecamatanId) => {
    try {
      const data = await getKelurahan(kecamatanId);
      const mapped = (data.data || []).map((item) => ({
        id: item.code,
        name: item.name,
      }));
      set({ kelurahan: mapped });
    } catch (error) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mengambil data kelurahan.",
        type: "error",
      });
    }
  },
}));
