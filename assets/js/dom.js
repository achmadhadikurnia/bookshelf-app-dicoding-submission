const UNREAD_BOOK = "unreadBookshelfList";
const READ_BOOK = "readBookshelfList";

function addBook() {
    const idBook = +new Date();
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = parseInt(document.getElementById("inputBookYear").value, 10);
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const book = createBook(idBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    const bookObject = composeBookObject(idBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    books.push(bookObject);

    if (inputBookIsComplete) {
        document.getElementById(READ_BOOK).append(book);
    } else {
        document.getElementById(UNREAD_BOOK).append(book);
    }

    updateJson();
}

function createBook(idBook, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete) {
    const book = document.createElement("article");
    book.setAttribute("id", idBook);
    book.classList.add("card", "my-3");

    const bookTitle = document.createElement("h5");
    bookTitle.classList.add("text-truncate");
    bookTitle.style.maxWidth = "200px";
    bookTitle.innerText = inputBookTitle;

    const bookInfo = document.createElement("div");
    const bookYear = `<i class="fa-regular fa-calendar"></i> <span>${inputBookYear}</span>`;
    const bookAuthor = `<i class="fa-regular fa-user"></i> <span>${inputBookAuthor}</span>`;
    bookInfo.setAttribute("class", 'action-button');
    bookInfo.innerHTML = `${bookYear} ${bookAuthor}`;

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-body", "border-start", "border-4", "border-info", "d-flex", "justify-content-between");

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const cardAction = addAction(inputBookIsComplete, idBook);

    cardContent.append(bookTitle, bookInfo);
    cardContainer.append(cardContent);
    cardContainer.append(cardAction);
    book.append(cardContainer);

    return book;
}

function addAction(inputBookIsComplete, idBook) {
    const cardActions = document.createElement("div");

    const actionDelete = createActionDelete(idBook);
    const actionRead = createActionRead(idBook);
    const actionUndo = createActionUndo(idBook);

    cardActions.append(actionDelete);

    if (inputBookIsComplete) {
        cardActions.append(actionUndo);
    } else {
        cardActions.append(actionRead);
    }

    return cardActions;
}

function createActionDelete(idBook) {
    const action = document.createElement("button");
    action.classList.add("btn", "btn-sm", "btn-danger", "mx-1");
    action.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    action.setAttribute("title", "Delete");

    action.addEventListener("click", function () {
        let confirmation = confirm("Are you sure want to delete this item?");

        if (confirmation) {
            const cardParent = document.getElementById(idBook);
            cardParent.addEventListener("eventDelete", function (event) {
                event.target.remove();
            });
            cardParent.dispatchEvent(new Event("eventDelete"));

            deleteBookFromJson(idBook);
            updateJson();
        }
    });

    return action;
}

function createActionRead(idBook) {
    const action = document.createElement("button");
    action.classList.add("btn", "btn-sm", "btn-primary");
    action.innerHTML = '<i class="fa-regular fa-envelope-open"></i>';
    action.setAttribute("title", "Mark as read");

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);
        const bookTitle = cardParent.querySelector(".card-content > h5").innerText;
        const bookAuthor = cardParent.querySelectorAll(".card-content > div > span")[0].innerText;
        const bookYear = cardParent.querySelectorAll(".card-content > div > span")[1].innerText;

        cardParent.remove();

        const book = createBook(idBook, bookTitle, bookAuthor, bookYear, true);
        document.getElementById(READ_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, bookTitle, bookAuthor, bookYear, true);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function createActionUndo(idBook) {
    const action = document.createElement("button");
    action.classList.add("btn", "btn-sm", "btn-secondary");
    action.innerHTML = '<i class="fa-regular fa-envelope"></i>';
    action.setAttribute("title", "Mark as unread");

    action.addEventListener("click", function () {
        const cardParent = document.getElementById(idBook);

        const bookTitle = cardParent.querySelector(".card-content > h5").innerText;
        const bookAuthor = cardParent.querySelectorAll(".card-content > div > span")[0].innerText;
        const bookYear = cardParent.querySelectorAll(".card-content > div > span")[1].innerText;


        cardParent.remove();

        const book = createBook(idBook, bookTitle, bookAuthor, bookYear, false);
        document.getElementById(UNREAD_BOOK).append(book);

        deleteBookFromJson(idBook);
        const bookObject = composeBookObject(idBook, bookTitle, bookAuthor, bookYear, false);

        books.push(bookObject);
        updateJson();
    })

    return action;
}

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    const titles = document.getElementsByTagName("h5");

    for (let i = 0; i < titles.length; i++) {
        const titlesText = titles[i].textContent || titles[i].innerText;

        if (titlesText.toUpperCase().indexOf(filter) > -1) {
            titles[i].closest(".card").style.display = "";
        } else {
            titles[i].closest(".card").style.display = "none";
        }
    }

    bookCounter();
}

function bookCounter() {
    const numberOfBooks = document.getElementById('numberOfBooks');
    const numberOfUnreadList = document.getElementById('numberOfUnreadList');
    const numberOfReadList = document.getElementById('numberOfReadList');

    const unreadBookshelfList = document.querySelectorAll("#unreadBookshelfList .card:not([style*='display: none'])").length;
    const readBookshelfList = document.querySelectorAll("#readBookshelfList .card:not([style*='display: none'])").length;
    const totalBookshelfList = unreadBookshelfList + readBookshelfList;

    numberOfUnreadList.innerText = unreadBookshelfList;
    numberOfReadList.innerText = readBookshelfList;
    numberOfBooks.innerText = totalBookshelfList;
}
