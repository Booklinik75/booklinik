import DashboardUi from "../../../components/DashboardUi";
import { checkAdmin } from "../../../utils/ServerHelpers";

export const getServerSideProps = checkAdmin;

const AdminIndex = ({ userProfile, token }) => {
  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div>
        <p>hi {userProfile.email}</p>
      </div>
    </DashboardUi>
  );
};

export default AdminIndex;
