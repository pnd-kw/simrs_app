export const mockJadwalResponse = {
  message: "Sukses",
  data: [
    {
      id: 1,
      doctor_id: {
        id: 1,
        fullname: "dr. Penyakit Dalam",
      },
      initial: "INT",
      layanan_id: {
        id: 4,
        name: "RAWAT JALAN",
      },
      day: "monday",
      time_start: "15:05",
      time_finish: "18:00",
    },
    {
      id: 2,
      doctor_id: {
        id: 1,
        fullname: "dr. Penyakit Dalam",
      },
      initial: "INT",
      layanan_id: {
        id: 4,
        name: "RAWAT JALAN",
      },
      day: "wednesday",
      time_start: "18:00",
      time_finish: "20:00",
    },
    {
      id: 3,
      doctor_id: {
        id: 2,
        fullname: "dr. Bedah",
      },
      initial: "BED",
      layanan_id: {
        id: 4,
        name: "RAWAT JALAN",
      },
      day: "tuesday",
      time_start: "13:05",
      time_finish: "15:00",
    },
    {
      id: 4,
      doctor_id: {
        id: 2,
        fullname: "dr. Bedah",
      },
      initial: "BED",
      layanan_id: {
        id: 4,
        name: "RAWAT JALAN",
      },
      day: "friday",
      time_start: "18:00",
      time_finish: "20:00",
    },
    {
      id: 5,
      doctor_id: {
        id: 3,
        fullname: "dr. Umum",
      },
      initial: "UMU",
      layanan_id: {
        id: 4,
        name: "RAWAT JALAN",
      },
      day: "monday",
      time_start: "08:00",
      time_finish: "20:00",
    },
  ],
};
