const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
//const { seedDB } = require('./db/helper');

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.PORT) {
    throw new Error('PORT must be defined');
  }

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    //seedDB();
    //console.log('Database seeded.');
  } catch (err) {
    console.log(err);
  }

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log(`Products server listening on port ${PORT}.`)
  );
})();

// exports.handler = async (event) => {
//   if (!process.env.MONGO_URI) {
//     throw new Error('MONGO_URI must be defined');
//   }

//   if (!process.env.PORT) {
//     throw new Error('PORT must be defined');
//   }

//   if (!process.env.JWT_KEY) {
//     throw new Error('JWT_KEY must be defined');
//   }

//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('Connected to MongoDB.');

//     //seedDB();
//     //console.log('Database seeded.');
//   } catch (err) {
//     console.log(err);
//   }

//   const PORT = process.env.PORT || 3001;
//   app.listen(PORT, () =>
//     console.log(`Products server listening on port ${PORT}.`)
//   );
// };
