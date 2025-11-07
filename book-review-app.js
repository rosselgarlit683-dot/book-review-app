const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); 

const books = {
  "111": { title: "Book One", author: "John Doe", review: "Great book!" },
  "222": { title: "Book Two", author: "Jane Smith", review: "Interesting read." },
  "333": { title: "Book Three", author: "John Doe", review: "Not bad." }
};

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) res.json(book);
  else res.status(404).json({ message: "Book not found" });
});


app.get("/books/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const filtered = Object.values(books).filter(b => b.title.toLowerCase().includes(title));
  if (filtered.length > 0) res.json(filtered);
  else res.status(404).json({ message: "No books found with this title" });
});


app.get("/books/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) {
    res.json({ review: book.review });
  } else {
    res.status(404).json({ message: "Review not found" });
  }
});


const users = []; 

app.post('/register', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    users.push({ username, password });
    res.json({ message: 'User registered successfully!', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  res.json({ message: `Welcome, ${username}!` });
});


app.put('/books/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  books[isbn].review = review;
  res.json({ message: 'Review added/updated successfully!', book: books[isbn] });
});


app.delete('/books/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  if (!books[isbn].review) {
    return res.status(400).json({ message: 'No review to delete.' });
  }

  delete books[isbn].review;
  res.json({ message: 'Review deleted successfully!', book: books[isbn] });
});


app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));


app.get("/async/books", async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(books), 500); 
      });
    };

    const allBooks = await getBooks();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});


app.get("/promise/books/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const findBook = new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    }, 500);
  });

  findBook
    .then((book) => res.json(book))
    .catch((err) => res.status(404).json({ message: err }));
});


app.get("/promise/books/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();

  const findBooksByAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filtered = Object.values(books).filter(b =>
        b.author.toLowerCase().includes(author)
      );

      if (filtered.length > 0) resolve(filtered);
      else reject("No books found by that author");
    }, 500);
  });

  findBooksByAuthor
    .then((result) => res.json(result))
    .catch((err) => res.status(404).json({ message: err }));
});


app.get("/promise/books/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  const findBooksByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filtered = Object.values(books).filter(b =>
        b.title.toLowerCase().includes(title)
      );

      if (filtered.length > 0) resolve(filtered);
      else reject("No books found with that title");
    }, 500);
  });

  findBooksByTitle
    .then((result) => res.json(result))
    .catch((err) => res.status(404).json({ message: err }));
});
