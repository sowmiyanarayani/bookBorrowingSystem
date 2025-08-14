const config = require('./config.json');

const { 
  borrowLimit, 
  maximumBorrowingDays, 
  usersData, 
  listOfBooks } = config;

const milliSecondPerDay = 1000 * 60 * 60 * 24;

const currentDate = () => new Date().toLocaleDateString();

const getUserById = (userId) =>
  usersData.find(user => user.userId === userId);

const getBookById = (bookId) =>
  listOfBooks.find(book => book.bookId === bookId);

const calculateDueDate = () =>
  new Date(Date.now() + maximumBorrowingDays * milliSecondPerDay)
    .toLocaleDateString();

const updateUserBorrowing = (user, book) => ({
  ...user,
  borrowedBooks: [
    ...user.borrowedBooks,
    {
      bookId: book.bookId,
      title: book.title,
      dueDate: calculateDueDate(),
    }
  ]
});

const checkOutProcess = (userId, book) => {
  book.available = false;
  return usersData.map(user =>
    user.userId === userId ? updateUserBorrowing(user, book) : user
  );
};

const checkBookAvailability = (userId, bookId) => {
  const book = getBookById(bookId);
  return book.available
    ? checkOutProcess(userId, book)
    : "Book not Available";
};

const isUserEligibleToBorrow = (userId) => {
  const user = getUserById(userId);
  return user.borrowedBooks.length < borrowLimit;
};

const calculateFine = (dueDate) => {
  const currentDate = new Date();
  const due = new Date(dueDate);

  return currentDate > due
    ? Math.ceil((currentDate - due) / milliSecondPerDay) * 2
    : 0;
};

const isBookBorrowedByUser = (userId, bookId) => {
  const user = getUserById(userId);
  return user && user.borrowedBooks.some(book => book.bookId === bookId);
};

const getReturnStatus = (fine) =>
  fine
    ? `Book returned late. Fine amount: ₹${fine}`
    : "Book returned successfully. No fine.";

const updateBookAvailability = (bookId) =>
  listOfBooks.map(book =>
    book.bookId === bookId ? { ...book, available: true } : book
  );

const removeBookFromUser = (user, bookId) => ({
  ...user,
  borrowedBooks: user.borrowedBooks.filter(book => book.bookId !== bookId),
});

const addReturnedBookToHistory = (user, borrowedBook) => ({
  ...user,
  borrowingHistory: [
    ...user.borrowingHistory,
    {
      ...borrowedBook,
      returnedOn: currentDate().toLocaleDateString,
    }
  ]
});

const processBookReturn = (userId, bookId) => {
  const user = getUserById(userId);
  const borrowedBook = user.borrowedBooks.find(book => book.bookId === bookId);
  const fine = calculateFine(borrowedBook.dueDate);

  const updatedUser = addReturnedBookToHistory(
    removeBookFromUser(user, bookId),
    borrowedBook
  );

  const updatedUsers = usersData.map(user =>
    user.userId === userId ? updatedUser : user
  );

  const updatedBooks = updateBookAvailability(bookId);

  return {
    message: getReturnStatus(fine),
    updatedBooks,
    updatedUsers
  };
};

const addUserToReservations = (book, userId) => {
    book.reservations = [...book.reservations, userId];
  return `Book reserved successfully. Your position in queue: ${book.reservations.length}`;
};

const addReservation = (book, userId) => {
  book.reservations = book.reservations || [];
  const bookReservation = book.reservations.find(id => id === userId)

  return bookReservation
    ? "You have already reserved this book."
    : addUserToReservations(book, userId);
};

module.exports = {
  getUserById,
  getBookById,
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser,
  addReservation,
};
