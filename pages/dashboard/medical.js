import DashboardUi from "../../components/DashboardUi";
import { checkAuth } from "../../utils/ServerHelpers";

export const getServerSideProps = checkAuth;

const MedicalProfile = ({ userProfile }) => {
  return <DashboardUi></DashboardUi>;
};

export default MedicalProfile;
