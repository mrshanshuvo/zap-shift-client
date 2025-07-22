import ParcelStatusSummary from "./StatsDashboards/ParcelStatusSummary";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Parcel Delivery Overview</h2>
      <ParcelStatusSummary />
    </div>
  );
};

export default AdminDashboard;
