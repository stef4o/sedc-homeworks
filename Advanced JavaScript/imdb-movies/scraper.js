let movies = $(".lister-list").find("tr");
let moviesFinal = [];

movies.each(function() {
    let posterLink = `http://www.imdb.com${$(this).find("td.posterColumn").find("a").attr("href")}`;
    let posterImage = $(this).find("td.posterColumn").find("a").find("img").attr("src");
    let index = movies.index($(this)) + 1;
    let title = $(this).find("td.titleColumn").find("a").text();
    let titleLink = `http://www.imdb.com${$(this).find("td.titleColumn").find("a").attr("href")}`;
    let titleTitle = $(this).find("td.titleColumn").find("a").attr("title");
    let secondaryInfo = $(this).find("td.titleColumn").find("span.secondaryInfo").text();
    let rating = parseFloat($(this).find("td.imdbRating").find("strong").text());
    let ratingTitle = $(this).find("td.imdbRating").find("strong").attr("title");

    moviesFinal.push({
        posterLink,
        posterImage,
        index,
        title,
        titleLink,
        secondaryInfo,
        rating,
        ratingTitle
    });
});