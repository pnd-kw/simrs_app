import useDialogStore from "@/stores/useDialogStore";

const useDialog = () => {
  const openDialog = useDialogStore.getState().openDialog;
  const close = useDialogStore.getState().closeDialog;

  const open = ({
    minWidth = "min-w-[75vw]",
    title = "",
    description = "",
    headerColor = "bg-primary1",
    contentTitle = "",
    component: Component,
    props = {},
    header = true,
  }) => {
    openDialog({
      minWidth,
      title,
      description,
      headerColor,
      contentTitle,
      content: <Component {...props} />,
      header,
    });
  };

  return { open, close };
};

export default useDialog;
