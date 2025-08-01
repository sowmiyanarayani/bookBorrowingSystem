const config = require('./config.json');
const {
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser
  
  } = require('./helper.cjs');

const { listOfBooks, usersData } = config;


const listOfAvailableBooks = () =>
listOfBooks
    .filter(book => book.available)
    .map(({ bookId, title, author }) => `${bookId}- ${title} by ${author}`);


const borrowBook = (userId, bookId) => {
  const user = usersData.find(user => user.userId === userId);
  
  return !isUserEligibleToBorrow(user)
    ? `${user.name} has reached the borrow limit.`
    : checkBookAvailability(userId, bookId, usersData);
};


const returnBook = (userId, bookId) => !isBookBorrowedByUser
      ? "Book was not borrowed by this user." 
      : processBookReturn(userId, bookId);


const searchBooks = (query) => listOfBooks
   .filter(book =>
     book.title.toLowerCase().includes(query) ||
     book.author.toLowerCase().includes(query))
    .map(book => `${book.bookId}. ${book.title} by ${book.author}`);

  
const registerUser = (name) => {
  let lastUserId = 192010;
  const newUser = {
    userId: ++lastUserId, 
    name,
    borrowedBooks: [],
    history: []
  };

  return [...usersData, newUser]; 
};

console.log("Available books:", listOfAvailableBooks(listOfBooks));
console.log("Borrow result:",JSON.stringify( borrowBook(2019007, 900124, usersData, listOfBooks),null,2));
console.log("Return result:",JSON.stringify( returnBook(2019010, 19131, usersData, listOfBooks),null,2));
console.log("borrow book:", borrowBook(2019007, 900124, usersData, listOfBooks))
//console.log("Return book:", returnBook(2019010, 900126, usersData, listOfBooks))
console.log("Search books", searchBooks("pancha"))
console.log("user registration:", registerUser("Jency", usersData))

