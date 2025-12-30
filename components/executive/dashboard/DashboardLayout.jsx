import Container from "@/components/Container";
import BarChartComponent from "./components/BarChart";
import PieChartComponent from "./components/PieChart";

const asalRegistrasiData = [
  { label: "Booking", value: 2000 },
  { label: "Tanpa Booking", value: 500 },
];

const bookingOnsiteData = [
  { label: "Belum", value: 300 },
  { label: "Cancel", value: 200 },
  { label: "Loket", value: 2598 },
];

const tanpaBookingData = [
  { label: "Loket", value: 2000 },
  { label: "Cancel", value: 75 },
];

const bookingOnlineData = [
  { label: "Loket", value: 2000 },
  { label: "Cancel", value: 100 },
];

const DashboardLayout = () => {
  const topContent = <BarChartComponent />;
  const bottomContent = (
    <>
      <div className="flex w-full items-center justify-center">
        <div className="flex w-[80vw] justify-between p-4 border-b">
          <h2 className="text-2xl font-semibold mb-2">
            Summary Registrasi
            <span className="text-primary2">{" "}1 Juni 2025</span> s/d{" "}
            <span className="text-primary2">{" "}30 Juni 2025</span>{" "}
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-10 p-10 justify-center">
        <PieChartComponent
          dataArray={asalRegistrasiData}
          labelBottom="Asal Registrasi"
          ringColors={["#0C5535", "#1BBB75"]}
        />

        <PieChartComponent
          dataArray={bookingOnsiteData}
          labelBottom="Booking Onsite"
        />

        <PieChartComponent
          dataArray={tanpaBookingData}
          labelBottom="Tanpa Booking"
          ringColors={["#F09F00", "#976A11"]}
        />

        <PieChartComponent
          dataArray={bookingOnlineData}
          labelBottom="Booking Online/Mobile"
          ringColors={["#A34FB4", "#541273"]}
        />
      </div>
    </>
  );

  return <Container topContent={topContent} bottomContent={bottomContent} height={"h-[65vh]"} />;
};

export default DashboardLayout;
