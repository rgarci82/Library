import { useState } from "react";
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('books');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    //books
    const [ISBN, setISBN] = useState('');
    const [bTitle, setBTitle] = useState('');
    const [bAuthor, setBAuthor] = useState('');
    const [publisher, setPublisher] = useState('');
    const [genre, setGenre] = useState('');
    const [edition, setEdition] = useState('');
    const [quantity, setQuantity] = useState(1);

    //devices
    const [serialNumber, setSerialNumber] = useState('');
    const [dName, setDname] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState(''); 


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
            const response = await fetch('http://localhost:3000/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
                return;
            }

            setErrorMessage(null);
            setSuccessMessage("Book created successfully!");

            setISBN('');
            setBTitle('');
            setBAuthor('');
            setPublisher('');
            setGenre('');
            setEdition('');
            setQuantity(1);
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred.');
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
            const response = await fetch('http://localhost:3000/api/devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deviceData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
                setSuccessMessage(null);
                return;
            } 

            setErrorMessage(null);
            setSuccessMessage("Device created successfully!");
    
            setSerialNumber('');
            setDname('');
            setBrand('');
            setModel('');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An unexpected error occurred.');
            setSuccessMessage(null);
        }
    };


    const handleTabClick = (tab: React.SetStateAction<string>) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className="navbar">
                    <div className="navbar-section library-name">
                    My Library
                    </div>
                    
                    <div className="navbar-section search-section">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search..."
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            window.location.href = '/browse';
                        }
                        }}
                    />
                    <div className="nav-icons">
                        <span>🔧</span>
                        <span>👤</span>
                    </div>
                </div>
            </div>
            <div className="navbar-section tabs">
                <div className={`tab ${activeTab === 'books' ? 'active' : ''}`} onClick={() => handleTabClick('books')}>Create Book</div>
                <div className={`tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => handleTabClick('media')}>Create Media</div>
                <div className={`tab ${activeTab === 'devices' ? 'active' : ''}`} onClick={() => handleTabClick('devices')}>Create Device</div>
            </div>
            <div className="info-boxes">
            {activeTab === 'books' && (
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
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">Create Book</button>
                        </form>
                        {successMessage && <div className="success-message">{successMessage}</div>}
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </div>
            )}
            {activeTab === 'devices' && (
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
                        <button type="submit" className="submit-button">Create Device</button>
                    </form>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
            )}
            </div>
        </div>
    )
}

export default AdminDashboard