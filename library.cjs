const config = require('./config.json');
const {
  isUserEligibleToBorrow,
  checkBookAvailability,
} = require('./helper.cjs');

const { listOfBooks, usersData } = config;

const updatedListOfBooks = listOfBooks;



const listOfAvailableBooks = (updatedListOfBooks) =>
  updatedListOfBooks
    .filter(book => book.available)
    .map(({ bookId, title, author }) => `${bookId}- ${title} by ${author}`);


const borrowBook = (userId, bookId, usersData, booksData) => {
  const user = usersData.find(u => u.userId === userId);
  
  return!isUserEligibleToBorrow(user)
    ? `${user.name} has reached the borrow limit.`
    : checkBookAvailability(userId, bookId, usersData, booksData);
};

console.log("Available books:", listOfAvailableBooks(updatedListOfBooks));
console.log("Borrow result:", borrowBook(2019008, 900124, usersData, updatedListOfBooks));

