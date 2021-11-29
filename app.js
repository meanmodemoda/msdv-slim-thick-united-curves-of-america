/*global d3 */
//npm d3-simple-slider
//npm i @thomasloven/round-slider

async function draw() {

//*************************1. Draw Dimensions 

//------------------------ Area Chart Dimensions

    const dimensionsArea = {
        width: 400,
        height: 800,
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        }
    }

    dimensionsArea.boundedWidth = dimensionsArea.width
        - dimensionsArea.margin.left
        - dimensionsArea.margin.right

    dimensionsArea.boundedHeight = dimensionsArea.height
        - dimensionsArea.margin.top
        - dimensionsArea.margin.bottom
        
//-----------------------Line Chart Dimensions        
        
   const dimensionsLine = {
        width: 400,
        height: 800,
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        }
    }

    dimensionsLine.boundedWidth = dimensionsLine.width
        - dimensionsLine.margin.left
        - dimensionsLine.margin.right

    dimensionsLine.boundedHeight = dimensionsLine.height
        - dimensionsLine.margin.top
        - dimensionsLine.margin.bottom
        
    
// const posCheck = document.querySelector("#section-intro-chart").addEventListener('mouseenter', (e) => {
//         console.log("mouse page X: ", e.pageX);
//         console.log("mouse page Y: ", e.pageY);
//     }, );
        
//*************************2. Draw Wrapper and Bounds

//----------------------------Area Chart Wrapper and Bounds
   const wrapperArea = d3.select("#section-intro-chart") 
        .append("svg")
        .attr("width", dimensionsArea.width)
        .attr("height", dimensionsArea.height)
        
   const boundsArea = wrapperArea.append("g")
        .style("translate",`transform(${dimensionsArea.margin.left}px, ${dimensionsArea.margin.top}px)`)

//----------------------------Line Chart Wrapper and Bounds

   const wrapperLine = d3.select("#svg-group") 
        .append("svg")
        .attr("width", dimensionsLine.width)
        .attr("height", dimensionsLine.height)
        
   const boundsLine = wrapperLine.append("g")
        .style("translate",`transform(${dimensionsLine.margin.left}px, ${dimensionsLine.margin.top}px)`)


  // const tooltip = d3.select("#tooltip")
  
//**************************3. Load Data and Create Accessors

  const msm = await d3.csv("./body_measurement.csv",(d) => {
      d3.autoType(d) //time will converted to time format
        return d})
// console.table(msm[0]) //this is good for csv
// console.log(msm[0])      

 const surgery = await d3.csv("./plastic_surgery_growth.csv",(d) => {
     d3.autoType(d)
      return d})
// console.table(surgery[0]) 
// console.log(surgery[0])  

const sumSry = d3.group(surgery, d => d.surgery);    
// console.log(sumSry)

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

//surgery year
const yearParser = d3.timeParse("%Y");
const yearAccessor = d =>yearParser(d.year);
// console.log(yearAccessor(surgery[0]))
//surgery rate
const rateAccessor = d => d.rate;
// console.log(rateAccessor(surgery[0]))

//set up Arrays manually so I can control the order
const bodyParts = ["bust","abdomen","waist","hip","butt"]
const bodyTypes = ["Hour Glass","Heroine Chic","Pilates Body","Slim Thick"]
const periods = ["since Playboy","1990s","2000s","2010s - now"]

//*************************4. Create Scale  

const xScale = d3.scaleLinear()
    .domain([22,40])
    .range([dimensionsArea.margin.left,dimensionsArea.margin.left+250])
    
const yScale = d3.scaleOrdinal()
    .domain(bodyParts)
    .range([dimensionsArea.boundedHeight/2-250,dimensionsArea.boundedHeight/2-150,dimensionsArea.boundedHeight/2-50,dimensionsArea.boundedHeight/2+100,dimensionsArea.boundedHeight/2+200])
    
const colorScale = d3.scaleOrdinal()
    .domain(bodyTypes)
    .range(['#999999','#666666','#333333','#000000'])
    
const timeScale = d3.scaleTime()
    .domain(d3.extent(surgery,yearAccessor))
    .range([dimensionsLine.boundedHeight,dimensionsLine.margin.top])
    .nice()
    
const pctScale = d3.scaleLinear()
    .domain(d3.extent(surgery))
    
// const sliderScale = d3.scaleOrdinal()
//     .domain(periods)
//     .range([dimensionsArea.boundedWidth/2+100,dimensionsArea.boundedWidth/2+200,dimensionsArea.boundedWidth/2+300,dimensionsArea.boundedWidth/2+400])
    
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
const xAxisBottom = boundsArea.append("g")
    .call(xAxisBottomGenerator)
    .style("transform",`translateY(${dimensionsArea.boundedHeight/2+200}px)`)

// const sliderAxis = bounds.append("g")
//     .call(sliderAxisGenerator)
//     .style("transform",`translateY(${dimensionsArea.boundedHeight/2+370}px)`)
    
const xAxisTop = boundsArea.append("g")
    .call(xAxisTopGenerator)
    .style("transform",`translateY(${dimensionsArea.boundedHeight/2-250}px)`)
    
const yAxis = boundsArea.append("g")
    .call(yAxisGenerator)
    .style("transform",`translateX(${dimensionsArea.margin.left}px)`)
    


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
    

const slider = boundsArea.append('g')
    .classed("slider",true)
    // .attr('width', 400)
    // .attr('height', 100)
    //note this is different from CSS, d3 standard `translate` syntax, `px` is omitted
    .attr('transform', `translate(${dimensionsArea.margin.left},${dimensionsArea.boundedHeight/2+250})`)
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
    boundsArea.selectAll(".path")
    .data(sumMsm)
    .join("path")
    .attr("d", d=>areaGenerator(d[1]))
    .attr("fill","#000000")
    // .attr("fill", d => colorScale(d[0]))
    // .attr("stroke", d => colorScale(d[0]))
    // .attr("stroke-width", 2)
    .attr("opacity",gradientChange(periodNum))
    // console.log(periodNum);
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


//--------------------------------10 line tracing

//----------------------Draw Test Dots  


const drawing = d3.select("g#left-sil-line");
const line = drawing.select("path");
const sliderTest = d3.select("input#curve-slider");

const testDot = drawing.append("circle")
    .attr("cx",500)
    .attr("cy",2000)
    .attr("r", 40)
    .attr("fill","blue")

const getPos = () => {
    let lineLength = line.node().getTotalLength();
    let pct = Number(sliderTest.node().value);
    let pos = line.node().getPointAtLength(pct * lineLength);
    console.log(pos)
    return pos;
}

const circle = drawing.append("circle")
    .attr("cx",getPos().x)
    .attr("cy",getPos().y)
    .attr("r",20)
    .attr("fill","blue")
    
sliderTest.on("input", () => {
  // update coordinates of circle
  // when input slider is updated
  circle.attr("cx", getPos().x).attr("cy", getPos().y);
})
   
} draw()
