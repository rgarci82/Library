import { useEffect, useState } from "react";
import { Book, Media, Device } from './AdminDashboard'; // Adjust the import based on your file structure

interface EditModalProps {
    selectedItem: Book | Media | Device | null;
    onClose: () => void;
    onRefresh: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ selectedItem, onClose, onRefresh }) => {
    const [formData, setFormData] = useState<Book | Media | Device | null>(selectedItem);

    const isBook = (item: Book | Media | Device): item is Book => {
        return item.itemType === 'books';
    };
    
    const isMedia = (item: Book | Media | Device): item is Media => {
        return item.itemType === 'media';
    };
    
    const isDevice = (item: Book | Media | Device): item is Device => {
        return item.itemType === 'devices';
    };
  
    useEffect(() => {
      setFormData(selectedItem);
    }, [selectedItem]);
  
    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }) as Book | Media | Device | null); // Ensure the correct type is returned
      };
  
    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure formData is defined
        if (!formData) {
            console.error("Form data is not defined");
            return; // Prevent the request if form data is undefined
        }

        // Determine the ID to use based on itemType
        let id: string | number | undefined;

        if (isBook(formData)) {
            id = formData.ISBN; // Use ISBN for books
        } else if (isMedia(formData)) {
            id = formData.MediaID; // Use MediaID for media
        } else if (isDevice(formData)) {
            id = formData.serialNumber; // Use serialNumber for devices
        } else {
            console.error("Invalid item type");
            return; // Prevent the request if item type is invalid
        }

        // Check if id is defined
        if (!id) {
            console.error("Item ID is not defined");
            return; // Prevent the request if ID is undefined
        }

        try {
            const response = await fetch(`http://localhost:3000/api/${formData.itemType}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            onRefresh()
            onClose()

            // Handle successful update here
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };

  
    if (!selectedItem) return null; // If no item is selected, return null
  
    return (
        <div className="edit-modal">
          <h2>Edit {selectedItem.itemType}</h2>
          <form onSubmit={handleSubmitEdit}>
            {selectedItem.itemType === 'books' && formData && 'bTitle' in formData && (
              <>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="bTitle"
                    value={formData?.bTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    name="bAuthor"
                    value={formData?.bAuthor}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Edition</label>
                  <input
                    type="text"
                    name="edition"
                    value={formData.edition || ''}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
    
            {selectedItem.itemType === 'media' && formData && 'mTitle' in formData && (
              <>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="mTitle"
                    value={formData.mTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    name="mAuthor"
                    value={formData.mAuthor}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Edition</label>
                  <input
                    type="number"
                    name="edition"
                    value={formData.edition || ''}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
    
            {selectedItem.itemType === 'devices' && formData && 'dName' in formData && (
              <>
                <div className="form-group">
                  <label>Device Name</label>
                  <input
                    type="text"
                    name="dName"
                    value={formData.dName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            
            <button type="submit" className="edit__button">Save Changes</button>
            <button type="button" onClick={onClose} className="edit__button">Cancel</button>
          </form>
        </div>
      );
    };

export default EditModal;