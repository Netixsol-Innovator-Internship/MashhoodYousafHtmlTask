import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Collections from "../components/Collections";

const CollectionsPage = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get(
          "https://ecommerce-back-end-kohl.vercel.app/api/products"
        );
        const usersRes = await axios.get(
          "https://day1-back-end.vercel.app/api/users"
        );

        console.log("response while gettind stats for dashboard", statsRes);
        console.log("response while gettind users for dashboard", usersRes);

        setStats(statsRes.data.data);
        setUsers(usersRes.data.users);

        console.log("stats", stats);
        console.log("users", usersRes.data.users);
      } catch (err) {
        setError("Failed to fetch data");
        console.log(
          "err cathed in statsPAge while getting stats and users",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Collections />
      <div className="p-4 font-sans sm:p-6 md:p-8 max-w-7xl mx-auto">
        <p className="text-1xl md:text-2xl font-bold mb-6 text-center">
          Our Collections
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {/* Users Box + Below Text */}
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded shadow text-center w-full">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold">{users.length}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              This is the total number of users
            </p>
          </div>

          {/* Tasks Box + Below Text */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded shadow text-center w-full">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold">{stats.totalTask || 0}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              All created tasks
            </p>
          </div>

          {/* Completed Tasks */}
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 p-4 rounded shadow text-center w-full">
              <p className="text-sm text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-semibold">
                {stats.completedTasks || 0}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Tasks marked as done
            </p>
          </div>

          {/* Pending Tasks */}
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-4 rounded shadow text-center w-full">
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold">{stats.pendingTask || 0}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Yet to be completed
            </p>
          </div>
        </div>

     
      </div>
    </>
  );
};

export default CollectionsPage;
