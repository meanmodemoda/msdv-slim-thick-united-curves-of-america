/*global d3*/
/*global enter-view*/
/*global stickyfillis*/
//npm d3-simple-slider
//npm i @thomasloven/round-slider

async function draw() {
	
//*************************1. Draw Dimensions 

//------------------------ Area Chart Dimensions

    const dimensionsArea = {
        width: 800,
        height: 800,
        margin: {
            top: 100,
            right:20,
            bottom: 20,
            left: 20
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
        // .attr("width", dimensionsArea.width)
        // .attr("height", dimensionsArea.height)
        .attr("viewBox", `0 0 ${dimensionsArea.height} ${dimensionsArea.width}`)
        
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
    
     const labelsGroup = boundsArea.append("g")
         .classed("labels",true)
         
     const annoGroup = boundsArea.append("g")
        .classed("anno",true)
        
        
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

const periodAccessor = d => d.period;
    //periodNum 1,2,3,4
const periodNumAccessor = d =>parseInt(d.periodNum);
// console.log(periodNumAccessor(msm[0]))
const cultureAccessor = d =>d.culture;
// console.log(periodAccessor(msm[0]))
const iconAccessor = d =>d.icon;

//set up Arrays manually so I can control the order
const cultureTypes = ["counter","main"]
const bodyParts = ["bust","abdomen","waist","hip","butt"]
const bodyTypes = ["Hour Glass","Androgyny","Disco Diva","Fitness Craze","Heroine Chic","Pilates Body","Slim Thick"]
const periods = ["1950s","1960s","1970s","1980s","1990s","2000s","2010s+"]
const periodNums = [1,2,3,4,5,6,7]	

//*************************4. Create Scale  

const xRightScale = d3.scaleLinear()
    .domain([20,48])
    .range([dimensionsArea.boundedWidth/3,dimensionsArea.boundedWidth/3+160])
    
const xLeftScale = d3.scaleLinear()
    .domain([20,48])
    .range([dimensionsArea.boundedWidth/3,dimensionsArea.boundedWidth/3-160])
    
const yScale = d3.scaleOrdinal()
    .domain(bodyParts)
    .range([dimensionsArea.boundedHeight/2-250,dimensionsArea.boundedHeight/2-180,dimensionsArea.boundedHeight/2-110,dimensionsArea.boundedHeight/2-20,dimensionsArea.boundedHeight/2+50])
    
    
const areaColorScale = d3.scaleOrdinal()
    .domain(bodyTypes)
    .range(['#999999','#666666','#333333','#000000'])
 
const cultureColorScale = d3.scaleOrdinal()
    .domain(cultureTypes)
    .range(['#8b0000','#000000'])
  
const progressScale = d3.scaleLinear()
    .domain(d3.extent(msm,periodNumAccessor))
    .range([dimensionsArea.boundedWidth/3-160,dimensionsArea.boundedWidth/3+160])
    .nice()
//****************************5. Draw Peripherals

//----------------------Draw Axis Generators
const xAxisRightBottomGenerator = d3.axisBottom()
    .scale(xRightScale)
    .tickValues([32,36,40,44,48])
    
const xAxisLeftBottomGenerator = d3.axisBottom()
    .scale(xLeftScale)
    .tickValues([32,36,40,44,48])
    
const xAxisRightTopGenerator = d3.axisTop()
    .scale(xRightScale)
     .tickValues([32,36,40,44,48])
     
const xAxisLeftTopGenerator = d3.axisTop()
    .scale(xLeftScale)
     .tickValues([32,36,40,44,48])
     
const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(5)
    
const progressAxisGenerator = d3.axisBottom()
    .scale(progressScale)
    .ticks(7)
	.tickFormat((d,i) => periods[i])
	
//----------------------Draw Axes
// const xAxisRightBottom = rightAxisGroup.append("g")
//     .call(xAxisRightBottomGenerator)
//     .style("transform",`translateY(${dimensionsArea.boundedHeight/2+50}px)`)

// const xAxisLeftBottom = leftAxisGroup.append("g")
//     .call(xAxisLeftBottomGenerator)
//     .style("transform",`translateY(${dimensionsArea.boundedHeight/2+50}px)`)

// const xAxisRightTop = rightAxisGroup.append("g")
//     .call(xAxisRightTopGenerator)
//     .style("transform",`translateY(${dimensionsArea.boundedHeight/2-250}px)`)

// const xAxisLeftTop = rightAxisGroup.append("g")
//     .call(xAxisLeftTopGenerator)
//     .style("transform",`translateY(${dimensionsArea.boundedHeight/2-250}px)`)
    
// const yAxis = rightAxisGroup.append("g")
//     .call(yAxisGenerator)
//     .style("transform",`translateX(${dimensionsArea.boundedWidth/3}px)`)
    
const progressAxis = labelsGroup.append("g")
    .call(progressAxisGenerator)
    .style("transform",`translateY(${dimensionsArea.boundedHeight/2+100}px)`)
    

//---------------------------Draw Ordinal Scale Slider    
//using d3=simple-slider package, note syntax slightly different from d3.js
    
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
    
//bound borders
 const topRight = boundsArea.append("circle")
    .attr("cx",dimensionsArea.boundedWidth)
    .attr("cy",0)
    .attr("r", 20)
    .attr("fill","blue")
    
 const topLeft = boundsArea.append("circle")
    .attr("cx",dimensionsArea.margin.left)
    .attr("cy",0)
    .attr("r", 20)
    .attr("fill","red")

 const bottomLeft = boundsArea.append("circle")
    .attr("cx",dimensionsArea.margin.left)
    .attr("cy",dimensionsArea.boundedHeight)
    .attr("r", 20)
    .attr("fill","green")  
   
 const cultureLabel=annoGroup.append("text")
        .classed("culturelabel",true)
        .text("culture")
        .attr("x",100)
        .attr("y",50)
    .style("fill", "black")
    .style("font-family", "Arial Black")
    .style("font-size", 12)
    
 const counterLabel=annoGroup.append("text")
        .classed("counterlabel",true)
        .text("culture")
        .attr("x",100)
        .attr("y",60)
    .style("fill", "red")
    .style("font-family", "Arial Black")
    .style("font-size", 12)    
//*****************************8. Transition Generator
    
function drawAreaChart(periodNum) {
//----------------------------Ppre-filter data
    const msmFilter = msm.filter(d => periodNumAccessor(d) == periodNum);
    const sumMsm = d3.group(msmFilter,cultureAccessor)
    
    const filterAnnoText = (input) => {
   if (input.part === "butt" ||input.part === "bust" ||input.part === "waist") {
    return input;
    }
}
    const annoFilter = msmFilter.filter(d => filterAnnoText(d))
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
 const rightContour = rightChartGroup.selectAll("path")
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
    
 const leftContour = leftChartGroup.selectAll("path")
    .data(sumMsm)
    .join("path")
    .transition().duration(600)
    .attr("d", d=>areaLeftGenerator(d[1]))
    .attr("fill", d => cultureColorScale(d[0]))
    .attr("opacity", d => opacityCultureChange(d[0]))
    // .attr("fill", d => areaColorScale(d[0]))
    .attr("stroke", d => cultureColorScale(d[0]))


//-------------------Draw Progress Bar    
const progressBar = labelsGroup.selectAll("rect")
    .data(sumMsm)
    .join("rect")
    // .transition().duration(600)
    .attr("x",dimensionsArea.boundedWidth/3-160)
    .attr("y",dimensionsArea.boundedHeight/2+100)
    .attr("width",progressScale(periodNum-1)-40)
    .attr("height",2)
    .attr("fill", "#000000")
    
const progressDot =  labelsGroup.selectAll("circle")
    .data(sumMsm)
    .join("circle")
    // .transition().duration(600)
    .attr("cx",progressScale(periodNum))
    .attr("cy",dimensionsArea.boundedHeight/2+100)
    .attr("r",4)
    .attr("fill", "#000000")
    .attr("stroke","white")
    .attr("stroke-width",2)
    
//progress hightlight    
progressAxis.selectAll("text")
    .style('fill',  i =>
        (periodNums[i] ==(periodNum+1))? 'red': "black")
//     .attr('font-size',"10px")
//     .style("text-anchor", "middle");


const rightAnno = rightChartGroup.selectAll("text")
    .data(annoFilter.filter(d => d.culture ==="counter"))
    .join("text")
    .attr("x", d=> xRightScale(measurementAccessor(d))+20)
    .attr("y", d => yScale(partAccessor(d)))
    .text(measurementAccessor)
    .attr("fill","red") 
    .attr("text-anchor","middle")
.attr("alignment-baseline","middle")

const leftAnno = leftChartGroup.selectAll("text")
    .data(annoFilter.filter(d => d.culture ==="main"))
    .join("text")
    .attr("x", d=> xLeftScale(measurementAccessor(d))-20)
    .attr("y", d => yScale(partAccessor(d)))
    .text(measurementAccessor)
    .attr("fill","black") 
    .attr("text-anchor","middle")
.attr("alignment-baseline","middle")



}



//-----------------------------9. Draw Interaction


const container = d3.select('#scrolly-side');
const stepSel = container.selectAll('.step');
const quoteSel = container.selectAll('.quotes');

    
function updateChart(index=1) {
	const sel = container.select(`[data-index='${index}']`);
	const width = sel.attr('data-width');
	quoteSel.style("opacity",(d, i) => i === (index-1)? 1:0)
	stepSel.classed('is-active', (d, i) => i === index);
	
	container.select('.bar-inner').style('width', width);
	drawAreaChart(index)
}


function init() {
	Stickyfill.add(d3.select('.sticky').node());

	enterView({
		selector: stepSel.nodes(),
		offset: 0.5,
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






