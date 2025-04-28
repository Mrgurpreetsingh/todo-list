// frontend/src/component/FormContainer.jsx
import React from 'react';
import '../styles/FormContainer.css';

function FormContainer({ children, title, errorMessage }) {
  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>{title}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {children}
      </div>
    </div>
  );
}

export default FormContainer;
