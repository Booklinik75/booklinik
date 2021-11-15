import DashboardUi from "components/DashboardUi";
import { checkAuth } from "utils/ServerHelpers";

export const getServerSideProps = checkAuth;

const SalesIndex = ({ userProfile, token }) => {
  return (
    <DashboardUi userProfile={userProfile} token={token}>
      <div>
        <p>hi {userProfile.email}</p>
      </div>
    </DashboardUi>
  );
};

export default SalesIndex;
