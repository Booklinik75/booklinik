import { useState } from "react";
import DashboardNavigation from "./DashboardNavigation";
import DashboardSideNav from "./DashboardSideNav";

const DashboardUi = ({ children, userProfile, token }) => {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const openSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <div className="h-screen">
      <DashboardNavigation setIsSideNavOpen={openSideNav} />
      <div
        className="grid grid-cols-12 relative"
        style={{
          height: "calc(100% - 75px)",
        }}
      >
        <DashboardSideNav
          userProfile={userProfile}
          token={token}
          isSideNavOpen={sideNavOpen}
        />
        <div className="col-span-12 lg:col-span-10 shadow-lg grid grid-cols-6 p-12 gap-10 overflow-x-hidden overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardUi;
