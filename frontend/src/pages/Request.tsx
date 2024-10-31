import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number; 
}

const Request: React.FC = () => {
    const [step, setStep] = useState(1);
    const [itemType, setItemType] = useState<string>("Book");
    const [userID, setUserID] = useState<number>();
    const [bookTitle, setBookTitle] = useState<string>("");
    const [bookISBN, setISBN] = useState<string>("");
    const [bookAuthor, setBookAuthor] = useState<string>("");
    const [bookPublisher, setBookPublisher] = useState<string>("");
    const [bookGenre, setBookGenre] = useState<string>("");
    const [bookEdition, setBookEdition] = useState<string>("");

    const [mediaTitle, setMediaTitle] = useState<string>("");
    const [mediaISBN, setMediaISBN] = useState<string>("");
    const [mediaAuthor, setMediaAuthor] = useState<string>("");
    const [mediaPublisher, setMediaPublisher] = useState<string>("");
    const [mediaGenre, setMediaGenre] = useState<string>("");
    const [mediaEdition, setMediaEdition] = useState<string>("");

    const [deviceTitle, setDeviceTitle] = useState<string>("");
    const [serialNumber, setSerialNumber] = useState<string>("");
    const [brand, setBrand] = useState<string>("");
    const [model, setModel] = useState<string>("");

    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      if (step === 1) {
        if (!itemType) {
          setError("Please fill in all fields");
          return;
        }
        setStep(2);
      } else {
        if (itemType === 'Book' && (!bookTitle || !bookISBN || !bookAuthor || !bookPublisher || !bookGenre)) {
          setError("Please fill in all fields");
          return;
        }
        else if (itemType === 'Media' && (!mediaTitle || !mediaISBN || !mediaAuthor || !mediaPublisher || !mediaGenre)){
          setError("Please fill in all fields");
        }
        else if (itemType === 'Device' && (!deviceTitle || !serialNumber || !brand || !model)){
          setError("Please fill in all fields");
        }
        
        console.log(userID);
        if (itemType === 'Book'){
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/request`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userID,
                bookTitle,
                bookISBN,
                bookAuthor,
                bookPublisher,
                bookGenre,
                bookEdition,
                status: "pending"
              }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              console.log("Book request created successfully", data);
              navigate('/user/');
              // Handle successful user creation, e.g., redirect or display success message
            } else {
              setError(data.message || "An error occurred");
            }
          } catch (error) {
            setError("Failed to create book request. Please try again.");
            console.error("Error:", error);
          }
        }
        else if (itemType === 'Media'){
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/request`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userID,
                mediaTitle,
                mediaISBN,
                mediaAuthor,
                mediaPublisher,
                mediaGenre,
                mediaEdition,
                status: "pending"
              }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              console.log("Media request created successfully", data);
              navigate('/user/');
              // Handle successful user creation, e.g., redirect or display success message
            } else {
              setError(data.message || "An error occurred");
            }
          } catch (error) {
            setError("Failed to create media request. Please try again.");
            console.error("Error:", error);
          }
        }
        else if (itemType === 'Device'){
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/request`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userID,
                serialNumber,
                deviceTitle,
                brand,
                model,
                status: "pending"
              }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              console.log("Device request created successfully", data);
              navigate('/user/');
              // Handle successful user creation, e.g., redirect or display success message
            } else {
              setError(data.message || "An error occurred");
            }
          } catch (error) {
            setError("Failed to create device request. Please try again.");
            console.error("Error:", error);
          }
        }
      }
    };
    
    useEffect(() => {
      const fetchUserData = async () => {
          try {
              const token = localStorage.getItem("token");
              if (!token) throw new Error("No token found");
  
              const decoded: JwtPayload | null = jwtDecode(token);  // Decode the token
              if (!decoded || !decoded.id) throw new Error("Invalid token or ID not found");
  
              // Use decoded.id directly for fetching user data
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${decoded.id}`, {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
              });
  
              if (!response.ok) {
                const errorMessage = await response.text(); // Fetch the error message
                throw new Error(`Failed to fetch user data: ${errorMessage}`);
              }
  
              const data = await response.json();
              setUserID(data.userID);
          } catch (error) {
              console.error("Error:", error);
          }
      };
  
      fetchUserData();
  }, []);


  return (
    <div style={styles.container}>
      <div style={styles.registrationBox}>
        <h1 style={styles.title}>Registration</h1>
        <form onSubmit={handleNext} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          {step === 1 && (
            <>
              <div style={styles.inputGroup}>
                  <label style={styles.label}>Item Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => {
                      setItemType(e.target.value);
                    }}
                    required
                    style={styles.input}
                  >
                    <option value="Book">Book</option>
                    <option value="Media">Media</option>
                    <option value="Device">Device</option>
                  </select>
                </div>
            </>
          )}
          {step === 2 && itemType === 'Book' && (
            <>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Book Title</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setBookTitle(sanitizedValue);
                    }}
                    placeholder="Enter the book title"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ISBN</label>
                  <input
                    type="text"
                    value={bookISBN}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setISBN(sanitizedValue);
                    }}
                    placeholder="Enter the ISBN"
                    required
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Book Author</label>
                  <input
                    type="text"
                    value={bookAuthor}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setBookAuthor(sanitizedValue);
                    }}
                    placeholder="Enter the author"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Book Publisher</label>
                  <input
                    type="text"
                    value={bookPublisher}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setBookPublisher(sanitizedValue);
                    }}
                    placeholder="Enter the publisher"
                    required
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Genre</label>
                  <input
                    type="text"
                    value={bookGenre}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setBookGenre(sanitizedValue);
                    }}
                    placeholder="Enter the genre"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Edition (Optional)</label>
                  <input
                    type="text"
                    value={bookEdition}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                      setBookEdition(sanitizedValue);
                    }}
                    placeholder="Enter the edition"
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}
          {step === 2 && itemType === 'Media' && (
            <>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Media Title</label>
                  <input
                    type="text"
                    value={mediaTitle}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setMediaTitle(sanitizedValue);
                    }}
                    placeholder="Enter the media title"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ISBN</label>
                  <input
                    type="text"
                    value={mediaISBN}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setMediaISBN(sanitizedValue);
                    }}
                    placeholder="Enter the ISBN"
                    required
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Media Author</label>
                  <input
                    type="text"
                    value={mediaAuthor}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setMediaAuthor(sanitizedValue);
                    }}
                    placeholder="Enter the author"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Media Publisher</label>
                  <input
                    type="text"
                    value={mediaPublisher}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setMediaPublisher(sanitizedValue);
                    }}
                    placeholder="Enter the publisher"
                    required
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Genre</label>
                  <input
                    type="text"
                    value={mediaGenre}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setMediaGenre(sanitizedValue);
                    }}
                    placeholder="Enter the genre"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Edition (Optional)</label>
                  <input
                    type="text"
                    value={mediaEdition}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                      setMediaEdition(sanitizedValue);
                    }}
                    placeholder="Enter the edition"
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}
          {step === 2 && itemType === 'Device' && (
            <>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Device Title</label>
                  <input
                    type="text"
                    value={deviceTitle}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setDeviceTitle(sanitizedValue);
                    }}
                    placeholder="Enter the device title"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Serial Number</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setSerialNumber(sanitizedValue);
                    }}
                    placeholder="Enter the serial number"
                    required
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setBrand(sanitizedValue);
                    }}
                    placeholder="Enter the brand"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value;
                      setModel(sanitizedValue);
                    }}
                    placeholder="Enter the model"
                    required
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}
          <button type="submit" style={styles.button}>
            {step === 1 ? "Next" : "Request Item"}
          </button>
        </form>
      </div>
    </div>
  );
};


const styles : { [key: string]: React.CSSProperties }= {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#007BFF",
      padding: "20px",
      backgroundImage: `url('/Background.png')`
    },
    registrationBox: {
      width: "52.5vw",
      minHeight: "40vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    error: {
      color: "#d9534f",
      marginBottom: "10px",
    },
    row: {
      display: "flex",
      gap: "20px", // Ensures equal spacing between input groups
      flexWrap: "wrap",
      marginBottom: "20px", // Provides equal spacing between the rows
    },
    
    inputGroup: {
      flex: "1 1 calc(50% - 10px)", // Ensures equal width for each input group
      minWidth: "200px",
      // Removed the marginBottom from here, so the spacing is uniform across rows
    },
    label: {
      display: "block",
      marginBottom: "5px",
      color: "#555",
    },
    input: {
      width: "100%",
      height: "7.5vh",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      fontSize: "16px",
      boxSizing: "border-box",
      backgroundColor: "#f9f9f9",
      color: "#333333",
      margin: "0",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      backgroundColor: "#fff",
      color: "#333",
      boxSizing: "border-box",
      minHeight: "100px",
      resize: "vertical",
    },
    button: {
      backgroundColor: "red",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "20px",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: "0",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      zIndex: "1000",
      maxHeight: "150px",
      overflowY: "auto",
      boxSizing: "border-box",
    },
    dropdownItem: {
      padding: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      color: "#333",
    },
    dropdownItemSelected: {
      backgroundColor: "#007BFF",
      color: "#fff",
    },
    links: {
      marginTop: "15px",
      display: "flex",
      justifyContent: "center",
    },
    link: {
      color: "red",
      textDecoration: "none",
    },
  };

  export default Request;