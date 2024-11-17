import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminDashboard.css";

interface ReportData {
  bTitle?: string;
  userID?: string;
  bAuthor?: string;
  publisher?: string;
  genre?: string;
  edition?: string;
  ISBN?: string;
  MediaID?: string;
  mTitle?: string;
  mAuthor?: string;
  requestedCount?: number;
  copiesAvailable?: number;
  holdID?: string;
  status?: string;
}

const AdminReportsDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reports, setReports] = useState<Record<string, ReportData[]>>({
    availableBookCopies: [],
    allRequestedBooks: [],
    mostRequestedBooks: [],
    allBookHolds: [],
    availableMediaCopies: [],
    allRequestedMedia: [],
    mostRequestedMedia: [],
    allMediaHolds: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookReports" | "mediaReports">("bookReports");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchAdminReports = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
  
    setLoading(true);
    setFetchError(null);
  
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/adminreports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate: startDateISO, endDate: endDateISO }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setFetchError("Failed to load reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleTabClick = (tab: "bookReports" | "mediaReports") => {
    setActiveTab(tab);
  };

  const renderTable = (
    title: string,
    data: ReportData[],
    columns: string[]
  ) => (
    <div className="report-section">
      <h2>{title}</h2>
      <table className="report-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => {
                  const key = col.toLowerCase().replace(/ /g, "");
                  return <td key={key}>{item[key as keyof ReportData] || "N/A"}</td>;
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchAdminReports();
    } else {
      alert("Please select both start and end dates.");
    }
  };

  return (
    <div className="admin-reports-dashboard">
      <h1>Admin Reports Dashboard</h1>

      <div className="tabs">
        <div
          className={`tab ${activeTab === "bookReports" ? "active" : ""}`}
          onClick={() => handleTabClick("bookReports")}
        >
          Book Reports
        </div>
        <div
          className={`tab ${activeTab === "mediaReports" ? "active" : ""}`}
          onClick={() => handleTabClick("mediaReports")}
        >
          Media Reports
        </div>
      </div>

      <div className="filter-section">
        <label>Select Date Range:</label>
        <div className="date-pickers">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
          />
        </div>
        <button className="filter-button" onClick={handleFilter}>
          Filter
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {activeTab === "bookReports" && (
            <>
              {renderTable(
                "Available Book Copies",
                reports.availableBookCopies || [],
                ["bTitle", "bAuthor", "publisher", "genre", "edition", "ISBN"]
              )}
              {renderTable(
                "All Requested Books",
                reports.allRequestedBooks || [],
                ["ISBN", "bTitle", "bAuthor", "publisher", "genre", "edition"]
              )}
              {renderTable(
                "Most Requested Books",
                reports.mostRequestedBooks || [],
                ["ISBN", "bTitle", "bAuthor", "publisher", "genre", "edition"]
              )}
              
              
              {renderTable(
                "All Book Holds",
                reports.allBookHolds || [],
                ["bTitle", "MediaID", "bAuthor", "publisher", "genre", "edition", "holdID", "status"]
              )}
            </>
          )}

          {activeTab === "mediaReports" && (
            <>
              {renderTable(
                "Available Media Copies",
                reports.availableMediaCopies || [],
                ["MediaID", "mTitle", "mAuthor", "publisher", "genre", "edition"]
              )}
              {renderTable(
                "All Requested Media",
                reports.allRequestedMedia || [],
                ["MediaID", "mTitle", "mAuthor", "publisher", "genre", "edition"]
              )}
              {renderTable(
                "Most Requested Media",
                reports.mostRequestedMedia || [],
                ["MediaID", "mTitle", "mAuthor", "publisher", "genre", "edition"]
              )}
              
              {renderTable(
                "All Media Holds",
                reports.allMediaHolds || [],
                ["mTitle", "MediaID", "mAuthor", "publisher", "genre", "edition", "holdID", "status"]
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminReportsDashboard;
