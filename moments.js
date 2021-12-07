const testTag = document.querySelector(".testmove")
const moveTag = document.querySelectorAll(".move")
const bodyTag = document.querySelector("body")
const gazeTag = document.querySelector(".gaze")
const introTag = document.querySelector(".filler.title")
const scrollyTag = document.querySelector("#scrolly-side")
const bridgeTag = document.querySelector(".intro.bridge")
const fillerBridgeTag = document.querySelector(".filler.bridge")
const titleTag = document.querySelector("#titles")
// const scrollyTag = document.querySelector(".scrolly")
document.addEventListener("scroll",function(){
    
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

    // console.log("scrolledDistance",scrolledDistance)
    // console.log("beforegazeHeight",beforeGazeHeight)
    // console.log("gazeHeight",gazeHeight)//fixed to relative window
    // console.log("totalScrollableHeight",totalScrollableHeight)
    //   console.log("scrolledInGaze",scrolledInGaze)
      
     const index = parseFloat(testTag.dataset.move).toFixed(1);
     
        if (pct>0.2) {
            testTag.classList.add("reveal")}
        // } else {
        //     testTag.classList.remove("reveal")
        // }
        
          console.log("pct",pct)
            console.log("index",index)
        console.log(testTag.offsetTop)
       
       
    //  console.log("scrollyHeight",scrollyHeight)
    //  console.log("bodyHeight",bodyHeight)
    //  console.log("intro",introHeight)
    //     console.log("title",titleHeight)
    //   console.log("bridge",bridgeHeight)
    //   console.log("bridge2",fillerBridgeHeight)
     
    //  console.log("totalScrollable",totalScrollableDistance)
})