const config = require('./config.json');

const {
  getUserById,
  isUserEligibleToBorrow,
  checkBookAvailability,
  processBookReturn,
  isBookBorrowedByUser
  } = require('./helper.cjs');

const { listOfBooks, usersData } = config;


const listOfAvailableBooks = () =>
  listOfBooks.reduce(( acc, curr ) => {
  const { bookId, title, author, available } = curr;

  return available
        ? [...acc, `${bookId}- ${title} by ${author}`] 
        : acc,
    []
  });



const borrowBook = (userId, bookId) => 
  isUserEligibleToBorrow(userId)
    ? checkBookAvailability(userId, bookId)
    : "Borrow limit reached.";


const returnBook = (userId, bookId) => {
  const user = getUserById(userId);
  
  return isBookBorrowedByUser(user, bookId)
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

  

const addUser = (usersData, ...names) => {
  const lastUserId = Math.max(...usersData.map(u => u.userId));
  let newId = lastUserId;

  const newUsers = names.map(name => {
    newId += 1;
    return {
      userId: newId,
      name,
      borrowedBooks: [],
      borrowingHistory: [],
      fines: 0
    };
  });

  return [...usersData, ...newUsers];
};




console.log("Available books:", listOfAvailableBooks());
console.log("Borrow result:",JSON.stringify( borrowBook(2019007, 900123), null, 2));
console.log("Return result:",JSON.stringify( returnBook(2019010, 19131), null, 2));
console.log("Search books", searchBooks("pon"));
console.log("user registration:", JSON.stringify(addUser(usersData,"Jency","willison"), null, 2));

