let moviesContainer = $(".card-group")
let movies;
let MGUA = []; // Movies General Usage Array
let pageSize;
let pageNumber = 1;

let MAX_PAGE_NUMBER;

function Movies(m) {

    function getMvs() {
        return m;

    }

    this.getAllMovies = function() {
        return getMvs();
    }
}

let addMovie = (movie) => {
    moviesContainer.append(`
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 movieWraper">
            <div class="card movieContainer">
                <img class="card-img-top img-fluid posterImage" src="${movie.posterImage}" alt="${movie.title}">
                <div class="card-block">
                    <a href="${movie.titleLink}" target=_blank>
                        <h4 class="card-title">
                            <span data-toggle="tooltip" data-placement="top" title="${movie.titleTitle}">${movie.title} ${movie.secondaryInfo}</span>
                        </h4>
                    </a>
                    <p class="card-text">Rating: <strong>${movie.rating}</strong></p>
                </div>
                <div class="card-footer">
                    <small class="text-muted">${movie.ratingTitle}</small>
                </div>
            </div>
        </div>
    `);
}

let removeRows = (moviesContainer) => {
    moviesContainer.html("");
}

let getMovies = () => { return (MGUA.length == 0) ? movies.getAllMovies() : MGUA };

let displayPage = (pageNumber, pageSize, movies, moviesContainer) => {
    removeRows(moviesContainer);
    let startIndex = (pageNumber - 1) * pageSize;
    let endIndex = pageNumber * pageSize;
    let displayMovies = movies.slice(startIndex, endIndex);
    displayMovies.forEach((m) => addMovie(m));
}

let setPagination = (length) => {
    let container = $("#pages");
    container.html("");
    let elements = "";
    for (let i = 0; i < length; ++i) {
        elements += `<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`
    }
    container.append(elements);
    container.find("li").on('click', function() {
        pageNumber = $(container).find("li").index($(this)) + 1;
        setPage(pageNumber);
        displayPage(pageNumber, getPageSize(), getMovies(), moviesContainer);
    })
}

let setPage = (pageNumber) => {
    pageNumber < 2 ? $("#previous").addClass("disabled") : $("#previous").removeClass("disabled");
    pageNumber > MAX_PAGE_NUMBER - 1 ? $("#next").addClass("disabled") : $("#next").removeClass("disabled");
    let pages = $("#pages");
    pages.find(".active").removeClass("active");
    pages.find("li").eq(pageNumber - 1).addClass("active");
}

let getPageSize = () => {
    return parseInt($("#showPerPage").val(), 10);
}

let getMaxPageNumber = (length) => {
    return (length % getPageSize() | 0) == 0 ? (length / getPageSize() | 0) : (length / getPageSize() | 0) + 1;
}

let handleSorts = (sortProperty) => {
    if (sortProperty != "none")
        sortMovies((a, b) => comparator(a[sortProperty], b[sortProperty], getSortOrder()));
}

let comparator = (a, b, order) => {
    if ($("sortBy").val() == "secondaryInfo") {
        a = parseInt(a.slice(1, 5), 10);
        b = parseInt(b.slice(1, 5), 10);
    }
    if (!$.isNumeric(a)) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    if (order == "ASCENDING") {
        return a < b ? 1 : (a > b ? -1 : 0);
    } else if (order == "DESCENDING") {
        return a > b ? 1 : (a < b ? -1 : 0);
    }
}

let sortMovies = (wayOfSort) => {
    MGUA = getMovies();
    MGUA.sort(wayOfSort);
    pageNumber = 1;
    setPage(pageNumber);
    displayPage(pageNumber, getPageSize(), MGUA, moviesContainer);
}

let getSortOrder = () => {
    return $("#sortOrder").hasClass("fa-sort-amount-asc") ? "ASCENDING" : "DESCENDING";
}

let setPagesAndDisplayMovies = () => {
    setPagination(getMaxPageNumber(getMovies().length));
    setPage(1);
    displayPage(1, getPageSize(), getMovies(), moviesContainer);
}

$(() => {

    pageSize = getPageSize();

    $("#previous").on('click', function() {
        if (pageNumber > 1)
            setPage(--pageNumber);
        displayPage(pageNumber, getPageSize(), getMovies(), moviesContainer);
    })

    $("#next").on('click', function() {
        if (pageNumber < MAX_PAGE_NUMBER)
            setPage(++pageNumber);
        displayPage(pageNumber, getPageSize(), getMovies(), moviesContainer);
    })

    $("#sortBy").on('change', function() {
        if ($(this).val() != "none")
            handleSorts($(this).val());
    });

    $("#sortOrder").on('click', function() {
        if ($("#sortBy").val() != "none") {
            $(this).toggleClass("fa-sort-amount-desc");
            $(this).toggleClass("fa-sort-amount-asc");
            $(this).hasClass("fa-sort-amount-desc") ? $(this).attr("title", "Descending order") : $(this).attr("title", "Ascending order");
            handleSorts($("#sortBy").val());
        }
    });

    $("#showPerPage").on('change', function() {
        pageSize = getPageSize();
        setPagesAndDisplayMovies();
    });

    $("#searchInput").on('keypress', function(e) {
        if (e.which == 13) {
            let phrase = $("#searchInput").val().toLowerCase();
            if (!!phrase) {
                MGUA = getMovies().filter((movie) => {
                    if (movie.title.toLowerCase().indexOf(phrase) != -1) return true;
                    if (movie.titleTitle.toLowerCase().indexOf(phrase) != -1) return true;
                    if (movie.secondaryInfo.toLowerCase().indexOf(phrase) != -1) return true;
                    return false;
                });
            }
            if (MGUA.length == 0) {
                moviesContainer.text("There is no such a book.");
            } else {
                setPagesAndDisplayMovies();
            }
        }
    });

    $("#showAll").on('click', () => {
        MGUA = [];
        console.log(MGUA); // array is printed correctly: empty array
        /* 
            but here, is printed the last sorted array
            [ex] it was sorted by rating, ascending order.
            and when i call @movies.getAllMovies() it gives me the [ex] array
            i wonder how can be this changed when this is actually a "private" 
        */
        console.log(movies.getAllMovies());
        $("#sortBy").val("none");
        $("#searchInput").val("");
        pageNumber = 1;
        setPagination(getMaxPageNumber(movies.getAllMovies().length));
        setPage(1);
        displayPage(1, getPageSize(), movies.getAllMovies(), moviesContainer);
    })

    $.ajax("data.json", {
        complete: (data) => {
            let result = data.responseJSON;
            movies = new Movies(result);
            setPagination(getMaxPageNumber(getMovies().length));
            setPage(pageNumber);
            displayPage(pageNumber, getPageSize(), getMovies(), moviesContainer);
        }
    });
})