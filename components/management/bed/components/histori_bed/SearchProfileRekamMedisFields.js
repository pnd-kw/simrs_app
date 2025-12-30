export const defaultFormValuesSearchHistoriBed = {
  bed_id: "",
};

export const getSearchHistoriBedFields = (listBed) => [
  {
    type: "combobox",
    name: "bed_id",
    label: "Bed",
    placeholder: "Pilih",
    options: listBed,
    layout: "horizontal",
  },
];
