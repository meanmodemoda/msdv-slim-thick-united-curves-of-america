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
            bottom: 0,
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
        width: 2000,
        height: 3050,
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
        
//*************************2. Draw Wrappers and Bounds

//----------------------------Area Chart Wrapper and Bounds
   const wrapperArea = d3.select("#section-intro-chart") 
        .append("svg")
        .attr("width", dimensionsArea.width)
        .attr("height", dimensionsArea.height)
        
   const boundsArea = wrapperArea.append("g")
        .style("translate",`transform(${dimensionsArea.margin.left}px, ${dimensionsArea.margin.top}px)`)

//----------------------------Line Chart Wrapper and Bounds

   const wrapperLine = d3.select("g#time-line") 
        .append("svg")
        .attr("width", dimensionsLine.width)
        .attr("height", dimensionsLine.height)
        
   const boundsLine = wrapperLine.append("g")
        .style("translate",`transform(${dimensionsLine.margin.left}px, ${dimensionsLine.margin.top}px)`)


  // const tooltip = d3.select("#tooltip")
  
//**************************3. Load Data and Create Accessors

//----------------------Load Data
  const msm = await d3.csv("./body_measurement_v2.csv",(d) => {
      d3.autoType(d)  
        return d})
        
msm.sort((a,b)=>a.culture-b.culture);
// console.table(msm[0])  
// console.log(msm[0])   

 const surgery = await d3.csv("./plastic_surgery_growth.csv",(d) => {
     d3.autoType(d)
      return d})
      
 surgery.sort((a,b)=>b.year-a.year);

// console.table(surgery[0]) 
// console.log(surgery[0])  

const sumSry = d3.group(surgery, d => d.surgery);    
// console.log(sumSry)

//--------------------Create Accessors
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

const cultureAccessor = d =>d.culture;
// console.log(periodAccessor(msm[0]))
const iconAccessor = d =>d.icon;

//surgeryType
const surgeryAccessor = d => d.surgery;
//surgeryYear
const yearParser = d3.timeParse("%Y");
const yearAccessor = d =>yearParser(d.year);
// console.log(yearAccessor(surgery[0]))
//surgery rate
const rateAccessor = d => d.rate;
// console.log(rateAccessor(surgery[0]))

//set up Arrays manually so I can control the order
const cultureTypes = ["counter","main"]
const bodyParts = ["bust","abdomen","waist","hip","butt"]
const bodyTypes = ["Hour Glass","Androgyny","Fitness Craze","Heroine Chic","Pilates Body","Slim Thick"]
const periods = ["1950s","1960s-'70s","1980s","1990s","2000s","2010s-now"]
const surgeryTypes = ["Breast augmentation","Buttock augmentation", "Cheek implant","Chin augmentation","Facelift","Lip augmentation","Liposuction","Nose reshaping","Tummy tuck"]

//*************************4. Create Scale  

const xScale = d3.scaleLinear()
    .domain([20,46])
    .range([dimensionsArea.margin.left,dimensionsArea.margin.left+250])
    
const yScale = d3.scaleOrdinal()
    .domain(bodyParts)
    .range([dimensionsArea.boundedHeight/2-250,dimensionsArea.boundedHeight/2-150,dimensionsArea.boundedHeight/2-50,dimensionsArea.boundedHeight/2+100,dimensionsArea.boundedHeight/2+200])
    
const timeScale = d3.scaleTime()
    .domain(d3.extent(surgery,yearAccessor))
    .range([dimensionsLine.boundedHeight/2-600,dimensionsLine.boundedHeight])
    .nice()
    
const rateScale = d3.scaleLinear()
    .domain(d3.extent(surgery,rateAccessor))
    .range([dimensionsLine.boundedWidth/2-20,dimensionsLine.boundedWidth/2+500])
    
    
const areaColorScale = d3.scaleOrdinal()
    .domain(bodyTypes)
    .range(['#999999','#666666','#333333','#000000'])
 
const cultureColorScale = d3.scaleOrdinal()
    .domain(cultureTypes)
    .range(['#8b0000','#000000'])

const lineColorScale = d3.scaleOrdinal()
    .domain(surgeryTypes)
    .range(['#000000','#8b0000','#8b0000','#000000','#000000','#000000','#000000','#000000','#000000'])
    
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
    
const timeAxisGenerator = d3.axisLeft()
    .scale(timeScale)
    
const rateAxisGenerator = d3.axisBottom()
    .scale(rateScale)

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
    
// const timeAxis = boundsLine.append("g")
//     .call(timeAxisGenerator)
//     .style("transform",`translateX(${dimensionsLine.boundedWidth/2}px)`)
    

// const rateAxis = boundsLine.append("g")
//     .call(rateAxisGenerator)
//     .style("transform",`translateY(${dimensionsLine.boundedHeight}px)`)

//---------------------------Draw Ordinal Scale Slider    
//using d3=simple-slider package, note syntax slightly different from d3.js
const sliderGenerator = d3.sliderHorizontal()
    .min(1)
    .max(6)
    .ticks(6)
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
    
//***************************6. Draw Chart Generators
 const areaGenerator = d3.area()
    .x1(d => xScale(measurementAccessor(d)))
    .x0(d => xScale(20))
    .y(d => yScale(partAccessor(d)))
    .curve(d3.curveCardinal)
     // .curve(d3.curveCatmullRom.alpha(0.9))
    // .curve(d3.curveBundle.beta(1))

const lineGenerator = d3.line()
  .x(d => rateScale(rateAccessor(d)))
    .y(d => timeScale(yearAccessor(d)))
    // .curve(d3.curveCardinal)
    .curve(d3.curveCatmullRom.alpha(0.9))
//***************************7. Draw Area Chart

const lineChart = boundsLine.selectAll(".path")
    .data(sumSry)
    .join("path")
    .attr("d", d => lineGenerator(d[1]))
    .attr("stroke", d => lineColorScale(d[0]))
    .attr("stroke-width",3)
    .attr("fill","none")
    .attr("opacity",0.8)
    .raise()
    
    
    
function drawAreaChart(periodNum) {
//----------------------------Ppre-filter data
    const msmFilter = msm.filter(d => periodNumAccessor(d) == periodNum);
    const sumMsm = d3.group(msmFilter,cultureAccessor);
    
//---------------------Change gradient value by filter
  const gradientChange=(periodNum)=>{
        if(periodNum==1) return 0.3;
        else if(periodNum==2) return 0.4;
        else if(periodNum==3) return 0.5;
        else if(periodNum==4) return 0.7;
        else if(periodNum==5) return 0.8;
        else if(periodNum==6) return 1;
    }   

  const opacityCultureChange=(cultureTypes)=>{
        if(cultureTypes=="counter") return 0.5;
        else return 1;
    }       
 //--------------------Draw areaChart
    boundsArea.selectAll(".path")
    .data(sumMsm)
    .join("path")
    .attr("d", d=>areaGenerator(d[1]))
    .attr("fill", d => cultureColorScale(d[0]))
    .attr("opacity", d => opacityCultureChange(d[0]))
    // .attr("fill", d => areaColorScale(d[0]))
    .attr("stroke", d => cultureColorScale(d[0]))
    //   .attr("opacity",0.5)
    // .attr("stroke-width", 5)
   
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
