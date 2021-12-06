// /*global d3*/

// const titleBegin = document.querySelectorAll(".cls-1")
// const titleChange = document.querySelectorAll(".cls-2")
// const header=document.querySelector("header")
// const subTitle=document.querySelector(".sub-title")
// const test=document.querySelector(".test")


// document.addEventListener("scroll", function(){
    
    
//     // const headerHeight = header.offsetHeight;
//     const pixels =window.pageYOffset;
   
//     // const windowHeight = window.innerHeight;
    
//     // titleChange.classList.add("enter");
    
//     // subTitle.innerHTML = pixels + "pixels scrolled"
// //      console.log("headerHeight",headerHeight)
// //   console.log("windowHeight",windowHeight)
  
//         // titleBegin.style("opacity",0)
//       test.style.width=`30%`
    
// })



    
    const titleBegin = d3.selectAll(".cls-1")
    const titleChange = d3.selectAll(".cls-2")
    
    
    titleBegin.transition()
    .duration(2500)
    .style("opacity",1)
    
    
    // titleChange.transition()
    // .duration(3000)
    // .style("opacity",1)
    
    //  titleBegin.transition()
    // .duration(2000)
    // .attr("opacity",0)
    
    // titleBegin.transition()
    // .duration(1000)
    // .attr("opacity",1)
    
    //  titleChange.transition()
    // .duration(500)
    // .attr("opacity",0)
    // const windowHeight = window.innerHeight;
    // const pixels =window.pageYOffset;
    
    // console.log(pixels)
    // titleBegin.on("scroll",function(){
    //     titleBegin.style("opacity",0) 
    // })
    // titleMiddle.style("fill","#000")
    // titleMiddle.style("opacity",1).curve(d3.curveCardinal)
    // titleBegin.style("opacity",1)
    // titleMiddle.attr("opacity",0)
