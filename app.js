/*global d3 */

async function draw() {

//*************************1. Set up Measurement

   const width = 1000;
    
    let dimensions = {
        width: width,
        height: width * 0.8,
        margin: {
            top: 80,
            right: 50,
            bottom: 50,
            left: 50
        }
    }

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right

    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom
    
// const posCheck = document.querySelector("#section-intro-chart").addEventListener('mouseenter', (e) => {
//         console.log("mouse page X: ", e.pageX);
//         console.log("mouse page Y: ", e.pageY);
//     }, );
        
//*************************2. Draw Canvas

   const wrapper = d3.select("#section-intro-chart") 
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        
   const bounds = wrapper.append("g")
        .style("translate",`transform(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)
  // const tooltip = d3.select("#tooltip")
  
//**************************3. Load and Prepare Data  

  const msm = await d3.csv("./body_measurement.csv",(d) => {
      d3.autoType(d) //time will converted to time format
        return d})
        
// console.table(msm[0]) //this is good for csv
// console.log(msm[0])        
    
//**************************5. Create Data Accessors
    //what if the key is deeply nested
    const yearAccessor = d => d.year;
    const typeAccessor = d => d.type;
    const bustAccessor = d => d.bust;
    const waistAccessor = d => d.waist;
    const buttAccessor = d => d.butt;
    
// console.log(buttAccessor(msm[0]))
    const bodyParts = ["bust",'waist',"butt"]

// //**************************6. Create Scale  

const xScale = d3.scaleLinear()
    .domain([22,40])
    .range([dimensions.boundedWidth/2+100,dimensions.boundedWidth/2+400])
    
const yScale = d3.scaleOrdinal()
    .domain(bodyParts)
    .range([dimensions.boundedHeight/2-150,dimensions.boundedHeight/2+100,dimensions.boundedHeight/2+350])
    
//**************************** Draw Axis

const xAxisBottomGenerator = d3.axisBottom()
    .scale(xScale)

const xAxisTopGenerator = d3.axisTop()
    .scale(xScale)
    
const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickSize(5)

const xAxisBottom = bounds.append("g")
    .call(xAxisBottomGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight/2+350}px)`)
    
const xAxisTop = bounds.append("g")
    .call(xAxisTopGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight/2-150}px)`)
    
const yAxis = bounds.append("g")
    .call(yAxisGenerator)
    .style("transform",`translateX(${dimensions.boundedWidth/2+100}px)`)

// //**************************7. Draw Dots
// // Select the svg area and add circles:

const testDot = bounds.append("circle")
    .attr("cx",dimensions.boundedWidth/2)
    .attr("cy",dimensions.boundedHeight/2)
    .attr("r", 5)
    

// const dotChart = bounds.selectAll("circle")
//   .data(dataset)
//   .join("circle")
//   .transition()
//   .delay(function(d,i) {return (i * 1)})
//   .duration(1000)
//   .attr("cx",d => map.latLngToLayerPoint([latAccessor(d),longAccessor(d)]).x)
//     .attr("cy",d => map.latLngToLayerPoint([latAccessor(d),longAccessor(d)]).y)
//     .attr("r", d => dotScale(depthAccessor(d)))
//     .style("fill", d => magColorScale(magAccessor(d)))
//     .attr("stroke", "Navy")
//     .attr("stroke-width", 0.25)
//     .attr("fill-opacity", .8)
    

//***************************8. Draw Tooltip

//***************************9. Draw Interactivity



   
} draw()
