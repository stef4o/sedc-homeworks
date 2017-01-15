let button = document.getElementById("dataProcces");
let display = document.getElementById("display");


let makeCalculations = function(data) {
    switch (data.operation) {
        case "square":
            printOnDisplay("square", data.data, getSum("square", data.data, x => x * x));
            break;
        case "cube":
            printOnDisplay("cube", data.data, getSum("cube", data.data, x => x * x * x));
            break;
        case "sine":
            printOnDisplay("sine", data.data, getSum("sine", data.data, x => Math.sin(x)));
            break;
        case "cosine":
            printOnDisplay("cosine", data.data, getSum("cosine", data.data, x => Math.cos(x)));
            break;
        case "log":
            printOnDisplay("log", data.data, getSum("log", data.data, x => Math.log(x)));
            break;
    }
};

let getSum = function(wordOper, data, operation) {
    let result = 0;
    let steps = "";
    for (item of data) {
        steps += `${result} + ${wordOper}(${item}) =`;
        result += operation(item);
        steps += ` ${result}<br/>`;
    }
    return { "result": result, "steps": steps };
}

let printOnDisplay = function(operation, data, calcs) {
    display.innerHTML = `Operation "${operation}" <br/> Data: ${data} <br/> 
                         Result: ${calcs.result} <br/> Steps:<br/> ${calcs.steps}`;
}

let proccesRandomData = function(data) {
    let randomNumber = Math.random() * data.length | 0;
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