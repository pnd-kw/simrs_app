import { useMemo } from "react";

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export const useFilterAndPagination = ({
  data = [],
  filterValue = "",
  objKey = "",
  paginationObj = { page: 1, perPage: 10 },
}) => {
  return useMemo(() => {
    if (!Array.isArray(data)) return { total: 0, data: [] };

    const keyword = filterValue.toLowerCase();

    const filtered = data.filter((item) => {
      if (!objKey || keyword === "") return true;

      const keys = Array.isArray(objKey) ? objKey : [objKey];
      
      return keys.some((key) => {
        const value = String(getNestedValue(item, key) ?? "").toLowerCase();
        return value.includes(keyword);
      });
    });

    const startIndex = (paginationObj.page - 1) * paginationObj.perPage;
    const endIndex = paginationObj.page * paginationObj.perPage;

    const paginated = filtered.slice(startIndex, endIndex);

    return {
      total: filtered.length,
      data: paginated,
    };
  }, [data, filterValue, objKey, paginationObj]);
};
