const config = require('./config.json');

const {
  borrowLimit,
  maximumBorrowingDays,
  usersData,
  listOfBooks,
  finePerDay
} = config;

const milliSecondPerDay = 1000 * 60 * 60 * 24;

const currentDate = new Date();

const findUserById = (userId) =>
  usersData.find(user => user.userId === userId) || "Not Found";

const findBookById = (bookId) =>
  listOfBooks.find(book => book.bookId === bookId) || "Not Found";

const calculateDueDate = () =>
  new Date(Date.now() + maximumBorrowingDays * milliSecondPerDay)
    .toLocaleDateString();

const addBorrowedBookToUser = (user, book) => ({
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

const processBookCheckout = (userId, book) => {
  book.available = false;

  return usersData.map(user =>
    user.userId === userId ? addBorrowedBookToUser(user, book) : user
  );
};

const checkBookAvailability = (userId, bookId) => {
  const book = findBookById(bookId);

  return book.available
    ? processBookCheckout(userId, book)
    : "Book is currently unavailable.";
};

const isUserEligibleToBorrow = (userId) => {
  const user = findUserById(userId);

  if (user === "Not Found") return "Enter a valid user ID.";

  return user.borrowedBooks.length < borrowLimit
    ? true
    : "Borrow limit reached.";
};

const calculateOverdueFine = (dueDate) => {
  const due = new Date(dueDate);

  return currentDate > due
    ? Math.ceil((currentDate - due) / milliSecondPerDay) * finePerDay
    : 0;
};

const validateBookBorrowRecord = (userId, bookId) => {
  const user = findUserById(userId);
  if (user === "Not Found") return "Enter a valid user ID.";

  const borrowed = user.borrowedBooks.some(book => book.bookId === bookId);
  return borrowed ? true : "Book was not borrowed by this user.";
};

const getBookReturnMessage = (fine) =>
  fine
    ? `Book returned late. Fine amount: ₹${fine}`
    : "Book returned successfully. No fine.";

const markBookAsAvailable = (bookId) =>
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
      returnedOn: currentDate.toLocaleDateString(), 
    }
  ]
});

const getUpdatedUsersAfterReturn = (data) => {
  const { userId, bookId, borrowedBook, users } = data;

  return users.map(user =>
    user.userId === userId
      ? addReturnedBookToHistory(removeBookFromUser(user, bookId), borrowedBook)
      : user
  );
};

const handleBookReturn = (userId, bookId) => {
  const user = findUserById(userId);
  const borrowedBook = user.borrowedBooks.find(book => book.bookId === bookId);
  const fine = calculateOverdueFine(borrowedBook.dueDate);

  return {
    message: getBookReturnMessage(fine),
    updatedBooks: markBookAsAvailable(bookId),
    updatedUsers: getUpdatedUsersAfterReturn({ userId, bookId, borrowedBook }),
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
  findUserById,
  findBookById,
  isUserEligibleToBorrow,
  checkBookAvailability,
  handleBookReturn,
  validateBookBorrowRecord,
  addUserToReservations,
};
