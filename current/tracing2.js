
const svgLeft = document.querySelector("#left-sil-line");
const svgRight = document.querySelector("#right-sil-line");


const lengthLeft = svgLeft.getTotalLength();
const lengthRight = svgRight.getTotalLength();



// start position of the drawing - normal display pre-animation
svgLeft.style.strokeDasharray = lengthLeft;
svgRight.style.strokeDasharray = lengthRight;
// hides the svg before the scrolling starts
svgLeft.style.strokeDashoffset = lengthLeft;
svgRight.style.strokeDashoffset = lengthRight;

// offset the svg dash by the same amount as the percentage scrolled
window.addEventListener("scroll", function () {

 const length2 = svgLeft.getBoundingClientRect().height;
  const totalScrolled = document.documentElement.scrollTop;
  const totalHeight = document.documentElement.scrollHeight;
  // const clientHeight = document.documentElement.clientHeight

  // const scrollpercentLeft = 1500/(scrollH-scrollT); 
  // const scrollpercentRight = 1550/(scrollH-scrollT);
  
  const scrollpercentLeft = (totalScrolled-length2)/(totalHeight+2000)

console.log("totalScrolled",totalScrolled)
console.log("totalHeight",totalHeight)
console.log(scrollpercentLeft)
console.log("lengthLeft",lengthLeft)
console.log("length2",length2)

  const drawLeft = lengthLeft * scrollpercentLeft;
  // const drawRight = lengthRight * scrollpercentRight;
// console.log("draw",drawLeft)
  // Reverse the drawing (when scrolling upwards)
  svgLeft.style.strokeDashoffset = lengthLeft - drawLeft;
// svgRight.style.strokeDashoffset = lengthRight - drawRight;
});




// window.addEventListener("scroll", function () {
//   const scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);

//   const draw = length * scrollpercent;

//   // Reverse the drawing (when scrolling upwards)
//   svg.style.strokeDashoffset = length - draw;

// });