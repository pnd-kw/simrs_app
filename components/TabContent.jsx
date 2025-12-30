"use client";

import { Suspense, useMemo } from "react";
import { useTabStore } from "@/stores/useTabStore";
import useMenusStore from "@/stores/useMenusStore";
import { findMenuItemByKey } from "@/utils/sidebar/findMenuItemByKey";
import { useClientValue } from "@/hooks/use-client-value";


const TabContent = () => {
  const activeTabStore = useTabStore((s) => s.activeTab);
  const menuStore = useMenusStore((s) => s.menu);

  // cegah mismatch hydration
  const activeTab = useClientValue(activeTabStore);
  const menu = useClientValue(menuStore);

  const activeSubMenu = useMemo(() => {
    if (!menu?.length || !activeTab) return null;
    return findMenuItemByKey(menu, activeTab);
  }, [menu, activeTab]);

  if (!activeSubMenu?.componentRef)
    return <div className="p-4 text-gray-500">Pilih menu dari sidebar</div>;

  const Component = activeSubMenu.componentRef;

  return (
    <div className="min-h-screen w-full bg-grey2 scrollbar-hide">
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Component />
      </Suspense>
    </div>
  );
};

export default TabContent;
