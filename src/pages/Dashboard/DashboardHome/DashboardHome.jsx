import useUserRole from "../../../hooks/useUserRole";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();
  if (!role) {
    return <div>Unauthorized or no role assigned.</div>;
  }

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <progress className="progress progress-primary w-56"></progress>
      </div>
    );
  }
  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "rider") {
    return <RiderDashboard />;
  } else if (role === "user") {
    return <UserDashboard />;
  }
};

export default DashboardHome;
