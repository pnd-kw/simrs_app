import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { useRouter } from "next/navigation";
import useDialog from "@/hooks/ui/use-dialog";
import DialogLogout from "./DialogLogout";

const NavBarContent = () => {
  const menuRef = useRef(null);
  const { open } = useSidebar();
  const { open: openDialog, close } = useDialog();
  const [isOpenMenuProfile, setIsOpenMenuProfile] = useState(false);
  const router = useRouter();

  const { user, logout } = useAuthStore();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    if (!user) return;

    const roles = user.roles.flatMap((item) => item.nama_role);
    setUserRoles(roles);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpenMenuProfile(false);
      }
    };

    if (isOpenMenuProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenMenuProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toastWithProgress({
        title: "Sukses",
        description: "Berhasil keluar dari aplikasi.",
        duration: 3000,
        type: "success",
      });
      close();
      router.push("/login");
    } catch (error) {
      console.error("Logout error", error);
      toastWithProgress({
        title: "Error",
        description: "Gagal keluar dari aplikasi.",
        duration: 3000,
        type: "error",
      });
    }
  };

  return (
    <div
      className="flex h-full items-center justify-end transition-all duration-300"
      style={{
        left: open ? "14rem" : "3rem",
        width: open ? "calc(100% - 14rem)" : "calc(100% -  3rem)",
      }}
    >
      <div className="flex w-[25vw] justify-end">
        <div className="flex items-center justify-evenly">
          <div className="flex flex-col">
            <div className="text-xs font-semibold">{user?.name}</div>
            <div className="flex space-x-1 justify-end">
              <span className="uppercase" style={{ fontSize: 9 }}>{userRoles?.map((item) => item)}</span>
            </div>
          </div>
          <div>
            <Button
              type="button"
              variant="transparent"
              onClick={() => setIsOpenMenuProfile((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 scale-[1.5]"
                viewBox="0 0 24 24"
              >
                <defs>
                  <linearGradient
                    id="profileGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#3776A1", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#003A6B", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <g fill="url(#profileGradient)">
                  <path d="M12 7.5a1.75 1.75 0 1 0 0 3.5a1.75 1.75 0 0 0 0-3.5" />
                  <path d="M12 1.75a2.63 2.63 0 0 0-1.32.355l-6.61 3.8l-.002.002A2.65 2.65 0 0 0 2.75 8.198v7.603a2.64 2.64 0 0 0 1.318 2.292l.003.002l2.186 1.257C6.492 15.847 9.3 14.11 12 14.11s5.508 1.737 5.743 5.242l2.186-1.257l.003-.002a2.65 2.65 0 0 0 1.318-2.291V8.199a2.65 2.65 0 0 0-1.318-2.292l-6.61-3.8l-.002-.002A2.63 2.63 0 0 0 12 1.75m-3.25 7.5a3.25 3.25 0 1 1 6.5 0a3.25 3.25 0 0 1-6.5 0" />
                  <path d="m16.256 20.207l-.005-.669C16.117 16.93 14.114 15.61 12 15.61s-4.117 1.32-4.251 3.928c0 .019-.003.248-.005.669l2.935 1.687h.002a2.63 2.63 0 0 0 2.639 0h.001z" />
                </g>
              </svg>
            </Button>
          </div>
        </div>
        {isOpenMenuProfile && (
          <div
            ref={menuRef}
            className="absolute z-[2] min-w-[12vw] min-h-[4vh] bg-white rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.2)] p-1 mt-9 mr-1"
          >
            <div className="flex flex-col w-full h-full items-start space-y-1">
              <Button
                type="button"
                variant="transparent"
                onClick={() => {}}
                className="w-full justify-start rounded-sm hover:bg-gradient-to-b from-primary1 to-primary2 hover:text-white text-stone-600 text-xs text-left"
              >
                <Icon icon="duo-icons:app" className="size-5" />
                Pindah aplikasi
              </Button>
              <Button
                type="button"
                variant="transparent"
                onClick={() =>
                  openDialog({
                    minWidth: "min-w-[30vw]",
                    contentTitle: "Logout",
                    headerColor: "bg-red1",
                    component: DialogLogout,
                    props: {
                      dialogImage: "/assets/exclamation-red-icon.svg",
                      onLogout: handleLogout,
                    },
                  })
                }
                className="w-full justify-start rounded-sm hover:bg-gradient-to-b from-primary1 to-primary2 hover:text-white text-stone-600 text-xs text-left"
              >
                <Icon icon="uil:signout" className="size-5" />
                Keluar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBarContent;
