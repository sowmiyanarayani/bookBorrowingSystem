const config = require('./config.json');
const { listOfBooks, usersData } = config;

const getRandomNumber =(min,max)=> Math.floor(Math.random() * (max - min + 1)) +min;
const getRandomId = () => getRandomNumber(100000,999999);

const addBookIds = () => listOfBooks.map(book => ({
    id: getRandomId(),
    ...book
  }));

const addUserIds = () => usersData.map(user => ({
    userId: getRandomId(),
    ...user
  }));

  
 
  console.table(addBookIds())
  console.table(addUserIds())