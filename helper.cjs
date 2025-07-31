const config = require('./config.json');
const { borrowLimit, maximumBorrowingDays, usersData, listOfBooks} = config;


const calculateDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + maximumBorrowingDays);
  return date.toLocaleDateString(); 
};


const updateUserBorrowing = (user, book, dueDate) => ({
  ...user,
  borrowedBooks: [
    ...user.borrowedBooks,
    {
      bookId: book.bookId,
      title: book.title,
      dueDate
    }
  ]
 });


const checkOutProcess = (userId, book) => {
  const dueDate = calculateDueDate();
  book.available = false;

  return usersData.map(user =>
    user.userId === userId ? updateUserBorrowing(user, book, dueDate) : user
  );
};


const checkBookAvailability = (userId, bookId) => {
  const book = listOfBooks.find(book => book.bookId === bookId);

   return book.available
    ? checkOutProcess(userId, book)
    : "Book not available";
};


const isUserEligibleToBorrow = (user) => 
  user.borrowedBooks.length < borrowLimit;


const calculateFine = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  return today > due
    ? Math.ceil((today - due) / (1000 * 60 * 60 * 24)) * 2
    : 0;
};
 

const isBookBorrowedByUser = (user, bookId) => {
  return user && user.borrowedBooks.some(book => book.bookId === bookId);
};


const getReturnMessage = fine => 
  fine 
    ? `Book returned late. Fine amount: ₹${fine}` 
    : "Book returned successfully. No fine.";


const updateBookStatus = (bookId, listOfBooks) => 
  listOfBooks.map(book =>
    book.bookId === bookId 
      ? { ...book, available: "True" } 
      : book
  );

const updateUserBorrowedDetails = (user, bookId) => ({
  ...user,
  borrowedBooks: user.borrowedBooks.filter(book => book.bookId !== bookId)
});


const addToUserHistory = (user, borrowedBook, fine) => ({
  ...user,
  borrowingHistory: [
    ...user.borrowingHistory,
    {
      ...borrowedBook,
      returnedOn: new Date().toLocaleDateString(),
      fine
    }
  ],
  fines: user.fines + fine
});

const processBookReturn = (userId, bookId) => {
  const user = usersData.find(user => user.userId === userId);
  const borrowedBook = user.borrowedBooks.find(book => book.bookId === bookId);
 

  const fine = calculateFine(borrowedBook.dueDate);

  const updatedBooks = updateBookStatus(bookId, listOfBooks);

  const userWithoutBook = updateUserBorrowedDetails(user, bookId);

  const updatedUser = addToUserHistory(userWithoutBook, borrowedBook, fine);

  
  const updatedUsers = usersData.map(user =>
    user.userId === userId ? updatedUser : user
  );

  return {
    message: getReturnMessage(fine),
    updatedBooks,
    updatedUsers
  };
};


 module.exports = {
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser
 };