/*global d3 */

async function drawAnalysis() {
    //*************************1. Draw Dimensions 

    //------------------------ Area Chart Dimensions     

    const dimensionsLine = {
        width: 800,
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


    const tooltip = d3.select("#tooltip")

    const testDot = boundsLine.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 20)
        .attr("fill", "red")

    // ------------------------------Initial static 

    const lineChartGroup = boundsLine.append("g")
        .classed("lineChart", true)

    const compChartGroup = boundsLine.append("g")
        .classed("lineCompChart", true)

    const labelsGroup = boundsLine.append("g")
        .classed("labels", true)

    const tooltipDot = boundsLine.append("circle")
        .attr("r", 2)
        .attr("fill", "#fc8781")
        .attr("stroke-width", 2)
        .style("opacity", 0)
        .style("pointer-events", "none")

    const tooltipGroup = tooltip.append("g")

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
    // console.table(analysis[0])
    // console.log(analysis[0])

    const sumSry = d3.group(surgery, d => d.surgery);
    // console.log(sumSry)

    const millions = analysis.filter(d => d.unit === "million");
    const billions = analysis.filter(d => d.unit === "billion")
    const sumMil = d3.group(millions, d => d.party);
    const sumBil = d3.group(billions, d => d.party);
    // console.log(sumMil)
    // console.log(sumBil)

    const billionsIG = billions.filter(d => d.party === "Instagram")
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

    //category
    const categoryAccessor = d => d.category;
    const valueAccessor = d => d.value;


    //set up Arrays manually so I can control the order;
    const surgeryTypes = ["Breast augmentation", "Buttock surgeries", "Cheek implant", "Chin augmentation", "Facelift", "Lip augmentation", "Liposuction", "Nose reshaping", "Tummy tuck"]
    const categories = ["Instagram Followers", "Networth", "Spending", "Ad Revenue"]
    const parties = ["Kylie IG", "Kim IG", "Kylie Networth", "Kim Networth", "US Plastic Surgery", "Instagram"]
    const yearAnalysis = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
    //*************************4. Create Scale  



    const timeScale = d3.scaleTime()
        .domain(d3.extent(surgery, yearAccessor))
        .range([320, 500])
    // .nice()


    const milScale = d3.scaleLinear()
        .domain(d3.extent(millions, valueAccessor))
        .range([172, 70])
        .nice()

    const rateScale = d3.scaleLinear()
        .domain([-2, 9])
        .range([300, 192])
        .nice()


    const bilScale = d3.scaleLinear()
        .domain(d3.extent(billions, valueAccessor))
        .range([420, 320])
        .nice()


    const lineColorScale = d3.scaleOrdinal()
        .domain(surgeryTypes)
        .range(['#8b0000', '#8b0000', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080'])

    const partyColorScale = d3.scaleOrdinal()
        .domain(parties)
        .range(['#11ae7a', '#808080', '#cbd438', '#8b0000', '#8b0000', '#808080'])



    //****************************5. Draw Peripherals

    //----------------------Draw Axis Generators

    const timeRateAxisGenerator = d3.axisBottom()
        .scale(timeScale)
        .ticks(5)

    const timeMilAxisGenerator = d3.axisBottom()
        .scale(timeScale)
        .ticks(4)

    const rateAxisGenerator = d3.axisLeft()
        .scale(rateScale)
        .ticks(4)

    const milAxisGenerator = d3.axisLeft()
        .scale(milScale)
        .ticks(4)

    const bilAxisGenerator = d3.axisLeft()
        .scale(bilScale)
        .ticks(4)

    //----------------------Draw Axes

    const rateAxis = boundsLine.append("g")
        .call(rateAxisGenerator)
        .style("transform", `translateX(320px)`)
        .attr("class", "axisRed")

    const timeRateAxis = boundsLine.append("g")
        .call(timeRateAxisGenerator)
        .style("transform", `translateY(30px)`)
        .attr("class", "axisRed")


    const milAxis = boundsLine.append("g")
        .call(milAxisGenerator)
        .style("transform", `translateX(320px)`)
        .attr("class", "axisRed")

    const bilAxis = boundsLine.append("g")
        .call(bilAxisGenerator)
        .style("transform", `translateX(320px)`)
        .attr("class", "axisRed")

    //***************************6. Draw Chart Generators

    const lineGenerator = d3.line()
        .x(d => timeScale(yearAccessor(d)))
        .y(d => rateScale(rateAccessor(d)))
        // .curve(d3.curveCardinal)
        .curve(d3.curveCatmullRom.alpha(0.9))

    const lineMilGenerator = d3.line()
        .x(d => timeScale(yearAccessor(d)))
        .y(d => milScale(valueAccessor(d)))
    // .curve(d3.curveCardinal)

    const lineBilGenerator = d3.line()
        .x(d => timeScale(yearAccessor(d)))
        .y(d => bilScale(valueAccessor(d)))
    // .curve(d3.curveCardinal)
    // .curve(d3.curveCatmullRom.alpha(0.2))

    //***************************7. Draw Charts
    const lineChart = boundsLine.selectAll(".path")
        .data(sumSry)
        // .attr("class", "path")
        .join("path")
        // .transition()
        // .duration(600)
        .attr("d", d => lineGenerator(d[1]))
        .attr("stroke", d => lineColorScale(d[0]))
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("opacity", 1)


    const lineMilChart = boundsLine.selectAll(".path")
        .data(sumMil)
        // .attr("class", "path")
        .join("path")
        // .transition()
        // .duration(600)
        .attr("d", d => lineMilGenerator(d[1]))
        .attr("stroke", d => partyColorScale(d[0]))
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("opacity", 1)

    const lineBilChart = boundsLine.selectAll(".path")
        .data(sumBil)
        // .attr("class", "path")
        .join("path")
        // .transition()
        // .duration(600)
        .attr("d", d => lineBilGenerator(d[1]))
        .attr("stroke", d => partyColorScale(d[0]))
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("opacity", 1)

    //***************************8. Draw Chart Peripherals
    //------------------Draw Labels
    //for precision positioning, avoided loop, hardcoded positioning
    const labels = ["The Gaze", "The Surgery", "The Money"]

    const labelGroups = labelsGroup.selectAll("g")
        .data(labels)
        .enter()
        .append("g")


    const gazeLabel = labelGroups.append("text")
        .attr("x", 150)
        .attr("y", 70)
        .text("The Gaze")
        .style("fill", "white")
        .style("font-family", "Arial Black")
        .style("font-size", 12)

    const surgeryLabel = labelGroups.append("text")
        .attr("x", 150)
        .attr("y", 190)
        .text("The Surgery")
        .style("fill", "white")
        .style("font-family", "Arial Black")
        .style("font-size", 12)

    const moneyLabel = labelGroups.append("text")
        .attr("x", 150)
        .attr("y", 320)
        .text("The Money")
        .style("fill", "white")
        .style("font-family", "Arial Black")
        .style("font-size", 12)

    const test = labelGroups.append().html("The Money2")
        .attr("x", 150)
        .attr("y", 420)
        .text("The Money")
        .style("fill", "white")
        .style("font-family", "Arial Black")
        .style("font-size", 12)

    // const chartLabels = labelGroups.append("text")
    //     .attr("x", 150)
    //     .attr("y", (d, i) => i * 120 + 30)
    //     .text(d => d)
    //     .style("fill", "white")
    //     .style("font-family", "Arial Black")
    //     .style("font-size", 12)
    //------------------Draw Title

    // ctr.append("text")
    //     .attr("x", dimensions.ctrWidth / 2 + 50)
    //     .attr("y", dimensions.topMargin - 20)
    //     .attr("text-anchor", "middle")
    //     .text("NYC Air Quality by Borough Over Time (2009 - 2018)")
    //     .style("fill", "black")
    //     .style("font-size", 14)
    //     .style("font-family", "Arial Black")
    //     .raise()

    //Tooltip

    const listeningRect = boundsLine.append("rect")
        .attr("x", 320)
        .attr("width", 500)
        .attr("height", 920)
        .style("opacity", 0)
        .on("touchmouse mousemove", callback)
        .on("mouseleave", removeTooltip)

    function callback(e) {
        const mousePos = d3.pointer(e, this)
        const year = timeScale.invert(mousePos[0])
        //Custom Bisector - left, center, right
        const bisector = d3.bisector(yearAccessor).left
        const index = bisector(billionsIG, year)

        const yValue = valueAccessor(billionsIG[index])
        console.log(yValue)
        console.log(year)
        //Update Image
        tooltipDot.style('opacity', 1)
            .attr('cx', timeScale(year))
            .attr('cy', bilScale(yValue))
            .raise()

        tooltip.style('display', 'block')
            .style('top', '200px')
            .style('left', '200px')
            .style("fill", "white")
            .style("font-family", "Arial Black")
            .style("font-size", 12)
            .style("border", "2 solid white")

        tooltipGroup.select('.value').append("text")
            .text(`Hello World`)

        const dateFormatter = d3.timeFormat("%Y")
        tooltip.select('.year')
            .text(`$${dateFormatter(timeScale(year))}`)
            .style("fill", "white")
            .style("font-family", "Arial Black")
            .style("font-size", 12)
    }

    function removeTooltip(e) {
        tooltipDot.style('opacity', 0)
        tooltip.style('display', 'none')
    }



    //---------------------------Draw Ordinal Scale Slider    
    //using d3=simple-slider package, note syntax slightly different from d3.js
    const sliderGenerator = d3.sliderHorizontal()
        .min(1)
        .max(9)
        .ticks(9)
        .tickFormat((d, i) => yearAnalysis[i])
        .step(1)
        .default(1)
        .width(200)
        .displayValue(false)
        .fill("#000000")
        .handle(
            d3.symbol()
                .type(d3.symbolCircle)
                .size(50)())


    const slider = boundsLine.append('g')
        .classed("slider", true)
        // .attr('width', 400)
        // .attr('height', 100)
        //note this is different from CSS, d3 standard `translate` syntax, `px` is omitted
        .attr('transform', `translate(320,450)`)
        .call(sliderGenerator);


    // sliderGenerator.on('onchange', (value) => {
    //     drawLines(value);

} drawAnalysis()