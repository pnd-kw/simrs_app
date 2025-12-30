import { getStatusJkn } from "@/api/registrasi/statusJkn";
import { useFetchParams } from "@/hooks/fetch/use-fetch-params";
import { DateTime } from "@/utils/dateTime";
import { SkeletonMultiText } from "@/utils/skeletonLoader";
import { JENIS_KUNJUNGAN, STATUS_JKN_LEFT_COLUMN, STATUS_JKN_RIGHT_COLUMN } from "../ConstantsValue";

const StatusJknDialog = ({ idBooking, updatedTime }) => {
  const formattedUpdatedTime = DateTime(updatedTime);

  const { data, isLoading } = useFetchParams({
    queryKey: "status jkn",
    apiFn: getStatusJkn,
    params: idBooking,
  });

  const dataStatusJkn = {
    ...data?.data[0],
    tanggaldibuat: formattedUpdatedTime,
  };

  const isEmpty = !dataStatusJkn || Object.keys(dataStatusJkn).length === 0;

  return (
    <div className="w-full h-full px-4 py-2">
      {isLoading ? (
        <SkeletonMultiText />
      ) : (
        <>
          {isEmpty ? (
            <div className="flex w-full min-h-10 items-center justify-center bg-yellow2 rounded-md">
              Data status JKN tidak ditemukan
            </div>
          ) : (
            <>
              <div
                className={`flex w-full min-h-10 items-center justify-center ${
                  dataStatusJkn?.status === "Belum dilayani"
                    ? "bg-yellow2/60"
                    : "bg-primary3/70"
                } rounded-md mb-4`}
              >
                <span
                  className={`text-lg ${
                    dataStatusJkn?.status === "Belum dilayani"
                      ? "text-yellow1"
                      : "text-primary1"
                  }`}
                >
                  {dataStatusJkn?.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                {[STATUS_JKN_LEFT_COLUMN, STATUS_JKN_RIGHT_COLUMN].map((col, idx) => (
                  <div key={idx}>
                    {col.map((item) => (
                      <div
                        key={item.key}
                        className="grid grid-cols-2 gap-2 bg-grey2 p-2 border border-grey1"
                      >
                        <div className="flex justify-between gap-2">
                          <span className="text-sm">{item.value}</span>
                          <span className="text-sm">:</span>
                        </div>
                        <div className="flex justify-start">
                          <span className="text-sm">
                            {(() => {
                              if (item.key === "estimasidilayani") {
                                return new Date(
                                  dataStatusJkn?.estimasidilayani
                                ).toLocaleString("id-ID", {
                                  timeZone: "Asia/Jakarta",
                                });
                              } else if (item.key === "jeniskunjungan") {
                                const jenisKunjunganLabel =
                                  JENIS_KUNJUNGAN.find(
                                    (j) =>
                                      j.value === dataStatusJkn?.jeniskunjungan
                                  )?.value || "-";
                                return jenisKunjunganLabel;
                              } else {
                                return dataStatusJkn?.[item.key];
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StatusJknDialog;
