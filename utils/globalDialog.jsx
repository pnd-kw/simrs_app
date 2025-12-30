"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import useDialogStore from "@/stores/useDialogStore";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const GlobalDialog = () => {
  const {
    isOpen,
    closeDialog,
    minWidth,
    title,
    description,
    headerColor,
    contentTitle,
    content,
    header,
  } = useDialogStore();

  const headerStyle = `flex items-center pl-10 ${headerColor} w-full h-[6vh] text-white font-semibold`;

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className={`${minWidth} max-h-[90vh] rounded-xs overflow-y-auto`}>
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden>
          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden>
        <div className={header ? headerStyle : ""}>{contentTitle}</div>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalDialog;
