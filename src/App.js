import React, { useState } from 'react';

// Main App component for the frontend POC with a pop-up
const App = () => {
    // State to hold the notification message
    const [notification, setNotification] = useState('');
    // State to control the visibility of the pop-up
    const [showPopup, setShowPopup] = useState(false);
    // State to track if an action is in progress to prevent multiple clicks
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle the button clicks
    const handleAction = async (actionType) => {
        // Prevent new requests if one is already in progress
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        // Clear any previous notification and hide pop-up
        setNotification('');
        setShowPopup(false);

        try {
            // Send a POST request to the backend API endpoint
            const response = await fetch('https://in-app-poc-backend-production.up.railway.app/api/action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: actionType }),
            });

            // Check if the response was successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();
            // Update the notification state with the message from the backend
            setNotification(data.message);
            // Show the pop-up after a successful action
            setShowPopup(true);
        } catch (error) {
            console.error('Error:', error);
            setNotification(`Failed to perform action: ${error.message}`);
            setShowPopup(true);
        } finally {
            // Reset the loading state
            setIsLoading(false);
        }
    };

    // Function to close the pop-up
    const closePopup = () => {
        setShowPopup(false);
        setNotification(''); // Optionally clear the message when closed
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>In-App Notification POC</h1>
            <p>Click the buttons to trigger a notification.</p>
            <div style={{ margin: '20px' }}>
                <button
                    onClick={() => handleAction('like')}
                    disabled={isLoading}
                    style={{ padding: '10px 20px', margin: '5px', borderRadius: '5px' }}
                >
                    👍 Like
                </button>
                <button
                    onClick={() => handleAction('follow')}
                    disabled={isLoading}
                    style={{ padding: '10px 20px', margin: '5px', borderRadius: '5px' }}
                >
                    ➕ Follow
                </button>
                <button
                    onClick={() => handleAction('subscribe')}
                    disabled={isLoading}
                    style={{ padding: '10px 20px', margin: '5px', borderRadius: '5px' }}
                >
                    🔔 Subscribe
                </button>
            </div>

            {/* Pop-up component controlled by the showPopup state */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 0,
                    minWidth: '250px'
                }}>
                    <h2 style={{ marginTop: 0 }}>Notification</h2>
                    <p>{notification}</p>
                    <button
                        onClick={closePopup}
                        style={{ padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Close
                    </button>
                </div>
            )}
            
        </div>
    );
};

export default App;
