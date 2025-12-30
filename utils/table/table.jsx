import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Date, DateTime } from "../dateTime";
import Pagination from "./pagination";
import RowsPerPageSelector from "./rowsPerPageSelector";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { parseISO } from "date-fns";

function formatHeader(key) {
  return key.replace(/_/g, " ").toUpperCase();
}

function getDateFieldType(key) {
  if (/time/i.test(key)) return "datetime";
  if (/tanggal|created_at|updated_at|created_date|inserted_date/i.test(key))
    return "date";
  return null;
}

function isDateField(key) {
  return getDateFieldType(key) !== null;
}

function getComparator(order, orderBy) {
  return (a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue == null && bValue != null) return 1;
    if (aValue != null && bValue == null) return -1;
    if (aValue == null && bValue == null) return 0;

    if (isDateField(orderBy)) {
      const dateA = parseISO(String(aValue));
      const dateB = parseISO(String(bValue));
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return order === "desc"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      }
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "desc" ? bValue - aValue : aValue - bValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (aStr < bStr) return order === "desc" ? 1 : -1;
    if (aStr > bStr) return order === "desc" ? -1 : 1;
    return 0;
  };
}

export function Table({
  data = [],
  sort = true,
  defaultSortBy = "",
  pin = true,
  defaultPinned = { column: "", position: "left" },
  page = 1,
  perPage = 10,
  total = 0,
  listIconButton = [
    {
      name: "edit",
      value: false,
      show: () => true,
      icon: null,
      variant: "transAmberText",
      onClick: () => {},
    },
  ],
  customWidths = {},
  totalPage = 1,
  onPageChange,
  onRowsPerPageChange,
  customBooleanRender = {},
  border = "",
  header = [],
  hiddenColumns = [],
  tableHeadTextSize = "text-sm",
  rowCondition,
  rowColor = "",
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(defaultSortBy);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [pinnedColumn, setPinnedColumn] = useState([defaultPinned]);
  const tableContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const headers = data?.length > 0 ? Object.keys(data?.[0]) : header;
  const isEvenNumber = (num) => num % 2 === 0;
  const splitIndex = Math.floor(headers.length / 2);
  const leftColumn = headers.slice(0, splitIndex);

  useEffect(() => {
    const handleMouseUpGlobal = () => setIsDragging(false);
    document.addEventListener("mouseup", handleMouseUpGlobal);
    return () => {
      document.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, []);

  const visibleHeaders = headers.filter((key) => !hiddenColumns.includes(key));

  const visibleData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return [...data].sort(getComparator(order, orderBy));
  }, [data, order, orderBy]);

  const activeIconButtons = useMemo(
    () => listIconButton.filter((btn) => btn.value === true),
    [listIconButton]
  );

  function getActionColMinWidth(activeIconButtons = []) {
    const length = activeIconButtons.length;

    const widths = {
      7: "min-w-[16rem]",
      6: "min-w-[14rem]",
      5: "min-w-[12rem]",
      4: "min-w-[10rem]",
      3: "min-w-[8rem]",
      2: "min-w-[6rem]",
      1: "min-w-[4.5rem]",
    };

    return widths[length] || "min-w-[4rem]";
  }

  const togglePinColumn = useCallback(
    (column) => {
      setPinnedColumn((prev) =>
        prev.length > 0 && prev[0].column === column
          ? []
          : [
              {
                column,
                position: leftColumn.includes(column) ? "left" : "right",
              },
            ]
      );
    },
    [leftColumn]
  );

  const handleSortColumn = useCallback(
    (column) => {
      if (!column) return;
      setOrder((prevOrder) =>
        orderBy === column && prevOrder === "asc" ? "desc" : "asc"
      );
      setOrderBy(column);
    },
    [orderBy]
  );

  const handleMouseDown = (e) => {
    const selection = window.getSelection();
    if (selection && selection.type === "Range") return;

    const target = e.target;
    const isText =
      target.nodeType === Node.TEXT_NODE ||
      target.closest("span, p, strong, em, a, input, textarea, button");
    if (isText) return;

    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div
        ref={tableContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        className={`overflow-x-auto max-h-[84vh] relative ${
          isDragging ? "cursor-grabbing select-none" : ""
        }`}
      >
        <table>
          <thead>
            <tr className="min-h-[2rem] h-[4rem] px-2 py-2">
              <th
                className={`bg-white ${tableHeadTextSize} text-stone-900 ${border} ${
                  border ? "border-stone-300" : ""
                } sticky top-0 px-2 py-2`}
              >
                <span className="font-normal">{formatHeader("no")}</span>
              </th>
              {listIconButton.some((btn) => btn.value === true) ? (
                <th
                  className={`bg-white sticky top-0 px-2 py-2 ${border} ${
                    border ? "border-stone-300" : ""
                  }
                    ${getActionColMinWidth(activeIconButtons)}`}
                >
                  <span
                    className={`flex items-center justify-center text-stone-900 font-normal ${tableHeadTextSize}`}
                  >
                    {formatHeader("act")}
                  </span>
                </th>
              ) : null}

              {visibleHeaders.map((key) => {
                const pinned = pinnedColumn.find((col) => col.column === key);
                let pinnedClass = `bg-stone-100 ${tableHeadTextSize} text-stone-900 sticky ${border} ${
                  border ? "border-stone-300" : ""
                } top-0 pr-10 font-normal px-2 py-2`;

                if (pinned?.position === "left") {
                  pinnedClass += " left-0 z-7";
                } else if (pinned?.position === "right") {
                  pinnedClass += " right-0 z-7";
                }
                return (
                  <th
                    key={key}
                    className={
                      pinned
                        ? pinnedClass
                        : `${tableHeadTextSize} bg-white text-stone-900 ${border} ${
                            border ? "border-stone-300" : ""
                          } ${
                            customWidths[key] || ""
                          } sticky top-0 pr-10 font-normal px-2 py-2`
                    }
                    onMouseEnter={() => setHoveredColumn(key)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{formatHeader(key)}</span>
                      {hoveredColumn === key && (
                        <div className="flex gap-0 absolute right-0 top-1/2 -translate-y-1/2">
                          {pin && (
                            <Button
                              variant="transparent"
                              className="p-2 cursor-pointer hover:text-stone-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePinColumn(key);
                              }}
                            >
                              <Icon icon="mdi:pin" size={6} />
                            </Button>
                          )}
                          {sort &&
                            (orderBy === key && order === "asc" ? (
                              <Button
                                variant="transparent"
                                className="p-2 cursor-pointer hover:text-stone-500"
                                onClick={() => handleSortColumn(key)}
                              >
                                <Icon icon="formkit:arrowup" size={6} />
                              </Button>
                            ) : (
                              <Button
                                variant="transparent"
                                size="icon"
                                className="p-2 cursor-pointer hover:text-stone-500"
                                onClick={() => handleSortColumn(key)}
                              >
                                <Icon icon="formkit:arrowdown" size={6} />
                              </Button>
                            ))}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {!data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    headers.length +
                    1 +
                    (listIconButton.some((btn) => btn.value === true) ? 1 : 0)
                  }
                  className="text-center py-8 text-stone-900"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              visibleData.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`px-2 ${
                      rowCondition && rowCondition(item)
                        ? rowColor
                        : isEvenNumber(index)
                        ? "bg-stone-100"
                        : ""
                    }`}
                  >
                    <td
                      className={`text-xs text-center ${border} ${
                        border ? "border-stone-300" : ""
                      } text-stone-800 whitespace-normal 
                  break-words max-w-[10rem]`}
                    >
                      {page * perPage + index + 1}
                    </td>
                    {listIconButton.some((btn) => btn.value === true) ? (
                      <td
                        className={`whitespace-normal break-words ${border} ${
                          border ? "border-stone-300" : ""
                        }
                    max-w-[10rem] px-2`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {listIconButton.map((btn) =>
                            btn.show?.(item) ?? true ? (
                              <Button
                                key={btn.name}
                                variant={btn.variant}
                                size="xs"
                                disabled={btn.disabled}
                                onClick={() => btn.onClick(item)}
                              >
                                {btn.icon}
                              </Button>
                            ) : null
                          )}
                        </div>
                      </td>
                    ) : null}
                    {visibleHeaders.map((key, index) => {
                      const pinned = pinnedColumn.find(
                        (col) => col.column === key
                      );

                      let pinnedClass = `sticky text-xs text-stone-900 bg-stone-100 ${border} ${
                        border ? "border-stone-300" : ""
                      } 
                    whitespace-normal break-words max-w-[10rem] px-2 text-left ${
                      customWidths[key] || ""
                    }`;
                      if (pinned?.position === "left") {
                        pinnedClass += " left-0 z-6";
                      } else if (pinned?.position === "right") {
                        pinnedClass += " right-0 z-6";
                      }

                      return (
                        <td
                          key={index}
                          className={
                            pinned
                              ? pinnedClass
                              : `text-xs text-stone-800 whitespace-normal ${border} ${
                                  border ? "border-stone-300" : ""
                                } break-words 
                            max-w-[10rem] px-2 text-left ${
                              customWidths[key] || ""
                            }`
                          }
                        >
                          <div className="select-text p-2">
                            {(() => {
                              const dateType = getDateFieldType(key);
                              if (dateType === "datetime")
                                return DateTime(item[key]);
                              if (dateType === "date") return Date(item[key]);

                              if (
                                typeof item[key] === "boolean" &&
                                customBooleanRender?.[key]
                              ) {
                                return customBooleanRender[key](
                                  item[key],
                                  item
                                );
                              }

                              if (
                                typeof item[key] === "string" ||
                                typeof item[key] === "number" ||
                                React.isValidElement(item[key])
                              ) {
                                return item[key];
                              }

                              return (
                                <span className="italic text-gray-400"></span>
                              );
                            })()}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="flex py-2 justify-between">
          <RowsPerPageSelector
            value={perPage}
            onChange={(newVal) => {
              onRowsPerPageChange?.(newVal);
            }}
            total={total}
            options={[10, 20, 50, 100]}
          />
          <Pagination
            page={page + 1}
            totalPages={totalPage}
            onPageChange={(p) => {
              onPageChange?.(p);
            }}
          />
        </div>
      )}
    </>
  );
}
