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
const sumMsm = d3.group(msm, d => d.type)
    
//**************************5. Create Data Accessors
    //bodyType
    const typeAccessor = d => d.type;
     //bodyMeasurement (x-value)
    const measurementAccessor = d => d.measurement;
    //bodyPart (y-value)
    const partAccessor = d => d.part;
    //period
    const periodAccessor = d => d.period;
    
// console.log(periodAccessor(msm[0]))

    const bodyParts = ["bust","abdomen","waist","hip","butt"]
    const bodyTypes = ["Hour Glass","Heroine Chic","Pilates Body","Slim Thick"]
    const periods = ["since Playboy","1990s","2000s","2010s - now"]
// //**************************6. Create Scale  

const xScale = d3.scaleLinear()
    .domain([22,40])
    .range([dimensions.boundedWidth/2+100,dimensions.boundedWidth/2+400])
    
const yScale = d3.scaleOrdinal()
    .domain(bodyParts)
    .range([dimensions.boundedHeight/2-150,dimensions.boundedHeight/2-50,dimensions.boundedHeight/2+100,dimensions.boundedHeight/2+250,dimensions.boundedHeight/2+350])
    
const colorScale = d3.scaleOrdinal()
    .domain(bodyTypes)
    .range(['#999999','#666666','#333333','#000000'])
    
const sliderScale = d3.scaleOrdinal()
    .domain(periods)
    .range([dimensions.boundedWidth/2+100,dimensions.boundedWidth/2+200,dimensions.boundedWidth/2+300,dimensions.boundedWidth/2+400])
    
//**************************** Draw Axis

const xAxisBottomGenerator = d3.axisBottom()
    .scale(xScale)

const sliderAxisGenerator = d3.axisBottom()
    .scale(sliderScale)

const xAxisTopGenerator = d3.axisTop()
    .scale(xScale)
    
const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickSize(5)

const xAxisBottom = bounds.append("g")
    .call(xAxisBottomGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight/2+350}px)`)

const sliderAxis = bounds.append("g")
    .call(sliderAxisGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight/2+370}px)`)
    
const xAxisTop = bounds.append("g")
    .call(xAxisTopGenerator)
    .style("transform",`translateY(${dimensions.boundedHeight/2-150}px)`)
    
const yAxis = bounds.append("g")
    .call(yAxisGenerator)
    .style("transform",`translateX(${dimensions.boundedWidth/2+100}px)`)
    

// //**************************7. Draw Dots
// // Select the svg area and add circles:

//-----------------Draw Multiple Lines

const areaGenerator = d3.area()
    .x1(d => xScale(measurementAccessor(d)))
    .x0(d => xScale(22))
    .y(d => yScale(partAccessor(d)))
    .curve(d3.curveCardinal)
    // .curve(d3.curveCatmullRom.alpha(0.9))
    // .curve(d3.curveBundle.beta(1))
    
bounds.selectAll(".line")
    .data(sumMsm)
    .enter().append("path")
    .classed("line",true)
    .attr("d", d=>areaGenerator(d[1]))
    .attr("fill", d => colorScale(d[0]))
    .attr("stroke", d => colorScale(d[0]))
    .attr("stroke-width", 2)
    .attr("opacity",0.8)
    
    
const testDot = bounds.append("circle")
    .attr("cx",dimensions.boundedWidth/2)
    .attr("cy",dimensions.boundedHeight/2)
    .attr("r", 5)
    
//using d3=simple-slider package, note syntax slightly different from d3.js
const sliderGenerator = d3.sliderHorizontal()
    .min(1)
    .max(4)
    .ticks(4)
    .tickFormat((d,i) => periods[i])
    .step(1)
    .width(300)
    .displayValue(false)
    .fill("#000000")
    .handle(
      d3.symbol()
        .type(d3.symbolCircle)
        .size(200)())
    

sliderGenerator.on('onchange', (val) => {
      d3.select('#value').text(val);
      console.log(val);
    });

const slider = bounds.append('g')
    .classed("slider",true)
    .attr('width', 500)
    .attr('height', 100)
    //note this is different from CSS, d3 standard `translate` syntax, `px` is omitted
    .attr('transform', `translate(${dimensions.boundedWidth/2+100},${dimensions.boundedHeight/2+400})`)
    .call(sliderGenerator);
    
// slider.select(".domain")
//      .attr("stroke","#E04836")
//      .attr("stroke-width","10")
//      .attr("opacity",".6")
//      .attr("stroke-dasharray","4");    
    
//***************************8. Draw Tooltip

//***************************9. Draw Interactivity

   
} draw()
