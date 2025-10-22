const config = require('./config.json');

const {
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser,
  addUserToReservations,
  getBookById,
  getUserById
} = require('./helper.cjs');

const { listOfBooks, usersData } = config;


const listOfAvailableBooks = () =>
  listOfBooks.reduce(( acc, { bookId, title, author, available } ) => {
  
  return available
        ? [...acc, `${bookId}- ${title} by ${author}`] 
        : acc
  }, []);

 const borrowBook = (userId, bookId) => {
  const eligibility = isUserEligibleToBorrow(userId);
  return eligibility === true
    ? checkBookAvailability(userId, bookId)
    : eligibility;
};


// const returnBook = (userId, bookId) => 
//   isBookBorrowedByUser(userId, bookId)
//     ? processBookReturn(userId, bookId)
//     : "Book was not borrowed by this user.";

const returnBook = (userId, bookId) => {
  const borrowedStatus = isBookBorrowedByUser(userId, bookId);

  return borrowedStatus !== true
    ? borrowedStatus
    : processBookReturn(userId, bookId);
};

const searchBooks = (query) =>
  listOfBooks.reduce((acc, { bookId, title, author }) => {
     const isBookMatch = 
      title.toLowerCase().includes(query) ||
      author.toLowerCase().includes(query);

    return isBookMatch
      ? [...acc, `${bookId}. ${title} by ${author}`]
      : acc;
  }, []);

const newUsers = (...names) => {
  const lastUserId = Math.max(...usersData.map(user => user.userId));

  const newUsers = names.map((name, index) => ({
    userId: lastUserId + index + 1, 
    name,
    borrowedBooks: [],
    borrowingHistory: [],
  }));

  return [...usersData, ...newUsers];
};

 const reserveBook = (userId, bookId) => { 
   const book = getBookById(bookId); 
   return book.available
    ? "Book is available. You can borrow it instead of reserving." 
    : addUserToReservations(book, userId);};


const main = () => {
  const results = {};

  results.availableBooks = listOfAvailableBooks();

  results.borrowResult = borrowBook(2019007, 900123);

  results.returnResult = returnBook(10, 19131);

  results.searchBooks = searchBooks("sila");

  results.newUsers = newUsers("Jency", "Willison", "Rose");

  results.addReservation1 = reserveBook(2019007, 900125);
  results.addReservation2 = reserveBook(2019010, 19131);
  results.addReservation3 = reserveBook(2019010, 19131);
  results.addReservation4 = reserveBook(2019008, 19131);

  console.log("Library Operations Results:", JSON.stringify(results, null, 2));
};

main();
