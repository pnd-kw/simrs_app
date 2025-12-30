import { useEffect, useState } from "react";

export function useClientValue(value) {
  const [clientValue, setClientValue] = useState();
  useEffect(() => setClientValue(value), [value]);
  return clientValue;
}
