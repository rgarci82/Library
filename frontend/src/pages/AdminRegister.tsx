import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRegister: React.FC = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNum, setPhoneNum] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
  
    const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (step === 1) {
        if (!email || !password) {
          setError("Please fill in all fields");
          return;
        }
        setStep(2);
      } else {
        if (
          !firstName ||
          !lastName ||
          !phoneNum 
        ) {
          setError("Please fill in all fields");
          return;
        }
        if (phoneNum.length !== 10){
          setError("Phone number must be exactly 10 digits");
          return;
        }
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              phoneNum,
              password,
            }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            navigate('/login');
            // Handle successful user creation, e.g., redirect or display success message
          } else {
            setError(data.message || "An error occurred");
          }
        } catch (error) {
          setError("Failed to create admin. Please try again.");
          console.error("Error:", error);
        }
      }
    };


  return (
    <div style={styles.container}>
      <div style={styles.registrationBox}>
        <h1 style={styles.title}>Admin Register</h1>
        <form onSubmit={handleNext} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          {step === 1 && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={styles.input}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      // Allow only alphabetic characters and spaces
                      const sanitizedValue = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                      setFirstName(sanitizedValue);
                    }}
                    placeholder="Enter your first name"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      );
                      setLastName(sanitizedValue);
                    }}
                    placeholder="Enter your last name"
                    required
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.row}>
              <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="text"
                    value={phoneNum}
                    onChange={(e) => {
                      // Allow only numeric values
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      setPhoneNum(sanitizedValue);
                    }}
                    placeholder="Enter your phone number"
                    required
                    style={styles.input}
                  />
                </div>
                
              </div>
            </>
          )}
          <button type="submit" style={styles.button}>
            {step === 1 ? "Next" : "Create Account"}
          </button>
          <div style={styles.links}>
            <a href="/AdminLogin" style={styles.link}>
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
      height: "100vh",
      backgroundColor: "#007BFF",
      backgroundImage: `url('/Background.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    registrationBox: {
      width: "52.5vw",
      minHeight: "50vh",
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
      color: "#C8102E",
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
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px",
    },
    inputGroup: {
      flex: "1 1 calc(50% - 10px)",
      minWidth: "300px",
      marginBottom: "10px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      color: "#555",
    },
    input: {
      width: "100%",
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
    multiSelectContainer: {
      position: "relative",
      cursor: "pointer",
    },
    multiSelect: {
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "10px",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      backgroundColor: "#fff",
      minHeight: "40px",
      boxSizing: "border-box",
    },
    selectedSkills: {
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
      color: "#808080",
      marginBottom: "5px",
    },
    skillTag: {
      backgroundColor: "#007BFF",
      color: "#fff",
      padding: "5px 10px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
    },
    clearTag: {
      marginLeft: "5px",
      cursor: "pointer",
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
    availabilityCheckbox: {
      marginRight: "10px",
    },
    availabilityOption: {
      display: "flex",
      alignItems: "center",
      marginBottom: "5px",
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

  export default AdminRegister;