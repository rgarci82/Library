import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Request: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userType, setUserType] = useState<string>("Student");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || !userType || !phoneNum) {
      setError("Please fill in all fields");
      return;
    }
    if (phoneNum.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNum,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User created successfully", data);
        navigate('/login/');
        // Handle successful user creation, e.g., redirect or display success message
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("Failed to create user. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registrationBox}>
        <h1 style={styles.title}>Registration</h1>
        <form onSubmit={handleNext} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Item Type</label>
              <select
                value={userType}
                onChange={(e) => {
                  console.log(e.target.value);
                  setUserType(e.target.value);
                }}
                required
                style={styles.input}
              >
                <option value="Book">Book</option>
                <option value="Media">Media</option>
                <option value="Device">Media</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="text"
                value={phoneNum}
                onChange={(e) => {
                  // Allow only numeric values
                  const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
                  setPhoneNum(sanitizedValue);
                }}
                placeholder="Enter your phone number"
                required
                style={styles.input}
              />
            </div>
          </div>
          <button type="submit" style={styles.button}>
            {"Request Item"}
          </button>
          <div style={styles.links}>
            <a href="/login" style={styles.link}>
              Already have an account? Login here
            </a>
          </div>
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