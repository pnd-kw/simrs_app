"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useTabStore } from "@/stores/useTabStore";
import useMenusStore from "@/stores/useMenusStore";
import { findMenuItemByKey } from "@/utils/sidebar/findMenuItemByKey";
import { Icon } from "@iconify/react";
import { useSidebar } from "./ui/sidebar";

const TabMenu = () => {
  const { openTabs, activeTab, setActiveTab, closeTab } = useTabStore();
  const { menu } = useMenusStore();
  const [isFixed, setIsFixed] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const menuRef = useRef(null);
  const { open } = useSidebar();

  useEffect(() => {
    const onScroll = () => {
      const trigger = window.innerHeight * 0.1;
      const shouldFix = window.scrollY >= trigger;
      setIsFixed(shouldFix);

      if (shouldFix && menuRef.current) {
        setSpacerHeight(menuRef.current.offsetHeight);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {isFixed && <div style={{ height: spacerHeight }} />}
      <div
        ref={menuRef}
        className={clsx(
          "flex flex-wrap items-center gap-2 px-2 pt-2 bg-grey2 min-h-[10vh] transition-all duration-200",
          isFixed ? "fixed top-0 right-0 z-9 shadow-md" : "relative",
          isFixed && (open ? "left-[13.6rem]" : "left-[2.6rem]")
        )}
      >
        {openTabs.map((tabKey) => {
          const tabData = findMenuItemByKey(menu, tabKey);
          if (!tabData) return null;

          const isActive = tabKey === activeTab;

          return (
            <div
              key={tabKey}
              className={`flex items-center pr-2 rounded-md border cursor-pointer transition-colors ${
                isActive
                  ? "bg-gradient-to-b from-primary1 to-primary2 text-white"
                  : "bg-primary2 text-white hover:bg-stone-300"
              }`}
              style={{
                fontSize: 11
              }}
            >
              <span
                onClick={() => setActiveTab(tabKey)}
                className="flex items-center font-semibold min-h-[6vh] px-2"
              >
                {tabData.title}
              </span>
              <button onClick={() => closeTab(tabKey)} className="ml-2">
                <Icon
                  icon="material-symbols:close-rounded"
                  className="bg-stone-100 rounded-full text-primary1 w-4 h-4"
                />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TabMenu;
