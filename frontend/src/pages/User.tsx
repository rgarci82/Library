import React, { useState , useEffect} from 'react';
import './User.css';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number; 
}
interface BorrowedBook {
  ISBN: string;
  bTitle: string;
  bAuthor: string;
  publisher: string;
  genre: string;
  edition: number | null; // edition can be a string or null
  ItemID: number; // Assuming ItemID is a number
}

interface BorrowedMedia {
  MediaID: number;
  mTitle: string;
  mAuthor: string;
  publisher: string;
  genre: string;
  edition: number | null;
  ItemID: number;
}


const UserPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userFine, setUserFine] = useState<any>(null);
  const [userBorrowedBooks, setUserBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [userBorrowedMedia, setUserBorrowedMedia] = useState<BorrowedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //STARTING OF DUMMY DATA
  const [notificationsData, setNotificationsData] = useState<{ reminder: string }[]>([]);

  const mediaData = [
    { title: 'Media 1', borrowedDate: '2024-01-01', dueDate: '2024-01-14', status: 'Borrowed' },
    { title: 'Media 2', borrowedDate: '2024-01-01', dueDate: '2024-01-28', status: 'Borrowed' },
  ];

  const devicesData = [
    { title: 'Device 1', borrowedDate: '2024-01-01', dueDate: '2024-01-14', status: 'Borrowed' },
    { title: 'Device 2', borrowedDate: '2024-01-01', dueDate: '2024-01-28', status: 'Borrowed' },
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
  
  // First useEffect to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setUserDataLoading(true);
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decoded: JwtPayload | null = jwtDecode(token); // Decode the token
        if (!decoded || !decoded.id) throw new Error("Invalid token or ID not found");

        // Fetch user data
        const response = await fetch(`http://localhost:3000/api/users/${decoded.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        setUserData(userData);

        if (!userData.userID) {
          console.error("User data is not available.");
          return; // Return early if userID is undefined
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        setUserDataLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Second useEffect to fetch user fines after userData is fetched
  useEffect(() => {
    if (userDataLoading || !userData?.userID) return;

    const fetchUserFine = async () => {
      setLoading(true);
      try {
        const finesResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/fines`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!finesResponse.ok) throw new Error("Failed to fetch user fine");

        const finesData = await finesResponse.json();
        setUserFine(finesData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
  fetchUserFine();
}, [userData, userDataLoading]); // Dependencies include userData and userDataLoading


  // Second useEffect to fetch user fines after userData is fetched
  useEffect(() => {
    if (userDataLoading || !userData?.userID) return;

    const fetchUserBorrowedBooks = async () => {
      setLoading(true);
      try {
        const borrowedBooksResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/booksBorrowed`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!borrowedBooksResponse.ok) throw new Error("Failed to fetch borrowed books");

        const booksBorrowedData = await borrowedBooksResponse.json();
        setUserBorrowedBooks(booksBorrowedData.borrowedBooks);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
  fetchUserBorrowedBooks();
}, [userData, userDataLoading]); // Dependencies include userData and userDataLoading


  // Second useEffect to fetch user fines after userData is fetched
  useEffect(() => {
    if (userDataLoading || !userData?.userID) return;

    const fetchUserBorrowedMedia = async () => {
      setLoading(true);
      try {
        const borrowedMediaResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/mediaBorrowed`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!borrowedMediaResponse.ok) throw new Error("Failed to fetch borrowed media");

        const mediaBorrowedData = await borrowedMediaResponse.json();
        setUserBorrowedMedia(mediaBorrowedData.borrowedMedia);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
  fetchUserBorrowedMedia();
}, [userData, userDataLoading]); // Dependencies include userData and userDataLoading

  //END OF DUMMY DATA
  //****************************************************************************** 

      // Render loading state or error state if needed
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

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
            placeholder="Browse for items..."
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
        {userData ? (
          <>
            {activeTab === 'books' && userBorrowedBooks.length > 0 && (
                userBorrowedBooks.map((book) => (
                    <div key={book.ItemID} className="info-box books-box">
                        <h3>Title: {book.bTitle}</h3>
                        <ul>
                            <li>Author: {book.bAuthor}</li>
                            <li>Publisher: {book.publisher}</li>
                            <li>Genre: {book.genre}</li>
                            <li>Edition: {book.edition ? book.edition : 'N/A'}</li>
                            <li>ItemID: {book.ItemID}</li>
                        </ul>
                    </div>
                ))
            )}

            {activeTab === 'media' && userBorrowedMedia.length > 0 && (
                userBorrowedMedia.map((media) => (
                    <div key={media.ItemID} className="info-box books-box">
                        <h3>Title: {media.mTitle}</h3>
                        <ul>
                            <li>Author: {media.mAuthor}</li>
                            <li>Publisher: {media.publisher}</li>
                            <li>Genre: {media.genre}</li>
                            <li>Edition: {media.edition ? media.edition : 'N/A'}</li>
                            <li>ItemID: {media.ItemID}</li>
                        </ul>
                    </div>
                ))
            )}  

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

            {activeTab === 'fines' && (
              <div className="info-box fines-box">
                <h3>Fine</h3>
                <ul>
                  <li>Amount: ${userFine.totalFine}</li>
                </ul>
              </div>
            )}

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
              <div key={index} className="info-box item-hold-box">
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
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;