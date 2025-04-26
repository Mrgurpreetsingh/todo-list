import csrf from 'csurf';

// Initialise la protection CSRF
const csrfProtection = csrf({ cookie: true });

export default csrfProtection;
