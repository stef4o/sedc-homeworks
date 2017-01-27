let booksContainer = $("#booksContainer");
let pageSize = 20;
let pageNumber = 1;
let books = []; // this array is used for storing all books
let booksGeneralPurposeArray = []; // this array is used for storing filtered, searched, sorted.. arrays

let sortOrder = {
    "NONE": 0,
    "ASCENDING": 1,
    "DESCENDING": 2
}

let sorted = sortOrder.NONE;

let MAX_PAGE_NUMBER;

// adding 1 book to the container
let addBookToTable = function(book, booksContainer) {
    booksContainer.append(`<tr>
                    <td>${book.author}</td>
                    <td>${book.title}</td>
                    <td>${book.awards}</td>
                    <td><img src="https://www.worldswithoutend.com/${book.img}" /></td>
                </tr>`);
};

// remove all books from container
let removeRows = function(booksContainer) {
    booksContainer.html("");
};

// display @pageSize books at time
let displayPage = (pageNumber, pageSize, books, booksContainer) => {
    removeRows(booksContainer);
    let startIndex = (pageNumber - 1) * pageSize;
    let endIndex = pageNumber * pageSize;
    let displayBooks = books.slice(startIndex, endIndex);
    displayBooks.forEach(b => addBookToTable(b, booksContainer))
    $("#paging").text(`Showing ${startIndex == 0 ? 1 : startIndex} to ${endIndex <= books.length ? endIndex : books.length} of ${books.length}. Page ${pageNumber}`);
};

// set @MAX_PAGE_NUMBER variable
let setMaxPageNumber = (length) => {
    MAX_PAGE_NUMBER = (length % pageSize | 0) == 0 ? (length / pageSize | 0) : (length / pageSize | 0) + 1;
}

let sortBooks = (wayOfSort) => {
    booksGeneralPurposeArray = booksGeneralPurposeArray.length == 0 ? books : booksGeneralPurposeArray;
    booksGeneralPurposeArray.sort(wayOfSort);
    pageNumber = 1;
    displayPage(pageNumber, pageSize, booksGeneralPurposeArray, booksContainer);
}

let sortAscendingOrDescending = (a, b) => {
    if (!Number.isInteger(a)) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    if (sorted == sortOrder.ASCENDING) { //(sorted == sortWays.AUTHOR_ASCENDING || sorted == sortWays.TITLE_ASCENDING || sorted == sortWays.AWARDS_ASCENDING) {
        return a < b ? 1 : (a > b ? -1 : 0);
    } else if (sorted == sortOrder.DESCENDING) {
        return a > b ? 1 : (a < b ? -1 : 0);
    }
}

let handleSorts = (sortProperty) => {
    sorted = sorted != sortOrder.DESCENDING ? sortOrder.DESCENDING : sortOrder.ASCENDING;
    sortBooks((a, b) => sortAscendingOrDescending(a[sortProperty], b[sortProperty]));
}

$(() => {

    // searching by some phrase
    $("#search").on('click', () => {
        let phrase = $("#searchInput").val().toLowerCase();
        if (!!phrase) {
            booksGeneralPurposeArray = books.filter((book) => {
                if (book.author.toLowerCase().indexOf(phrase) != -1) return true;
                if (book.title.toLowerCase().indexOf(phrase) != -1) return true;
                if (book.author.toLowerCase().indexOf(phrase) != -1) return true;
                return false;
            })
            if (booksGeneralPurposeArray.length == 0) {
                booksContainer.text("There is no such a book.");
            } else {
                pageNumber = 1;
                setMaxPageNumber(booksGeneralPurposeArray.length);
                displayPage(pageNumber, pageSize, booksGeneralPurposeArray, booksContainer);
            }
        }
    })

    // Show all books. Here is used @books array with all books.
    $("#showAllBooks").on('click', () => {
        $("#searchInput").val("");
        booksGeneralPurposeArray = [];
        setMaxPageNumber(books.length);
        pageNumber = 1;
        displayPage(pageNumber, pageSize, books, booksContainer);
    })

    // show books with awards
    $("#awardsOnly").on('click', () => {
        let tempBooks = booksGeneralPurposeArray.length == 0 ? books : booksGeneralPurposeArray;
        booksGeneralPurposeArray = tempBooks.filter((book) => {
            return book.awards > 0;
        });

        if (booksGeneralPurposeArray.length == 0) {
            booksContainer.text("There is no book with awards.")
        } else {
            pageNumber = 1;
            setMaxPageNumber(booksGeneralPurposeArray.length);
            displayPage(pageNumber, pageSize, booksGeneralPurposeArray, booksContainer);
        }
    })

    // event handler which will take id from element who fired this event and pass it as argument to another function
    $(".sortBy").on('click', event => {
        handleSorts(event.target.id);
    })

    // event handler for the previous button
    $("#previous").on('click', () => {
        let tempBooks = booksGeneralPurposeArray.length == 0 ? books : booksGeneralPurposeArray;
        if (pageNumber > 1) {
            pageNumber -= 1;
        }
        displayPage(pageNumber, pageSize, tempBooks, booksContainer);
    });

    // event handler for the next button
    $("#next").on('click', () => {
        let tempBooks = booksGeneralPurposeArray.length == 0 ? books : booksGeneralPurposeArray;
        if (pageNumber < MAX_PAGE_NUMBER) {
            pageNumber += 1;
        }
        displayPage(pageNumber, pageSize, tempBooks, booksContainer);
    });

    // get the data
    $.ajax("data.json", {
        complete: (data) => {
            let result = data.responseJSON;
            books = result;
            setMaxPageNumber(books.length);
            displayPage(pageNumber, pageSize, books, booksContainer);
        }
    });
})