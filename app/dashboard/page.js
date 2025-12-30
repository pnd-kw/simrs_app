"use client";
import NavBarContent from "@/components/NavBarContent";
import TabContent from "@/components/TabContent";
import TabMenu from "@/components/TabMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePrefetchMasterData } from "@/hooks/fetch/use-prefetch-master-data";
import useAuthStore from "@/stores/useAuthStore";
import useMenusStore from "@/stores/useMenusStore";
import DemoNotice from "@/utils/demoNotice";
import AppSidebar from "@/utils/sidebar/appSidebar";
import { useEffect } from "react";

export default function DashboardLayout() {
  const selectedApp = useAuthStore((s) => s.selectedApp);
  const fetchMenu = useMenusStore((s) => s.fetchMenu);
  const { masterData } = usePrefetchMasterData();

  useEffect(() => {
    const load = async () => {
      await fetchMenu();
      await masterData();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApp]);

  return (
    <SidebarProvider>
      <DemoNotice />
      <AppSidebar />
      <div className="flex h-full w-full overflow-y-auto">
        <div className="flex absolute h-[5vh] w-full bg-white shadow-md">
          <NavBarContent />
        </div>
        <div className="flex pt-[5vh] h-full w-full">
          <main className="flex-1 overflow-y-auto bg-white transition-all duration-300">
            <TabMenu />
            <TabContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
