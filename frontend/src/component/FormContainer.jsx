// FormContainer.jsx
import React from 'react';
import '../styles/FormContainer.css'; // Assurez-vous d'importer votre fichier CSS

function FormContainer({ children, title, errorMessage, onSubmit }) {
  return (
    <div className="form-wrapper"> {/* Conteneur pour centrer le formulaire */}
      <div className="form-container">
        <h2>{title}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={onSubmit} className="form">
          {children}
          <button type="submit" className="form-button">Soumettre</button>
        </form>
      </div>
    </div>
  );
}

export default FormContainer;
