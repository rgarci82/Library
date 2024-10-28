
import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function createUser(req, res){
    try{
        const { firstName, lastName, email, phoneNum, userType, password } = req.body;

        if(!firstName || !lastName || !email || !userType || !password){
            res.status(400).json({message: "First Name, Last Name, Email, User Type, and Password are required"})
        }

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if(existingUser > 0){
            res.status(400).json({message: "Email already registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await pool.query('INSERT INTO users (firstName, lastName, email, phoneNum, userType, password) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, phoneNum || null, userType, hashedPassword]
        );

        res.status(201).json({message: "User created successfully", userID: result.insertId, email})

    } catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function loginUser(req, res){
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({message: "Email and password are required"})
        }

        const [row] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        const user = row[0]

        if(!user){
            return res.status(404).json({message: "Invalid email or password"})
        }

        const validatePassword = await bcrypt.compare(password, user.password)
        if(!validatePassword){
            return res.status(400).json({message: "Invalid email or password"})
        }

        const token = jwt.sign(
            {id: user.userID, 
            email: user.email, 
            userType: user.userType},
            process.env.JWT_KEY,
            {expiresIn: '1h'}
        )

        return res.status(200).json({
            message: "Login successful",
            token: token,
        });

    } catch (error){
        return res.status(500).json({message: error.message})
    }
}

export async function getUserProfile(req, res){
    try{
        const { userID } = req.params

        const [userProfile] = await pool.query('SELECT userID, firstName, lastName, email, phoneNum, userType FROM users WHERE userID = ?', [userID])

        if (userProfile.length == 0){
        res.status(404).json({message: "User not found"})
        }

        res.json(userProfile[0])
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function getUserFine(req, res) {
    try {
        const { userID } = req.params;
        
        console.log(`Fetching fine for userID: ${userID}`); // Log userID for debugging
        
        const fineAmountResult = await pool.query(
            `SELECT SUM(fineAmount) AS totalFine 
             FROM bookborrowed, mediaBorrowed, deviceBorrowed
             WHERE bookborrowed.userID = ? OR mediaBorrowed.userID = ? OR deviceBorrowed.userID = ?`, 
            [userID]
        );

        const totalFine = fineAmountResult[0]?.totalFine || 0;
        res.json(totalFine);
    } catch (error) {
        console.error("Error fetching user fine:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

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
/*
export async function getUserBorrowedMedia(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching borrowed media for userID: ${UserID}`);
  
      const mediaborrowedResult = await pool.query(
        `SELECT m.mTitle, mb.borrowDate, mb.dueDate 
         FROM media AS m 
         JOIN mediaborrowed AS mb ON mb.itemID = mc.itemID 
         JOIN mediacopy AS mc ON mc.MediaID = m.MediaID 
         WHERE mb.userID = ?`,
        [UserID]
      );
  
      const borrowedMedia = mediaborrowedResult;
      res.json(borrowedMedia);
    } catch (error) {
      console.error("Error fetching user borrowed media:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  
  export async function getUserBorrowedDevice(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching borrowed device for userID: ${UserID}`);
  
      const deviceborrowedResult = await pool.query(
        `SELECT d.dName, db.borrowDate, db.dueDate 
         FROM device AS d 
         JOIN deviceborrowed AS db ON d.serialNumber = db.serialNumber 
         WHERE db.userID = ?`,
        [UserID]
      );
  
      const borrowedDevice = deviceborrowedResult;
      res.json(borrowedDevice);
    } catch (error) {
      console.error("Error fetching user borrowed device:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  export async function getUserRequestedBook(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching requested book for userID: ${UserID}`);
  
      const bookRequestedResult = await pool.query(
        `SELECT requestID, ISBN, bTitle, bAuthor, publisher, genre, edition, status 
         FROM bookrequest 
         WHERE userID = ?`,
        [UserID]
      );
  
      const requestedBook = bookRequestedResult;
      res.json(requestedBook);
    } catch (error) {
      console.error("Error fetching user requested book:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  export async function getUserRequestedMedia(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching requested media for userID: ${UserID}`);
  
      const mediaRequestedResult = await pool.query(
        `SELECT requestID, ISBN, mTitle, mAuthor, publisher, genre, edition, status 
         FROM mediarequest 
         WHERE userID = ?`,
        [UserID]
      );
  
      const requestedMedia = mediaRequestedResult;
      res.json(requestedMedia);
    } catch (error) {
      console.error("Error fetching user requested media:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  export async function getUserRequestedDevice(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching requested device for userID: ${UserID}`);
  
      const bookRequestedResult = await pool.query(
        `SELECT requestID, ISBN, bTitle, serialNumber,dName, brand,model,Status 
         FROM devicerequest 
         WHERE userID = ?`,
        [UserID]
      );
  
      const requestedDevice = deviceRequestedResult;
      res.json(requestedDevice);
    } catch (error) {
      console.error("Error fetching user requested Device:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  export async function getUserBookHold(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching book hold for userID: ${UserID}`);
  
      const bookHoldResult = await pool.query(
        `SELECT holdID, userID, itemID, holddate, status 
         FROM bookhold 
         WHERE userID = ?`,
        [UserID]
      );
  
      const bookhold = bookHoldResult;
      res.json(requestedDevice);
    } catch (error) {
      console.error("Error fetching user book hold:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  export async function getUserMediaHold(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching media hold for userID: ${UserID}`);
  
      const deviceHoldResult = await pool.query(
        `SELECT holdID, userID, itemID, holddate, status 
         FROM mediahold 
         WHERE userID = ?`,
        [UserID]
      );
  
      const mediahold = mediaHoldResult;
      res.json(requestedDevice);
    } catch (error) {
      console.error("Error fetching user media hold:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  export async function getUserDeviceHold(req, res) {
    try {
      const { UserID } = req.params;
      console.log(`Fetching device hold for userID: ${UserID}`);
  
      const deviceHoldResult = await pool.query(
        `SELECT holdID, userID, itemID, holddate, status 
         FROM devicehold 
         WHERE userID = ?`,
        [UserID]
      );
  
      const devicehold = deviceHoldResult;
      res.json(requestedDevice);
    } catch (error) {
      console.error("Error fetching user device hold:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }