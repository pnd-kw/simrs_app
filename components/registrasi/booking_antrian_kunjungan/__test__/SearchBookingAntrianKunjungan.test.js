jest.mock("@/hooks/booking_antrian_kunjungan/use-booking-rs", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { renderWithQueryClient } from "@/test/setup/testUtils";
import mockResponse from "../__fixtures__/booking-response.json";
import SearchBookingAntrianKunjungan from "../components/SearchBookingAntrianKunjungan";
import useBookingRs from "@/hooks/booking_antrian_kunjungan/use-booking-rs";
import { waitFor } from "@testing-library/react";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";

describe("SearchBookingAntrianKunjungan", () => {
  let mockState;
  let mockFunctions;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFunctions = {
      setBookingRsData: jest.fn(),
      setIsSuccessSubmitBookingRs: jest.fn(),
    };

    mockState = {
      isSuccessSubmitBookingRs: false,
    };

    useFetchQuery.mockReturnValue({
      data: { items: mockResponse.data, meta: { last_page: 1, total: 1 } },
      isLoading: false,
      isFetching: false,
    });

    useBookingRs.mockImplementation(() => ({ ...mockFunctions, ...mockState }));
  });

  it("memanggil setBookingRsData ketika submit sukses", async () => {
    const { rerender } = renderWithQueryClient(
      <SearchBookingAntrianKunjungan />
    );

    // update state reference
    mockState.isSuccessSubmitBookingRs = true;

    rerender(<SearchBookingAntrianKunjungan />);

    await waitFor(() => {
      expect(mockFunctions.setBookingRsData).toHaveBeenCalledTimes(1);
      expect(mockFunctions.setBookingRsData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockResponse.data[0].id,
        })
      );
      expect(mockFunctions.setIsSuccessSubmitBookingRs).toHaveBeenCalledWith(false);
    });
  });
});
