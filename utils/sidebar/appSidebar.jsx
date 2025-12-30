"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import useMenusStore from "@/stores/useMenusStore";
import { useTabStore } from "@/stores/useTabStore";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

const AppSidebar = () => {
  const { open } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});
  const openTab = useTabStore((state) => state.openTab);
  const { menu } = useMenusStore();

  function toNormalCase(str) {
    if (!str) return "";
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function toggleMenu(key) {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function renderMenuItems(items, level = 0) {
    return items.map((item) => {
      const hasChildren =
        Array.isArray(item.children) && item.children.length > 0;
      const isOpen = openMenus[item.key];

      return (
        <div key={item.key} className={`ml-${level > 0 ? 4 : 0}`}>
          <button
            className="flex items-center justify-between w-full py-2 px-2 text-white hover:bg-grey2 hover:text-primary1 rounded-sm"
            onClick={() => {
              if (hasChildren) {
                toggleMenu(item.key);
              } else {
                openTab(item.key);
              }
            }}
          >
            <span
              className="flex h-full items-center gap-4"
              style={{ fontSize: "12px" }}
            >
              {level === 0 && item.icon && (
                <Icon icon={item.icon} fontSize={20} />
              )}
              {toNormalCase(item.title)}
            </span>
            {hasChildren &&
              (isOpen ? (
                <Icon icon="ic:round-expand-less" className="w-4 h-4" />
              ) : (
                <Icon icon="ic:round-expand-more" className="w-4 h-4" />
              ))}
          </button>

          {hasChildren && (
            <div
              className={`overflow-hidden transition-all ${
                isOpen ? "min-h-[8vh]" : "max-h-0"
              }`}
              style={{ transitionDuration: isOpen ? "500ms" : "300ms" }}
            >
              <ul className="ml-8 text-xs border-l border-stone-300">
                {renderMenuItems(item.children, level + 1)}
              </ul>
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <Sidebar collapsible="icon" className={open ? "w-[14rem]" : "w-[3rem]"}>
      <SidebarContent className="bg-gradient-to-b from-primary1 to-primary2 scrollbar-hide">
        <div
          className={`fixed z-40 ${
            open ? "left-[12.8rem] top-5" : "left-[1.8rem] top-5"
          } h-[10vh] items-center justify-end`}
        >
          <SidebarTrigger
            className="cursor-pointer"
            icon={
              open ? (
                <Icon
                  className="text-primary3"
                  icon="material-symbols:keyboard-double-arrow-left-rounded"
                />
              ) : (
                <Icon
                  className="text-primary3"
                  icon="material-symbols:keyboard-double-arrow-right-rounded"
                />
              )
            }
          />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {open ? (
                <div className="flex w-[14rem] h-[14vh] bg-white">
                  <div className="relative w-full h-full">
                    <Image
                      src="/assets/login-card-bg.jpg"
                      alt="sidebar logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex w-[2.6rem] h-[14vh] bg-white">
                  <div className="relative w-full h-full">
                    <div className="flex h-full items-center">
                      <span className="flex py-3 px-1 items-center justify-center text-md font-bold bg-primary1 rounded-full text-white">
                        Logo
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {renderMenuItems(menu)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
