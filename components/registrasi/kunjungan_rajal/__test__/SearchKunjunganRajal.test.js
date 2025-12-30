jest.mock("@/hooks/kunjungan_rawat_jalan/use-rajal-rs", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import useRajalRs from "@/hooks/kunjungan_rawat_jalan/use-rajal-rs";
import SearchKunjunganRajal from "../components/SearchKunjunganRajal";
import mockResponse from "../__fixtures__/rajal-response.json";
import { waitFor } from "@testing-library/react";
import { renderWithQueryClient } from "@/test/setup/testUtils";

describe("SearchKunjunganRajal", () => {
  let mockState;
  let mockFunctions;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFunctions = {
      setRajalRsData: jest.fn(),
      setIsSuccessSubmitRajalRs: jest.fn(),
    };

    mockState = {
      isSuccessSubmitRajalRs: false,
    };

    useFetchQuery.mockReturnValue({
      data: { items: mockResponse.data, meta: { last_page: 1, total: 1 } },
      isLoading: false,
      isFetching: false,
    });

    useRajalRs.mockImplementation(() => ({ ...mockFunctions, ...mockState }));
  });

  it("memanggil setRajalRsData ketika submit sukses", async () => {
    const { rerender } = renderWithQueryClient(
      <SearchKunjunganRajal />
    );

    mockState.isSuccessSubmitRajalRs = true;

    rerender(<SearchKunjunganRajal />);

    await waitFor(() => {
      expect(mockFunctions.setRajalRsData).toHaveBeenCalledTimes(1);
      expect(mockFunctions.setRajalRsData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockResponse.data[0].id,
        })
      );
      expect(mockFunctions.setIsSuccessSubmitRajalRs).toHaveBeenCalledWith(false);
    });
  });
});
