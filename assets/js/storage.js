const BOOKS_KEY = "BOOKSHELF_APPS";

let books = [];
let unreadBooks = [];
let readBooks = [];

function isStorageSupported() {
    if (typeof Storage === "undefined") {
        alert("Your browser is not support Web Storage!");

        return false;
    } else {
        return true;
    }
}

function updateJson() {
    if (isStorageSupported()) {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(books));

        bookCounter();
    }
}

function fetchJson() {
    let data = JSON.parse(localStorage.getItem(BOOKS_KEY));

    if (data !== null) {
        books = data;
    }

    document.dispatchEvent(new Event("onJsonFetched"));
}

function composeBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

function renderFromBooks() {
    for (book of books) {
        const newBook = createBook(book.id, book.title, book.author, book.year, book.isComplete);

        if (book.isComplete) {
            readBooks.push(book.id);
            document.getElementById(READ_BOOK).append(newBook);
        } else {
            unreadBooks.push(book.id);
            document.getElementById(UNREAD_BOOK).append(newBook);
        }
    }

    bookCounter();
}

function deleteBookFromJson(idBook) {
    for (let arrayPosition = 0; arrayPosition < books.length; arrayPosition++) {
        if (books[arrayPosition].id == idBook) {
            books.splice(arrayPosition, 1);

            break;
        }
    }
}
