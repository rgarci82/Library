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
            setUserBorrowedBooks(data); // Assuming setUserBorrowedBooks is the state setter for borrowed books
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
  



  export async function getUserBorrowedBook(req, res) { 
    try {    
        const { UserID } = req.params; 
        console.log(`Fetching borrowed books for userID: ${UserID}`); 
        
        const BorrowedBookResult = await pool.query( 
            'SELECT b.bTitle, bb.borrowdate, bb.Duedate ' + 
            'FROM book AS b ' + 
            'JOIN bookborrowed AS bb ON bb.itemID = b.itemID ' + 
            'JOIN bookcopy AS bc ON bc.ISBN = b.ISBN ' + 
            'WHERE bb.userID = ?',  
            [UserID] 
        ); 
        

        const BorrowedBook = BorrowedBookResult[0]; 
        
        res.json(BorrowedBook); 
        
    } catch (error) { 
        console.error("Error fetching user borrowed books:", error); 
        
        res.status(500).json({ message: "Internal Server Error" }); 
    } 
}
