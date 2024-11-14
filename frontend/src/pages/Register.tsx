import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userType, setUserType] = useState<string>("Student");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const navigate = useNavigate();

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      if (!email || !password) {
        toast.error("Please fill in all fields", {
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
      setStep(2);
    } else {
      if (!firstName || !lastName || !userType || !phoneNum) {
        toast.error("Please fill in all fields", {
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
      if (phoneNum.length !== 10) {
        toast.error("Phone number must be exactly 10 digits", {
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

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phoneNum,
            userType,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("User created successfully", {
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
          navigate('/login/');
          // Handle successful user creation, e.g., redirect or display success message
        } else {
          toast.error(`${data.message}`, {
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
        toast.error("Failed to create user. Please try again.", {
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
  };



  return (
    <div>
      <div style={styles.navbar}>
        <div style={styles.libraryName}>
          <Link to={'/'} style={styles.libraryNameLink}>My Library</Link>
        </div>
        <div style={styles.libraryName}>
          <Link to={'/browse'} style={styles.libraryNameLink}>Browse</Link>
        </div>
      </div>
      <div style={styles.container}>
        <div style={styles.registrationBox}>
          <h1 style={styles.title}>Registration</h1>
          <form onSubmit={handleNext} style={styles.form}>
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
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>User Type</label>
                    <select
                      value={userType}
                      onChange={(e) => {
                        setUserType(e.target.value);
                      }}
                      required
                      style={styles.input}
                    >
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <button type="submit" style={styles.button}>
              {step === 1 ? "Next" : "Create Account"}
            </button>
            <div style={styles.links}>
              <a href="/login" style={styles.link}>
                Already have an account? Login here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const styles: { [key: string]: React.CSSProperties } = {
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
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    margin: '0 20px'
  },
  libraryNameLink: {
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
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

export default Register;