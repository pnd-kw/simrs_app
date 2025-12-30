import { create } from "zustand";

const useDialogStore = create((set) => ({
  isOpen: false,
  minWidth: "min-w-[75vw]",
  title: "",
  description: "",
  headerColor: "bg-[#0C5535]",
  contentTitle: "",
  content: null,
  header: true,

  openDialog: ({
    minWidth,
    title,
    description,
    headerColor,
    contentTitle,
    content,
    header,
  }) =>
    set({
      isOpen: true,
      minWidth,
      title,
      description,
      headerColor,
      contentTitle,
      content,
      header,
    }),

  closeDialog: () =>
    set({
      isOpen: false,
      minWidth: "min-w-[75vw]",
      title: "",
      description: "",
      headerColor: "bg-[#0C5535]",
      contentTitle: "",
      content: null,
      header: true,
    }),
}));

export default useDialogStore;
