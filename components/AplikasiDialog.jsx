"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AplikasiDialogMandiri({ aplikasi }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col items-center px-6 pt-8">
          <div className="mb-3 flex justify-center">
            <div className="flex items-center justify-center rounded-full bg-primary1 text-white text-lg font-bold py-3 px-1">Logo</div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Silahkan Pilih Aplikasi
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Silahkan pilih aplikasi sesuai kebutuhan anda
          </p>
        </div>

        {/* List Aplikasi */}
        <div className="divide-y p-4">
          {aplikasi?.map((app, idx) => (
            <button
              key={idx}
              className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition"
              onClick={() => {
                router.push(app.url);
              }}
            >
              <Icon
                icon={app.icon.icon}
                color={app.icon.color}
                width={app.icon.size}
                height={app.icon.size}
              />
              <span className="font-medium">{app.nama_aplikasi}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
