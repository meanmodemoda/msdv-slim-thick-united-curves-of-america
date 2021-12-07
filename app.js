import "intersection-observer";
// import scrollama from "scrollama"; // or...
const scrollama = require("scrollama");


const gazeScrolly = document.querySelector("#gaze");
const gazeArticle = gazeScrolly.querySelector("article");
const moves = article.querySelectorAll(".move");

// initialize the scrollama
const scrollerBasic = scrollama();

// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    console.log(response);
    // add to color to current step
    response.element.classList.add("is-active");
}

function handleStepExit(response) {
    // response = { element, direction, index }
    console.log(response);
    // remove color from current step
    response.element.classList.remove("is-active");
}

function init() {
    // set random padding for different step heights (not required)
    moves.forEach(function (move) {
        let v = 100 + Math.floor((Math.random() * window.innerHeight) / 4);
        move.style.padding = v + "px 0px";
    });

    // 1. setup the scroller with the bare-bones options
    // 		this will also initialize trigger observations
    // 2. bind scrollama event handlers (this can be chained like below)
    scrollerBasic
        .setup({
            step: "#gaze .svg-group svg article .move",
            debug: true,
            offset: 0.5
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

    // 3. setup resize event
    window.addEventListener("resize", scrollerBasic.resize);
}

// kick things off
init();