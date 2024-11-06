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
  itemID: number; // Assuming ItemID is a number
  dueDate: string;
}

interface BorrowedMedia {
  MediaID: number;
  mTitle: string;
  mAuthor: string;
  publisher: string;
  genre: string;
  edition: number | null;
  itemID: number;
  dueDate: string;
}

interface BorrowedDevice {
  serialNumber: string;
  dName: string;
  brand: string,
  model: string,
  dueDate: Date;
}
interface RequestedBooks {
  bTitle: string;
  requestDate: Date;
  status: string;
}

interface RequestedMedia {
  requestDate: string | number | Date;
  mTitle: string;
  RequestDate: Date;
  status: string;
}

interface RequestedDevice {
  requestDate: string | number | Date;
  dName: string;
  status: string;
}

interface bookHold {
  holddate: string | number | Date;
  status: string;
}

interface mediaHold {
  holddate: string | number | Date;
  status: string;
}

interface deviceHold {
  holddate: string | number | Date;
  status: string;
}

const UserPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userFine, setUserFine] = useState<any>(null);
  const [userBorrowedBooks, setUserBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [userBorrowedMedia, setUserBorrowedMedia] = useState<BorrowedMedia[]>([]);
  const [userBorrowedDevice, setUserBorrowedDevice] = useState<BorrowedDevice[]>([]);
  const [userRequestedBooks, setUserRequestedBooks] = useState<RequestedBooks[]>([]);
  const [userRequestedMedia, setUserRequestedMedia] = useState<RequestedMedia[]>([]);
  const [userRequestedDevice, setUserRequestedDevice] = useState<RequestedDevice[]>([]);
  const [userbookHold, setUserbookHold] = useState<bookHold[]>([]);
  const [usermediaHold, setUsermediaHold] = useState<mediaHold[]>([]);
  const [userdeviceHold, setUserdeviceHold] = useState<deviceHold[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //STARTING OF DUMMY DATA
  const [notificationsData, setNotificationsData] = useState<{ reminder: string }[]>([]);

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

  //Fines
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
  }, [userData, userDataLoading]);

  //Book Borrowed
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
  }, [userData, userDataLoading]);

  //Media Borrowed
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
  }, [userData, userDataLoading]);

  //Device Borrowed
  useEffect(() => {
      if (userDataLoading || !userData?.userID) return;

      const fetchUserBorrowedDevice = async () => {
        setLoading(true);
        try {
          const borrowedDeviceResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/deviceBorrowed`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!borrowedDeviceResponse.ok) throw new Error("Failed to fetch borrowed media");

          const deviceBorrowedData = await borrowedDeviceResponse.json();
          setUserBorrowedDevice(deviceBorrowedData.borrowedDevice);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
    fetchUserBorrowedDevice();
  }, [userData, userDataLoading]);

  //Items Requested
  useEffect(() => {
    if (userDataLoading || !userData?.userID) return;

    const fetchUserRequestedItems = async () => {
      setLoading(true);
      try {
        // Fetch requested media
        const requestedMediaResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/mediaRequested`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!requestedMediaResponse.ok) throw new Error("Failed to fetch requested media");

        const mediarequestedData = await requestedMediaResponse.json();
        setUserRequestedMedia(mediarequestedData.userRequestedMedia || []); // Ensure you access the correct property

        // You could also fetch requested books here if you have a similar API endpoint
        const requestedBooksResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/booksRequested`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!requestedBooksResponse.ok) throw new Error("Failed to fetch requested books");

        const booksRequestedData = await requestedBooksResponse.json();
        setUserRequestedBooks(booksRequestedData.userRequestedBooks || []); // Ensure you access the correct property
  //device
        const requestedDeviceReponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/deviceRequested`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!requestedDeviceReponse.ok) throw new Error("Failed to fetch requested media");

        const deviceRequestedData = await requestedDeviceReponse.json();
        setUserRequestedDevice(deviceRequestedData.userRequestedDevice || []); // Ensure you access the correct property
      } catch (error) {
        console.error("Error featching requested device data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRequestedItems();
  }, [userData, userDataLoading]);
  
  //Items Hold
  useEffect(() => {
    if (userDataLoading || !userData?.userID) return;

    const fetchUserItemHold = async () => {
      setLoading(true);
      try {
        // Fetch bookhold
        const bookHoldResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/bookHold`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!bookHoldResponse.ok) throw new Error("Failed to fetch requested media");

        const bookholdData = await bookHoldResponse.json();
        setUserbookHold(bookholdData.userbookHold || []); // Ensure you access the correct property
        // Fetch devicehold
        const deviceHoldResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/deviceHold`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!deviceHoldResponse.ok) throw new Error("Failed to fetch requested media");

        const deviceholdData = await deviceHoldResponse.json();
        setUserdeviceHold(deviceholdData.userdeviceHold || []); // Ensure you access the correct property
        // Fetch mediahold
        const mediaHoldResponse = await fetch(`http://localhost:3000/api/users/${userData.userID}/mediaHold`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!mediaHoldResponse.ok) throw new Error("Failed to fetch requested media");

        const mediaholdData = await mediaHoldResponse.json();
        setUsermediaHold(mediaholdData.usermediaHold || []); // Ensure you access the correct property
      } catch (error) {
        console.error("Error featching requested device data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserItemHold();
  }, [userData, userDataLoading]);

  // Render loading state or error state if needed
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };
  return (
    <div className="background-container">
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
            {activeTab === 'books' && (
              userBorrowedBooks.length > 0 ? (
                userBorrowedBooks.map((book) => (
                  <div key={book.itemID} className="info-box books-box">
                    <h3 className="title-css">{book.bTitle}</h3>
                    <ul>
                      <li className="info-text-css">Author: {book.bAuthor}</li>
                      <li className="info-text-css">Publisher: {book.publisher}</li>
                      <li className="info-text-css">Genre: {book.genre}</li>
                      <li className="info-text-css">Edition: {book.edition ? book.edition : 'N/A'}</li>
                      <li className="info-text-css">ItemID: {book.itemID}</li>
                      <li className="info-text-css">Due Date: {new Date(book.dueDate).toLocaleDateString()}</li>
                    </ul>
                    <div className="button-container">
                      <button className="button-text">
                        Return
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="not-found-css">No borrowed books found.</p>
              )
            )}

            {/* Borrowed Media */}
            {activeTab === 'media' && (
              userBorrowedMedia.length > 0 ? (
                userBorrowedMedia.map((media) => (
                  <div key={media.itemID} className="info-box media-box">
                    <h3 className="title-css">Title: {media.mTitle}</h3>
                    <ul>
                      <li className="info-text-css">Author: {media.mAuthor}</li>
                      <li className="info-text-css">Publisher: {media.publisher}</li>
                      <li className="info-text-css">Genre: {media.genre}</li>
                      <li className="info-text-css">Edition: {media.edition ? media.edition : 'N/A'}</li>
                      <li className="info-text-css">ItemID: {media.itemID}</li>
                      <li className="info-text-css">Due Date: {new Date(media.dueDate).toLocaleDateString()}</li>
                    </ul>
                    <div className="button-container">
                      <button className="button-text">
                        Return
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="not-found-css">No borrowed media found.</p>
              )
            )}

            {/* Borrowed Devices */}
            {activeTab === 'devices' && (
              userBorrowedDevice.length > 0 ? (
                userBorrowedDevice.map((device) => (
                  <div key={device.serialNumber} className="info-box devices-box">
                    <h3 className="title-css">Title: {device.dName}</h3>
                    <ul>
                      <li className="info-text-css">Brand: {device.brand}</li>
                      <li className="info-text-css">Model: {device.model}</li>
                      <li className="info-text-css">Serial Number: {device.serialNumber}</li>
                      <li className="info-text-css">Due Date: {new Date(device.dueDate).toLocaleDateString()}</li>
                    </ul>
                    <div className="button-container">
                      <button className="button-text">
                        Return
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="not-found-css">No borrowed devices found.</p>
              )
            )}

  
            {/* Fines */}
            {activeTab === 'fines' && (
              <div className="info-box fines-box">
                <h3 className="title-css">Fine</h3>
                <ul>
                  <li className="fine-text-css">Amount: ${userFine.totalFine}</li>
                </ul>
              </div>
            )}
  
            {/* Item Requests */}
            {activeTab === 'itemRequested' && (
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    {/* Display requested books */}
                    <div className="title-container">
                      <h2 className="requested-title">Requested Books</h2>
                    </div>
                    {userRequestedBooks.length > 0 ? (
                      userRequestedBooks.map((bookrequest, index) => (
                        <div key={index} className="info-box item-requested-box">
                          <h3>{bookrequest.bTitle}</h3>
                          <ul>
                            <li>Request Date: {new Date(bookrequest.requestDate).toLocaleDateString()}</li>
                            <li>Status: {bookrequest.status}</li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="not-found-css">No requested books found.</p>
                    )}
  
                    {/* Display requested media */}
                    <div className="title-container">
                      <h2 className="requested-title">Requested Media</h2>
                    </div>
                    {userRequestedMedia.length > 0 ? (
                      userRequestedMedia.map((mediarequest, index) => (
                        <div key={index} className="info-box item-requested-box">
                          <h3>{mediarequest.mTitle}</h3>
                          <ul>
                            <li>Request Date: {new Date(mediarequest.requestDate).toLocaleDateString()}</li>
                            <li>Status: {mediarequest.status}</li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="not-found-css">No requested media found.</p>
                    )}

                    {/* Display requested devices */}
                    <div className="title-container">
                      <h2 className="requested-title">Requested Devices</h2>
                    </div>
                    {userRequestedDevice.length > 0 ? (
                      userRequestedDevice.map((devicerequest, index) => (
                        <div key={index} className="info-box item-requested-box">
                          <h3>{devicerequest.dName}</h3>
                          <ul>
                            <li>Request Date: {new Date(devicerequest.requestDate).toLocaleDateString()}</li>
                            <li>Status: {devicerequest.status}</li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="not-found-css">No requested devices found.</p>
                    )}
                  </>
                )}
              </div>
            )}
  
            {/* Item Hold */}
            {activeTab === 'itemHold' && (
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    {/* Display book hold */}
                    <div className="title-container">
                      <h2 className="hold-title">Book Holds</h2>
                    </div>
                    {userbookHold.length > 0 ? (
                      userbookHold.map((bookhold, index) => (
                        <div key={index} className="info-box item-requested-box">
                          <ul>
                            <li>Request Date: {new Date(bookhold.holddate).toLocaleDateString()}</li>
                            <li>Status: {bookhold.status}</li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="not-found-css">No books holds found.</p>
                    )}       

                    {/* Display media holds*/}
                    <div className="title-container">
                      <h2 className="hold-title">Media Holds</h2>
                    </div>
                    {usermediaHold.length > 0 ? (
                      usermediaHold.map((mediahold, index) => (
                        <div key={index} className="info-box item-requested-box">
                          <ul>
                            <li>Request Date: {new Date(mediahold.holddate).toLocaleDateString()}</li>
                            <li>Status: {mediahold.status}</li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="not-found-css">No media holds found.</p>
                    )}

                    {/* Display book hold */}
                    <div className="title-container">
                      <h2 className="hold-title">Device Holds</h2>
                    </div>
                    {userdeviceHold.length > 0 ? (
                      userdeviceHold.map((devicehold, index) => (
                        <div key={index} className="info-box item-requested-box">
                          <ul>
                            <li>Hold Date: {new Date(devicehold.holddate).toLocaleDateString()}</li>
                            <li>Status: {devicehold.status}</li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="not-found-css">No device holds found.</p>
                    )}    
                  </>
                )}
              </div>
            )}
             
            {/* Notifications */}
            {activeTab === 'notifications' && (
              notificationsData.length > 0 ? (
                notificationsData.map((notification, index) => (
                  <div key={index} className="info-box notifications-box">
                    <h3>Notification</h3>
                    <ul>
                      <li>{notification.reminder}</li>
                    </ul>
                  </div>
                ))
              ) : (
                <p className="not-found-css">No notifications found.</p>
              )
            )}
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div> 
    </div>
  );
}
  export default UserPage;