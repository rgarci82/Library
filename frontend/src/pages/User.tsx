import React, { useState , useEffect} from 'react';
import './User.css';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number; 
}

const UserPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [userData, setUserData] = useState<any>(null);
  const [userFine, setUserFine] = useState<any>(null);
  const [userBookBorrowed, setUserBorrowedBooks] = useState<any>(null);
  const [userMediaBorrowed, setUserBorrowedMedia] = useState<any>(null);
  const [userDeviceBorrowed, setUserBorrowedDevice] = useState<any>(null);
  const [userBookRequest, setUserBookRequest] = useState<any>(null); 
  const [userMediaRequest, setMediaRequest] = useState<any>(null); 
  const [userDeviceRequest, setDeviceRequest] = useState<any>(null); 
  const [userBookHold, setBookHold] = useState<any>(null); 
  const [userMediaHold, setMediaHold] = useState<any>(null); 
  const [userDeviceHold, setDeviceHold] = useState<any>(null); 
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
  
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const decoded: JwtPayload | null = jwtDecode(token); 
            if (!decoded || !decoded.id) throw new Error("Invalid token or ID not found");

           
            const response = await fetch(`http://localhost:3000/api/users/${decoded.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    fetchUserData();
}, []);

useEffect(() => {
  const fetchUserFine = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/fines`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) throw new Error("Failed to fetch user fine");

      const data = await response.json();
      setUserFine(data);
    } catch (error) {
        console.error("Error:", error);
    }
  }
  fetchUserFine();
}, [userData]);

  //END OF DUMMY DATA
  //****************************************************************************** 
useEffect(() => {
    const fetchUserBorrowedBooks = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/books-borrowed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) throw new Error("Failed to fetch user borrowed books");
            
            const data = await response.json();
            setUserBorrowedBooks(data);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    fetchUserBorrowedBooks();
}, [userData]);



useEffect(() => {
    const fetchUserBorrowedMedia = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/borrowedMedia`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
  
        if (!response.ok) throw new Error("Failed to fetch borrowed media");

        const data = await response.json();
        setUserBorrowedMedia(data); // Assume setUserBorrowedMedia is a state setter for borrowed media
      } catch (error) {
          console.error("Error:", error);
      }
    };

    fetchUserBorrowedMedia();
}, [userData]);


useEffect(() => {
    const fetchUserBorrowedDevice = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/devices`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
  
        if (!response.ok) throw new Error("Failed to fetch borrowed devices");
  
        const data = await response.json();
        setUserBorrowedDevice(data); // Assumes setUserBorrowedDevice is a state function to store device data
      } catch (error) {
          console.error("Error:", error);
      }
    }
    fetchUserBorrowedDevice();
  }, [userData]);


useEffect(() => {
    const fetchUserBookRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/bookrequests`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error("Failed to fetch user book requests");

            const data = await response.json();
            setUserBookRequest(data); // Update state with the fetched book request data
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    fetchUserBookRequest();
}, [userData]);


useEffect(() => {
    const fetchMediaRequest = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/mediarequests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user media requests");
  
        const data = await response.json();
        setMediaRequest(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchMediaRequest();
  }, [userData]);
  
  

  useEffect(() => {
    const fetchDeviceRequest = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/devicerequests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user device requests");
  
        const data = await response.json();
        setDeviceRequest(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchDeviceRequest();
  }, [userData]);
  



  useEffect(() => {
    const fetchBookHold = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/bookholds`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user book holds");
  
        const data = await response.json();
        setBookHold(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchBookHold();
  }, [userData]);
  
  


  useEffect(() => {
    const fetchMediaHold = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/mediaholds`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user media holds");
  
        const data = await response.json();
        setMediaHold(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchMediaHold();
  }, [userData]);
  


  
  useEffect(() => {
    const fetchDeviceHold = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/deviceholds`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user device holds");
  
        const data = await response.json();
        setDeviceHold(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchDeviceHold();
  }, [userData]);
  

  
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
        {userData ? (
          <>
            {activeTab === 'books' && booksData.map((book, index) => (
              <div key={index} className="info-box books-box">
                <h3>{book.title}</h3>
                <ul>
                  <li>FIRST NAME: {userData.firstName}</li>
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
              <div key={index} className="info-box item-hold-box">
                <h3>{item.title}</h3>
                <ul>
                  <li>Hold Date: {item.holdDate}</li>
                  <li>Status: {item.status}</li>
                </ul>
              </div>
            ))}

            {activeTab === 'notifications' && notificationsData.map((notification, index) => (
              <div key={index} className="info-box notification-box">
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



