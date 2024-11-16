import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminDashboard.css";


interface ReportData {
  title?: string;
  user?: string;
  author?: string;
  genre?: string;
  copiesAvailable?: number;
  requestedCount?: number;
}

const AdminReportsDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reports, setReports] = useState<Record<string, ReportData[]>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("bookReports");

  const fetchReports = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin-reports?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`
      );
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchReports();
    } else {
      alert("Please select both start and end dates.");
    }
  };

  const renderTable = (title: string, data: ReportData[], columns: string[]) => (
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
                {columns.map((col) => (
                  <td key={col}>{(item as any)[col.toLowerCase()] || "N/A"}</td>
                ))}
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

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
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
                "Most Requested Books",
                reports.mostRequestedBooks || [],
                ["Title", "User", "Author"]
              )}
              {renderTable(
                "Available Book Copies",
                reports.availableBookCopies || [],
                ["Title", "CopiesAvailable"]
              )}
              {renderTable(
                "All Requested Books",
                reports.allRequestedBooks || [],
                ["Title", "User", "RequestedCount"]
              )}
              {renderTable(
                "All Book Holds",
                reports.allBookHolds || [],
                ["Title", "User"]
              )}
              {renderTable(
                "Most Borrowed Book Genres",
                reports.mostBorrowedBookGenres || [],
                ["Genre", "RequestedCount"]
              )}
            </>
          )}

          {activeTab === "mediaReports" && (
            <>
              {renderTable(
                "Most Requested Media",
                reports.mostRequestedMedia || [],
                ["Title", "User", "Author"]
              )}
              {renderTable(
                "Available Media Copies",
                reports.availableMediaCopies || [],
                ["Title", "CopiesAvailable"]
              )}
              {renderTable(
                "All Requested Media",
                reports.allRequestedMedia || [],
                ["Title", "User", "RequestedCount"]
              )}
              {renderTable(
                "All Media Holds",
                reports.allMediaHolds || [],
                ["Title", "User"]
              )}
              {renderTable(
                "Most Borrowed Media",
                reports.mostBorrowedMedia || [],
                ["Title", "RequestedCount"]
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminReportsDashboard;
