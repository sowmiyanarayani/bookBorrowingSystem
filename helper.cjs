const config = require('./config.json');
const { listOfBooks, usersData } = config;

const getRandomNumber =(min,max)=> Math.floor(Math.random() * (max - min + 1)) +min;
const getRandomId = () => getRandomNumber(100000,999999);

const addBookIds = () => listOfBooks.map(book => ({
    bookId: getRandomId(),
    ...book
  }));

const addUserIds = () => usersData.map(user => ({
    userId: getRandomId(),
    ...user
  }));
const updatedListOfBooks = addBookIds()
const updatedUsersData= addUserIds();

 const listOfAvailableBooks = (updatedListOfBooks) =>
  updatedListOfBooks
    .filter(book => book.available)
    .map(({ bookId, title, author }) => `${bookId}- ${title} by ${author}`);

  console.table(updatedListOfBooks)
  console.table(updatedUsersData)
  console.log(listOfAvailableBooks(updatedListOfBooks))