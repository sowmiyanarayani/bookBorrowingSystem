const config = require('./config.json');
const { borrowLimit, maximumBorrowingDays, finePerDay} = config;

const getRandomNumber =(min,max)=> Math.floor(Math.random() * (max - min + 1)) +min;
const getRandomId = () => getRandomNumber(100000,999999);

/*const addBookIds = () => listOfBooks.map(book => ({
    bookId: getRandomId(),
    ...book
  }));

const addUserIds = () => usersData.map(user => ({
    userId: getRandomId(),
    ...user
  }));
*/
const calculateDueDate = () =>
  new Date(Date.now() + maximumBorrowingDays * 86400000).toLocaleDateString();


const updateUserBorrowing = (user, book, dueDate) => ({
  ...user,
  borrowedBooks: [
    ...user.borrowedBooks,
    {
      bookId: book.bookId,
      title: book.title,
      dueDate
    }
  ],
  borrowingHistory: [
    ...user.borrowingHistory,
    {
      bookId: book.bookId,
      title: book.title,
      dueDate
    }
  ]
});


const checkOutProcess = (userId, book, usersData) => {
  const dueDate = calculateDueDate();
  book.available = false;

  return usersData.map(user =>
    user.userId === userId ? updateUserBorrowing(user, book, dueDate) : user
  );
};


const checkBookAvailability = (userId, bookId, usersData, booksData) => {
  const book = booksData.find(b => b.bookId === bookId);

   return book.available
    ? checkOutProcess(userId, book, usersData)
    : "Book not available";
};


const isUserEligibleToBorrow = (user) => 
  user.borrowedBooks.length < borrowLimit;


const calculateFine = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  return today > due
    ? Math.ceil((today - due) / (1000 * 60 * 60 * 24)) * 5
    : 0;
};
  


 module.exports = {
  isUserEligibleToBorrow,
  checkBookAvailability,
  calculateFine,
 
};