import React, { useState, useEffect } from 'react';
import './User.css';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number; 
}

const UserPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [userData, setUserData] = useState<any>(null);
  const [userFine, setUserFine] = useState<any>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [borrowedDevices, setBorrowedDevices] = useState<any[]>([]);
  const [borrowedMedia, setBorrowedMedia] = useState<any[]>([]);
  const [bookRequests, setBookRequests] = useState<any[]>([]);
  const [deviceRequests, setDeviceRequests] = useState<any[]>([]);
  const [mediaRequests, setMediaRequests] = useState<any[]>([]);
  const [bookHolds, setBookHolds] = useState<any[]>([]);
  const [deviceHolds, setDeviceHolds] = useState<any[]>([]);
  const [mediaHolds, setMediaHolds] = useState<any[]>([]);
  const [notificationsData, setNotificationsData] = useState<{ reminder: string }[]>([]);

  const checkOverdueItems = () => {
    const today = new Date().toISOString().split('T')[0];
    const notifications: { reminder: string }[] = [];

    borrowedBooks.forEach(book => {
      if (book.dueDate < today) {
        notifications.push({ reminder: `Your book "${book.title}" is overdue!` });
      }
    });

    borrowedMedia.forEach(item => {
      if (item.dueDate < today) {
        notifications.push({ reminder: `Your media item "${item.title}" is overdue!` });
      }
    });

    borrowedDevices.forEach(device => {
      if (device.dueDate < today) {
        notifications.push({ reminder: `Your device "${device.title}" is overdue!` });
      }
    });

    setNotificationsData(notifications);
  };

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
        checkOverdueItems();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserFine = async () => {
      if (userData && userData.userID) {
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
    };
    fetchUserFine();
  }, [userData]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/books/borrowed`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch borrowed books");

          const data = await response.json();
          setBorrowedBooks(data);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchBorrowedBooks();
  }, [userData]);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchBorrowedDevices = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/devices/borrowed`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch borrowed devices");

          const data = await response.json();
          setBorrowedDevices(data);
        } catch (error) {
          console.error("Error fetching borrowed devices:", error);
        }
      }
    };

    fetchBorrowedDevices();
  }, [userData]);

  useEffect(() => {
    const fetchBorrowedMedia = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/media/borrowed`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch borrowed media");

          const data = await response.json();
          setBorrowedMedia(data);
        } catch (error) {
          console.error("Error fetching borrowed media:", error);
        }
      }
    };

    fetchBorrowedMedia();
  }, [userData]);

  useEffect(() => {
    const fetchBookRequests = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/books/requests`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch book requests");

          const data = await response.json();
          setBookRequests(data);
        } catch (error) {
          console.error("Error fetching book requests:", error);
        }
      }
    };

    fetchBookRequests();
  }, [userData]);

  useEffect(() => {
    const fetchDeviceRequests = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/devices/requests`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch device requests");

          const data = await response.json();
          setDeviceRequests(data);
        } catch (error) {
          console.error("Error fetching device requests:", error);
        }
      }
    };

    fetchDeviceRequests();
  }, [userData]);

  useEffect(() => {
    const fetchMediaRequests = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/media/requests`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch media requests");

          const data = await response.json();
          setMediaRequests(data);
        } catch (error) {
          console.error("Error fetching media requests:", error);
        }
      }
    };

    fetchMediaRequests();
  }, [userData]);

  useEffect(() => {
    const fetchBookHolds = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/books/holds`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch book holds");

          const data = await response.json();
          setBookHolds(data);
        } catch (error) {
          console.error("Error fetching book holds:", error);
        }
      }
    };

    fetchBookHolds();
  }, [userData]);

  useEffect(() => {
    const fetchDeviceHolds = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/devices/holds`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch device holds");

          const data = await response.json();
          setDeviceHolds(data);
        } catch (error) {
          console.error("Error fetching device holds:", error);
        }
      }
    };

    fetchDeviceHolds();
  }, [userData]);

  useEffect(() => {
    const fetchMediaHolds = async () => {
      if (userData && userData.userID) {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/media/holds`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error("Failed to fetch media holds");

          const data = await response.json();
          setMediaHolds(data);
        } catch (error) {
          console.error("Error fetching media holds:", error);
        }
      }
    };

    fetchMediaHolds();
  }, [userData]);

  const returnItem = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/items/${itemId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error("Failed to return item");

      alert("Item returned successfully!");
      // Refresh borrowed items after returning
      const fetchBorrowedBooks = async () => {
        const response = await fetch(`http://localhost:3000/api/users/${userData.userID}/books/borrowed`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setBorrowedBooks(data);
      };

      fetchBorrowedBooks();
    } catch (error) {
      console.error("Error returning item:", error);
      alert("Failed to return item.");
    }
  };

  return (
    <div className="user-page">
      <h1>User Dashboard</h1>
      <div className="tab-navigation">
        <button onClick={() => handleTabClick('books')}>Borrowed Books</button>
        <button onClick={() => handleTabClick('media')}>Borrowed Media</button>
        <button onClick={() => handleTabClick('devices')}>Borrowed Devices</button>
        <button onClick={() => handleTabClick('fines')}>Fines</button>
        <button onClick={() => handleTabClick('notifications')}>Notifications</button>
        <button onClick={() => handleTabClick('bookRequests')}>Book Requests</button>
        <button onClick={() => handleTabClick('deviceRequests')}>Device Requests</button>
        <button onClick={() => handleTabClick('mediaRequests')}>Media Requests</button>
        <button onClick={() => handleTabClick('bookHolds')}>Book Holds</button>
        <button onClick={() => handleTabClick('deviceHolds')}>Device Holds</button>
        <button onClick={() => handleTabClick('mediaHolds')}>Media Holds</button>
      </div>

      {activeTab === 'books' && (
        <div className="tab-content">
          <h2>Borrowed Books</h2>
          <ul>
            {borrowedBooks.map((book) => (
              <li key={book.id}>
                {book.title} (Due: {book.dueDate}) 
                <button onClick={() => returnItem(book.id)}>Return</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="tab-content">
          <h2>Borrowed Media</h2>
          <ul>
            {borrowedMedia.map((media) => (
              <li key={media.id}>
                {media.title} (Due: {media.dueDate})
                <button onClick={() => returnItem(media.id)}>Return</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="tab-content">
          <h2>Borrowed Devices</h2>
          <ul>
            {borrowedDevices.map((device) => (
              <li key={device.id}>
                {device.title} (Due: {device.dueDate}) 
                <button onClick={() => returnItem(device.id)}>Return</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'fines' && (
        <div className="tab-content">
          <h2>Your Fines</h2>
          {userFine ? (
            <div>
              <p>Total Fines: ${userFine.total}</p>
            </div>
          ) : (
            <p>No fines found.</p>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="tab-content">
          <h2>Notifications</h2>
          {notificationsData.length > 0 ? (
            <ul>
              {notificationsData.map((notification, index) => (
                <li key={index}>{notification.reminder}</li>
              ))}
            </ul>
          ) : (
            <p>No notifications.</p>
          )}
        </div>
      )}

      {activeTab === 'bookRequests' && (
        <div className="tab-content">
          <h2>Book Requests</h2>
          <ul>
            {bookRequests.map((request) => (
              <li key={request.id}>{request.title}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'deviceRequests' && (
        <div className="tab-content">
          <h2>Device Requests</h2>
          <ul>
            {deviceRequests.map((request) => (
              <li key={request.id}>{request.title}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'mediaRequests' && (
        <div className="tab-content">
          <h2>Media Requests</h2>
          <ul>
            {mediaRequests.map((request) => (
              <li key={request.id}>{request.title}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'bookHolds' && (
        <div className="tab-content">
          <h2>Book Holds</h2>
          <ul>
            {bookHolds.map((hold) => (
              <li key={hold.id}>{hold.title}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'deviceHolds' && (
        <div className="tab-content">
          <h2>Device Holds</h2>
          <ul>
            {deviceHolds.map((hold) => (
              <li key={hold.id}>{hold.title}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'mediaHolds' && (
        <div className="tab-content">
          <h2>Media Holds</h2>
          <ul>
            {mediaHolds.map((hold) => (
              <li key={hold.id}>{hold.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserPage;
