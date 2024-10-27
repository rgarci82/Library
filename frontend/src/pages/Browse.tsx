import React, { useState } from 'react';
import './User.css';

// Define the type for each item
interface Item {
  id: number;
  name: string;
  author: string; // New field for author
  publisher: string; // New field for publisher
  status: string; // New field for status
  type: 'book' | 'media' | 'device'; // New field for item type
  description: string; // Description will be generated based on type
}

// Sample data - Replace this with data from an API
const mockItems: Item[] = [
  { id: 1, name: 'Item 1', author: 'Book Author 1', publisher: 'Publisher 1', status: 'Available', type:
  'book', description: 'Book Title, Book Author, Book Publisher, Available' },
  { id: 2, name: 'Item 2', author: 'Book Author 2', publisher: 'Publisher 2', status: 'Borrowed', type:
  'book', description: 'Book Title, Book Author, Book Publisher, Borrowed' },
  { id: 3, name: 'Item 3', author: 'Book Author 3', publisher: 'Publisher 3', status: 'Available', type:
  'book', description: 'Book Title, Book Author, Book Publisher, Available' },
  { id: 4, name: 'Item 4', author: 'Book Author 4', publisher: 'Publisher 4', status: 'Available', type:
  'book', description: 'Book Title, Book Author, Book Publisher, Available' },
  { id: 5, name: 'Item 5', author: 'Book Author 5', publisher: 'Publisher 5', status: 'Available', type:
  'book', description: 'Book Title, Book Author, Book Publisher, Available' },
  { id: 6, name: 'Item 6', author: 'Media Author 1', publisher: 'Publisher 6', status: 'Available', type:
  'media', description: 'Media Title, Media Author, Media Publisher, Available' },
  { id: 7, name: 'Item 7', author: 'Media Author 2', publisher: 'Publisher 7', status: 'Available', type:
  'media', description: 'Media Title, Media Author, Media Publisher, Available' },
  { id: 8, name: 'Item 8', author: 'Media Author 3', publisher: 'Publisher 8', status: 'Available', type:
  'media', description: 'Media Title, Media Author, Media Publisher, Available' },
  { id: 9, name: 'Item 9', author: 'Media Author 4', publisher: 'Publisher 9', status: 'Available', type:
  'media', description: 'Media Title, Media Author, Media Publisher, Available' },
  { id: 10, name: 'Item 10', author: 'Media Author 5', publisher: 'Publisher 10', status: 'Available',
  type: 'media', description: 'Media Title, Media Author, Media Publisher, Available' },
  { id: 11, name: 'Item 11', author: 'Device Brand 1', publisher: 'Publisher 11', status: 'Available',
  type: 'device', description: 'Device Title, Device Brand, Device Model, Available' },
  { id: 12, name: 'Item 12', author: 'Device Brand 2', publisher: 'Publisher 12', status: 'Available',
  type: 'device', description: 'Device Title, Device Brand, Device Model, Available' },
  { id: 13, name: 'Item 13', author: 'Device Brand 3', publisher: 'Publisher 13', status: 'Available',
  type: 'device', description: 'Device Title, Device Brand, Device Model, Available' },
  { id: 14, name: 'Item 14', author: 'Device Brand 4', publisher: 'Publisher 14', status: 'Available',
  type: 'device', description: 'Device Title, Device Brand, Device Model, Available' },
  { id: 15, name: 'Item 15', author: 'Device Brand 5', publisher: 'Publisher 15', status: 'Available',
  type: 'device', description: 'Device Title, Device Brand, Device Model, Available' },
  ];


const BrowsePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('book'); // Default search option
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // State for selected item

  // Filter items based on search term and type
  const filteredItems = mockItems.filter(item => {
    const searchValue = searchTerm.toLowerCase();
    const matchesType = (searchBy === 'book' && item.type === 'book') ||
    (searchBy === 'media' && item.type === 'media') ||
    (searchBy === 'device' && item.type === 'device');

    return matchesType && (item.name.toLowerCase().includes(searchValue) ||
      item.author.toLowerCase().includes(searchValue) ||
      item.publisher.toLowerCase().includes(searchValue));
    });

    // Function to handle opening the details popup
    const openDetails = (item: Item) => {
    setSelectedItem(item);
    };

    // Function to close the details popup
    const closeDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <div>
      <div style={styles.navbar}>
        <div style={styles.libraryName}>My Library</div>
        
        <div style={styles.navIcons}>
          <span>🔧</span>
          <span>👤</span>
        </div>
      </div>
      </div>
      <div style={styles.browseContainer}>
        <header style={styles.textContainer}>
          {/*browsing header texts*/}
          <h1 style={styles.headerTitle}>Browse Items</h1>
          <p style={styles.headerSubtitle}>Find the perfect item for you!</p>

          {/*drop down selections*/}
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={styles.dropdown}
          >
            <option value="book">Book</option>
            <option value="media">Media</option>
            <option value="device">Device</option>
          </select>

          {/*request button*/}
          <button
            style={styles.requestButton}
            onClick={() => alert('Redirecting to request page...')}
          >
            Request an Item
          </button>

          {/*search bar*/}
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)'}
              onBlur={(e) => e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)'}
            />
          </div>

          {/*items grid*/}
          <div style={styles.itemsGridContainer}>
            <div style={styles.itemsGrid}>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div key={item.id} style={styles.itemCard}>
                    <h3 style={styles.itemTitle}>{item.name}</h3>
                    <div style={styles.checkboxContainer}>
                      <input type="checkbox" id={`borrow-${item.id}`} style={{ marginRight: '5px' }} />
                      <label htmlFor={`borrow-${item.id}`}>Borrow</label>
                      <input type="checkbox" id={`hold-${item.id}`} style={{ marginLeft: '10px', marginRight: '5px' }} />
                      <label htmlFor={`hold-${item.id}`}>Hold</label>
                    </div>
                    <button onClick={() => openDetails(item)} style={styles.detailsButton}>Details</button>
                  </div>
                ))
              ) : (
                <p style={styles.noItemsText}>No items found.</p>
              )}
            </div>
          </div>
          
          {/*details button*/}
          {selectedItem && (
            <div style={styles.detailsPopupOverlay}>
              <div style={styles.detailsPopup}>
                <h2 style={styles.itemTitle}>{selectedItem.name}</h2>
                <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '5px' }}>Author: {selectedItem.author}</p>
                <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '5px' }}>Publisher: {selectedItem.publisher}</p>
                <p style={{ fontSize: '1.2rem', color: '#777' }}>Status: {selectedItem.status}</p>
                <button onClick={closeDetails} style={styles.closeButton}>Close</button>
              </div>
            </div>
          )}
        </header>
      </div>
    </div>
    
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  libraryName: {
    backgroundColor: '#C8102E',
    fontWeight: 'bold',
    fontSize: '24px',
    justifyContent: 'center',
    padding: '10px',
  },
  navIcons: {
    display: 'flex',
    gap: '10px',
    marginLeft: 'auto',
    fontSize: '1.5rem',
  },
  browseContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundImage: `url('/Background.png')`,
    height: '100%',
  },
  textContainer: {
    height: '100%',
    textAlign: 'center',
    marginBottom: '10px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    
  },
  headerTitle: {
    fontSize: '2.5rem',
    color: 'black',
  },
  headerSubtitle: {
    fontSize: '1.2rem',
    color: 'black',
  },
  dropdown: {
    padding: '10px',
    width: '15vh',
    height: '7vh',
    margin: '10px 0',
    fontSize: '16px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    outline: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.3s ease',
  },
  requestButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 15px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#C8102E',
    color: '#fff',
    cursor: 'pointer',
  },
  searchBar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '12px 20px',
    fontSize: '16px',
    width: '100%',
    height: '7vh',
    maxWidth: '500px',
    borderRadius: '25px',
    border: '1px solid #ddd',
    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
    outline: 'none',
    transition: 'box-shadow 0.3s ease',
    backgroundColor: '#f7f7f7',
  },
  itemsGridContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Aligns grid at the top of the container
    height: '500px', // Set height to control scroll area
    overflowY: 'auto', // Adds vertical scroll
    padding: '10px',
    width: '100%',
    backgroundColor: '#f5f5f5', // Optional background color
  },
  itemsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center', // Centers each card horizontally
    width: '100%', // Ensures full width within the container
  },
  itemCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'left',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '80%', // Adjust width as desired for a long rectangle look
    maxWidth: '600px', // Optional max width to limit stretch on large screens
    display: 'flex',
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: '1.5rem',
    color: '#333',
    margin: '10px 0',
  },
  checkboxContainer: {
    marginBottom: '10px',
  },
  detailsButton: {
    padding: '5px 10px',
    backgroundColor: '#C8102E',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  detailsPopupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsPopup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  closeButton: {
    padding: '10px 20px',
    marginTop: '20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#e94e77',
    color: '#fff',
    cursor: 'pointer',
  },
  noItemsText: {
    textAlign: 'center',
  }
}
  
export default BrowsePage;

