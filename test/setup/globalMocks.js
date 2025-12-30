// Mock semua hooks eksternal di satu tempat

// =============================
// Mock BroadcastChannel
// =============================
class MockBroadcastChannel {
  constructor(name) {
    this.name = name;
    this.onmessage = null;
  }

  postMessage(message) {}

  close() {}

  addEventListener() {}

  removeEventListener() {}
}

global.BroadcastChannel = MockBroadcastChannel;

jest.mock("@/hooks/fetch/master_data/use-fetch-asuransi", () => ({
  useFetchAsuransi: jest.fn(() => ({ data: [], isLoading: false })),
}));

jest.mock("@/hooks/fetch/master_data/use-fetch-doctor", () => ({
  useFetchDoctor: jest.fn(() => ({ data: [], isLoading: false })),
}));

jest.mock("@/hooks/fetch/master_data/use-fetch-jenis-layanan", () => ({
  useFetchJenisLayanan: jest.fn(() => ({ data: [], isLoading: false })),
}));
jest.mock("@/hooks/fetch/master_data/use-fetch-perusahaan-asuransi", () => ({
  useFetchPerusahaanAsuransi: jest.fn(() => ({ data: [], isLoading: false })),
}));
jest.mock("@/hooks/fetch/master_data/use-fetch-poliklinik", () => ({
  useFetchPoliklinik: jest.fn(() => ({ data: [], isLoading: false })),
}));
jest.mock("@/hooks/fetch/master_data/use-fetch-schedule-doctor", () => ({
  useFetchScheduleDoctor: jest.fn(() => ({ data: [], isLoading: false })),
}));
jest.mock("@/hooks/fetch/use-fetch-params", () => ({
  useFetchParams: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    isSuccess: false,
  })),
}));
jest.mock("@/hooks/fetch/use-fetch-query", () => ({
  useFetchQuery: jest.fn(() => ({
    data: { items: [], meta: { last_page: 1, total: 0 } },
    isLoading: false,
    isFetching: false,
  })),
}));
jest.mock("@/hooks/fetch/use-prefetch-master-data", () => ({
  usePrefetchMasterData: jest.fn(() => ({
    masterData: jest.fn(async () => {
      return Promise.resolve();
    }),
  })),
}));
jest.mock("@/hooks/mutation/use-create", () => ({
  useCreate: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    isPending: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    data: undefined,
    error: null,
    reset: jest.fn(),
    status: "idle",
  })),
}));
jest.mock("@/hooks/mutation/use-delete", () => ({
  useDelete: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    isPending: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    data: undefined,
    error: null,
    reset: jest.fn(),
    status: "idle",
  })),
}));
jest.mock("@/hooks/mutation/use-update", () => ({
  useUpdate: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    isPending: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    data: undefined,
    error: null,
    reset: jest.fn(),
    status: "idle",
  })),
}));
jest.mock("@/hooks/store/use-delete-target", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getTargetId: jest.fn(),
    setId: jest.fn(),
    clearId: jest.fn(),
  })),
}));
jest.mock("@/hooks/store/use-no-kontrol", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    noKontrol: undefined,
    setNoKontrol: jest.fn(),
    clearNoKontrol: jest.fn(),
  })),
}));
jest.mock("@/hooks/store/use-no-rujukan", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    noRujukan: undefined,
    setNoRujukan: jest.fn(),
    clearNoRujukan: jest.fn(),
  })),
}));
jest.mock("@/hooks/store/use-reg", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    regId: undefined,
    nama: undefined,
    doctorId: undefined,
    noAsuransi: undefined,
    setDataReg: jest.fn(),
  })),
}));
jest.mock("@/hooks/ui/use-dialog", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    open: jest.fn(),
    close: jest.fn(),
  })),
}));
jest.mock("@/hooks/utility/use-filter-and-pagination", () => ({
  useFilterAndPagination: jest.fn(() => ({
    total: undefined,
    data: [],
  })),
}));
jest.mock("@/hooks/utility/useDownloadPdf", () => ({
  useDownloadPdf: jest.fn(() => ({
    downloadPdf: jest.fn().mockResolvedValue(undefined),
  })),
}));
