import { Icon } from "@iconify/react";
import { useRef, useState } from "react";

const TEXT = {
  id: {
    title: "Keterangan Demo",
    items: [
      "Endpoint pihak ketiga (BPJS) tidak akan berfungsi atau akan menampilkan pesan error karena membutuhkan credential dan data real.",
      "Proses simpan data (POST) tidak menampilkan seluruh data di tabel karena perbedaan struktur request body dan response backend pada sistem asli.",
      "Proses pembaruan data (UPDATE) tidak mengubah seluruh field karena perbedaan struktur data antara payload update dan data yang dikembalikan backend. Untuk pengujian update, silakan ubah nomor asuransi.",
      "Karena adanya integrasi dengan pihak ketiga (BPJS), tidak seluruh fitur dan alur aplikasi dapat berjalan 100% pada mode demo.",
    ],
    toggle: "EN",
  },
  en: {
    title: "Demo Information",
    items: [
      "Third-party endpoints (BPJS) will not work or may show error messages because they require real credentials and production data.",
      "Create (POST) actions will not display complete data in the table due to differences between request payload structure and the actual backend response.",
      "Update actions will not modify all fields because of differences between update payload structure and backend GET response. For testing updates, please modify the insurance number.",
      "Due to third-party integrations (BPJS), not all features and application flows will function 100% in demo mode.",
    ],
    toggle: "ID",
  },
};

export default function DemoNotice() {
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState("id");
  const boxRef = useRef(null);

  const onMouseDown = (e) => {
    const box = boxRef.current;
    if (!box) return;

    const shiftX = e.clientX - box.getBoundingClientRect().left;
    const shiftY = e.clientY - box.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      box.style.left = pageX - shiftX + "px";
      box.style.top = pageY - shiftY + "px";
      box.style.bottom = "auto";
      box.style.right = "auto";
    };

    const onMouseMove = (e) => moveAt(e.pageX, e.pageY);

    document.addEventListener("mousemove", onMouseMove);

    document.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.onmouseup = null;
    };
  };

  if (!open) return null;

  const content = TEXT[lang];

  return (
    <div
      ref={boxRef}
      onMouseDown={onMouseDown}
      className="fixed bottom-4 left-4 z-50 max-w-sm cursor-move rounded-lg border border-yellow1 bg-yellow-50 shadow-lg"
    >
      <div className="flex items-center justify-between gap-2 border-b border-yellow1 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
          <Icon icon="material-symbols:info-outline" width={18} />
          {content.title}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLang(lang === "id" ? "en" : "id");
            }}
            className="rounded bg-yellow1 px-2 py-0.5 text-md font-semibold text-white hover:bg-yellow2"
          >
            {content.toggle}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            className="text-stone-800 hover:text-stone-600"
          >
            <Icon
              icon={
                collapsed
                  ? "material-symbols:expand-more"
                  : "material-symbols:expand-less"
              }
              width={18}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="text-stone-800 hover:text-red-600"
          >
            <Icon icon="material-symbols:close" width={18} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 text-xs text-gray-800">
          <ol className="list-decimal space-y-2 pl-4">
            {content.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
