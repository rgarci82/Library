import React, { useState , useEffect} from 'react';
import './User.css';

const UserPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('books');

  //STARTING OF DUMMY DATA
  const [notificationsData, setNotificationsData] = useState<{ reminder: string }[]>([]);


  const booksData = [
    { title: 'Book 1', borrowedDate: '2024-01-01', dueDate: '2024-01-14', status: 'Borrowed' },
    { title: 'Book 2', borrowedDate: '2024-01-01', dueDate: '2024-01-28', status: 'Borrowed' },
  ];

  const mediaData = [
    { title: 'Media 1', borrowedDate: '2024-01-01', dueDate: '2024-01-14', status: 'Borrowed' },
    { title: 'Media 2', borrowedDate: '2024-01-01', dueDate: '2024-01-28', status: 'Borrowed' },
  ];

  const devicesData = [
    { title: 'Device 1', borrowedDate: '2024-01-01', dueDate: '2024-01-14', status: 'Borrowed' },
    { title: 'Device 2', borrowedDate: '2024-01-01', dueDate: '2024-01-28', status: 'Borrowed' },
  ];

  const finesData = [
    { fine: 0.0}
  ];

  const itemRequestedData = [
    { title: 'Item 1', requestDate: '2024-01-01', status: 'Pending' },
    { title: 'Item 2', requestDate: '2024-01-02', status: 'Accepted' },
  ];

  const itemHoldData = [
    { title: 'Item 1', holdDate: '2024-01-01', status: 'OnHold' },
    { title: 'Item 2', holdDate: '2024-01-02', status: 'CheckedOut' }
  ];

  const checkOverdueItems = () => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const notifications: { reminder: string }[] = [];

    // Check books
    booksData.forEach(book => {
      if (book.dueDate < today) {
        notifications.push({ reminder: `Your book "${book.title}" is overdue!` });
      }
    });

    // Check media
    mediaData.forEach(item => {
      if (item.dueDate < today) {
        notifications.push({ reminder: `Your media item "${item.title}" is overdue!` });
      }
    });

    // Check devices
    devicesData.forEach(device => {
      if (device.dueDate < today) {
        notifications.push({ reminder: `Your device "${device.title}" is overdue!` });
      }
    });

    setNotificationsData(notifications);
  };

  useEffect(() => {
    checkOverdueItems(); 
  }, []);


  //END OF DUMMY DATA
  //****************************************************************************** 
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };


  return (
    <div>
      <div className="navbar">
        <div className="navbar-section library-name">
          My Library
        </div>
        
        <div className="navbar-section search-section">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = '/browse';
              }
            }}
          />
          <div className="nav-icons">
            <span>🔧</span>
            <span>👤</span>
          </div>
        </div>
        
        <div className="navbar-section tabs">
          <div className={`tab ${activeTab === 'books' ? 'active' : ''}`} onClick={() => handleTabClick('books')}>Books</div>
          <div className={`tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => handleTabClick('media')}>Media</div>
          <div className={`tab ${activeTab === 'devices' ? 'active' : ''}`} onClick={() => handleTabClick('devices')}>Devices</div>
          <div className={`tab ${activeTab === 'fines' ? 'active' : ''}`} onClick={() => handleTabClick('fines')}>Fines</div>
          <div className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => handleTabClick('notifications')}>Notifications</div>
          <div className={`tab ${activeTab === 'itemRequested' ? 'active' : ''}`} onClick={() => handleTabClick('itemRequested')}>Item Requested</div>
          <div className={`tab ${activeTab === 'itemHold' ? 'active' : ''}`} onClick={() => handleTabClick('itemHold')}>Item Holds</div>
        </div>
      </div>

      <div className="info-boxes">
        {activeTab === 'books' && booksData.map((book, index) => (
          <div key={index} className="info-box books-box">
            <h3>{book.title}</h3>
            <ul>
              <li>Borrowed Date: {book.borrowedDate}</li>
              <li>Due Date: {book.dueDate}</li>
              <li>Status: {book.status}</li>
            </ul>
          </div>
        ))}

        {activeTab === 'media' && mediaData.map((media, index) => (
          <div key={index} className="info-box media-box">
            <h3>{media.title}</h3>
            <ul>
              <li>Borrowed Date: {media.borrowedDate}</li>
              <li>Due Date: {media.dueDate}</li>
              <li>Status: {media.status}</li>
            </ul>
          </div>
        ))}

        {activeTab === 'devices' && devicesData.map((device, index) => (
          <div key={index} className="info-box devices-box">
            <h3>{device.title}</h3>
            <ul>
              <li>Borrowed Date: {device.borrowedDate}</li>
              <li>Due Date: {device.dueDate}</li>
              <li>Status: {device.status}</li>
            </ul>
          </div>
        ))}

        {activeTab === 'fines' && finesData.map((fine, index) => (
          <div key={index} className="info-box fines-box">
            <h3>Fine</h3>
            <ul>
              <li>Amount: ${fine.fine}</li>
            </ul>
          </div>
        ))}

        {activeTab === 'itemRequested' && itemRequestedData.map((item, index) => (
          <div key={index} className="info-box item-requested-box">
            <h3>{item.title}</h3>
            <ul>
              <li>Request Date: {item.requestDate}</li>
              <li>Status: {item.status}</li>
            </ul>
          </div>
        ))}

        {activeTab === 'itemHold' && itemHoldData.map((item, index) => (
          <div key={index} className="info-box item-Hold-box">
            <h3>{item.title}</h3>
            <ul>
              <li>Hold Date: {item.holdDate}</li>
              <li>Status: {item.status}</li>
            </ul>
          </div>
        ))}

        {activeTab === 'notifications' && notificationsData.map((notification, index) => (
          <div key={index} className="info-box notifications-box">
            <h3>Notification</h3>
            <ul>
              <li>{notification.reminder}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;