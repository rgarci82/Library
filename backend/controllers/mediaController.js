import pool from '../config/db.js'

export async function getMedia(req, res){
    try {
        const [rows] = await pool.query('SELECT * FROM media')

        res.json(rows)
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function createMedia(req, res){
    const { MediaID, mTitle, mAuthor, publisher, genre, edition } = req.body;

    if(!MediaID || !mTitle || !mAuthor || !publisher || !genre){
        return res.status(400).json({ message: 'MediaID, Title, Author, Publisher, and Genre are required.' });
    }

    try{
        const [result] = await pool.query('INSERT INTO media (MediaID, mTitle, mAuthor, publisher, genre, edition) VALUES (?, ?, ?, ?, ?, ?)',
        [MediaID, mTitle, mAuthor, publisher, genre, edition || null]
        );
        
        res.status(201).json({message: "Media created successfully", MediaID: MediaID})
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function getMediaByID(req, res){
    try{
        const { MediaID } = req.params;
        const [result] = await pool.query('SELECT * FROM device WHERE MediaID = ?',
            [MediaID]
        );
        if (result.length == 0){
            return res.status(404).json({message: 'Media not found'})
        }
        res.json(result[0])
    } catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function updateMedia(req, res){
    try{
        const { MediaID } = req.params
        const { mTitle, mAuthor, publisher, genre, edition } = req.body;

        if(!mTitle || !mAuthor || !publisher || !genre){
            return res.status(400).json({ message: 'Title, Author, Publisher, and Genre are required.' });
        }    

        const [result] = await pool.query('UPDATE media SET mTitle = ?, mAuthor = ?, publisher = ? genre = ? edition = ? WHERE MediaID = ?',
            [mTitle, mAuthor, publisher, genre, edition || null, MediaID]
        );

        if(result.affectedRows == 0){
            res.status(404).json({message: "Media not found"});
        }

        res.json({message: "Media updated successfully"});
    }catch (error){
        res.status(500).json({message: error.message});
    }
}

export async function deleteMedia(req, res){
    try{
        const { MediaID } = req.params;

        const [result] = await pool.query('DELETE FROM device WHERE MediaID = ?',
            [MediaID]
        );

        if(result.affectedRows == 0){
            res.status(404).json({message: "Media not found"})
        }

        res.json({message: 'Media deleted successfully'});
    } catch (error){
        res.status(500).json({message: error.message})
    }
}