import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';

enum ItemStatus {
  Available = 'available',
  Borrowed = 'borrowed',
}

// Define the type for each item
interface Book {
  ISBN: string;
  bTitle: string;
  bAuthor: string;
  publisher: string;
  genre: string;
  edition: number | null;
}

interface Media {
  MediaID: number;
  mTitle: string;
  mAuthor: string;
  publisher: string;
  genre: string;
  edition: number | null;
}

interface Device {
  serialNumber: string;
  dName: string;
  brand: string;
  model: string;
  status: ItemStatus;
}

interface JwtPayload {
  id: number;
}

type Item = Book | Media | Device;

const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'book' | 'media' | 'device'>('book');

  const [userData, setUserData] = useState<any>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [filteredItems, setFilteredItems] = useState<(Book | Media | Device)[]>([]);

  const [showHoldPopup, setShowHoldPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [selectedHoldItem, setSelectedHoldItem] = useState<Item>();
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const decoded: JwtPayload | null = jwtDecode(token); // Decode the token
      if (!decoded || !decoded.id) throw new Error("Invalid token or ID not found");

      // Fetch user data
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");

      const userData = await response.json();
      setUserData(userData);
      setIsLoggedIn(true)

      if (!userData.userID) {
        console.error("User data is not available.");
        return; // Return early if userID is undefined
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/getBooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) throw new Error("Failed to fetch all unborrowed books by user.");

      const data = await response.json();

      setAllBooks(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchAllMedia = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/getMedia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) throw new Error("Failed to fetch all media");

      const data = await response.json();
      setAllMedia(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchAllDevices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/getDevices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) throw new Error("Failed to fetch all devices");

      const data = await response.json();
      setAllDevices(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchBookCopies = async (ISBN: string, book: Book) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${ISBN}/bookCopy`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error("Failed to fetch all books");

      const data = await response.json();

      if (data.length > 0) {
        borrowBook(book);
        return;
      }
      else if (data.length === 0) {
        setSelectedHoldItem(book);
        setShowHoldPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchMediaCopies = async (MediaID: number, media: Media) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/${MediaID}/mediaCopy`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error("Failed to fetch all media");

      const data = await response.json();

      if (data.length > 0) {
        borrowMedia(media);
        return;
      }
      else if (data.length === 0) {
        setSelectedHoldItem(media);
        setShowHoldPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const borrowBook = async (book: Book) => {
    try {
      if (!userData) {
        navigate('/login')
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData, book }), // Send book as JSON
      });

      await response.json(); // Parse JSON after fetch completes

      if (response.ok) {
        toast.success(`${book.bTitle} borrowed successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const borrowMedia = async (media: Media) => {
    try {
      if (!userData) {
        navigate('/login')
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData, media }), // Send book as JSON
      });

      await response.json(); // Parse JSON after fetch completes

      if (response.ok) {
        toast.success(`${media.mTitle} borrowed successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    };
  };

  const borrowDevice = async (device: Device) => {
    try {
      if (!userData) {
        navigate('/login')
      }
      if (userData) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/borrow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData, device }), // Send device as JSON
          });

          await response.json(); // Parse JSON after fetch completes

          if (response.ok) {
            toast.success(`${device.dName} borrowed successfully`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
          else {
            setSelectedHoldItem(device);
            setShowHoldPopup(true);
          }
        } catch (error) {
          toast.error(`Error: ${error}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      toast.error(`Error: ${error}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const holdingItem = async () => {
    if (selectedHoldItem) {
      if ("ISBN" in selectedHoldItem) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/hold`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData, selectedHoldItem }), // Send book as JSON
          });

          await response.json(); // Parse JSON after fetch completes

          if (response.ok) {
            toast.success('Book held successfully', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
        } catch (error) {
          toast.error(`Error: ${error}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      }
      else if ("MediaID" in selectedHoldItem) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/hold`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData, selectedHoldItem }), // Send book as JSON
          });

          await response.json(); // Parse JSON after fetch completes

          if (response.ok) {
            toast.success('Media held successfully', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
        } catch (error) {
          toast.error(`Error: ${error}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      }
      else if ("serialNumber" in selectedHoldItem) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/hold`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData, selectedHoldItem }), // Send book as JSON
          });

          await response.json(); // Parse JSON after fetch completes

          if (response.ok) {
            toast.success('Device held successfully', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          }
        } catch (error) {
          toast.error(`Error: ${error}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      }
    }
  };

  const openPopup = (item: Item) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  //Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  // Get the search term from the URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) setSearchTerm(search);
  }, [location]);

  //Fetch all books
  useEffect(() => {
    fetchAllBooks();
    fetchAllMedia();
    fetchAllDevices();
  }, [userData]);

  // Function to filter items based on the search term and selected type
  useEffect(() => {
    // Determine which array to filter based on the selected search type
    let itemsToFilter: Book[] | Media[] | Device[] = [];

    switch (searchBy) {
      case 'book':
        itemsToFilter = allBooks;
        break;
      case 'media':
        itemsToFilter = allMedia;
        break;
      case 'device':
        itemsToFilter = allDevices;
        break;
      default:
        itemsToFilter = [];
    }

    // Filter items based on the search term
    const filtered = itemsToFilter.filter((item) => {
      if (searchBy === 'book' && 'bTitle' in item) {
        return (item as Book).bTitle.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchBy === 'media' && 'mTitle' in item) {
        return (item as Media).mTitle.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchBy === 'device' && 'dName' in item) {
        return (item as Device).dName.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false; // Fallback in case none of the conditions match
    });

    // Update the state with the filtered items
    setFilteredItems(filtered);
  }, [searchTerm, searchBy, allBooks, allMedia, allDevices]);

  return (
    <div>
      <div>
        <div style={styles.navbar}>
          <div style={styles.libraryName}>
            <Link to={'/'} style={styles.libraryNameLink}>My Library</Link>
          </div>
          <div style={styles.navIcons}>
            {isLoggedIn ? (
              <li className='nav__list'>
                <Link to={localStorage.getItem('isAdmin') === 'True' ? '/adminDashboard' : '/user'} style={styles.browseButton}>Profile</Link>
              </li>
            ) : (
              <>
                <li className="nav__list">
                  <Link to='/register' style={styles.browseButton}>Sign Up</Link>
                </li>
                <li className="nav__list">
                  <Link to='/login' style={styles.browseButton}>Login</Link>
                </li>
              </>
            )}
          </div>
        </div>
      </div>
      <div style={styles.browseContainer}>
        <header style={styles.textContainer}>
          <h1 style={styles.headerTitle}>Browse Items</h1>
          <p style={styles.headerSubtitle}>Find the perfect item for you!</p>

          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as 'book' | 'media' | 'device')}
            style={styles.dropdown}
          >
            <option value="book">Book</option>
            <option value="media">Media</option>
            <option value="device">Device</option>
          </select>

          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)'}
              onBlur={(e) => e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)'}
            />
          </div>

          <button
            style={styles.requestButton}
            onClick={() => window.location.href = "/request"}
          >
            Request an Item
          </button>

          <div style={styles.itemsGridContainer}>
            <div style={styles.itemsGrid}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  if (searchBy === 'book' && 'ISBN' in item) {
                    const book = item as Book; // Cast to Book type
                    const publisherText = book.publisher ? ` | ${book.publisher.trim()}` : '';
                    return (
                      <div key={book.ISBN} style={styles.itemCard}>
                        <h3 style={styles.itemTitle}>{book.bTitle}</h3>
                        <p>
                          {book.bAuthor}
                          {publisherText}
                        </p>
                        <p style={styles.genreText}>
                          Genre: {book.genre}
                        </p>
                        <div style={styles.buttonContainer}>
                          <button style={styles.borrowButton} onClick={() => fetchBookCopies(book.ISBN, book)}>Borrow</button>
                          <button style={styles.detailsButton} onClick={() => openPopup(book)}>Details</button>
                        </div>
                      </div>
                    );
                  } else if (searchBy === 'media' && 'MediaID' in item) {
                    const media = item as Media; // Cast to Media type
                    const publisherText = media.publisher ? ` | ${media.publisher.trim()}` : '';
                    return (
                      <div key={media.MediaID} style={styles.itemCard}>
                        <h3 style={styles.itemTitle}>{media.mTitle}</h3>
                        <p>
                          {media.mAuthor}
                          {publisherText}
                        </p>
                        <p style={styles.genreText}>
                          Genre: {media.genre}
                        </p>
                        <div style={styles.buttonContainer}>
                          <button style={styles.borrowButton} onClick={() => fetchMediaCopies(media.MediaID, media)}>Borrow</button>
                          <button style={styles.detailsButton} onClick={() => openPopup(media)}>Details</button>
                        </div>
                      </div>
                    );
                  } else if (searchBy === 'device' && 'serialNumber' in item) {
                    const device = item as Device; // Cast to Device type
                    return (
                      <div key={device.serialNumber} style={styles.itemCard}>
                        <h3 style={styles.itemTitle}>{device.dName}</h3>
                        <p>
                          {device.brand} {device.model}
                        </p>
                        <div style={styles.buttonContainer}>
                          <button style={styles.borrowButton} onClick={() => borrowDevice(device)}>Borrow</button>
                          <button style={styles.detailsButton} onClick={() => openPopup(device)}>Details</button>
                        </div>
                      </div>
                    );
                  }
                  return null; // Fallback if no item type matches
                })
              ) : (
                <p style={styles.noItemsText}>No items found.</p>
              )}
            </div>
          </div>
          {showHoldPopup && (
            <div style={styles.detailsPopupOverlay}>
              <div style={styles.detailsPopup}>
                <h3>No copies available</h3>
                <p style={styles.genreText}>This item is currently not available. Would you like to place it on hold?</p>
                <div style={styles.holdCloseContainer}>
                  <button onClick={() => {
                    holdingItem();
                    setShowHoldPopup(false); // Close the popup
                  }} style={styles.closeButton}>
                    Hold
                  </button>
                  <button onClick={() => setShowHoldPopup(false)} style={styles.closeButton}>Close</button>
                </div>
              </div>
            </div>
          )}
          {isPopupOpen && selectedItem && (
            <div style={styles.detailsPopupOverlay}>
              <div style={styles.detailsPopup}>
                {'ISBN' in selectedItem ? (
                  <>
                    <h3>{selectedItem.bTitle}</h3>
                    <p>ISBN: {selectedItem.ISBN}</p>
                    <p>Author: {selectedItem.bAuthor}</p>
                    <p>Publisher: {selectedItem.publisher}</p>
                    <p>Genre: {selectedItem.genre}</p>
                    <p>Edition: {selectedItem.edition ?? 'N/A'}</p>
                  </>
                ) : 'MediaID' in selectedItem ? (
                  <>
                    <h3>{selectedItem.mTitle}</h3>
                    <p>MediaID: {selectedItem.MediaID}</p>
                    <p>Director: {selectedItem.mAuthor}</p>
                    <p>Genre: {selectedItem.genre}</p>
                    <p>Edition: {selectedItem.edition ?? 'N/A'}</p>
                  </>
                ) : 'serialNumber' in selectedItem ? (
                  <>
                    <h3>{selectedItem.dName}</h3>
                    <p>Serial Number: {selectedItem.serialNumber}</p>
                    <p>Brand: {selectedItem.brand}</p>
                    <p>Model: {selectedItem.model}</p>
                    <p>Status: {selectedItem.status}</p>
                  </>
                ) : null}
                <button style={styles.closeButton} onClick={closePopup}>
                  Close
                </button>
              </div>
            </div>
          )}
        </header>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    position: 'fixed',
    left: '0',
    right: '0',
    zIndex: 100,
  },
  libraryName: {
    backgroundColor: '#C8102E',
    fontWeight: 'bold',
    fontSize: '24px',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '10px',
  },
  navIcons: {
    display: 'flex',
    gap: '10px',
    marginLeft: 'auto',
    fontSize: '1.5rem',
  },
  browseContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'gray',
    height: '100%',
  },
  textContainer: {
    marginTop: '5%',
    height: '100%',
    textAlign: 'center',
    marginBottom: '10px',
    backgroundColor: '#A0A0A0',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
  },
  headerTitle: {
    fontSize: '2.5rem',
    letterSpacing: '1px',
    wordSpacing: '10px',
    color: 'black',
  },
  headerSubtitle: {
    fontSize: '1.2rem',
    color: 'black',
  },
  dropdown: {
    padding: '10px',
    width: '15vh',
    height: '6.5vh',
    margin: '10px 0',
    fontSize: '16px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    outline: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.3s ease',
  },
  requestButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 15px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#C8102E',
    color: '#fff',
    cursor: 'pointer',
  },
  searchBar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '12px 20px',
    fontSize: '16px',
    width: '100%',
    height: '7vh',
    maxWidth: '500px',
    borderRadius: '25px',
    border: '1px solid #ddd',
    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
    outline: 'none',
    transition: 'box-shadow 0.3s ease',
    backgroundColor: '#f7f7f7',
  },
  genreText: {
    marginTop: '5px',
  },
  itemsGridContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Aligns grid at the top of the container
    maxHeight: '80vh',
    overflowY: 'auto', // Adds vertical scroll
    padding: '10px',
    width: '100%',
    backgroundColor: 'lightgray', // Optional background color
    borderRadius: '10px',
  },
  itemsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center', // Centers each card horizontally
    width: '100%', // Ensures full width within the container
  },
  itemCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'left',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '80%', // Adjust width as desired for a long rectangle look
    maxWidth: '600px', // Optional max width to limit stretch on large screens
    display: 'flex',
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: '1.5rem',
    color: '#333',
    margin: '10px 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end', // Aligns buttons to the right
    marginTop: '10px', // Optional margin to space buttons from the content above
  },
  borrowButton: {
    padding: '10px 25px',
    backgroundColor: '#C8102E',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px', // Adds space between buttons
  },
  detailsButton: {
    padding: '10px 20px',
    backgroundColor: '#C8102E',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  detailsPopupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsPopup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  closeButton: {
    padding: '10px 20px',
    marginTop: '20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#e94e77',
    color: '#fff',
    cursor: 'pointer',
  },
  holdCloseContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  noItemsText: {
    textAlign: 'center',
  },
  libraryNameLink: {
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  browseButton: {
    backgroundColor: '#C8102E',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '8px',
    color: 'white',
    border: '#C8102E',
    borderRadius: '4px',
    cursor: 'pointer',
  }
}

export default BrowsePage;