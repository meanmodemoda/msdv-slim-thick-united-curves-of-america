/*global d3 */

async function draw() {

//*************************1. Draw Dimensions

   const width = 400;
    
    let dimensions = {
        width: width,
        height: 800,
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
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
        
//*************************2. Draw Wrapper and Bounds
   const wrapper = d3.select("#section-intro-chart") 
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        
   const bounds = wrapper.append("g")
        .style("translate",`transform(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)
  // const tooltip = d3.select("#tooltip")
  
//**************************3. Load Data and Create Accessors

  const msm = await d3.csv("./body_measurement.csv",(d) => {
      d3.autoType(d) //time will converted to time format
        return d})
        
// console.table(msm[0]) //this is good for csv
// console.log(msm[0])      

    //bodyType
const typeAccessor = d => d.type;
     //bodyMeasurement (x-value)
const measurementAccessor = d => d.measurement;
    //bodyPart (y-value)
const partAccessor = d => d.part;
    //period
const periodAccessor = d => d.period;
    //periodNum 1,2,3,4
const periodNumAccessor = d =>d.periodNum;
// console.log(periodAccessor(msm[0]))

//set up Arrays manually so I can control the order
const bodyParts = ["bust","abdomen","waist","hip","butt"]
const bodyTypes = ["Hour Glass","Heroine Chic","Pilates Body","Slim Thick"]
const periods = ["since Playboy","1990s","2000s","2010s - now"]

//*************************4. Create Scale  

const xScale = d3.scaleLinear()
    .domain([22,40])
    .range([dimensions.margin.left,dimensions.margin.left+250])
    
const yScale = d3.scaleOrdinal()
    .domain(bodyParts)
    .range([dimensions.boundedHeight/2-250,dimensions.boundedHeight/2-150,dimensions.boundedHeight/2-50,dimensions.boundedHeight/2+100,dimensions.boundedHeight/2+200])
    
const colorScale = d3.scaleOrdinal()
    .domain(bodyTypes)
    .range(['#999999','#666666','#333333','#000000'])
    
// const sliderScale = d3.scaleOrdinal()
//     .domain(periods)
//     .range([dimensions.boundedWidth/2+100,dimensions.boundedWidth/2+200,dimensions.boundedWidth/2+300,dimensions.boundedWidth/2+400])
    
//****************************5. Draw Peripherals

//----------------------Draw Axis Generators
const xAxisBottomGenerator = d3.axisBottom()
    .scale(xScale)

// const sliderAxisGenerator = d3.axisBottom()
//     .scale(sliderScale)

const xAxisTopGenerator = d3.axisTop()
    .scale(xScale)
    
const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickSize(5)

//----------------------Draw Axes
const xAxisBottom = bounds.append("g")
    .call(xAxisBottomGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight/2+200}px)`)

// const sliderAxis = bounds.append("g")
//     .call(sliderAxisGenerator)
//     .style("transform",`translateY(${dimensions.boundedHeight/2+370}px)`)
    
const xAxisTop = bounds.append("g")
    .call(xAxisTopGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight/2-250}px)`)
    
const yAxis = bounds.append("g")
    .call(yAxisGenerator)
    .style("transform",`translateX(${dimensions.margin.left}px)`)
    
//----------------------Draw Test Dots  
const testDot = bounds.append("circle")
    .attr("cx",dimensions.boundedWidth/2)
    .attr("cy",dimensions.boundedHeight/2)
    .attr("r", 5)

//---------------------------Draw Ordinal Scale Slider    
//using d3=simple-slider package, note syntax slightly different from d3.js
const sliderGenerator = d3.sliderHorizontal()
    .min(1)
    .max(4)
    .ticks(4)
    .tickFormat((d,i) => periods[i])
    .step(1)
    .default(1)
    .width(250)
    .displayValue(false)
    .fill("#000000")
    .handle(
      d3.symbol()
        .type(d3.symbolCircle)
        .size(200)())
    

const slider = bounds.append('g')
    .classed("slider",true)
    // .attr('width', 400)
    // .attr('height', 100)
    //note this is different from CSS, d3 standard `translate` syntax, `px` is omitted
    .attr('transform', `translate(${dimensions.margin.left},${dimensions.boundedHeight/2+250})`)
    .call(sliderGenerator);
    
//***************************6. Draw Chart Generator
 const areaGenerator = d3.area()
    .x1(d => xScale(measurementAccessor(d)))
    .x0(d => xScale(22))
    .y(d => yScale(partAccessor(d)))
    .curve(d3.curveCardinal)
     // .curve(d3.curveCatmullRom.alpha(0.9))
    // .curve(d3.curveBundle.beta(1))

//***************************7. Draw Chart

function drawAreaChart(periodNum) {

//----------------------------Ppre-filter data
    const msmFilter = msm.filter(d => periodNumAccessor(d) == periodNum);
    const sumMsm = d3.group(msmFilter, d => d.type);
    
//---------------------Change gradient value by filter
  const gradientChange=(periodNum)=>{
        if(periodNum==1) return 0.3;
        else if(periodNum==2) return 0.6;
        else if(periodNum==3) return 0.4;
        else if(periodNum==4) return 0.3;
    }   
    
 //--------------------Draw areaChart
    bounds.selectAll(".path")
    .data(sumMsm)
    .join("path")
    .attr("d", d=>areaGenerator(d[1]))
    .attr("fill","#000000")
    // .attr("fill", d => colorScale(d[0]))
    // .attr("stroke", d => colorScale(d[0]))
    // .attr("stroke-width", 2)
    .attr("opacity",gradientChange(periodNum))
    console.log(periodNum);
}

//-----------------------------9. Draw Interaction

sliderGenerator.on('onchange', (value) => {
 drawAreaChart(value);
 
 if(value==1){
     document.querySelector("#section-intro-description").textContent = "This is new Story";
 document.querySelector("#section-intro-rapsheet").textContent = "Common";
 }
else  if(value==2){
 document.querySelector("#section-intro-description").textContent = "This is about Heroine Chic";
  document.querySelector("#section-intro-rapsheet").textContent = "Sir Mix A Lot";}
else if(value==3){
 document.querySelector("#section-intro-description").textContent = "This is about Pilates";
  document.querySelector("#section-intro-rapsheet").textContent = "Don't Pilate Nothing";}
else   if(value==4){document.querySelector("#section-intro-description").textContent = "This is about Slim Chick";
  document.querySelector("#section-intro-rapsheet").textContent = "Slim Thick";}
});
    
drawAreaChart(1);
   
} draw()
