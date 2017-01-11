let button = document.getElementById("dataProcces");

let makeCalculations = function(data) {
    switch (data.operation) {
        case "square":
            alert(sumSquareRoot(data));
            break;
        case "cube":
            alert(sumCube(data));
            break;
        case "sine":
            alert(sumSine(data));
            break;
        case "cosine":
            alert(sumCosine(data));
            break;
        case "log":
            alert(sumLog(data));
            break;
    }
};

let sumSquareRoot = function(data) {
    let result = 0;
    for (item of data.data) {
        result += Math.sqrt(parseInt(item, 10));
    }
    return result;
}

let sumCube = function(data) {
    let result = 0;
    for (item of data.data) {
        result += Math.pow(parseInt(item, 10), 3);
    }
    return result;
}

let sumSine = function(data) {
    let result = 0;
    for (item of data.data) {
        result += Math.sin(parseInt(item, 10));
    }
    return result;
}

let sumCosine = function(data) {
    let result = 0;
    for (item of data.data) {
        result += Math.cos(parseInt(item, 10));
    }
    return result;
}

let sumLog = function(data) {
    let result = 0;
    for (item of data.data) {
        result += Math.log(parseInt(item, 10));
    }
    return result;
}

let proccesRandomData = function(data) {
    let randomNumber = Math.random() * 10 | 0;
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "data/" + data[randomNumber], true);
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            let data = JSON.parse(xhttp.response);
            makeCalculations(data);
        }
    };
};


// button event listener
button.addEventListener("click", function() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "data/filelist.json", true);
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            let data = JSON.parse(xhttp.response);
            proccesRandomData(data);
        }
    };
});