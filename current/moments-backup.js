const testTag = document.querySelector(".testmove1")
const testTag2 = document.querySelector(".testmove2")
const moveTag = document.querySelectorAll(".move")
const bodyTag = document.querySelector("body")
const gazeTag = document.querySelector(".gaze")
const introTag = document.querySelector(".filler.title")
const scrollyTag = document.querySelector("#scrolly-side")
const bridgeTag = document.querySelector(".intro.bridge")
const fillerBridgeTag = document.querySelector(".filler.bridge")
const titleTag = document.querySelector("#titles")



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

document.addEventListener("scroll", function(){
    
    const scrolledDistance = window.pageYOffset
    const gazeHeight = gazeTag.getBoundingClientRect().height;
    
    const titleHeight =titleTag.getBoundingClientRect().height;
    const introHeight =introTag.getBoundingClientRect().height;
    const bridgeHeight =bridgeTag.getBoundingClientRect().height;
    const scrollyHeight = scrollyTag.getBoundingClientRect().height;
    const fillerBridgeHeight =fillerBridgeTag.getBoundingClientRect().height;
    
    const beforeGazeHeight = titleHeight + bridgeHeight + scrollyHeight + fillerBridgeHeight;
    
    // const bodyHeight = bodyTag.getBoundingClientRect().height//this part didn't change which is strange
    
    const totalScrollableHeight = beforeGazeHeight + gazeHeight;
    
    const scrolledInGaze = scrolledDistance - beforeGazeHeight;
    
    const pct = parseFloat(scrolledInGaze/gazeHeight).toFixed(1);
    
    console.log(pct)
    
    const drawLeft = (lengthLeft-400)* pct;
  const drawRight = (lengthRight-600)* pct;
  

// console.log("draw",drawLeft)
  // Reverse the drawing (when scrolling upwards)
  svgLeft.style.strokeDashoffset = lengthLeft -drawLeft;
 svgRight.style.strokeDashoffset = lengthRight - drawRight;
 
     console.log(drawLeft)
         console.log(drawRight)
    
})


// document.addEventListener("scroll",function(){
    
//     const scrolledDistance = window.pageYOffset
//     const gazeHeight = gazeTag.getBoundingClientRect().height;
    
//     const titleHeight =titleTag.getBoundingClientRect().height;
//     const introHeight =introTag.getBoundingClientRect().height;
//     const bridgeHeight =bridgeTag.getBoundingClientRect().height;
//     const scrollyHeight = scrollyTag.getBoundingClientRect().height;
//     const fillerBridgeHeight =fillerBridgeTag.getBoundingClientRect().height;
    
//     const beforeGazeHeight = titleHeight + bridgeHeight + scrollyHeight + fillerBridgeHeight;
    
//     // const bodyHeight = bodyTag.getBoundingClientRect().height//this part didn't change which is strange
    
//     const totalScrollableHeight = beforeGazeHeight + gazeHeight;
    
//     const scrolledInGaze = scrolledDistance - beforeGazeHeight;
    
//     const pct = parseFloat(scrolledInGaze/gazeHeight).toFixed(1);

    // console.log("scrolledDistance",scrolledDistance)
    // console.log("beforegazeHeight",beforeGazeHeight)
    // console.log("gazeHeight",gazeHeight)//fixed to relative window
    // console.log("totalScrollableHeight",totalScrollableHeight)
    //   console.log("scrolledInGaze",scrolledInGaze)
      
    //  const index = parseFloat(testTag.dataset.move).toFixed(1);
     
    //     if (pct>0.2) {
    //         testTag.classList.add("reveal")}
    //     // } else {
    //     //     testTag.classList.remove("reveal")
    //     // }
        // if (pct >=0.2 && pct<=0.3) {
        //     testTag.("opacity",0.5)
        // } else {
        //     testTag.style("opacity",1)
        // }
        // //   console.log("pct",pct)
        //     console.log("index",index)
       
       
    //  console.log("scrollyHeight",scrollyHeight)
    //  console.log("bodyHeight",bodyHeight)
    //  console.log("intro",introHeight)
    //     console.log("title",titleHeight)
    //   console.log("bridge",bridgeHeight)
    //   console.log("bridge2",fillerBridgeHeight)
     
    //  console.log("totalScrollable",totalScrollableDistance)
// })