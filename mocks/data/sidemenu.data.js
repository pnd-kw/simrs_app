export const mockSidemenuResponse = {
  message: "Sukses",
  data: [
    {
      id: 1111,
      code: "EXC",
      icon: "bxs:briefcase",
      parent_code: "",
      name: "EXECUTIVE",
      is_function: false,
      sub: [
        {
          id: 1112,
          code: "EXC_DASH",
          icon: "",
          parent_code: "EXC",
          name: "DASHBOARD",
          is_function: false,
          sub: [],
        },
      ],
    },
    {
      id: 999,
      code: "REG",
      icon: "fas fa-hospital-user",
      parent_code: "",
      name: "REGISTRASI",
      is_function: false,
      sub: [
        {
          id: 997,
          code: "REG_RJ",
          icon: null,
          parent_code: "REG",
          name: "Kunjungan Rawat Jalan",
          is_function: false,
          sub: [],
        },
        {
          id: 996,
          code: "REG_IGD",
          icon: null,
          parent_code: "REG",
          name: "Kunjungan IGD",
          is_function: false,
          sub: [],
        },
        {
          id: 995,
          code: "REG_BA",
          icon: null,
          parent_code: "REG",
          name: "Booking Antrian Kunjungan",
          is_function: false,
          sub: [],
        },
      ],
    },
  ],
};

