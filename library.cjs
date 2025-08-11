const config = require('./config.json');

const {
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser
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


const returnBook = (userId, bookId) => {
  return isBookBorrowedByUser(userId, bookId)
    ? processBookReturn(userId, bookId)
    : "Book was not borrowed by this user.";
};


const searchBooks = (query) =>
  listOfBooks.reduce((acc, { bookId, title, author }) => {
      const isMatch =
      title.toLowerCase().includes(query) ||
      author.toLowerCase().includes(query);

    return isMatch
      ? [...acc, `${bookId}. ${title} by ${author}`]
      : acc;
  }, []);

  

const addUser = (...names) => {
  const userIds = usersData.map(user => user.userId);
  const lastUserId = Math.max(...userIds);

  let newId = lastUserId;

  const newUser = names.map(name => {
    newId += 1;
    return {
      userId: newId,
      name,
      borrowedBooks: [],
      borrowingHistory: [],
    };
  });

  return [...usersData, ...newUser];
};

console.log("Available books:", listOfAvailableBooks());
console.log("Borrow result:",JSON.stringify( borrowBook(2019007, 900123), null, 2));
console.log("Return result:",JSON.stringify( returnBook(2019010, 19131), null, 2));
console.log("Search books", searchBooks("pon"));
console.log("addUser:", JSON.stringify(addUser(usersData,"Jency","willison"), null, 2));

