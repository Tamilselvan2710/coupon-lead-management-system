import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
  if (!localStorage.getItem("isAdmin")) {
    nav("/login", { replace: true });
  }

  API.get("/lead")
    .then(res => {
      console.log("DATA:", res.data);
      setData(res.data);
    })

  }, [nav]);

  const revenue = data.reduce(
    (sum, l) => sum + Number(l.final_price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Container */}
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">
          Lead Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Leads" value={data.length} />
          <StatCard title="Total Revenue" value={`₹${revenue}`} />
          <StatCard
            title="Coupons Used"
            value={data.filter(l => l.coupon_code).length}
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Type</th>
                <th>Coupon</th>
                <th>Final Price</th>
              </tr>
            </thead>

            <tbody>
              {data.map((l) => (
                <tr
                  key={l.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{l.name}</td>
                  <td>{l.phone}</td>
                  <td>{l.email}</td>
                  <td>{l.requirement_type}</td>
                  <td>
                    {l.coupon_code ? (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                        {l.coupon_code}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="font-semibold">
                    ₹{l.final_price}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-semibold mt-1">{value}</h2>
    </div>
  );
}