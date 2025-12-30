import { loginListMenu } from "@/api_disabled/auth/login";
import LoketCall from "@/components/antrean_call/loket_call/LoketCall";
import DashboardLayout from "@/components/executive/dashboard/DashboardLayout";
import DisplayLayout from "@/components/management/antrian_display/display/DisplayLayout";
import ManagementBedComponents from "@/components/management/bed/components/ManagementBedComponents";
import ManagemenetBedLayout from "@/components/management/bed/ManagementBedLayout";
import ProfileRekamMedisLayout from "@/components/management/profile_rekam_medis/ProfileRekamMedisLayout";
import Loket from "@/components/master/antrian_loket/Loket";
import TipeAntrian from "@/components/master/antrian_loket/TipeAntrian";
import Asuransi from "@/components/master/asuransi/Asuransi";
import Agama from "@/components/master/attribut/Agama";
import Bank from "@/components/master/attribut/Bank";
import GolonganDarah from "@/components/master/attribut/GolonganDarah";
import Pekerjaan from "@/components/master/attribut/Pekerjaan";
import PenanggungJawab from "@/components/master/attribut/PenanggungJawab";
import Pendidikan from "@/components/master/attribut/Pendidikan";
import SukuBangsa from "@/components/master/attribut/SukuBangsa";
import Bed from "@/components/master/bed/Bed";
import JadwalDokter from "@/components/master/dokter/JadwalDokter/JadwalDokter";
import Kas from "@/components/master/kas/Kas";
import JenisRawat from "@/components/master/layanan/JenisRawat";
import Layanan from "@/components/master/layanan/Layanan";
import RuangLayanan from "@/components/master/layanan/RuangLayanan";
import MasterJenisHarga from "@/components/master/master_jenis_harga/MasterJenisHarga";
import Poliklinik from "@/components/master/poliklinik/Poliklinik";
import PoliklinikSpesialis from "@/components/master/poliklinik/PoliklinikSpesialis";
import KelasKunjungan from "@/components/master/registrasi/KelasKunjungan";
import TipeRegistrasi from "@/components/master/registrasi/TipeRegistrasi";
import Spesialis from "@/components/master/spesialis/Spesialis";
import TextDisplayKunjungan from "@/components/master/text_display/TextDisplayKunjungan";
import TextDisplayLoket from "@/components/master/text_display/TextDisplayLoket";
import BookingAntrianKunjunganLayout from "@/components/registrasi/booking_antrian_kunjungan/BookingAntrianKunjunganLayout";
import KunjunganIgdLayout from "@/components/registrasi/kunjungan_igd/KunjunganIgdLayout";
import KunjunganRajalLayout from "@/components/registrasi/kunjungan_rajal/KunjunganRajalLayout";
import KunjunganRanapLayout from "@/components/registrasi/kunjungan_ranap/KunjunganRanapLayout";
import DataJaminanLayout from "@/components/ws_bridging/monitoring/data_jaminan/DataJaminanLayout";
import DataPelayananLayout from "@/components/ws_bridging/monitoring/data_pelayanan/DataPelayananLayout";
import DataKlaimLayout from "@/components/ws_bridging/monitoring/DataKlaimLayout";
import DataKunjunganLayout from "@/components/ws_bridging/monitoring/DataKunjunganLayout";
import DataBPJSLayout from "@/components/ws_bridging/peserta/data_bpjs/DataBPJSLayout";
import DataNIKLayout from "@/components/ws_bridging/peserta/data_nik/DataNIKLayout";
import CariSepRencanaKontrolLayout from "@/components/ws_bridging/rencana_kontrol/cari_sep/CariSepLayout";
import DataDokterLayout from "@/components/ws_bridging/rencana_kontrol/data_dokter/DataDokterLayout";
import KeluarRsLayout from "@/components/ws_bridging/rujukan/keluar_rs/KeluarRsLayout";
import MultiRecordPcareLayout from "@/components/ws_bridging/rujukan/multi_record-pcare/MultiRecordPcareLayout";
import SaranaLayout from "@/components/ws_bridging/rujukan/sarana/SaranaLayout";
import SepLayout from "@/components/ws_bridging/sep/SepLayout";
import { create } from "zustand";

const useMenusStore = create((set, get) => ({
  menu: [],
  selectedMenu: null,
  isFetched: false,

  fetchMenu: async () => {
    if (get().isFetched) return get().menu;

    const menuRes = await loginListMenu();

    function mapMenu(items) {
      return items.map((item) => {
        let componentRef;

        switch (item.code) {
          case "EXC_DASH":
            componentRef = DashboardLayout;
            break;
          case "REG_RI":
            componentRef = KunjunganRanapLayout;
            break;
          case "REG_RJ":
            componentRef = KunjunganRajalLayout;
            break;
          case "REG_IGD":
            componentRef = KunjunganIgdLayout;
            break;
          case "REG_BA":
            componentRef = BookingAntrianKunjunganLayout;
            break;
          case "ANT_LOC":
            componentRef = LoketCall;
            break;
          case "MS_SPS":
            componentRef = Spesialis;
            break;
          case "MS_ASR":
            componentRef = Asuransi;
            break;
          case "MS_BED":
            componentRef = Bed;
            break;
          case "MS_KAS":
            componentRef = Kas;
            break;
          case "MS_TXT_TDK":
            componentRef = TextDisplayKunjungan;
            break;
          case "MS_TXT_TDL":
            componentRef = TextDisplayLoket;
            break;
          case "MS_RGS_TR":
            componentRef = TipeRegistrasi;
            break;
          case "MS_RGS_KK":
            componentRef = KelasKunjungan;
            break;
          case "MS_PLK_PL":
            componentRef = Poliklinik;
            break;
          case "MS_PLK_PLS":
            componentRef = PoliklinikSpesialis;
            break;
          case "MS_LY_LY":
            componentRef = Layanan;
            break;
          case "MS_LY_RL":
            componentRef = RuangLayanan;
            break;
          case "MS_LY_JR":
            componentRef = JenisRawat;
            break;
          case "WMS_PBF_MS_JHG":
            componentRef = MasterJenisHarga;
            break;
          case "MS_DKT_JDD":
            componentRef = JadwalDokter;
            break;
          case "MS_AL_TA":
            componentRef = TipeAntrian;
            break;
          case "MS_AL_LKT":
            componentRef = Loket;
            break;
          case "MS_ATR_AGM":
            componentRef = Agama;
            break;
          case "MS_ATR_BNK":
            componentRef = Bank;
            break;
          case "MS_ATR_GD":
            componentRef = GolonganDarah;
            break;
          case "MS_ATR_PD":
            componentRef = Pendidikan;
            break;
          case "MS_ATR_SB":
            componentRef = SukuBangsa;
            break;
          case "MS_ATR_GCN":
            componentRef = PenanggungJawab;
            break;
          case "MS_ATR_PK":
            componentRef = Pekerjaan;
            break;
          case "WS_RKN_DKT":
            componentRef = DataDokterLayout;
            break;
          case "WS_RKN_SEP":
            componentRef = CariSepRencanaKontrolLayout;
            break;
          case "WS_SEP_SEP":
            componentRef = SepLayout;
            break;
          case "WS_MTR_KNJ":
            componentRef = DataKunjunganLayout;
            break;
          case "WS_MTR_KLM":
            componentRef = DataKlaimLayout;
            break;
          case "WS_MTR_PLN":
            componentRef = DataPelayananLayout;
            break;
          case "WS_MTR_JMN":
            componentRef = DataJaminanLayout;
            break;
          case "WS_PST_BPJS":
            componentRef = DataBPJSLayout;
            break;
          case "WS_PST_NIK":
            componentRef = DataNIKLayout;
            break;
          case "WS_RJK_RMR":
            componentRef = MultiRecordPcareLayout;
            break;
          case "WS_RJK_SRN":
            componentRef = SaranaLayout;
            break;
          case "WS_RJK_KRS":
            componentRef = KeluarRsLayout;
            break;
          case "MM_PRM":
            componentRef = ProfileRekamMedisLayout;
            break;
          case "MM_BED":
            componentRef = ManagemenetBedLayout;
            break;
          case "MM_ANT_DSP":
            componentRef = DisplayLayout;
            break;

          default:
            componentRef = <div>Coming Soon</div>;
        }

        return {
          key: item.code,
          title: item.name,
          icon: item.icon,
          componentRef,
          children: item.sub ? mapMenu(item.sub) : [],
        };
      });
    }

    const menuData = mapMenu(menuRes.data);
    set({ menu: menuData, isFetched: true });
    return menuData;
  },

  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));

export default useMenusStore;
