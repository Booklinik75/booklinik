import DashboardUi from "../../../components/DashboardUi";
import { checkAdmin } from "../../../utils/ServerHelpers";

export const getServerSideProps = checkAdmin;

const AdminIndex = ({ userProfile }) => {
  return (
    <DashboardUi isAdmin={true}>
      <div>
        {console.log(userProfile)}
        <p>hi {userProfile.email}</p>
      </div>
    </DashboardUi>
  );
};

export default AdminIndex;
