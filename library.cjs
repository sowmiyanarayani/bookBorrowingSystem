const config = require('./config.json');
const {
  isUserEligibleToBorrow,
  checkBookAvailability,
  calculateFine,
  
  } = require('./helper.cjs');

const { listOfBooks, usersData } = config;


const listOfAvailableBooks = (listOfBooks) =>
listOfBooks
    .filter(book => book.available)
    .map(({ bookId, title, author }) => `${bookId}- ${title} by ${author}`);


const borrowBook = (userId, bookId, usersData, booksData) => {
  const user = usersData.find(u => u.userId === userId);
  
  return!isUserEligibleToBorrow(user)
    ? `${user.name} has reached the borrow limit.`
    : checkBookAvailability(userId, bookId, usersData, booksData);
};

const returnBook = (userId, bookId, usersData, listOfBooks) => {
  const user = usersData.find(u => u.userId === userId);
  const book = listOfBooks.find(b => b.bookId === bookId);
  const borrowedBook = user.borrowedBooks.find(b => b.bookId === bookId);

  const fine = calculateFine(borrowedBook.dueDate);

  book.available = true;
  user.borrowedBooks = user.borrowedBooks.filter(b => b.bookId !== bookId);

  return {
    message: fine
      ? `Book returned late. Fine amount: ₹${fine}`
      : "Book returned successfully. No fine.",
      ...user,
  };
};

const searchBooks = (query) => {
  const lowerQuery = query.toLowerCase();

  const matchedBooks = listOfBooks.filter(book =>
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery)
  );

  const searchBook = matchedBooks.map(book => `${book.bookId}. ${book.title} by ${book.author}`);

  return searchBook;
};


console.log("Available books:", listOfAvailableBooks(listOfBooks));
console.log("Borrow result:",JSON.stringify( borrowBook(2019008, 900124, usersData, listOfBooks),null,2));
console.log("Return book:", returnBook(2019010, 900124, usersData, listOfBooks))
console.log("Search books", searchBooks("adi"))

