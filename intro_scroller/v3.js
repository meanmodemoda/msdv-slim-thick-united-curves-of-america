/*global d3*/
/*global enter-view*/
/*global stickyfillis*/
//npm d3-simple-slider
//npm i @thomasloven/round-slider

async function draw() {
	
//*************************1. Draw Dimensions 

//------------------------ Area Chart Dimensions

    const dimensionsArea = {
        width: 500,
        height: 600,
        margin: {
            top: 100,
            right: 20,
            bottom: 50,
            left: 0
        }
    }

    dimensionsArea.boundedWidth = dimensionsArea.width
        - dimensionsArea.margin.left
        - dimensionsArea.margin.right

    dimensionsArea.boundedHeight = dimensionsArea.height
        - dimensionsArea.margin.top
        - dimensionsArea.margin.bottom
        
//*************************2. Draw Wrappers and Bounds

//----------------------------Area Chart Wrapper and Bounds
   const wrapperArea = d3.select("#chart") 
        .append("svg")
        .attr("width", dimensionsArea.width)
        .attr("height", dimensionsArea.height)
        
   const boundsArea = wrapperArea.append("g")
        .style("translate",`transform(${dimensionsArea.margin.left}px, ${dimensionsArea.margin.top}px)`)

// ------------------------------Initial static 
    
    const rightChartGroup = boundsArea.append("g")
         .classed("rightAreaChart",true)
    
    const leftChartGroup = boundsArea.append("g")
         .classed("leftAreaChart",true)

    const rightAxisGroup = boundsArea.append("g")
         .classed("rightAxis",true)
         
     const leftAxisGroup = boundsArea.append("g")
         .classed("leftAxis",true)
    
    //**************************3. Load Data and Create Accessors

    
//----------------------Load Data
 const msm = await d3.csv("./body_measurement.csv",(d) => {
      d3.autoType(d)  
        return d})

msm.sort((a,b)=> a.culture - b.culture)        
// console.table(msm[0])  
// console.log(msm[0])   

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

//set up Arrays manually so I can control the order
const cultureTypes = ["counter","main"]
const bodyParts = ["bust","abdomen","waist","hip","butt"]
const bodyTypes = ["Hour Glass","Androgyny","Disco Diva","Fitness Craze","Heroine Chic","Pilates Body","Slim Thick"]
const periods = ["1950s","1960s","1970s","1980s","1990s","2000s","2010s+"]
	
//*************************4. Create Scale  

const xRightScale = d3.scaleLinear()
    .domain([20,46])
    .range([dimensionsArea.boundedWidth/2,dimensionsArea.boundedWidth/2+220])
    
const xLeftScale = d3.scaleLinear()
    .domain([20,46])
    .range([dimensionsArea.boundedWidth/2,dimensionsArea.boundedWidth/2-220])
    
const yScale = d3.scaleOrdinal()
    .domain(bodyParts)
    .range([dimensionsArea.boundedHeight/2-250,dimensionsArea.boundedHeight/2-150,dimensionsArea.boundedHeight/2-50,dimensionsArea.boundedHeight/2+100,dimensionsArea.boundedHeight/2+200])
    
    
const areaColorScale = d3.scaleOrdinal()
    .domain(bodyTypes)
    .range(['#999999','#666666','#333333','#000000'])
 
const cultureColorScale = d3.scaleOrdinal()
    .domain(cultureTypes)
    .range(['#8b0000','#000000'])
    
// const sliderScale = d3.scaleOrdinal()
//     .domain(periods)
//     .range([dimensionsArea.boundedWidth/2+100,dimensionsArea.boundedWidth/2+200,dimensionsArea.boundedWidth/2+300,dimensionsArea.boundedWidth/2+400])
    
//****************************5. Draw Peripherals

//----------------------Draw Axis Generators
const xAxisRightBottomGenerator = d3.axisBottom()
    .scale(xRightScale)
    
const xAxisLeftBottomGenerator = d3.axisBottom()
    .scale(xLeftScale)
// const sliderAxisGenerator = d3.axisBottom()
//     .scale(sliderScale)

const xAxisRightTopGenerator = d3.axisTop()
    .scale(xRightScale)
    
const xAxisLeftTopGenerator = d3.axisTop()
    .scale(xLeftScale)
    
const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .tickSize(5)
    

//----------------------Draw Axes
const xAxisRightBottom = rightAxisGroup.append("g")
    .call(xAxisRightBottomGenerator)
    .style("transform",`translateY(${dimensionsArea.boundedHeight/2+200}px)`)

const xAxisLeftBottom = leftAxisGroup.append("g")
    .call(xAxisLeftBottomGenerator)
    .style("transform",`translateY(${dimensionsArea.boundedHeight/2+200}px)`)

// const sliderAxis = bounds.append("g")
//     .call(sliderAxisGenerator)
//     .style("transform",`translateY(${dimensionsArea.boundedHeight/2+370}px)`)
const xAxisRightTop = rightAxisGroup.append("g")
    .call(xAxisRightTopGenerator)
    .style("transform",`translateY(${dimensionsArea.boundedHeight/2-250}px)`)

const xAxisLeftTop = rightAxisGroup.append("g")
    .call(xAxisLeftTopGenerator)
    .style("transform",`translateY(${dimensionsArea.boundedHeight/2-250}px)`)
    
const yAxis = rightAxisGroup.append("g")
    .call(yAxisGenerator)
    .style("transform",`translateX(${dimensionsArea.boundedWidth/2}px)`)
    
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
    .max(7)
    .ticks(7)
    .tickFormat((d,i) => periods[i])
    .step(1)
    .default(1)
    .width(400)
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
    .attr('transform', `translate(${dimensionsArea.margin.left+20},${dimensionsArea.boundedHeight/2+250})`)
    .call(sliderGenerator);
    
//***************************6. Draw Chart Generators
 const areaRightGenerator = d3.area()
    .x1(d => xRightScale(measurementAccessor(d)))
    .x0(d => xRightScale(20))
    .y(d => yScale(partAccessor(d)))
    .curve(d3.curveCardinal)
     // .curve(d3.curveCatmullRom.alpha(0.9))
    // .curve(d3.curveBundle.beta(1))

const areaLeftGenerator = d3.area()
    .x1(d => xLeftScale(measurementAccessor(d)))
    .x0(d => xLeftScale(20))
    .y(d => yScale(partAccessor(d)))
    .curve(d3.curveCardinal)
    

	wrapperArea.append("circle")
    .attr("cx",dimensionsArea.margin.left)
    .attr("cy",dimensionsArea.margin.top)
    .attr("r", 40)
    .attr("fill","blue")
    
 //
    
//*****************************8. Transition Generator
    
function drawAreaChart(periodNum) {
//----------------------------Ppre-filter data
    const msmFilter = msm.filter(d => periodNumAccessor(d) == periodNum);
    const sumMsm = d3.group(msmFilter,cultureAccessor)
    // console.log(sumMsm)
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
    rightChartGroup.selectAll("path")
    .data(sumMsm)
    .join("path")
    .transition().duration(600)
    .attr("d", d=>areaRightGenerator(d[1]))
    .attr("fill", d => cultureColorScale(d[0]))
    .attr("opacity", d => opacityCultureChange(d[0]))
    // .attr("fill", d => areaColorScale(d[0]))
    .attr("stroke", d => cultureColorScale(d[0]))
    //   .attr("opacity",0.5)
    // .attr("stroke-width", 5)
    // console.log(periodNum);
    
     leftChartGroup.selectAll("path")
    .data(sumMsm)
    .join("path")
    .transition().duration(600)
    .attr("d", d=>areaLeftGenerator(d[1]))
    .attr("fill", d => cultureColorScale(d[0]))
    .attr("opacity", d => opacityCultureChange(d[0]))
    // .attr("fill", d => areaColorScale(d[0]))
    .attr("stroke", d => cultureColorScale(d[0]))
}


//-----------------------------9. Draw Interaction

sliderGenerator.on('onchange', (value) => {
 drawAreaChart(value);
});
    



const container = d3.select('#scrolly-side');
const stepSel = container.selectAll('.step');


    
function updateChart(index=1) {
	const sel = container.select(`[data-index='${index}']`);
	const width = sel.attr('data-width');
	stepSel.classed('is-active', (d, i) => i === index);
	container.select('.bar-inner').style('width', width);
	drawAreaChart(index)
}


function init() {
	Stickyfill.add(d3.select('.sticky').node());

	enterView({
		selector: stepSel.nodes(),
		offset: 0.1,
		enter: el => {
			const index = +d3.select(el).attr('data-index');
			updateChart(index);
		},
		exit: el => {
			let index = +d3.select(el).attr('data-index');
			index = Math.max(0, index - 1);
			updateChart(index);
		}
	});
}

init()
    
drawAreaChart(1);

} draw()






