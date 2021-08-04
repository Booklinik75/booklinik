import DashboardUi from "../../components/DashboardUi";
import { checkAuth } from "../../utils/ServerHelpers";

export const getServerSideProps = checkAuth;

const MedicalProfile = ({ userProfile }) => {
  return (
    <DashboardUi
      isAdmin={userProfile.role === "admin" ? true : false}
    ></DashboardUi>
  );
};

export default MedicalProfile;
