const config = require('./config.json');

const {
  isUserEligibleToBorrow,
  checkBookAvailability,
  handleBookReturn,
  validateBookBorrowRecord,
  addUserToReservations,
  findBookById,
} = require('./helper.cjs');

const { listOfBooks, usersData } = config;

const booksCatalog = () =>
  listOfBooks.reduce((acc, { bookId, title, author, available }) => {
    return available
      ? [...acc, `${bookId} - ${title} by ${author}`]
      : acc;
  }, []);

const bookBorrowProcess = (userId, bookId) => {
  const eligibility = isUserEligibleToBorrow(userId);
  return eligibility === true
    ? checkBookAvailability(userId, bookId)
    : eligibility;
};

const processBookReturn = (userId, bookId) => {
  const borrowedStatus = validateBookBorrowRecord(userId, bookId);
  return borrowedStatus === true
    ? handleBookReturn(userId, bookId)
    : borrowedStatus;
};

const searchBook = (query) =>
  listOfBooks.reduce((acc, { bookId, title, author }) => {
    const isBookMatch =
      title.toLowerCase().includes(query.toLowerCase()) ||
      author.toLowerCase().includes(query.toLowerCase());

    return isBookMatch
      ? [...acc, `${bookId}. ${title} by ${author}`]
      : acc;
  }, []);

const addNewUsers = (...names) => {
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
  const book = findBookById(bookId);
  return book.available
    ? "Book is available. You can borrow it instead of reserving."
    : addUserToReservations(book, userId);
};

const getLibraryOperationSummary = () => ({
  availableBooks: booksCatalog(),
  borrowResult: bookBorrowProcess(207, 900123),
  returnResult: processBookReturn(10, 19131),
  searchBooks: searchBook("sila"),
  registeredUsers: addNewUsers("Jency", "Willison", "Rose"),
  reservations: [
    reserveBook(2019007, 900125),
    reserveBook(2019010, 19131),
    reserveBook(2019010, 19131),
    reserveBook(2019008, 19131),
  ],
});


const main = () =>
  console.log("Library Operation Results:", JSON.stringify(getLibraryOperationSummary(), null, 2));

main();
