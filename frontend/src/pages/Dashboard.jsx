import React, { useEffect, useState } from 'react';
import Sidebar from '../partials/Sidebar';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';

function Dashboard() {

  // check if user is logged in
  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      window.location.href = '/login';
    }
  
  },[])

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

       
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

         

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              
                {/* Datepicker built with flatpickr */}
                <Datepicker />
                             
              </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">

              {/* Line chart (threats detected) */}
              <DashboardCard01 />
              {/* Line chart (alerts sent) */}
              <DashboardCard02 />  
              {/* Doughnut chart (Top threats) */}
             <div>
             {/* <DashboardCard06 /> */}
             </div>
              {/* Table (Rcent anomalies) */}
              <DashboardCard07 />
            
            
              {/* Card (Recent Activity) */}
              <DashboardCard12 />
             
              
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;