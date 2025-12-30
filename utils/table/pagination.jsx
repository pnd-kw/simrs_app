import { Icon } from "@iconify/react";
import { useMemo } from "react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  renderButton,
}) {
  const pageNumbers = useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page + 1, "...", totalPages];
  }, [page, totalPages]);

  const defaultRenderButton = ({
    key,
    pageNumber,
    isActive,
    onClick,
    disabled,
  }) => (
    <button
      key={key}
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-1 text-xs border-1 border-stone-400 ${
        isActive ? "bg-stone-200 font-bold text-stone-900" : "bg-white"
      } ${disabled ? "text-gray-400 cursor-default" : "hover:bg-stone-200 text-stone-900"}`}
    >
      {pageNumber}
    </button>
  );

  const render = renderButton || defaultRenderButton;

  return (
    <div className="flex items-center">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(Math.max(0, page - 2))}
        disabled={page === 1}
        className="p-1 border disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white hover:bg-stone-200 hover:text-stone-900"
      >
        <Icon icon="material-symbols:arrow-back-ios-rounded"/>
      </button>

      {pageNumbers.map((p, i) =>
        render({
          key: i,
          pageNumber: p,
          isActive: p === page,
          onClick: () => {
            if (typeof p === "number") onPageChange(p - 1);
          },
          disabled: p === "...",
        })
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page))}
        disabled={page === totalPages}
        className="p-1 border disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white hover:bg-stone-200 hover:text-stone-900"
      >
        <Icon icon="material-symbols:arrow-forward-ios-rounded"/>
      </button>
    </div>
  );
}
