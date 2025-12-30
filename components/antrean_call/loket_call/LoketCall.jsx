import { useStoreAntreanCall } from "@/api/antrean_call/useStoreAntreanCall";
import usePusher from "@/api/socket/usePusher";
import { ReusableTable } from "@/components/antrean_call/components/reusableTable";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { SelectComponent } from "../components/SelectComponent";

const LoketCall = () => {
  const [selectedJenisAntrean, setSelectedJenisAntrean] = useState("");
  const [selectedLoket, setSelectedLoket] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [dataAntreanMenunggu, setDataAntreanMenunggu] = useState([]);
  const [dataAntreanProses, setDataAntreanProses] = useState([]);
  const [dataAntreanSelesai, setDataAntreanSelesai] = useState([]);
  const [dataAntreanUmum, setDataAntreanUmum] = useState([]);
  const [dataAntreanBpjs, setDataAntreanBpjs] = useState([]);
  const [dataAntreanAsuransi, setDataAntreanAsuransi] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const {
    isLoading,
    error,
    tipeAntrian,
    loketList,
    getTipeAntrianList,
    getLoketList,
    getAntreanList,
    antreanList,
    antreanCall,
    antreanSelesai,
  } = useStoreAntreanCall();
  

  useEffect(() => {
    getTipeAntrianList();
    getLoketList();
  }, []);

  const handleLock = async () => {
    if (!selectedJenisAntrean || !selectedLoket) return;
    if (isLocked) {
      setSelectedRow(null);
      setDataAntreanMenunggu([]);
      setDataAntreanProses([]);
      setDataAntreanSelesai([]);
      setDataAntreanUmum([]);
      setDataAntreanBpjs([]);
      setDataAntreanAsuransi([]);
      setIsLocked(false);
    } else {
      try {
        await getAntreanList(selectedJenisAntrean);
        setIsLocked(true);
      } catch (error) {
        console.error("Data error:", error);
      }
    }
  };

  useEffect(() => {
    if (isLocked && selectedJenisAntrean) {
      getAntreanList(selectedJenisAntrean);
    }
  }, [isLocked, selectedJenisAntrean]);

  const handleCall = async () => {
    try {
      await antreanCall({
        id: selectedRow.id,
        antriantype_code: selectedRow.antriantype,
        loketid: selectedLoket,
      });

      await getAntreanList(selectedJenisAntrean);
    } catch (err) {
      console.error("Gagal memanggil antrean", err);
    }
  };

  const handleSelesai = () => {
    antreanSelesai({
      id: selectedRow.id,
      antriantype_code: selectedRow.antriantype,
    });
  };

  const PusherListener = ({ jenisAntrean }) => {
    usePusher({
      channelName: `data-antrian-pendaftaran-${jenisAntrean.toLowerCase()}`,
      eventName: "data.antrian.pendaftaran.asuransi",
      onEvent: (data) => {
        try {
          const parsedList = typeof data === "string" ? JSON.parse(data) : data;

          setDataAntreanMenunggu(parsedList?.menunggu ?? []);
          setDataAntreanProses(parsedList?.proses ?? []);
          setDataAntreanSelesai(parsedList?.selesai ?? []);
        } catch (error) {
          console.error("Gagal parsing data", error);
        }
      },
    });

    return null;
  };

  const PusherListenerList = () => {
    usePusher({
      channelName: `data-antrian-pendaftaran`,
      eventName: "data.antrian.pendaftaran",
      onEvent: (data) => {
        try {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;

          setDataAntreanUmum(parsed?.a);
          setDataAntreanBpjs(parsed?.b);
          setDataAntreanAsuransi(parsed?.c);
        } catch (error) {
          console.error("Gagal parsing data", error);
        }
      },
    });

    return null;
  };

  const formattedMenunggu = dataAntreanMenunggu?.map((item, i) => ({
    id: item.id,
    antriantype: item.antriantype_code,
    code: `${item.antriantype_code}${item.antrianno}`,
  }));
  const formattedProses = dataAntreanProses?.map((item, i) => ({
    id: item.id,
    antriantype: item.antriantype_code,
    code: `${item.antriantype_code}${item.antrianno}`,
    loket: item.loket || "-",
  }));
  const formattedSelesai = dataAntreanSelesai.map((item, i) => ({
    id: item.id,
    antriantype: item.antriantype_code,
    code: `${item.antriantype_code}${item.antrianno}`,
    loket: item.loket || "-",
  }));
  const formattedListAntreanUmum = dataAntreanUmum?.map((item, i) => ({
    code: `${item.antriantype_code}${item.antrianno}`,
  }));
  const formattedListAntreanBpjs = dataAntreanBpjs?.map((item, i) => ({
    code: `${item.antriantype_code}${item.antrianno}`,
  }));
  const formattedListAntreanAsuransi = dataAntreanAsuransi?.map((item, i) => ({
    code: `${item.antriantype_code}${item.antrianno}`,
  }));

  return (
    <>
      <h2 className="px-2 mb-2 text-lg font-semibold uppercase">Loket Call</h2>
      <div className="grid w-full px-2 space-y-4">
        <div className="w-full min-h-screen bg-white shadow-md rounded-lg p-4 space-y-4 grid grid-cols-4 mb-4">
          <div className="p-2 col-span-3">
            <div className="border rounded p-2 col-span-3">
              <div className="flex flex-row w-full p-2 min-h-[5vw] items-center gap-4">
                <div className="uppercase w-full">
                  <p>jenis antrean</p>
                  <div>
                    <SelectComponent
                      data={tipeAntrian?.data}
                      placeholder="Pilih Asuransi"
                      value={selectedJenisAntrean}
                      onValueChange={setSelectedJenisAntrean}
                      isLoading={isLoading}
                      error={error}
                      disabled={isLocked}
                      valueKey="code"
                      labelKey="name"
                    />
                  </div>
                </div>
                <div className="uppercase w-full">
                  <p>loket</p>
                  <div>
                    <SelectComponent
                      data={loketList?.data}
                      placeholder="Pilih Loket"
                      value={selectedLoket}
                      onValueChange={setSelectedLoket}
                      isLoading={isLoading}
                      error={error}
                      disabled={isLocked}
                      valueKey="id"
                      labelKey="name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 w-full">
              {!isLocked ? (
                <Button
                  className="w-full bg-gradient-to-t from-[#1BBB75] to-[#0C5535] cursor-pointer"
                  onClick={handleLock}
                >
                  <Icon icon="material-symbols:lock" className="w-5 h-5" />
                  Lock
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-t from-red-400 to-red-600 cursor-pointer"
                  onClick={handleLock}
                >
                  <Icon icon="si:unlock-fill" className="w-5 h-5" />
                  Unlock
                </Button>
              )}

              {isLocked && selectedJenisAntrean && (
                <>
                  <PusherListener jenisAntrean={selectedJenisAntrean} />
                  <PusherListenerList />
                </>
              )}
            </div>

            <div className="flex justify-between mt-2 gap-2">
              <ReusableTable
                columns={[{ header: "ANTREAN", accessor: "code" }]}
                title="Antrean"
                data={formattedMenunggu}
                renderAction={(row) => (
                  <Button
                    size="icon"
                    className="bg-yellow-400 hover:bg-yellow-500 rounded w-5 h-5"
                    onClick={() => setSelectedRow(row)}
                  >
                    <Icon icon="token:get" />
                  </Button>
                )}
              />

              <ReusableTable
                columns={[
                  { header: "ANTREAN", accessor: "code" },
                  { header: "LOKET", accessor: "loket" },
                ]}
                title="Proses"
                data={formattedProses}
                headerColor="bg-[#F09F00]"
                renderAction={(row) => (
                  <Button
                    size="icon"
                    className="bg-yellow-400 hover:bg-yellow-500 rounded w-5 h-5"
                    onClick={() => setSelectedRow(row)}
                  >
                    <Icon icon="token:get" />
                  </Button>
                )}
              />

              <ReusableTable
                columns={[
                  { header: "ANTREAN", accessor: "code" },
                  { header: "LOKET", accessor: "loket" },
                ]}
                headerColor="bg-[#009B4C]"
                title="Selesai"
                data={formattedSelesai}
              />
            </div>
          </div>
          <div className="grid">
            <div className="bg-white border rounded shadow-md p-2 m-2 flex flex-col mb-0 pb-0">
              <div className="flex justify-end ">
                <Button
                  onClick={() => handleCall()}
                  className="uppercase bg-gradient-to-t from-[#1BBB75] to-[#0C5535] cursor-pointer"
                >
                  <Icon icon="charm:sound-up" />
                  <p>panggil</p>
                </Button>
              </div>
              <div className="flex justify-center items-center min-h-[18vw] text-green-800 text-9xl font-extrabold">
                {selectedRow?.code || "-"}
              </div>
            </div>
            <div className="p-2 m-2 flex justify-between">
              <Button
                onClick={() => handleCall()}
                className="uppercase bg-gradient-to-t from-[#FACE57] to-[#F09F00] cursor-pointer"
              >
                <Icon icon="mdi:play" />
                <p>proses</p>
              </Button>
              <Button
                onClick={() => handleSelesai()}
                className="uppercase bg-gradient-to-t from-[#FA4144] to-[#BD0C0F] cursor-pointer"
              >
                <Icon icon="material-symbols-light:square-rounded" />
                <p>selesai</p>
              </Button>
            </div>
          </div>
          <div className="grid col-span-4 w-full mb-2">
            <p className="font-bold uppercase items-center flex mx-2">
              daftar menunggu
            </p>
            <div className="flex justify-between gap-2 mx-2">
              {selectedJenisAntrean !== "A" && (
                <ReusableTable
                  columns={[{ header: "ANTREAN", accessor: "code" }]}
                  title="Antrean Umum"
                  data={formattedListAntreanUmum}
                />
              )}
              {selectedJenisAntrean !== "B" && (
                <ReusableTable
                  columns={[{ header: "ANTREAN", accessor: "code" }]}
                  title="Antrean BPJS"
                  data={formattedListAntreanBpjs}
                />
              )}
              {selectedJenisAntrean !== "C" && (
                <ReusableTable
                  columns={[{ header: "ANTREAN", accessor: "code" }]}
                  title="Antrean Asuransi"
                  data={formattedListAntreanAsuransi}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoketCall;
