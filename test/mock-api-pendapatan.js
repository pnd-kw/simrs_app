export const generateMockDataPendapatan = () => {
    const startDate = new Date('2023-06-01');
    const endDate = new Date('2023-06-30');
    const mockData = [];

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        mockData.push({
            hari: date.toISOString().split('T')[0],
            pendapatan_harian: Math.floor(Math.random() * 100000000) + 1000000000,
            target_harian: 0,
            realisasi: Math.random() * 1999999,
            rata_rata_harian: 88000000
        });
    }

    return {
        status: 200,
        message: "Success",
        body: mockData,
    };
};