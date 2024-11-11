import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { useNavigate } from "react-router-dom";
type ItemType = "books" | "media" | "devices";

export interface Book {
  itemType: ItemType;
  ISBN: string;
  bTitle: string;
  bAuthor: string;
  publisher: string;
  genre: string;
  edition?: string;
}

export interface Media {
  itemType: ItemType;
  MediaID: number;
  mTitle: string;
  mAuthor: string;
  publisher: string;
  genre: string;
  edition?: number;
}

export interface Device {
  itemType: ItemType;
  dName: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: string;
}

interface BookRequest {
  ISBN: string;
  bAuthor: string;
  bTitle: string;
  edition: number;
  genre: string;
  publisher: string;
  requestID: number;
  status: string;
  userID: number;
}

interface MediaRequest {
  requestID: number;
  userID: number;
  ISBN: string;
  mTitle: string;
  mAuthor: string;
  publisher: string;
  genre: string;
  edition: number;
  status: string;
}

interface DeviceRequest {
  requestID: number;
  userID: number;
  serialNumber: string;
  dName: string;
  brand: string;
  model: string;
  Status: string;
}

interface MonthlyRegistrationRecord {
  year: number;
  month: number;
  user_count: number;
}

interface TotalFines {
  totalFines: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("books");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    Book | Media | Device | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItemDelete, setSelectedItemDelete] = useState<
    Book | Media | Device | null
  >(null);

  //books
  const [ISBN, setISBN] = useState("");
  const [bTitle, setBTitle] = useState("");
  const [bAuthor, setBAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [edition, setEdition] = useState("");
  const [quantity, setQuantity] = useState<number | "">(1);

  const [books, setBooks] = useState<Book[]>([]);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);

  //media
  const [MediaID, setMediaID] = useState("");
  const [mTitle, setMTitle] = useState("");
  const [mAuthor, setMAuthor] = useState("");
  const [mPublisher, setMPublisher] = useState("");
  const [mGenre, setMGenre] = useState("");
  const [mEdition, setMEdition] = useState("");
  const [mQuantity, setMQuantity] = useState<number | "">(1);

  const [media, setMedia] = useState<Media[]>([]);
  const [mediaRequests, setMediaRequests] = useState<MediaRequest[]>([]);

  //devices
  const [serialNumber, setSerialNumber] = useState("");
  const [dName, setDname] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceRequests, setDeviceRequests] = useState<DeviceRequest[]>([]);

  //dataQueries
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<
    MonthlyRegistrationRecord[]
  >([]);
  const [totalFines, setTotalFines] = useState<TotalFines | null>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value === "" ? "" : Number(value));
  };

  const handleMQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMQuantity(value === "" ? "" : Number(value));
  };

  const handleBookSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = {
      ISBN,
      bTitle,
      bAuthor,
      publisher,
      genre,
      edition: edition || null,
      quantity,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        return;
      }

      setErrorMessage(null);
      setSuccessMessage("Book created successfully!");

      setISBN("");
      setBTitle("");
      setBAuthor("");
      setPublisher("");
      setGenre("");
      setEdition("");
      setQuantity(1);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleMediaSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = {
      MediaID,
      mTitle,
      mAuthor,
      mPublisher,
      mGenre,
      mEdition: mEdition || null,
      mQuantity,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        return;
      }

      setErrorMessage(null);
      setSuccessMessage("Media created successfully!");

      setMediaID("");
      setMTitle("");
      setMAuthor("");
      setMPublisher("");
      setMGenre("");
      setMEdition("");
      setMQuantity(1);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleDeviceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const deviceData = {
      serialNumber,
      dName,
      brand: brand || null,
      model: model || null,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deviceData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        setSuccessMessage(null);
        return;
      }

      setErrorMessage(null);
      setSuccessMessage("Device created successfully!");

      setSerialNumber("");
      setDname("");
      setBrand("");
      setModel("");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
      setSuccessMessage(null);
    }
  };

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
    console.log("Tab changed to:", tab);
  };

  const handleEditClick = (item: Book | Media | Device) => {
    const itemWithType = {
      ...item,
      itemType: item.hasOwnProperty("bTitle")
        ? ("books" as ItemType)
        : item.hasOwnProperty("mTitle")
        ? ("media" as ItemType)
        : ("devices" as ItemType),
    };

    setSelectedItem(itemWithType);
    setIsEditing(true);
  };

  const confirmDelete = async () => {
    if (!selectedItemDelete) return;

    let id: string | number | undefined;
    if ("ISBN" in selectedItemDelete) id = selectedItemDelete.ISBN;
    else if ("MediaID" in selectedItemDelete) id = selectedItemDelete.MediaID;
    else if ("serialNumber" in selectedItemDelete)
      id = selectedItemDelete.serialNumber;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${
          selectedItemDelete.itemType
        }/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete item");

      setIsDeleting(false);
      setSelectedItemDelete(null);
      await fetchBooks();
      await fetchDevies();
      await fetchMedia();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleting(false);
    setSelectedItem(null);
  };

  const handleDeleteClick = (item: Book | Media | Device) => {
    const itemWithType = {
      ...item,
      itemType: item.hasOwnProperty("bTitle")
        ? ("books" as ItemType)
        : item.hasOwnProperty("mTitle")
        ? ("media" as ItemType)
        : ("devices" as ItemType),
    };

    setSelectedItemDelete(itemWithType);
    setIsDeleting(true);
  };

  const handleAccept = async (requestID: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/request/accept/${requestID}`,
        {
          method: "PUT",
        }
      );
      if (response.status === 200) {
        fetchBookRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        alert("This request has already been processed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMediaAccept = async (requestID: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/media/request/accept/${requestID}`,
        {
          method: "PUT",
        }
      );
      if (response.status === 200) {
        fetchMediaRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        alert("This request has already been processed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeviceAccept = async (requestID: number) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/devices/request/accept/${requestID}`,
        {
          method: "PUT",
        }
      );
      if (response.status === 200) {
        fetchDeviceRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        alert("This request has already been processed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeviceDeny = async (requestID: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices/request/deny/${requestID}`,
        {
          method: "PUT",
        }
      );
      if (response.status === 200) {
        fetchDeviceRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        alert("This request has already been processed");
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleMediaDeny = async (requestID: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/media/request/deny/${requestID}`,
        {
          method: "PUT",
        }
      );
      if (response.status === 200) {
        fetchMediaRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        alert("This request has already been processed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeny = async (requestID: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/request/deny/${requestID}`,
        {
          method: "PUT",
        }
      );
      if (response.status === 200) {
        fetchBookRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        alert("This request has already been processed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books`);
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data: Book[] = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media`);
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data: Media[] = await response.json();
      setMedia(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDevies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data: Device[] = await response.json();
      setDevices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookRequests = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/request`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBookRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMediaRequests = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/media/request`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setMediaRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeviceRequests = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices/request`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setDeviceRequests(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchMonthlyRegistrations = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user-registrations`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
      const data = await response.json();
      setMonthlyRegistrations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalFineAmount = async () => {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/totalFineAmount`, 
        {
          method: 'GET'
        }
      );

      const data = await response.json();
      
      setTotalFines(data[0]);
    }catch (error) {
      console.error(error)
    }
  }

  const refreshItems = async () => {
    await fetchBooks();
    await fetchDevies();
    await fetchMedia();
  };

  useEffect(() => {
    fetchBooks();
    fetchMedia();
    fetchDevies();
    fetchBookRequests();
    fetchMediaRequests();
    fetchDeviceRequests();
    fetchMonthlyRegistrations();
    fetchTotalFineAmount();
  }, []);

  const handleSignOut = () => {
    navigate("/");
    localStorage.clear();
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-section library-name">My Library</div>

        <div className="navbar-section search-section">
          <button onClick={() => handleSignOut()}>Sign Out</button>
        </div>
      </div>
      <div className="navbar-section tabs">
        <div
          className={`tab ${activeTab === "books" ? "active" : ""}`}
          onClick={() => handleTabClick("books")}
        >
          Create Book
        </div>
        <div
          className={`tab ${activeTab === "media" ? "active" : ""}`}
          onClick={() => handleTabClick("media")}
        >
          Create Media
        </div>
        <div
          className={`tab ${activeTab === "devices" ? "active" : ""}`}
          onClick={() => handleTabClick("devices")}
        >
          Create Device
        </div>
        <div
          className={`tab ${activeTab === "manageItems" ? "active" : ""}`}
          onClick={() => handleTabClick("manageItems")}
        >
          Manage Items
        </div>
        <div
          className={`tab ${activeTab === "itemRequests" ? "active" : ""}`}
          onClick={() => handleTabClick("itemRequests")}
        >
          Item Requests
        </div>
        <div
          className={`tab ${activeTab === "dataQueries" ? "active" : ""}`}
          onClick={() => handleTabClick("dataQueries")}
        >
          Data Queries
        </div>
      </div>
      <div className="info-boxes">
        {activeTab === "books" && (
          <div className="create-book-form">
            <h2>Create a New Book</h2>
            <form onSubmit={handleBookSubmit}>
              <div className="form-group">
                <label htmlFor="ISBN">ISBN:</label>
                <input
                  type="text"
                  id="ISBN"
                  name="ISBN"
                  value={ISBN}
                  onChange={(e) => setISBN(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bTitle">Title:</label>
                <input
                  type="text"
                  id="bTitle"
                  name="bTitle"
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bAuthor">Author:</label>
                <input
                  type="text"
                  id="bAuthor"
                  name="bAuthor"
                  value={bAuthor}
                  onChange={(e) => setBAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="publisher">Publisher:</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="genre">Genre:</label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edition">Edition (optional):</label>
                <input
                  type="text"
                  id="edition"
                  name="edition"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  min="1"
                  onChange={handleQuantityChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Create Book
              </button>
            </form>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        )}
        {activeTab === "media" && (
          <div className="create-media-form">
            <h2>Create a New Media</h2>
            <form onSubmit={handleMediaSubmit}>
              <div className="form-group">
                <label htmlFor="MediaID">MediaID:</label>
                <input
                  type="text"
                  id="MediaID"
                  name="MediaID"
                  value={MediaID}
                  onChange={(e) => setMediaID(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mTitle">Title:</label>
                <input
                  type="text"
                  id="mTitle"
                  name="mTitle"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mAuthor">Author:</label>
                <input
                  type="text"
                  id="mAuthor"
                  name="mAuthor"
                  value={mAuthor}
                  onChange={(e) => setMAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mPublisher">Publisher:</label>
                <input
                  type="text"
                  id="mPublisher"
                  name="mPublisher"
                  value={mPublisher}
                  onChange={(e) => setMPublisher(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mGenre">Genre:</label>
                <input
                  type="text"
                  id="mGenre"
                  name="mGenre"
                  value={mGenre}
                  onChange={(e) => setMGenre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mEdition">Edition (optional):</label>
                <input
                  type="text"
                  id="mEdition"
                  name="mEdition"
                  value={mEdition}
                  onChange={(e) => setMEdition(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mQuantity">Quantity:</label>
                <input
                  type="number"
                  id="mQuantity"
                  name="mQuantity"
                  value={mQuantity}
                  min="1"
                  onChange={handleMQuantityChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Create Media
              </button>
            </form>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        )}
        {activeTab === "devices" && (
          <div className="create-device-form">
            <h2>Create a New Device</h2>
            <form onSubmit={handleDeviceSubmit} className="form-container">
              <div className="form-group">
                <label htmlFor="serialNumber">Serial Number:</label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dName">Device Name:</label>
                <input
                  type="text"
                  id="dName"
                  name="dName"
                  value={dName}
                  onChange={(e) => setDname(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="brand">Brand (optional):</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Model (optional):</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="input-field"
                />
              </div>
              <button type="submit" className="submit-button">
                Create Device
              </button>
            </form>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        )}
        {activeTab === "manageItems" && (
          <div className="manage-items">
            <h2>Manage Books, Media, and Devices</h2>

            {/* Books Section */}
            <div className="category-section">
              <h3>Books</h3>
              <div className="items-row">
                {books.map((book) => (
                  <div key={book.ISBN} className="card">
                    <p>
                      <strong>Title:</strong> {book.bTitle}
                    </p>
                    <p>
                      <strong>Author:</strong> {book.bAuthor}
                    </p>
                    <p>
                      <strong>Publisher:</strong> {book.publisher}
                    </p>
                    <p>
                      <strong>Genre:</strong> {book.genre}
                    </p>
                    <p>
                      <strong>Edition:</strong> {book.edition || "N/A"}
                    </p>
                    <button onClick={() => handleEditClick(book)}>Edit</button>
                    <button onClick={() => handleDeleteClick(book)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Section */}
            <div className="category-section">
              <h3>Media</h3>
              <div className="items-row">
                {media.map((item) => (
                  <div key={item.MediaID} className="card">
                    <p>
                      <strong>Title:</strong> {item.mTitle}
                    </p>
                    <p>
                      <strong>Author:</strong> {item.mAuthor}
                    </p>
                    <p>
                      <strong>Publisher:</strong> {item.publisher}
                    </p>
                    <p>
                      <strong>Genre:</strong> {item.genre}
                    </p>
                    <p>
                      <strong>Edition:</strong> {item.edition || "N/A"}
                    </p>
                    <button onClick={() => handleEditClick(item)}>Edit</button>
                    <button onClick={() => handleDeleteClick(item)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices Section */}
            <div className="category-section">
              <h3>Devices</h3>
              <div className="items-row">
                {devices.map((device) => (
                  <div key={device.serialNumber} className="card">
                    <p>
                      <strong>Device Name:</strong> {device.dName}
                    </p>
                    <p>
                      <strong>Brand:</strong> {device.brand}
                    </p>
                    <p>
                      <strong>Model:</strong> {device.model}
                    </p>
                    <p>
                      <strong>Serial Number:</strong> {device.serialNumber}
                    </p>
                    <p>
                      <strong>Status:</strong> {device.status}
                    </p>
                    <button onClick={() => handleEditClick(device)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(device)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {isEditing && selectedItem && (
              <EditModal
                selectedItem={selectedItem}
                onClose={() => setIsEditing(false)}
                onRefresh={refreshItems}
              />
            )}
            {isDeleting && selectedItemDelete && (
              <DeleteModal
                onDeleteConfirm={confirmDelete}
                onClose={closeDeleteModal}
                itemName={selectedItemDelete.itemType}
              />
            )}
          </div>
        )}
        {activeTab == "itemRequests" && (
          <>
            <div className="book-requests">
              <h1>Book Requests</h1>
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>ISBN</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Edition</th>
                    <th>Genre</th>
                    <th>Publisher</th>
                    <th>Status</th>
                    <th>User ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookRequests.map((request) => (
                    <tr key={request.requestID}>
                      <td>{request.ISBN}</td>
                      <td>{request.bTitle}</td>
                      <td>{request.bAuthor}</td>
                      <td>{request.edition}</td>
                      <td>{request.genre}</td>
                      <td>{request.publisher}</td>
                      <td>{request.status.toUpperCase()}</td>
                      <td>{request.userID}</td>
                      <td>
                        <button
                          className="accept-btn"
                          onClick={() => handleAccept(request.requestID)}
                        >
                          Accept
                        </button>
                        <button
                          className="deny-btn"
                          onClick={() => handleDeny(request.requestID)}
                        >
                          Deny
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="media-requests">
              <h1>Media Requests</h1>
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>ISBN</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Edition</th>
                    <th>Genre</th>
                    <th>Publisher</th>
                    <th>Status</th>
                    <th>User ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaRequests.map((request) => (
                    <tr key={request.requestID}>
                      <td>{request.ISBN}</td>
                      <td>{request.mTitle}</td>
                      <td>{request.mAuthor}</td>
                      <td>{request.edition}</td>
                      <td>{request.genre}</td>
                      <td>{request.publisher}</td>
                      <td>{request.status.toUpperCase()}</td>{" "}
                      {/* Capitalized status */}
                      <td>{request.userID}</td>
                      <td>
                        <button
                          className="accept-btn"
                          onClick={() => handleMediaAccept(request.requestID)}
                        >
                          Accept
                        </button>
                        <button
                          className="deny-btn"
                          onClick={() => handleMediaDeny(request.requestID)}
                        >
                          Deny
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="media-requests">
              <h1>Device Requests</h1>
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Device Name</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Status</th>
                    <th>User ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceRequests.map((request) => (
                    <tr key={request.requestID}>
                      <td>{request.serialNumber}</td>
                      <td>{request.dName}</td>
                      <td>{request.brand}</td>
                      <td>{request.model}</td>
                      <td>{request.Status.toUpperCase()}</td>
                      <td>{request.userID}</td>
                      <td>
                        <button
                          className="accept-btn"
                          onClick={() => handleDeviceAccept(request.requestID)}
                        >
                          Accept
                        </button>
                        <button
                          className="deny-btn"
                          onClick={() => handleDeviceDeny(request.requestID)}
                        >
                          Deny
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab == "dataQueries" && (
          <>
            <div className="report-container">
              <h2>Total Fines Report</h2>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Total Fines</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="total-amount">${totalFines?.totalFines}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Monthly Registrations Report */}
            <div className="report-container">
              <h2>Monthly Registrations Report</h2>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>User Count</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyRegistrations.map((record, index) => (
                    <tr key={index}>
                      <td>{record.year}</td>
                      <td>{record.month}</td>
                      <td>{record.user_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
