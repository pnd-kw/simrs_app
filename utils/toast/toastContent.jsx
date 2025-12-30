import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ToastContent = ({ t, title, description, duration, type }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const newProgress = Math.max(100 - (elapsed / duration) * 100, 0);
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        toast.dismiss(t.id);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [t.id, duration]);

  return (
    <div className="bg-white dark:bg-neutral-900 border rounded-md shadow pt-2 w-[300px]">
      <div className="flex items-center gap-3 px-2">
        <div className="flex items-center justify-center">
          {type === "success" ? (
            <Icon icon="line-md:check-all" className="text-primary2 text-3xl" />
          ) : (
            <Icon icon="ion:warning-outline" className="text-red1 text-3xl" />
          )}
        </div>
        <div>
          <div className="font-semibold text-sm mb-1 text-gray-800 dark:text-white">
            {title}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </div>
        </div>
      </div>
      <div className="h-1 bg-gray-300 mt-2 rounded overflow-hidden">
        <div
          className={`h-full ${
            type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
          style={{
            width: `${progress}%`,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
};

export default ToastContent;
