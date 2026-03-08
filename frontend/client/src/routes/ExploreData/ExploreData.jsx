import React, { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import "./ExploreData.css";

function ExploreData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest.get("/dataset"); 
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 const downloadCSV = async () => {
  try {
    const response = await apiRequest.get("/dataset/export", {
      responseType: "blob", 
    });

    const blob = new Blob([response.data], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dataset.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  if (loading) return <div className="data-loading">Loading...</div>;

  return (
    <>
   {!data?<h1>No Data</h1>:<div className="data-container">
      <div className="data-header">
        <h2>My Data</h2>
        <button className="download-btn" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="no-data">No data available</div>
        )}
      </div>
    </div>} 
    </>
   
  );
}

export default ExploreData;