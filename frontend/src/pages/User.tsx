import React, { useState } from 'react';
import './User.css'; 
const UserPage: React.FC = () => {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState('books'); // Default to 'books'

  // Function to handle tab click and change active tab
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div className="navbar">
        {/* Library Name */}
        <div className="navbar-section library-name">
          My Library
        </div>
        
        {/* Search Section */}
        <div className="navbar-section search-section">
          <input type="text" className="search-bar" placeholder="Search..." />
          <div className="nav-icons">
            {/* Add settings and profile icons */}
            <span>🔧</span>
            <span>👤</span>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="navbar-section tabs">
          <div 
            className={`tab ${activeTab === 'books' ? 'active' : ''}`} 
            onClick={() => handleTabClick('books')}
          >
            Books
          </div>
          <div 
            className={`tab ${activeTab === 'media' ? 'active' : ''}`} 
            onClick={() => handleTabClick('media')}
          >
            Media
          </div>
          <div 
            className={`tab ${activeTab === 'devices' ? 'active' : ''}`} 
            onClick={() => handleTabClick('devices')}
          >
            Devices
          </div>
          <div 
            className={`tab ${activeTab === 'fines' ? 'active' : ''}`} 
            onClick={() => handleTabClick('fines')}
          >
            Fines
          </div>
          <div 
            className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} 
            onClick={() => handleTabClick('notifications')}
          >
            Notifications
          </div>
          <div 
            className={`tab ${activeTab === 'itemRequested' ? 'active' : ''}`} 
            onClick={() => handleTabClick('itemRequested')}
          >
            Item Requested
          </div>
        </div>
      </div>

      {/* Information Boxes */}
      <div className="info-boxes">
        <div className={`info-box books-box ${activeTab !== 'books' ? 'hidden' : ''}`}>
          <h3>Books Borrowed</h3>
          <ul>
            <li key="title">Title: </li>
            <li key="borrowedDate">Borrowed Date: </li>
            <li key="dueDate">Due Date: </li>
          </ul>
        </div>
        <div className={`info-box media-box ${activeTab !== 'media' ? 'hidden' : ''}`}>
          <h3>Media Borrowed</h3>
          <ul>
            <li key="title">Title: </li>
            <li key="borrowedDate">Borrowed Date: </li>
            <li key="dueDate">Due Date: </li>
          </ul>
        </div>
        <div className={`info-box devices-box ${activeTab !== 'devices' ? 'hidden' : ''}`}>
          <h3>Devices Borrowed</h3>
          <ul>
            <li key="device">Device: </li>
            <li key="borrowedDate">Borrowed Date: </li>
            <li key="dueDate">Due Date:</li>
          </ul>
        </div>
        <div className={`info-box fines-box ${activeTab !== 'fines' ? 'hidden' : ''}`}>
          <h3>Fines</h3>
          <ul>
            <li key="fine">Fine: $</li>
          </ul>
        </div>
        <div className={`info-box notifications-box ${activeTab !== 'notifications' ? 'hidden' : ''}`}>
          <h3>Notifications</h3>
          <ul>
            <li key="reminder">Reminder: </li>
          </ul>
        </div>
        <div className={`info-box item-requested-box ${activeTab !== 'itemRequested' ? 'hidden' : ''}`}>
          <h3>Item Requested</h3>
          <ul>
            <li key="requestedTitle">Requested Title: </li>
            <li key="requestDate">Request Date: </li>
            <li key="status">Status: </li> {/* Corrected 'Status' to 'status' for consistency */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserPage;

