const config = require('./config.json');

const { 
  borrowLimit, 
  maximumBorrowingDays, 
  usersData, 
  listOfBooks,
  finePerDay } = config;

const milliSecondPerDay = 1000 * 60 * 60 * 24;

const currentDate = new Date();

const getUserById = (userId) => {
  const user = usersData.find(user => user.userId === userId);
  return user ? user : "Not Found";
};

const getBookById = (bookId) => {
  const book = listOfBooks.find(book => book.bookId === bookId);
  return book ? book : "Not Found";
};

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
  
  if (user === "Not Found")
     return "Invalid user ID.";

   return user.borrowedBooks.length < borrowLimit
    ? true
    : "Borrow limit reached.";
};



const calculateFine = (dueDate) => {
  const due = new Date(dueDate);

  return currentDate > due
    ? Math.ceil((currentDate - due) / milliSecondPerDay) * finePerDay
    : 0;
};

// const isBookBorrowedByUser = (userId, bookId) => {
//   const user = getUserById(userId);
//   return user ? user.borrowedBooks.some(book => book.bookId === bookId) : false;
// };

const isBookBorrowedByUser = (userId, bookId) => {
  const user = getUserById(userId);
  if (user === "Not Found") 
    return "Enter a valid user ID.";

  const borrowed = user.borrowedBooks.some(book => book.bookId === bookId);
  return borrowed ? true : "Book was not borrowed by this user.";
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
      returnedOn: currentDate.toLocaleDateString,
    }
  ]
});

const getUpdatedUsersAfterReturn = (data) => {
  const { userId, bookId, borrowedBook } = data;

  return usersData.map(user =>
    user.userId === userId
      ? addReturnedBookToHistory(removeBookFromUser(user, bookId), borrowedBook)
      : user
  );
};

const processBookReturn = (userId, bookId) => {
  const user = getUserById(userId);
  const borrowedBook = user.borrowedBooks.find(book => book.bookId === bookId);
  const fine = calculateFine(borrowedBook.dueDate);

  return {
    message: getReturnStatus(fine),
    updatedBooks: updateBookAvailability(bookId),
    updatedUsers: getUpdatedUsersAfterReturn({
      userId,
      bookId,
      borrowedBook
    })
  };
};

const updateReservations = (book, userId) => {
  book.reservations = [...book.reservations, userId];
  return `Book reserved successfully. Your position in queue: ${book.reservations.length}`;
 };

const addUserToReservations = (book, userId) =>
  book.reservations.includes(userId)
    ? "You have already reserved this book."
    : updateReservations(book, userId);

module.exports = {
  getUserById,
  getBookById,
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser,
  addUserToReservations
};
