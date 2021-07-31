import DashboardNavigation from "./DashboardNavigation";
import DashboardSideNav from "./DashboardSideNav";

const DashboardUi = ({ children, isAdmin }) => {
  return (
    <div className="h-screen">
      <DashboardNavigation />

      <div
        className="grid grid-cols-12"
        style={{
          height: "calc(100% - 75px)",
        }}
      >
        <DashboardSideNav isAdmin={isAdmin} />
        <div className="col-span-10 shadow-lg grid grid-cols-6 p-12 gap-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardUi;
