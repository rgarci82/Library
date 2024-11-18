import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  MediaID: string;
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
  status: string;
}

interface MonthlyRegistrationRecord {
  year: number;
  month: number;
  user_count: number;
}

interface MonthlyBookBorrow {
  year: number;
  month: string;
  books_borrowed_count: number
}

interface MonthlyBookRequest {
  year: number;
  month: string;
  books_requested_count: number
}

interface MonthlyMediaBorrow {
  year: number;
  month: string;
  media_borrowed_count: number
}

interface MonthlyMediaRequest {
  year: number;
  month: string;
  media_requested_count: number
}

interface MonthlyDeviceBorrow {
  year: number;
  month: string;
  devices_borrowed_count: number
}

interface MonthlyDeviceRequest {
  year: number;
  month: string;
  devices_requested_count: number
}

interface TotalFines {
  totalFines: number;
}

interface JwtPayload {
  id: number;
}

interface ReportData {
  title?: string;
  user?: string;
  author?: string;
  genre?: string;
  copiesAvailable?: number;
  requestedCount?: number;
  borrowedCount?: number;
  overdueCount?: number;
  fineAmount?: number;
  onHoldDuration?: string;
  requestDuration?: string;
}

interface MostBooksBorrowed{
  bTitle?: string;  
  
  bAuthor?: string;
  publisher?: string;
  genre?:string;
  ISBN?: string;
}

interface MostRequestedBooks{
  bTitle?: string;
  userID?: number; 
  bAuthor?: string;
  publisher?: string;
  genre?:string;
  ISBN?: string;
  requestCount?: number;
}

interface MostRequestedMedia{
  mTitle?: string;
  userID?: number; 
  mediaID?: number;
  mAuthor?: string;
  publisher?: string;
  genre?:string;
  edition?: number;
  requestCount?: number;
}
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("books");
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

  //reports
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<
    MonthlyRegistrationRecord[]
  >([]);
  const [monthlyBookBorrows, setMonthlyBookBorrows] = useState<MonthlyBookBorrow[]>([]);
  const [monthlyBookRequests, setMonthlyBookRequests] = useState<MonthlyBookRequest[]>([]);
  const [monthlyMediaBorrows, setMonthlyMediaBorrows] = useState<MonthlyMediaBorrow[]>([]);
  const [monthlyMediaRequests, setMonthlyMediaRequests] = useState<MonthlyMediaRequest[]>([]);
  const [monthlyDeviceBorrows, setMonthlyDeviceBorrows] = useState<MonthlyDeviceBorrow[]>([]);
  const [monthlyDeviceRequests, setMonthlyDeviceRequests] = useState<MonthlyDeviceRequest[]>([]);
  const [totalFines, setTotalFines] = useState<TotalFines | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reports, setReports] = useState<Record<string, ReportData[]>>({});
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenMedia, setIsModalOpenMedia] = useState(false);
  const [selectedRequestID, setSelectedRequestID] = useState<number | null>(null);
  const [quantityRequestBook, setQuantityRequestBook] = useState<number | "">(1);
  const [quantityRequestMedia, setQuantityRequestMedia] = useState<number | "">(1);
  const [mostBooksBorrowed, setMostBooksBorrowed] = useState<MostBooksBorrowed[]>([]);
  const [mostrequestedbooks, setMostRequestedBooks] = useState<MostRequestedBooks[]>([]);
  const [mostrequestedmedia, setMostRequestedMedia] = useState<MostRequestedMedia[]>([]);
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value === "" ? "" : Number(value));
  };

  const handleQuantityRequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantityRequestBook(value === "" ? "" : Number(value));
  };
  const handleQuantityRequestMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantityRequestMedia(value === "" ? "" : Number(value));
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
        toast.error(`Error: ${errorData}`, {
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
        return;
      }

      toast.success('Book created successfully', {
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

      setISBN("");
      setBTitle("");
      setBAuthor("");
      setPublisher("");
      setGenre("");
      setEdition("");
      setQuantity(1);
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
        toast.error(`Error: ${errorData}`, {
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
        return;
      }

      toast.success('Media created successfully', {
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

      setMediaID("");
      setMTitle("");
      setMAuthor("");
      setMPublisher("");
      setMGenre("");
      setMEdition("");
      setMQuantity(1);
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
        toast.error(`Error: ${errorData}`, {
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
        return;
      }

      toast.success('Device created successfully', {
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

      setSerialNumber("");
      setDname("");
      setBrand("");
      setModel("");
    } catch (error) {
      toast.error(`Error: ${error}.`, {
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

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
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
        `${import.meta.env.VITE_API_URL}/api/${selectedItemDelete.itemType}/${id}/softDelete`,
        {
          method: "PUT",
        }
      );

      if (response.status === 409) {
        toast.error('Error: Some copies are currently being borrowed.', {
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
        setIsDeleting(false)
        return;
      }

      toast.success('Item deleted successfully', {
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

      setIsDeleting(false);
      setSelectedItemDelete(null);
      await fetchBooks();
      await fetchDevices();
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

  const handleAccept = async (requestID: number, quantity: number | "") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/request/accept/${requestID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );
      if (response.status === 200) {
        toast.success('Request accepted.', {
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
        setIsModalOpen(false)
        fetchBookRequests();
      }
      if (response.status == 400) {
        toast.error('Request has already been processed.', {
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
      toast.error('Request has already been processed.', {
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

  const handleOpenModal = (requestID: number) => {
    setSelectedRequestID(requestID);
    setQuantityRequestBook(1);
    setIsModalOpen(true);
  };

  const handleOpenModalMedia = (requestID: number) => {
    setSelectedRequestID(requestID);
    setQuantityRequestMedia(1);
    setIsModalOpenMedia(true);
  };

  const handleCancel = () => {
    setQuantityRequestBook(1);
    setQuantityRequestMedia(1);
    setIsModalOpen(false);
    setIsModalOpenMedia(false);
    setSelectedRequestID(null);
  };

  const handleMediaAccept = async (requestID: number, quantity: number | "") => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/media/request/accept/${requestID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );
      if (response.status === 200) {
        toast.success('Request accepted.', {
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
        setIsModalOpenMedia(false)
        fetchMediaRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        toast.error('Request has already been processed.', {
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

  const handleDeviceAccept = async (requestID: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL
        }/api/devices/request/accept/${requestID}`,
        {
          method: "PUT",
        }
      );
      if (response.status === 200) {
        toast.success('Request accepted.', {
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
        fetchDeviceRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        toast.error('Request has already been processed.', {
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
        toast.success('Request denied successfully.', {
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
        fetchDeviceRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        toast.error('Request has already been processed.', {
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
        toast.success('Request denied successfully.', {
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
        fetchMediaRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        toast.error('Request has already been processed.', {
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
        toast.success('Request denied successfully.', {
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
        fetchBookRequests(); // Refresh the list after accepting
      }
      if (response.status == 400) {
        toast.error('Request has already been processed.', {
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
      console.error(error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/getBooks`,
        {
          method: 'POST',
          body: JSON.stringify({ userData })
        },
      );
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/getMedia`,
        {
          method: 'POST',
          body: JSON.stringify({ userData })
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data: Media[] = await response.json();
      setMedia(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/devices/getDevices`,
        {
          method: 'POST',
          body: JSON.stringify({ userData })
        },
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
        `${import.meta.env.VITE_API_URL}/api/media/request/all`,
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch media requests");
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
        throw new Error("Failed to fetch device requests");
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

  const fetchMonthlyBookBorrow = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/borrow/monthly`)

      const data = await response.json()
      setMonthlyBookBorrows(data)
    } catch (error) {
      console.error(error);
    }
  }


  const fetchMonthlyBookRequest = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/request/monthly`)

      const data = await response.json()
      setMonthlyBookRequests(data)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchMonthlyMediaBorrow = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/borrow/monthly`)

      const data = await response.json()
      setMonthlyMediaBorrows(data)
    } catch (error) {
      console.error(error);
    }
  }


  const fetchMonthlyMediaRequest = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/request/monthly`)

      const data = await response.json()
      setMonthlyMediaRequests(data)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchMonthlyDeviceBorrow = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/borrow/monthly`)

      const data = await response.json()
      setMonthlyDeviceBorrows(data)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchMonthlyDeviceRequest = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/request/monthly`)

      const data = await response.json()
      setMonthlyDeviceRequests(data)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTotalFineAmount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/totalFineAmount`,
        {
          method: 'GET'
        }
      );

      const data = await response.json();

      setTotalFines(data[0]);
    } catch (error) {
      console.error(error)
    }
  };

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

      if (!userData.userID) {
        console.error("User data is not available.");
        return; // Return early if userID is undefined
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const refreshItems = async () => {
    await fetchBooks();
    await fetchDevices();
    await fetchMedia();
  };

  

  const fetchMostBooksBorrowed = async (startDate: string | null, endDate: string | null) => {
    try {
      // Check if both startDate and endDate are provided
      if (!startDate || !endDate) {
        throw new Error("Start Date and End Date are required.");
      }
  
      // Make a POST request with the provided date range
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/mostborrowedbooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }), // Include the date range in the request body
      });
  
      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Update state with the fetched data (assuming you have setMostBooksBorrowed function)
      setMostBooksBorrowed(data);
  
    } catch (error) {
      // Log any errors for debugging
      console.error("Error fetching most borrowed books:", error);
    }
  };
  


//most requested
const fetchMostRequestedBooks = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/mostrequestedbooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body:JSON.stringify({startDate, endDate})
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    setMostRequestedBooks(data)
    console.log (data)
  } catch (error) {
    console.error("Error fetching most requested:", error);
  }
};

const handleFilter = () => {
  if (startDate && endDate) {
    fetchMostRequestedBooks ();
  } else {
    alert("Please select both start and end dates.");
  }
};
//most requested media
const fetchMostRequestedMedia = async () => {
  try {

    if (!startDate || !endDate) {
      throw new Error("Start Date and End Date must be provided.");
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/mostrequestedmedia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startDate, endDate }), // Send the date range in the request body
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

   
    if (Array.isArray(data)) {
      setMostRequestedMedia(data); // Update state with the fetched data
      console.log(data); // Log the response for debugging
    } else {
      throw new Error("Unexpected data format received.");
    }
  } catch (error) {
  
    console.error("Error fetching most requested:", error);
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
                  <td key={col}>{(item as any)[col] || "N/A"}</td>
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

  useEffect(() => {
    fetchUserData();
    fetchBooks();
    fetchMedia();
    fetchDevices();
    fetchBookRequests();
    fetchMediaRequests();
    fetchDeviceRequests();
    fetchTotalFineAmount();
    fetchMonthlyRegistrations();
    fetchMonthlyBookBorrow();
    fetchMonthlyBookRequest();
    fetchMonthlyMediaRequest();
    fetchMonthlyMediaBorrow();
    fetchMonthlyDeviceRequest();
    fetchMonthlyDeviceBorrow();

   
    fetchMostRequestedBooks ();
    fetchMostRequestedMedia ();
  }, []);

  const handleSignOut = () => {
    toast.success('Logged out successfully', {
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
    navigate("/");
    localStorage.clear();
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-section library-name">
          <Link to={'/'} className="admin__link">My Library</Link>
        </div>

        <div className="navbar-section search-section">
          <button className="admin__signout" onClick={() => handleSignOut()}>Sign Out</button>
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
        <div
          className={`tab ${activeTab === "deviceReports" ? "active" : ""}`}
          onClick={() => handleTabClick("deviceReports")}
        >
          Device Reports
        </div>
        <div
          className={`tab ${activeTab === "userReports" ? "active" : ""}`}
          onClick={() => handleTabClick("userReports")}
        >
          User Reports
        </div>
      </div>
      <div className="admin-info-boxes">
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
                  type="number"
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
          </div>
        )}
        {activeTab === "media" && (
          <div className="create-media-form">
            <h2>Create a New Media</h2>
            <form onSubmit={handleMediaSubmit}>
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
                  type="number"
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
                      <strong>Status:</strong> {device.status.charAt(0) + device.status.slice(1)}
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
                      <td>{request.edition ? request.edition : "N/A"}</td>
                      <td>{request.genre}</td>
                      <td>{request.publisher}</td>
                      <td>{request.status}</td>
                      <td>{request.userID}</td>
                      <td>
                        <button
                          className="accept-btn"
                          onClick={() => handleOpenModal(request.requestID)}
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
                      <td>{request.mTitle}</td>
                      <td>{request.mAuthor}</td>
                      <td>{request.edition ? request.edition : "N/A"}</td>
                      <td>{request.genre}</td>
                      <td>{request.publisher}</td>
                      <td>{request.status}</td>
                      <td>{request.userID}</td>
                      <td>
                        <button
                          className="accept-btn"
                          onClick={() => handleOpenModalMedia(request.requestID)}
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
                      <td>{request.status}</td>
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
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal--request">
              <h3>Enter Quantity</h3>
              <input
                type="number"
                min="1"
                value={quantityRequestBook}
                onChange={handleQuantityRequestChange}
              />
              <div className="modal-actions">
                <button
                  className="accept-btn"
                  onClick={() =>
                    selectedRequestID !== null &&
                    handleAccept(selectedRequestID, quantityRequestBook)
                  }
                >
                  Approve
                </button>
                <button className="deny-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {isModalOpenMedia && (
          <div className="modal-overlay">
            <div className="modal--request">
              <h3>Enter Quantity</h3>
              <input
                type="number"
                min="1"
                value={quantityRequestMedia}
                onChange={handleQuantityRequestMediaChange}
              />
              <div className="modal-actions">
                <button
                  className="accept-btn"
                  onClick={() =>
                    selectedRequestID !== null &&
                    handleMediaAccept(selectedRequestID, quantityRequestMedia)
                  }
                >
                  Approve
                </button>
                <button className="deny-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookReports" && (
            <>
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
              {renderTable(
                "Most Borrowed Books",
                mostBooksBorrowed|| [],
                ["bTitle","bAuthor", "publisher", "genre", "edition", "ISBN", ]
              )}
              
              {renderTable(
                "Most Requested Books",
                mostrequestedbooks || [],
                ["bTitle","userID","bAuthor", "publisher", "genre", "edition", "ISBN", "requestCount"]
              )}
              {renderTable(
                "Most and Least Borrowed Books",
                reports.borrowedBooksStats || [],
                ["Title", "BorrowedCount"]
              )}
              {renderTable(
                "Fulfilled and Unfulfilled Book Requests",
                reports.bookRequestsStatus || [],
                ["Title", "User", "RequestedCount"]
              )}
              {renderTable(
                "Books on Hold with Users",
                reports.booksOnHold || [],
                ["Title", "User", "OnHoldDuration"]
              )}
              {renderTable(
                "Request to Fulfillment Duration for Books",
                reports.bookRequestDuration || [],
                ["Title", "RequestDuration"]
              )}
            </>
          )}

          {activeTab === "mediaReports" && (
            <>
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
              {renderTable(
                "Most Requested Media",
                mostrequestedmedia || [],
                ["mTitle", "userID", "MediaID", "mAuthor", "publisher", "genre", "edition"]
              )}
              {renderTable(
                "List of Available Media Copies",
                reports.availableMediaCopies || [],
                ["Title", "CopiesAvailable"]
              )}
              {renderTable(
                "Currently Borrowed Media with Users",
                reports.currentlyBorrowedMedia || [],
                ["Title", "User"]
              )}
              {renderTable(
                "Most and Least Borrowed Media",
                reports.borrowedMediaStats || [],
                ["Title", "BorrowedCount"]
              )}
              {renderTable(
                "Fulfilled and Unfulfilled Media Requests",
                reports.mediaRequestsStatus || [],
                ["Title", "User", "RequestedCount"]
              )}
              {renderTable(
                "Media on Hold with Users",
                reports.mediaOnHold || [],
                ["Title", "User", "OnHoldDuration"]
              )}
              {renderTable(
                "Request to Fulfillment Duration for Media",
                reports.mediaRequestDuration || [],
                ["Title", "RequestDuration"]
              )}
            </>
          )}

          {activeTab === "deviceReports" && (
            <>
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
              {renderTable(
                "Most Requested Devices",
                reports.mostBorrowedDevices || [],
                ["Title", "User", "Brand"]
              )}
              {renderTable(
                "List of Available Devices",
                reports.availableDeviceCopies || [],
                ["Title", "Serial Number"]
              )}
              {renderTable(
                "Currently Borrowed Devices with Users",
                reports.currentlyBorrowedDevices || [],
                ["Title", "User"]
              )}
              {renderTable(
                "Most and Least Borrowed Devices",
                reports.borrowedDevicesStats || [],
                ["Title", "BorrowedCount"]
              )}
              {renderTable(
                "Fulfilled and Unfulfilled Device Requests",
                reports.deviceRequestsStatus || [],
                ["Title", "User", "RequestedCount"]
              )}
              {renderTable(
                "Devices on Hold with Users",
                reports.devicesOnHold || [],
                ["Title", "User", "OnHoldDuration"]
              )}
              {renderTable(
                "Request to Fulfillment Duration for Devices",
                reports.deviceRequestDuration || [],
                ["Title", "RequestDuration"]
              )}
            </>
          )}

          {activeTab === "userReports" && (
            <>
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
              {renderTable(
                "Most Active Borrowers",
                reports.mostActiveBorrowers || [],
                ["User", "BorrowedCount"]
              )}
              {renderTable(
                "Available Book Copies",
                reports.availableBookCopies || [],
                ["bTitle", "bAuthor", "publisher", "genre", "edition", "ISBN"]
              )}
              {renderTable(
                "Users with Most Overdue Items",
                reports.usersWithMostOverdue || [],
                ["User", "OverdueCount"]
              )}
              {renderTable(
                "Users with Current Fines",
                reports.usersWithFines || [],
                ["User", "FineAmount"]
              )}
              {renderTable(
                "Users with Unpaid Fines",
                reports.usersWithUnpaidFines || [],
                ["User", "FineAmount"]
              )}
            </>
          )}
      </div>
    </div >
  );
};

export default AdminDashboard;
