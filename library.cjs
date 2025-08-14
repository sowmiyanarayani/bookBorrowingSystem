const config = require('./config.json');

const {
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser,
  addReservation,
  getUserById,
  getBookById,
} = require('./helper.cjs');

const { listOfBooks, usersData } = config;


const listOfAvailableBooks = () =>
  listOfBooks.reduce(( acc, { bookId, title, author, available } ) => {
  
  return available
        ? [...acc, `${bookId}- ${title} by ${author}`] 
        : acc
  }, []);



const borrowBook = (userId, bookId) => 
  isUserEligibleToBorrow(userId, bookId)
    ? checkBookAvailability(userId, bookId)
    : "Borrow limit reached.";


const returnBook = (userId, bookId) => 
  isBookBorrowedByUser(userId, bookId)
    ? processBookReturn(userId, bookId)
    : "Book was not borrowed by this user.";



const searchBooks = (query) =>
  listOfBooks.reduce((acc, { bookId, title, author }) => {
     const isBookMatch = 
      title.toLowerCase().includes(query) ||
      author.toLowerCase().includes(query);

    return isBookMatch
      ? [...acc, `${bookId}. ${title} by ${author}`]
      : acc;
  }, []);

  

const addUser = (...names) => {
  const userIds = usersData.map(user => user.userId);
  const lastUserId = Math.max(...userIds);

  const newUser = names.map((name, index) => ({
    userId: lastUserId + index + 1, 
    name,
    borrowedBooks: [],
    borrowingHistory: [],
  }));

  return [...usersData, ...newUser];
};


const reserveBook = (userId, bookId) => {
  const book = getBookById(bookId);

   return book.available
    ? "Book is available. You can borrow it instead of reserving."
    : addReservation(book, userId);
};

console.log("Available books:", listOfAvailableBooks());
console.log("Borrow result:",JSON.stringify( borrowBook(2019007, 900123), null, 2));
console.log("Return result:",JSON.stringify( returnBook(2019010, 19131), null, 2));
console.log("Search books", searchBooks("sila"));
console.log("addUser:", JSON.stringify(addUser(usersData,"Jency","willison","Rose"), null, 2));
console.log("add reservation:",reserveBook(2019007, 900125))
console.log("add reservation:",reserveBook(2019010, 19131))
console.log("add reservation:",reserveBook(2019010, 19131))

