import LoketCall from "@/components/antrean_call/loket_call/LoketCall";
import DashboardLayout from "@/components/executive/dashboard/DashboardLayout";
import Kas from "@/components/master/kas/Kas";
import JenisRawat from "@/components/master/layanan/JenisRawat";
import Layanan from "@/components/master/layanan/Layanan";
import RuangLayanan from "@/components/master/layanan/RuangLayanan";
import KelasKunjungan from "@/components/master/registrasi/KelasKunjungan";
import TipeRegistrasi from "@/components/master/registrasi/TipeRegistrasi";
import Spesialis from "@/components/master/spesialis/Spesialis";
import TextDisplayKunjungan from "@/components/master/text_display/TextDisplayKunjungan";
import TextDisplayLoket from "@/components/master/text_display/TextDisplayLoket";
import MasterJenisHarga from "@/components/master/master_jenis_harga/MasterJenisHarga";
import BookingAntrianKunjunganLayout from "@/components/registrasi/booking_antrian_kunjungan/BookingAntrianKunjunganLayout";
import KunjunganRajalLayout from "@/components/registrasi/kunjungan_rajal/KunjunganRajalLayout";
import { Icon } from "@iconify/react";
import TipeAntrian from "@/components/master/antrian_loket/TipeAntrian";
import Loket from "@/components/master/antrian_loket/Loket";
import Agama from "@/components/master/attribut/Agama";
import Bank from "@/components/master/attribut/Bank";
import GolonganDarah from "@/components/master/attribut/GolonganDarah";
import Pendidikan from "@/components/master/attribut/Pendidikan";
import SukuBangsa from "@/components/master/attribut/SukuBangsa";
import PenanggungJawab from "@/components/master/attribut/PenanggungJawab";
import Pekerjaan from "@/components/master/attribut/Pekerjaan";
import Bed from "@/components/master/bed/Bed";
import Asuransi from "@/components/master/asuransi/Asuransi";
import JadwalDokter from "@/components/master/dokter/JadwalDokter/JadwalDokter";
import Poliklinik from "@/components/master/poliklinik/Poliklinik";
import PoliklinikSpesialis from "@/components/master/poliklinik/PoliklinikSpesialis";
import SepLayout from "@/components/ws_bridging/sep/SepLayout";
import CariSepRencanaKontrolLayout from "@/components/ws_bridging/rencana_kontrol/cari_sep/CariSepLayout";
import MultiRecordPcareLayout from "@/components/ws_bridging/rujukan/multi_record-pcare/MultiRecordPcareLayout";
import SaranaLayout from "@/components/ws_bridging/rujukan/sarana/SaranaLayout";
import DataDokterLayout from "@/components/ws_bridging/rencana_kontrol/data_dokter/DataDokterLayout";
import DataKunjunganLayout from "@/components/ws_bridging/monitoring/DataKunjunganLayout";
import DataKlaimLayout from "@/components/ws_bridging/monitoring/DataKlaimLayout";
import KeluarRsLayout from "@/components/ws_bridging/rujukan/keluar_rs/KeluarRsLayout";
import DataPelayananLayout from "@/components/ws_bridging/monitoring/data_pelayanan/DataPelayananLayout";
import DataJaminanLayout from "@/components/ws_bridging/monitoring/data_jaminan/DataJaminanLayout";
import DataBPJSLayout from "@/components/ws_bridging/peserta/data_bpjs/DataBPJSLayout";
import DataNIKLayout from "@/components/ws_bridging/peserta/data_nik/DataNIKLayout";
import KunjunganIgdLayout from "@/components/registrasi/kunjungan_igd/KunjunganIgdLayout";

export const listMenu = [
  {
    key: "executive",
    title: "Executive",
    icon: <Icon icon="bxs:briefcase" className="w-5 h-5" />,
    children: [
      {
        key: "dashboard",
        title: "Dashboard",
        content: <DashboardLayout />,
      },
      {
        key: "setting dashboard",
        title: "Setting dashboard",
        content: <div>Setting dashboard</div>,
      },
    ],
  },
  {
    key: "registrasi",
    title: "Registrasi",
    icon: <Icon icon="medical-icon:i-registration" className="w-5 h-5" />,
    children: [
      {
        key: "kunjungan rawat inap",
        title: "Kunjungan Rawat Inap",
        content: <div>Kunjungan Rawat Inap</div>,
      },
      {
        key: "kunjungan rawat jalan",
        title: "Kunjungan Rawat Jalan",
        content: <KunjunganRajalLayout />,
      },
      {
        key: "kunjungan igd",
        title: "Kunjungan IGD",
        content: <KunjunganIgdLayout />,
      },
      {
        key: "booking antrian kunjungan",
        title: "Booking Antrian Kunjungan",
        content: <BookingAntrianKunjunganLayout />,
      },
      {
        key: "penggabungan rm",
        title: "Penggabungan RM",
        content: <div>Penggabungan RM</div>,
      },
    ],
  },
  {
    key: "bpjs",
    title: "BPJS",
    icon: <Icon icon="ion:card" className="w-5 h-5" />,
    children: [
      {
        key: "input eklaim",
        title: "Input Eklaim",
        content: <div>Input Eklaim</div>,
      },
      {
        key: "daftar tagihan bpjs",
        title: "Daftar Tagihan BPJS",
        content: <div>Daftar Tagihan BPJS</div>,
      },
      {
        key: "upload manual",
        title: "Upload Manual",
        content: <div>Upload Manual</div>,
      },
      {
        key: "purifikasi",
        title: "Purifikasi",
        content: <div>Purifikasi</div>,
      },
      {
        key: "konfigurasi rekonsil",
        title: "Konfigurasi Rekonsil",
        content: <div>Konfigurasi Rekonsil</div>,
      },
      {
        key: "rekonsiliasi",
        title: "Rekonsiliasi",
        content: <div>Rekonsiliasi</div>,
      },
      {
        key: "rekonsiliasi kronis",
        title: "Rekonsiliasi Kronis",
        children: [
          {
            key: "upload manual kronis",
            title: "Upload Manual Kronis",
            content: <div>Upload Manual Kronis</div>,
          },
          {
            key: "rekonsiliasi kronis sub menu",
            title: "Rekonsiliasi Kronis",
            content: <div>Rekonsiliasi Kronis</div>,
          },
          {
            key: "konfigurasi file rekonsil",
            title: "Konfigurasi File Rekonsil",
            content: <div>Konfigurasi File Rekonsil</div>,
          },
        ],
      },
      {
        key: "rekonsiliasi bpjs",
        title: "Rekonsiliasi BPJS",
        content: <div>Rekonsiliasi BPJS</div>,
      },
      {
        key: "antrean online",
        title: "Antrean Online",
        children: [
          {
            key: "antrean",
            title: "Dashboard",
            content: <div>Dashboard Antrean</div>,
          },
          {
            key: "ref poli fingerprint",
            title: "Ref Poli Fingerprint",
            content: <div>Ref Poli Fingerprint</div>,
          },
          {
            key: "ref pasien fingerprint",
            title: "Ref Pasien Fingerprint",
            content: <div>Ref Pasien Fingerprint</div>,
          },
          {
            key: "list task id",
            title: "List Task Id",
            content: <div>List Task Id</div>,
          },
        ],
      },
      {
        key: "vclaim menu",
        title: "Vclaim Menu",
        children: [
          {
            key: "pengajuan sep",
            title: "Pengajuan SEP",
            content: <div>Pengajuan SEP</div>,
          },
          {
            key: "update tanggal pulang",
            title: "Update Tanggal Pulang",
            content: <div>Update Tanggal Pulang</div>,
          },
          {
            key: "rujukan",
            title: "Rujukan",
            content: <div>Rujukan</div>,
          },
          {
            key: "pembuatan rujuk balik",
            title: "Pembuatan Rujuk Balik",
            content: <div>Pembuatan Rujuk Balik</div>,
          },
          {
            key: "vclaim referensi",
            title: "Vclaim Referensi",
            content: <div>Vcalim Referensi</div>,
          },
          {
            key: "sep",
            title: "SEP",
            content: <div>SEP</div>,
          },
          {
            key: "rujukan khusus",
            title: "Rujukan Khusus",
            content: <div>Rujukan Khusus</div>,
          },
        ],
      },
    ],
  },
  {
    key: "management",
    title: "Management",
    icon: <Icon icon="carbon:id-management" className="w-5 h-5" />,
    children: [
      {
        key: "antrian display",
        title: "Antrian Display",
        children: [
          {
            key: "display",
            title: "Display",
            content: <div>Display</div>,
          },
          {
            key: "queue",
            title: "Queue",
            content: <div>Queue</div>,
          },
        ],
      },
      {
        key: "profile rekam medis",
        title: "Profile Rekam Medis",
        content: <div>Profile Rekam Medis</div>,
      },
      {
        key: "verifikasi booking online",
        title: "Verifikasi Booking Online",
        content: <div>Verifikasi Booking Online</div>,
      },
      {
        key: "bed",
        title: "Bed",
        content: (
          <div>
            <Bed />
          </div>
        ),
      },
    ],
  },
  {
    key: "casemix",
    title: "Casemix",
    icon: <Icon icon="mynaui:letter-c-waves" className="w-5 h-5" />,
    children: [
      {
        key: "ringkasan pasien pulang",
        title: "Ringkasan Pasien Pulang",
        children: [
          {
            key: "rawat jalan",
            title: "Rawat Jalan",
            content: <div>Rawat Jalan</div>,
          },
          {
            key: "rawat inap",
            title: "Rawat Inap",
            content: <div>Rawat Inap</div>,
          },
          {
            key: "igd",
            title: "IGD",
            content: <div>IGD</div>,
          },
          {
            key: "laporan operasi",
            title: "Laporan Operasi",
            content: <div>Laporan Operasi</div>,
          },
          {
            key: "fisioterapi",
            title: "Fisioterapi",
            content: <div>Fisioterapi</div>,
          },
          {
            key: "laporan tindakan",
            title: "Laporan Tindakan",
            content: <div>Laporan Tindakan</div>,
          },
          {
            key: "hemodialisa",
            title: "Hemodialisa",
            content: <div>Hemodialisa</div>,
          },
        ],
      },
      {
        key: "mapping rikjang procedure",
        title: "Mapping Rikjang Procedure",
        content: <div>Mapping Rikjang Procedure</div>,
      },
      {
        key: "request digital sign",
        title: "Request Digital Sign",
        content: <div>Request Digital Sign</div>,
      },
    ],
  },
  {
    key: "antrian call",
    title: "Antrian Call",
    icon: <Icon icon="fluent:people-call-20-filled" className="w-5 h-5" />,
    children: [
      {
        key: "loket call",
        title: "Loket Call",
        content: (
          <div>
            <LoketCall />
          </div>
        ),
      },
      {
        key: "poli call",
        title: "Poli Call",
        content: <div>Poli Call</div>,
      },
    ],
  },
  {
    key: "master",
    title: "Master",
    icon: <Icon icon="icon-park-solid:data" className="w-5 h-5" />,
    children: [
      {
        key: "spesialis",
        title: "Spesialis",
        content: (
          <div>
            <Spesialis />
          </div>
        ),
      },
      {
        key: "bed",
        title: "Bed",
        content: <div>Bed</div>,
      },
      {
        key: "rumah sakit",
        title: "Rumah Sakit",
        content: <div>Rumah Sakit</div>,
      },
      {
        key: "asuransi",
        title: "Asuransi",
        content: (
          <div>
            <Asuransi />
          </div>
        ),
      },
      {
        key: "kas",
        title: "Kas",
        content: (
          <div>
            <Kas />
          </div>
        ),
      },
      {
        key: "text display",
        title: "Text Display",
        children: [
          {
            key: "text display kunjungan",
            title: "Text Display Kunjungan",
            content: (
              <div>
                <TextDisplayKunjungan />
              </div>
            ),
          },
          {
            key: "text display Loket",
            title: "Text Display Loket",
            content: (
              <div>
                <TextDisplayLoket />
              </div>
            ),
          },
        ],
      },
      {
        key: "registrasi master",
        title: "Registrasi",
        children: [
          {
            key: "tipe registrasi",
            title: "Tipe Registrasi",
            content: (
              <div>
                <TipeRegistrasi />
              </div>
            ),
          },
          {
            key: "kelas kunjungan",
            title: "Kelas Kunjungan",
            content: (
              <div>
                <KelasKunjungan />
              </div>
            ),
          },
        ],
      },
      {
        key: "poliklinik",
        title: "Poliklinik",
        children: [
          {
            key: "poliklinik sub menu",
            title: "Poliklinik",
            content: (
              <div>
                <Poliklinik />
              </div>
            ),
          },
          {
            key: "poliklinik spesialis",
            title: "Poliklinik Spesialis",
            content: (
              <div>
                <PoliklinikSpesialis />
              </div>
            ),
          },
        ],
      },
      {
        key: "layanan",
        title: "Layanan",
        children: [
          {
            key: "layanan sub menu",
            title: "Layanan",
            content: (
              <div>
                <Layanan />
              </div>
            ),
          },
          {
            key: "ruang layanan",
            title: "Ruang Layanan",
            content: (
              <div>
                <RuangLayanan />
              </div>
            ),
          },
          {
            key: "jenis layanan",
            title: "Jenis Layanan",
            content: <div>Jenis Layanan</div>,
          },
          {
            key: "jenis rawat",
            title: "Jenis Rawat",
            content: (
              <div>
                <JenisRawat />
              </div>
            ),
          },
        ],
      },
      {
        key: "master jenis harga",
        title: "Master Jenis Harga",
        content: (
          <div>
            <MasterJenisHarga />
          </div>
        ),
      },
      {
        key: "dokter",
        title: "Dokter",
        children: [
          {
            key: "jadwal dokter",
            title: "Jadwal Dokter",
            content: <JadwalDokter />,
          },
          {
            key: "kuota online booking",
            title: "Kuota Online Booking",
            content: <div>Kuota Online Booking</div>,
          },
          {
            key: "perubahan jadwal dokter",
            title: "Perubahan Jadwal Dokter",
            content: <div>Perubahan Jadwal Dokter</div>,
          },
        ],
      },
      {
        key: "antrian loket",
        title: "Antrian Loket",
        children: [
          {
            key: "tipe antrian",
            title: "Tipe Antrian",
            content: (
              <div>
                <TipeAntrian />
              </div>
            ),
          },
          {
            key: "loket",
            title: "Loket",
            content: (
              <div>
                <Loket />
              </div>
            ),
          },
        ],
      },
      {
        key: "movie",
        title: "Movie",
        children: [
          {
            key: "movie list",
            title: "Movie List",
            content: <div>Movie List</div>,
          },
          {
            key: "movie profiling",
            title: "Movie Profiling",
            content: <div>Movie Profiling</div>,
          },
        ],
      },
      {
        key: "kategori setting",
        title: "Kategori Setting",
        content: <div>Kategori Setting</div>,
      },
      {
        key: "atribut",
        title: "Atribut",
        children: [
          {
            key: "agama",
            title: "Agama",
            content: (
              <div>
                <Agama />
              </div>
            ),
          },
          {
            key: "kualifikasi dokter",
            title: "Kualifikasi Dokter",
            content: <div>Kualifikasi Dokter</div>,
          },
          {
            key: "bank",
            title: "Bank",
            content: (
              <div>
                <Bank />
              </div>
            ),
          },
          {
            key: "golongan darah",
            title: "Golongan Darah",
            content: (
              <div>
                <GolonganDarah />
              </div>
            ),
          },
          {
            key: "pendidikan",
            title: "Pendidikan",
            content: (
              <div>
                <Pendidikan />
              </div>
            ),
          },
          {
            key: "suku bangsa",
            title: "Suku Bangsa",
            content: (
              <div>
                <SukuBangsa />
              </div>
            ),
          },
          {
            key: "penanggung jawab",
            title: "Penanggung Jawab",
            content: (
              <div>
                <PenanggungJawab />
              </div>
            ),
          },
          {
            key: "pekerjaan",
            title: "Pekerjaan",
            content: (
              <div>
                <Pekerjaan />
              </div>
            ),
          },
        ],
      },
      {
        key: "master tag",
        title: "Master Tag",
        content: <div>Master Tag</div>,
      },
    ],
  },
  {
    key: "penjualan",
    title: "Penjualan",
    icon: <Icon icon="carbon:sales-ops" className="w-5 h-5" />,
    children: [
      {
        key: "transaksi",
        title: "Transaksi",
        children: [
          {
            key: "input penjualan",
            title: "Input Penjualan",
            content: <div>Input Penjualan</div>,
          },
          {
            key: "daftar penjualan",
            title: "Daftar Penjualan",
            content: <div>Daftar Penjualan</div>,
          },
          {
            key: "service tutup penjualan",
            title: "Service Tutup Penjualan",
            content: <div>Service Tutup Penjualan</div>,
          },
        ],
      },
      {
        key: "master penjualan",
        title: "Master",
        children: [
          {
            key: "master fasilitas",
            title: "Master Fasilitas",
            content: <div>Master Fasilitas</div>,
          },
          {
            key: "master jasa",
            title: "Master Jasa",
            content: <div>Master Jasa</div>,
          },
          {
            key: "master rikjang",
            title: "Master Rikjang",
            content: <div>Master Rikjang</div>,
          },
          {
            key: "master paket",
            title: "Master Paket",
            content: <div>Master Paket</div>,
          },
          {
            key: "master template",
            title: "Master Template",
            content: <div>Master Template</div>,
          },
          {
            key: "master harga tarif",
            title: "Master Harga Tarif",
            content: <div>Master Harga Tarif</div>,
          },
          {
            key: "master penjualan otomatis",
            title: "Master Penjualan Otomatis",
            content: <div>Master Penjualan Otomatis</div>,
          },
        ],
      },
      {
        key: "jenis",
        title: "Jenis",
        children: [
          {
            key: "jenis fasilitas",
            title: "Jenis Fasilitas",
            content: <div>Jenis Fasilitas</div>,
          },
          {
            key: "jenis jasa",
            title: "Jenis Jasa",
            content: <div>Jenis Jasa</div>,
          },
          {
            key: "jenis rikjang",
            title: "Jenis Rikjang",
            content: <div>Jenis Rikjang</div>,
          },
          {
            key: "jenis paket",
            title: "Jenis Paket",
            content: <div>Jenis Paket</div>,
          },
        ],
      },
      {
        key: "laporan",
        title: "Laporan",
        children: [
          {
            key: "laporan penjualan",
            title: "Laporan Penjualan",
            content: <div>Laporan Penjualan</div>,
          },
          {
            key: "laporan jasa medis",
            title: "Laporan Jasa Medis",
            content: <div>Laporan Jasa Medis</div>,
          },
        ],
      },
    ],
  },
  {
    key: "hr dokter",
    title: "HR-Dokter",
    icon: <Icon icon="fontisto:doctor" className="w-5 h-5" />,
    children: [
      {
        key: "kas bon dokter",
        title: "Kas Bon Dokter",
        content: <div>Kas Bon Dokter</div>,
      },
      {
        key: "jasa medis",
        title: "Jasa Medis",
        children: [
          {
            key: "rekap jasmed",
            title: "Rekap Jasmed",
            content: <div>Rekap Jasmed</div>,
          },
          {
            key: "detail jasa medis",
            title: "Detail Jasa Media",
            content: <div>Detail Jasa Medis</div>,
          },
          {
            key: "master rincian jasmed",
            title: "Master Rincian Jasmed",
            content: <div>Master Rincian Jasmed</div>,
          },
        ],
      },
    ],
  },
  {
    key: "tagihan",
    title: "Tagihan",
    icon: <Icon icon="hugeicons:invoice" className="w-5 h-5" />,
    children: [
      {
        key: "saldo",
        title: "Saldo",
        content: <div>Saldo</div>,
      },
      {
        key: "input tagihan",
        title: "Input Tagihan",
        content: <div>Input Tagihan</div>,
      },
      {
        key: "daftar tagihan",
        title: "Daftar Tagihan",
        content: <div>Daftar Tagihan</div>,
      },
      {
        key: "daftar pembayaran tagihan",
        title: "Daftar Pembayaran Tagihan",
        content: <div>Daftar Pembayaran Tagihan</div>,
      },
      {
        key: "tagihan otomatis",
        title: "Tagihan Otomatis",
        content: <div>Tagihan Otomatis</div>,
      },
    ],
  },
  {
    key: "rekap tagihan",
    title: "Rekap Tagihan",
    icon: <Icon icon="stash:invoice" className="w-5 h-5" />,
    children: [
      {
        key: "input rekap tagihan",
        title: "Input Rekap Tagihan",
        content: <div>Input Rekap Tagihan</div>,
      },
      {
        key: "daftar rekap tagihan",
        title: "Daftar Rekap Tagihan",
        content: <div>Daftar Rekap Tagihan</div>,
      },
      {
        key: "daftar pembayaran rekap",
        title: "Daftar Pembayaran Rekap",
        content: <div>Daftar Pembayaran Rekap</div>,
      },
      {
        key: "agging piutang rekap",
        title: "Agging Piutang Rekap",
        content: <div>Agging Piutang Rekap</div>,
      },
    ],
  },
  {
    key: "request barang",
    title: "Request Barang",
    icon: <Icon icon="mdi:package-variant-closed-plus" className="w-5 h-5" />,
    children: [
      {
        key: "input request barang",
        title: "Input Request Barang",
        content: <div>Input Request Barang</div>,
      },
      {
        key: "daftar request barang",
        title: "Daftar Request Barang",
        content: <div>Daftar Request Barang</div>,
      },
    ],
  },
  {
    key: "pembelian barang",
    title: "Pembelian Barang",
    icon: <Icon icon="mdi:package-variant-closed-check" className="w-5 h-5" />,
    children: [
      {
        key: "pengajuan request barang",
        title: "Pengajuan Request Barang",
        content: <div>Pengajuan Request Barang</div>,
      },
      {
        key: "daftar pengajuan request barang",
        title: "Daftar Pengajuan Request Barang",
        content: <div>Daftar Pengajuan Request Barang</div>,
      },
    ],
  },
  {
    key: "ws bridging",
    title: "WS Bridging",
    icon: <Icon icon="maki:bridge" className="w-5 h-5" />,
    children: [
      {
        key: "sep",
        title: "SEP",
        children: [
          {
            key: "sep sub menu",
            title: "SEP",
            content: (
              <div>
                <SepLayout />
              </div>
            ),
          },
        ],
      },
      {
        key: "rencana kontrol",
        title: "Rencana Kontrol",
        children: [
          {
            key: "data dokter",
            title: "Data Dokter",
            content: (
              <div>
                <DataDokterLayout />
              </div>
            ),
          },
          {
            key: "cari sep",
            title: "Cari SEP",
            content: (
              <div>
                <CariSepRencanaKontrolLayout />
              </div>
            ),
          },
        ],
      },
      {
        key: "monitoring",
        title: "Monitoring",
        children: [
          {
            key: "data kunjungan",
            title: "Data Kunjungan",
            content: (
              <div>
                <DataKunjunganLayout />
              </div>
            ),
          },
          {
            key: "data klaim",
            title: "Data Klaim",
            content: (
              <div>
                <DataKlaimLayout />
              </div>
            ),
          },
          {
            key: "data pelayanan",
            title: "Data Pelayanan",
            content: (
              <div>
                <DataPelayananLayout />
              </div>
            ),
          },
          {
            key: "data jaminan",
            title: "Data Jaminan",
            content: (
              <div>
                <DataJaminanLayout />
              </div>
            ),
          },
        ],
      },
      {
        key: "peserta",
        title: "Peserta",
        children: [
          {
            key: "data bpjs",
            title: "Data BPJS",
            content: (
              <div>
                <DataBPJSLayout />
              </div>
            ),
          },
          {
            key: "data nik",
            title: "Data Nik",
            content: (
              <div>
                <DataNIKLayout />
              </div>
            ),
          },
        ],
      },
      {
        key: "rujukan",
        title: "Rujukan",
        children: [
          {
            key: "multi record - pcare",
            title: "Multi Record - Pcare",
            content: (
              <div>
                <MultiRecordPcareLayout />
              </div>
            ),
          },
          {
            key: "sarana",
            title: "Sarana",
            content: (
              <div>
                <SaranaLayout />
              </div>
            ),
          },
          {
            key: "keluar rs",
            title: "Keluar Rs",
            content: (
              <div>
                <KeluarRsLayout />
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    key: "warehouse",
    title: "Warehouse",
    icon: <Icon icon="lucide:warehouse" className="w-5 h-5" />,
    children: [
      {
        key: "master wms",
        title: "Master Wms",
        children: [
          {
            key: "master supplier",
            title: "Master Supplier",
            content: <div>Master Supplier</div>,
          },
          {
            key: "master unit",
            title: "Master Unit",
            content: <div>Master Unit</div>,
          },
          {
            key: "master gudang utama",
            title: "Master Gudang Utama",
            content: <div>Master Gudang Utamar</div>,
          },
          {
            key: "master satuan",
            title: "Master Satuan",
            content: <div>Master Satuan</div>,
          },
          {
            key: "master produsen",
            title: "Master Produsen",
            content: <div>Master Produsen</div>,
          },
          {
            key: "master tarif cbg",
            title: "Master Tarif Cbg",
            content: <div>Master Tarif Cbg</div>,
          },
        ],
      },
      {
        key: "perbekalan farmasi",
        title: "Perbekalan Farmasi",
        children: [
          {
            key: "master perbekalan farmasi",
            title: "Master",
            children: [
              {
                key: "master gudang farmasi",
                title: "Master Gudang",
                content: <div>Master Gudang</div>,
              },
              {
                key: "master kelas terapi farmasi",
                title: "Master Kelas Terapi",
                content: <div>Master Kelas Terapi</div>,
              },
              {
                key: "master janis obat farmasi",
                title: "Master Jenis Obat",
                content: <div>Master Jenis Obat</div>,
              },
              {
                key: "master golongan obat farmasi",
                title: "Master Golongan Obat",
                content: <div>Master Golongan Obat</div>,
              },
              {
                key: "master barang farmasi",
                title: "Master Barang",
                content: <div>Master Barang</div>,
              },
              {
                key: "master formula farmasi",
                title: "Master Formula",
                content: <div>Master Formula</div>,
              },
              {
                key: "master formula harga farmasi",
                title: "Master Formula Harga",
                content: <div>Master Formula Harga</div>,
              },
            ],
          },
          {
            key: "transaksi gudang utama perbekalan farmasi",
            title: "Transaksi Gudang Utama",
            children: [
              {
                key: "po perbekalan farmasi",
                title: "PO",
                content: <div>PO</div>,
              },
              {
                key: "daftar po perbekalan farmasi",
                title: "Daftar PO",
                content: <div>Daftar PO</div>,
              },
              {
                key: "pembelian transaksi gudang utama perbekalan farmasi",
                title: "Pembelian",
                content: <div>Pembelian</div>,
              },
              {
                key: "service tutup pembelian transaksi gudang utama perbekalan farmasi",
                title: "Service Tutup Pembelian",
                content: <div>Service Tutup Pembelian</div>,
              },
              {
                key: "pembayaran transaksi gudang utama perbekalan farmasi",
                title: "Pembayaran",
                content: <div>Pembayaran</div>,
              },
              {
                key: "daftar pembelian transaksi gudang utama perbekalan farmasi",
                title: "Daftar Pembelian",
                content: <div>Daftar Pembelian</div>,
              },
              {
                key: "daftar pembayaran transaksi gudang utama perbekalan farmasi",
                title: "Daftar Pembayaran",
                content: <div>Daftar Pembayaran</div>,
              },
              {
                key: "retur pembelian transaksi gudang utama perbekalan farmasi",
                title: "Retur Pembelian",
                content: <div>Retur Pembelian</div>,
              },
            ],
          },
          {
            key: "inventory control management perbekalan farmasi",
            title: "Inventory Control Management",
            children: [
              {
                key: "inventory control perbekalan farmasi",
                title: "Inventory Control",
                content: <div>Inventory Control</div>,
              },
              {
                key: "mutasi item perbekalan farmasi",
                title: "Mutasi Item",
                content: <div>Mutasi Item</div>,
              },
              {
                key: "input request mutasi perbekalan farmasi",
                title: "Input Request Mutasi",
                content: <div>Input Request Mutasi</div>,
              },
              {
                key: "receive request mutasi perbekalan farmasi",
                title: "Receive Request Mutasi",
                content: <div>Receive Request Mutasi</div>,
              },
              {
                key: "daftar mutasi item perbekalan farmasi",
                title: "Daftar Mutasi Item",
                content: <div>Daftar Mutasi Item</div>,
              },
              {
                key: "stock opname perbekalan farmasi",
                title: "Stock Opname",
                content: <div>Stock Opname</div>,
              },
              {
                key: "daftar stock opname perbekalan farmasi",
                title: "Daftar Stock Opname",
                content: <div>Daftar Stock Opname</div>,
              },
              {
                key: "input adjustment stock perbekalan farmasi",
                title: "Input Adjustment Stock",
                content: <div>Input Adjustment Stock</div>,
              },
              {
                key: "daftar adjustment stock perbekalan farmasi",
                title: "Daftar Adjustment Stock",
                content: <div>Daftar Adjustment Stock</div>,
              },
              {
                key: "input adjustment unit perbekalan farmasi",
                title: "Input Adjustment Unit",
                content: <div>Input Adjustment Stock</div>,
              },
              {
                key: "daftar adjustment unit perbekalan farmasi",
                title: "Daftar Adjustment Unit",
                content: <div>Daftar Adjustment Stock</div>,
              },
              {
                key: "forecasting perbekalan farmasi",
                title: "Forecasting",
                content: <div>Forecasting</div>,
              },
            ],
          },
          {
            key: "laporan perbekalan farmasi",
            title: "Laporan Perbekalan Farmasi",
            children: [
              {
                key: "laporan kartu stock",
                title: "Laporan Kartu Stock",
                content: <div>Laporan Kartu Stock</div>,
              },
              {
                key: "laporan history stock",
                title: "Laporan History Stock",
                content: <div>Laporan History Stock</div>,
              },
              {
                key: "laporan pembelian",
                title: "Laporan Pembelian",
                content: <div>Laporan Pembelian</div>,
              },
              {
                key: "laporan sipnap",
                title: "Laporan Sipnap",
                content: <div>Laporan Sipnap</div>,
              },
            ],
          },
        ],
      },
      {
        key: "logistik",
        title: "Logistik",
        children: [
          {
            key: "master logistik",
            title: "Master",
            children: [
              {
                key: "master gudang logistik",
                title: "Master Gudang",
                content: <div>Master Gudang</div>,
              },
              {
                key: "master barang logistik",
                title: "Master Barang",
                content: <div>Master Barang</div>,
              },
              {
                key: "status pengeluaran barang",
                title: "Status Pengeluaran Barang",
                content: <div>Status Pengeluaran Barang</div>,
              },
              {
                key: "master golongan barang",
                title: "Master Golongan Barang",
                content: <div>Master Golongan Barang</div>,
              },
            ],
          },
          {
            key: "transaksi gudang utama logistik",
            title: "Transaksi Gudang Utama",
            children: [
              {
                key: "po logistik",
                title: "PO",
                content: <div>PO</div>,
              },
              {
                key: "daftar po logistik",
                title: "Daftar PO",
                content: <div>Daftar PO</div>,
              },
              {
                key: "pembelian logistik",
                title: "Pembelian",
                content: <div>Pembelian</div>,
              },
              {
                key: "daftar pembelian logistik",
                title: "Daftar Pembelian",
                content: <div>Daftar Pembelian</div>,
              },
              {
                key: "pembayaran logistik",
                title: "Pembayaran",
                content: <div>Pembayaran</div>,
              },
              {
                key: "daftar pembayaran logistik",
                title: "Daftar Pembayaran",
                content: <div>Daftar Pembayaran</div>,
              },
              {
                key: "service tutup pembelian logistik",
                title: "Service Tutup Pembelian",
                content: <div>Service Tutup Pembelian</div>,
              },
              {
                key: "retur pembelian logistik",
                title: "Retur Pembelian",
                content: <div>Retur Pembelian</div>,
              },
            ],
          },
          {
            key: "inventory control management logistik",
            title: "Inventory Control Management",
            children: [
              {
                key: "inventory control logistik",
                title: "Inventory Control",
                content: <div>Inventory Control</div>,
              },
              {
                key: "mutasi item logistik",
                title: "Mutasi Item",
                content: <div>Mutasi Item</div>,
              },
              {
                key: "input request mutasi logistik",
                title: "Input Request Mutasi",
                content: <div>Input Request Mutasi</div>,
              },
              {
                key: "receive request mutasi logistik",
                title: "Receive Request Mutasi",
                content: <div>Receive Request Mutasi</div>,
              },
              {
                key: "daftar mutasi item logistik",
                title: "Daftar Mutasi",
                content: <div>Daftar Mutasi</div>,
              },
              {
                key: "input pemakaian logistik",
                title: "Input Pemakaian",
                content: <div>Input Pemakaian</div>,
              },
              {
                key: "daftar pemakaian logistik",
                title: "Daftar Pemakaian",
                content: <div>Daftar Pemakaian</div>,
              },
              {
                key: "input adjustment logistik",
                title: "Input Adjustment",
                content: <div>Input Adjustment</div>,
              },
              {
                key: "daftar adjustment logistik",
                title: "Daftar Adjustment",
                content: <div>Daftar Adjustment</div>,
              },
              {
                key: "stock opname logistik",
                title: "Stock Opname",
                content: <div>Stock Opname</div>,
              },
              {
                key: "daftar stock opname",
                title: "Daftar Stock Opname",
                content: <div>Daftar Stock Opname</div>,
              },
            ],
          },
          {
            key: "laporan logistik",
            title: "Laporan Logistik",
            children: [
              {
                key: "laporan history stok",
                title: "Laporan History Stok",
                content: <div>Laporan History Stok</div>,
              },
              {
                key: "laporan kartu stok",
                title: "Laporan Kartu Stok",
                content: <div>Laporan Kartu Stok</div>,
              },
              {
                key: "laporan stok logistik",
                title: "Laporan Stok Logistik",
                content: <div>Laporan Stok Logistik</div>,
              },
            ],
          },
        ],
      },
      {
        key: "fixed asset",
        title: "Fixed Asset",
        children: [
          {
            key: "atribut",
            title: "Atribut",
            children: [
              {
                key: "depreciation method",
                title: "Depreciation Method",
                content: <div>Depreciation Method</div>,
              },
              {
                key: "tipe fiscal",
                title: "Tipe Fiscal",
                content: <div>Tipe Fiscal</div>,
              },
              {
                key: "tipe asset",
                title: "Tipe Asset",
                content: <div>Tipe Asset</div>,
              },
              {
                key: "fase asset",
                title: "Fase Asset",
                content: <div>Fase Asset</div>,
              },
            ],
          },
          {
            key: "master fixed asset",
            title: "Master",
            children: [
              {
                key: "vendor",
                title: "Vendor",
                content: <div>Vendor</div>,
              },
              {
                key: "tipe notifikasi",
                title: "Tipe Notifikasi",
                content: <div>Tipe Notifikasi</div>,
              },
              {
                key: "gudang fixed asset",
                title: "Gudang",
                content: <div>Gudang</div>,
              },
              {
                key: "daftar penyusutan asset",
                title: "Daftar Penyusutan Asset",
                content: <div>Daftar Penyusutan Asset</div>,
              },
              {
                key: "golongan barang",
                title: "Golongan Barang",
                content: <div>Golongan Barang</div>,
              },
            ],
          },
          {
            key: "transaksi fixed asset",
            title: "Transaksi",
            children: [
              {
                key: "input request fixed asset",
                title: "Input Request",
                content: <div>Input Request</div>,
              },
              {
                key: "daftar request fixed asset",
                title: "Daftar Request",
                content: <div>Daftar Request</div>,
              },
              {
                key: "pengajuan fixed asset",
                title: "Pengajuan Fixed Asset",
                content: <div>Pengajuan Fixed Asset</div>,
              },
              {
                key: "daftar pengajuan request",
                title: "Daftar Pengajuan Request",
                content: <div>Daftar Pengajuan Request</div>,
              },
              {
                key: "purchase order",
                title: "Purchase Order",
                content: <div>Purchase Order</div>,
              },
              {
                key: "daftar purchase order",
                title: "Daftar Purchase Order",
                content: <div>Daftar Purchase Order</div>,
              },
              {
                key: "pembelian transaksi fixed asset",
                title: "Pembelian",
                content: <div>Pembelian</div>,
              },
              {
                key: "daftar pembelian transaksi fixed asset",
                title: "Daftar Pembelian",
                content: <div>Daftar Pembelian</div>,
              },
              {
                key: "pembayaran transaksi fixed asset",
                title: "Pembayaran",
                content: <div>Pembayaran</div>,
              },
              {
                key: "daftar pembayaran transaksi fixed asset",
                title: "Daftar Pembayaran",
                content: <div>Daftar Pembayaran</div>,
              },
              {
                key: "input fixed asset",
                title: "Input Fixed Asset",
                content: <div>Input Fixed Asset</div>,
              },
              {
                key: "daftar fixed asset",
                title: "Daftar Fixed Asset",
                content: <div>Daftar Fixed Asset</div>,
              },
              {
                key: "transfer asset",
                title: "Transfer Asset",
                content: <div>Transfer Asset</div>,
              },
              {
                key: "daftar transfer asset",
                title: "Daftar Transfer Asset",
                content: <div>Daftar Transfer Asset</div>,
              },
              {
                key: "daftar keseluruhan transfer",
                title: "Daftar Keseluruhan Transfer",
                content: <div>Daftar Keseluruhan transfer</div>,
              },
              {
                key: "dispose asset",
                title: "Dispose Asset",
                content: <div>Dispose Asset</div>,
              },
              {
                key: "management notifikasi",
                title: "Management Notifikasi",
                content: <div>Management Notifikasi</div>,
              },
              {
                key: "notifikasi asset",
                title: "Notifikasi Asset",
                content: <div>Notifikasi Asset</div>,
              },
              {
                key: "kalibrasi",
                title: "Kalibarasi",
                content: <div>Kalibrasi</div>,
              },
            ],
          },
          {
            key: "maintenance",
            title: "Maintenance",
            children: [
              {
                key: "help desk",
                title: "Help Desk",
                content: <div>Help Desk</div>,
              },
              {
                key: "daftar help desk",
                title: "Daftar Help Desk",
                content: <div>Daftar Help Desk</div>,
              },
              {
                key: "input maintenance",
                title: "Input Maintenance",
                content: <div>Input Maintenance</div>,
              },
              {
                key: "daftar maintenance",
                title: "Dafter Maintenance",
                content: <div>Daftar Maintenance</div>,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "mobile management",
    title: "Mobile Management",
    icon: <Icon icon="mdi:computer" className="w-5 h-5" />,
    children: [
      {
        key: "faq",
        title: "Faq",
        content: <div>Faq</div>,
      },
      {
        key: "slider",
        title: "Slider",
        content: <div>Slider</div>,
      },
      {
        key: "users",
        title: "Users",
        content: <div>Users</div>,
      },
      {
        key: "telekonsul",
        title: "Telekonsul",
        children: [
          {
            key: "input paket telekonsul",
            children: "Input Paket Telekonsul",
            content: <div>Input Paket Telekonsul</div>,
          },
          {
            key: "daftar paket telekonsul",
            children: "Daftar Paket Telekonsul",
            content: <div>Daftar Paket Telekonsul</div>,
          },
          {
            key: "tarif telekonsul",
            children: "Tarif Telekonsul",
            content: <div>Input Paket Telekonsul</div>,
          },
          {
            key: "jadwal telekonsul",
            children: "Jadwal Telekonsul",
            content: <div>Jadwal Telekonsul</div>,
          },
          {
            key: "pembelian telekonsul",
            children: "Pembelian Telekonsul",
            content: <div>Pembelian Telekonsul</div>,
          },
          {
            key: "pembayaran telekonsul",
            children: "Pembayaran Telekonsul",
            content: <div>Pembayaran Telekonsul</div>,
          },
        ],
      },
    ],
  },
  {
    key: "akutansi",
    title: "Akutansi",
    icon: <Icon icon="fa6-solid:file-invoice-dollar" className="w-5 h-5" />,
    children: [
      {
        key: "master akutansi",
        title: "Master Akutansi",
        children: [
          {
            key: "tipe penerima",
            children: "Tipe Penerima",
            content: <div>Tipe Penerima</div>,
          },
          {
            key: "coa",
            children: "Coa",
            content: <div>Coa</div>,
          },
          {
            key: "tipe gi",
            children: "Tipe GI",
            content: <div>Tipe GI</div>,
          },
          {
            key: "target pendapatan",
            children: "Target Pendapatan",
            content: <div>Target Pendapatan</div>,
          },
          {
            key: "setting neraca",
            children: "Setting Neraca",
            content: <div>Setting Neraca</div>,
          },
          {
            key: "saldo awal",
            children: "Saldo Awal",
            content: <div>Saldo Awal</div>,
          },
          {
            key: "periode",
            children: "Periode",
            content: <div>Periode</div>,
          },
          {
            key: "setting laba rugi",
            children: "Setting Laba Rugi",
            content: <div>Setting Laba Rugi</div>,
          },
          {
            key: "setting cash flow",
            children: "Setting Cash Flow",
            content: <div>Setting Cash Flow</div>,
          },
        ],
      },
      {
        key: "transaksi akutansi",
        title: "Transaksi Akutansi",
        children: [
          {
            key: "jurnal",
            children: "Jurnal",
            content: <div>Jurnal</div>,
          },
          {
            key: "daftar jurnal",
            children: "Daftar Jurnal",
            content: <div>Daftar Jurnal</div>,
          },
          {
            key: "buku besar",
            children: "Buku Besar",
            content: <div>Buku Besar</div>,
          },
          {
            key: "neraca saldo",
            children: "Neraca Saldo",
            content: <div>Neraca Saldo</div>,
          },
          {
            key: "neraca saldo detail",
            children: "Neraca Saldo Detail",
            content: <div>Neraca Saldo Detail</div>,
          },
          {
            key: "neraca",
            children: "Neraca",
            content: <div>Neraca</div>,
          },
          {
            key: "laba rugi",
            children: "Laba Rugi",
            content: <div>Laba Rugi</div>,
          },
          {
            key: "synchronize",
            children: "Synchronize",
            content: <div>Synchronize</div>,
          },
          {
            key: "jurnal penutup",
            children: "Jurnal Penutup",
            content: <div>Jurnal Penutup</div>,
          },
        ],
      },
      {
        key: "laporan akutansi",
        title: "Laporan Akutansi",
        children: [
          {
            key: "laporan neraca",
            children: "Laporan Neraca",
            content: <div>Laporan Neraca</div>,
          },
          {
            key: "laporan laba rugi",
            children: "Laporan Laba Rugi",
            content: <div>Laporan Laba Rugi</div>,
          },
          {
            key: "laporan cashflow",
            children: "Laporan Cashflow",
            content: <div>Laporan Cashflow</div>,
          },
          {
            key: "laporan laba rugi v2",
            children: "Laporan Laba Rugi V2",
            content: <div>Laporan Laba Rugi V2</div>,
          },
          {
            key: "laporan neraca v2",
            children: "Laporan Neraca V2",
            content: <div>Laporan Neraca V2</div>,
          },
          {
            key: "laporan rekap neraca",
            children: "Laporan Rekap Neraca",
            content: <div>Laporan Rekap Neraca</div>,
          },
          {
            key: "laporan rekap laba rugi",
            children: "Laporan Rekap Laba Rugi",
            content: <div>Laporan Rekap Laba Rugi</div>,
          },
        ],
      },
    ],
  },
  {
    key: "management akses",
    title: "Management Akses",
    icon: <Icon icon="mdi:user" className="w-5 h-5" />,
    children: [
      {
        key: "role",
        title: "Role",
        content: <div>Role</div>,
      },
      {
        key: "user",
        title: "User",
        content: <div>User</div>,
      },
      {
        key: "tema",
        title: "Tema",
        content: <div>Tema</div>,
      },
      {
        key: "role akses menu",
        title: "Role Akses Menu",
        content: <div>Role Akses Menu</div>,
      },
      {
        key: "menu",
        title: "Menu",
        content: <div>Menu</div>,
      },
      {
        key: "user access",
        title: "User Access",
        content: <div>User Access</div>,
      },
      {
        key: "access",
        title: "Access",
        content: <div>Access</div>,
      },
      {
        key: "verifikasi akses",
        title: "Verifikasi Akses",
        content: <div>Verifikasi Akses</div>,
      },
      {
        key: "setting simrs",
        title: "Setting Simrs",
        content: <div>Setting Simrs</div>,
      },
    ],
  },
  {
    key: "laporan simrs",
    title: "Laporan",
    icon: <Icon icon="lsicon:report-filled" className="w-5 h-5" />,
    children: [
      {
        key: "laporan service",
        title: "Laporan Service",
        content: <div>Laporan Service</div>,
      },
      {
        key: "status service",
        title: "Status Service",
        content: <div>Status Service</div>,
      },
      {
        key: "laporan income",
        title: "Laporan Income",
        content: <div>Laporan Income</div>,
      },
      {
        key: "laporan log bridging",
        title: "Laporan Log Bridging",
        content: <div>Laporan Log Bridging</div>,
      },
      {
        key: "laporan antrian jkn",
        title: "Laporan Antrian Jkn",
        content: <div>Laporan Antrian Jkn</div>,
      },
      {
        key: "laporan jadwal dokter",
        title: "Laporan Jadwal Dokter",
        content: <div>Laporan Jadwal Dokter</div>,
      },
      {
        key: "laporan obat penunjang",
        title: "Laporan Obat Penunjang",
        content: <div>Laporan Obat Penunjang</div>,
      },
      {
        key: "laporan jadwal operasi",
        title: "Laporan Jadwal Operasi",
        content: <div>Laporan Jadwal Operasi</div>,
      },
    ],
  },
  {
    key: "satu sehat",
    title: "Satu Sehat",
    icon: (
      <Icon icon="material-symbols-light:ecg-heart-sharp" className="w-5 h-5" />
    ),
    children: [
      {
        key: "status lokasi",
        title: "Status Lokasi",
        content: <div>Status Lokasi</div>,
      },
      {
        key: "organisasi",
        title: "Organisasi",
        content: <div>Organisasi</div>,
      },
      {
        key: "bundle",
        title: "Bundle",
        content: <div>Bundle</div>,
      },
      {
        key: "encounter",
        title: "Encounter",
        content: <div>Encounter</div>,
      },
      {
        key: "fka",
        title: "Fka",
        content: <div>Fka</div>,
      },
      {
        key: "verifikasi satu sehat",
        title: "Verifikasi Satu Sehat",
        content: <div>Verifikasi Satu Sehat</div>,
      },
    ],
  },
];
