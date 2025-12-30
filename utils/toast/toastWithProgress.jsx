import { toast } from "sonner";
import ToastContent from "./toastContent";

const toastWithProgress = ({
  title,
  description,
  duration = 3000,
  type = "success",
}) => {
  toast.custom((t) => (
    <ToastContent
      t={t}
      title={title}
      description={description}
      duration={duration}
      type={type}
    />
  ));
};

export default toastWithProgress;
