/*global d3 */

async function drawAnalysis() {
    //*************************1. Draw Dimensions 

    //------------------------ Area Chart Dimensions     

    const dimensionsLine = {
        width: 600,
        height: 800,
        margin: {
            top: 20,
            right: 100,
            bottom: 20,
            left: 100
        }
    }

    dimensionsLine.boundedWidth = dimensionsLine.width
        - dimensionsLine.margin.left
        - dimensionsLine.margin.right

    dimensionsLine.boundedHeight = dimensionsLine.height
        - dimensionsLine.margin.top
        - dimensionsLine.margin.bottom



    //*************************2. Draw Wrappers and Bounds

    //----------------------------Area Chart Wrapper and Bounds
    const wrapperLine = d3.select("#analysis")
        .append("svg")
        // .attr("width", dimensionsArea.width)
        // .attr("height", dimensionsArea.height)
        .attr("viewBox", `0 0 ${dimensionsLine.height} ${dimensionsLine.width}`)

    const boundsLine = wrapperLine.append("g")
        .style("translate", `transform(${dimensionsLine.margin.left}px, ${dimensionsLine.margin.top}px)`)

    const testDot = boundsLine.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 20)
        .attr("fill", "red")

    // ------------------------------Initial static 

    const lineChartGroup = boundsLine.append("g")
        .classed("lineChart", true)

    //**************************3. Load Data and Create Accessors

    //----------------------Load Data
    const surgery = await d3.csv("./data/plastic_surgery_growth.csv", (d) => {
        d3.autoType(d)
        return d
    })

    const analysis = await d3.csv("./data/analysis.csv", (d) => {
        d3.autoType(d)
        return d
    })
    surgery.sort((a, b) => a.year - b.year);
    analysis.sort((a, b) => a.year - b.year)
    // console.table(surgery[0])
    // console.log(surgery[0])
    console.table(analysis[0])
    console.log(analysis[0])

    const sumSry = d3.group(surgery, d => d.surgery);
    // console.log(sumSry)

    //--------------------Create Accessors

    //surgeryType
    const surgeryAccessor = d => d.surgery;
    //surgeryYear
    const yearParser = d3.timeParse("%Y");
    const yearAccessor = d => yearParser(d.year);
    // console.log(yearAccessor(surgery[0]))
    //surgery rate
    const rateAccessor = d => d.rate;
    // console.log(rateAccessor(surgery[0]))
    const countAccessor = d => d.count;


    //set up Arrays manually so I can control the order;
    const surgeryTypes = ["Breast augmentation", "Buttock augmentation", "Cheek implant", "Chin augmentation", "Facelift", "Lip augmentation", "Liposuction", "Nose reshaping", "Tummy tuck"]


    //*************************4. Create Scale  


    const timeScale = d3.scaleTime()
        .domain(d3.extent(surgery, yearAccessor))
        .range([100, 400])
        .nice()

    const rateScale = d3.scaleLinear()
        .domain([-2, 9])
        .range([dimensionsLine.boundedHeight / 4, 50])
        .nice()

    const lineColorScale = d3.scaleOrdinal()
        .domain(surgeryTypes)
        .range(['#8b0000', '#8b0000', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080'])


    //****************************5. Draw Peripherals

    //----------------------Draw Axis Generators

    const timeAxisGenerator = d3.axisBottom()
        .scale(timeScale)

    const rateAxisGenerator = d3.axisLeft()
        .scale(rateScale)

    //----------------------Draw Axes

    const timeAxis = boundsLine.append("g")
        .call(timeAxisGenerator)
        .style("transform", `translateY(${dimensionsLine.boundedHeight / 4 - 28}px)`)
        .attr("class", "axisRed")

    const rateAxis = boundsLine.append("g")
        .call(rateAxisGenerator)
        .style("transform", `translateX(${dimensionsLine.margin.left}px)`)
        .attr("class", "axisRed")

    //***************************6. Draw Chart Generators

    const lineGenerator = d3.line()
        .x(d => timeScale(yearAccessor(d)))
        .y(d => rateScale(rateAccessor(d)))
        .curve(d3.curveCardinal)
    // .curve(d3.curveCatmullRom.alpha(0.9))


    const lineChart = boundsLine.selectAll(".path")
        .data(sumSry)
        // .attr("class", "path")
        .join("path")
        .transition()
        .attr("d", d => lineGenerator(d[1]))
        .attr("stroke", d => lineColorScale(d[0]))
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("opacity", 1)


} drawAnalysis()