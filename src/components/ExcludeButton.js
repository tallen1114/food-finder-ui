import React, { useState } from 'react';
import Modal from 'react-modal'; // Or your preferred modal library

Modal.setAppElement('#root'); // Ensure this is set correctly for your app

const ExcludeButton = ({ upc }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [comment, setComment] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setComment(''); // Clear comment when closing
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://food-finder-api-um63.onrender.com/excludeCereal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upc, comment }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message
        console.log('Item excluded successfully!');
        closeModal();
      } else {
        // Handle error, e.g., show an error message
        console.error('Failed to exclude item');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={openModal}>Exclude</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Exclude Item Modal"
      >
        <h2>Why exclude this item? (Optional)</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default ExcludeButton;