import bcrypt from 'bcrypt';

bcrypt.hash('simplepassword', 10, (err, hash) => {
  console.log(hash);
});