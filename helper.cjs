const config = require('./config.json');
const { listOfBooks, usersData } = config;

const getRandomNumber =(min,max)=> Math.floor(Math.random() * (max - min + 1)) +min;
const getRandomId = () => getRandomNumber(100000,999999);

const addBookIds = (books) => {
  const usedBookIds = new Set();
  return books.map(book => ({
    id: getRandomId(usedBookIds),
    ...book
  }));
};

const addUserIds = (users) => {
  const usedUserIds = new Set();
  return users.map(user => ({
    userId: getRandomId(usedUserIds),
    ...user
  }));
}
  
  const updatedBooks = addBookIds(listOfBooks);
  console.table(updatedBooks)
  
  const updatedUsers = addUserIds(usersData);
  console.table(updatedUsers)