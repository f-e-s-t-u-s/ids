import React, { useEffect, useState } from 'react';
import axios from 'axios'


function DashboardCard07() {

  const [data, setData] = useState([])

// get anomalies
useEffect(() => {
  const getAnomalies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/anomalies?packets_type=1');
      if (response.status === 200) {
        const data = response.data.message;
        console.log(data);
        const lastData = data.slice(Math.max(data.length - 20, 0)); // Get the last 5 anomalies
        setData(lastData);
      }
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    }
  };

  // Initial fetch
  getAnomalies();

  // Fetch data every 10 seconds
  const intervalId = setInterval(getAnomalies, 10000);

  // Cleanup interval on component unmount
  return () => clearInterval(intervalId);
}, []);

// covert time
const convertTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString()
}


  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100"> Recent Anomalies</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Count</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Timestamp</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">IP src</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">IP dest</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Src Port</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Dst Port</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Transport layer</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Highest Layer</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Packet size</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Anomaly Flag</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
             

             {
              data && data.map((anomaly, index) => {
                return (
                  <tr key={anomaly.id}>
                  <td className="p-2">
                    <div className="flex items-center">
                      {index}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-center">{convertTime(anomaly.time_stamp)}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-emerald-500">{anomaly.ipsrc}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center">{anomaly.ipdst}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">{anomaly.srcport}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">{anomaly.dstport}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">{anomaly.transport_layer}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">{anomaly.highest_layer}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">{anomaly.packet_size}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-center text-sky-500">{anomaly.anomaly_flag === 1 ? "true" : "false"}</div>
                  </td>
                </tr>
                )
              })
             }
             
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
