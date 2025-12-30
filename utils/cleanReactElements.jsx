const cleanReactElements = (obj) => {
  const result = {};

  for (const key in obj) {
    const value = obj[key];

    const isReactElement =
      value?.$$typeof?.toString() === "Symbol(react.element)" ||
      value?.$$typeof?.toString()?.includes("react");

    if (!isReactElement) {
      result[key] = value;
    }
  }

  return result;
};

export default cleanReactElements;
