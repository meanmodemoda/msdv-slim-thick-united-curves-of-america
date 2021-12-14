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

    const tooltip = d3.select('#tooltip')

    // tooltip.html('<div><b>hello world</b></div>')
    //     .style("color", "green")
    // .style('top', 500 + 'px')
    // .style('left', 800 + 'px')

    // tooltip.select('.year')
    //     .html('<div><b>2020</b></div>')
    //     .attr("color", "yellow")
    // // .style('top', 200 + 'px')
    // // .style('left', 400 + 'px')
    // tooltip.select('.year')
    //     .text(`Hello World`)
    //   

    const boundsLine = wrapperLine.append("g")
        .style("translate", `transform(${dimensionsLine.margin.left}px, ${dimensionsLine.margin.top}px)`)

    // const testDot = boundsLine.append("circle")
    //     .attr("cx", 50)
    //     .attr("cy", 50)
    //     .attr("r", 20)
    //     .attr("fill", "red")

    // ------------------------------Initial static 

    const lineChartGroup = boundsLine.append("g")
        .classed("lineChart", true)

    const tooltipGroup = boundsLine.append("g")
        .classed("tooltipGroup", true)

    const tooltipSurgery = boundsLine.append("g")

    const tooltipMil = boundsLine.append("g")
    const tooltipBil = boundsLine.append("g")

    const labelsGroup = boundsLine.append("g")
        .classed("labels", true)

    const dotBilGroup = boundsLine.append("g")
        .classed("dotBilChart", true)

    const dotMilGroup = boundsLine.append("g")
        .classed("dotMilChart", true)

    const dotSryGroup = boundsLine.append("g")
        .classed("dotSryChart", true)

    const lineRefGroup = boundsLine.append("g")
        .classed("lineRefGroup", true)



    const foreignGroup = labelsGroup.append("svg")
    // .attr("width", 960)
    // .attr("height", 500);

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
    //periodnum
    const periodNumAccessor = d => d.periodnum;
    //category
    const categoryAccessor = d => d.category;
    const valueAccessor = d => d.value;
    //note accessor
    const noteAccessor = d => d.note;

    //set up Arrays manually so I can control the order;
    const surgeryTypes = ["Breast augmentation", "Buttock surgeries", "Cheek implant", "Chin augmentation", "Facelift", "Lip augmentation", "Liposuction", "Nose reshaping", "Tummy tuck"]
    const categories = ["Instagram Followers", "Networth", "Spending", "Ad Revenue"]
    const gazeType = ["Kylie's Instagram", "Kim's Instagram", "Kylie's Networth", "Kim's Networth"]
    const moneyType = ["US Plastic Surgery", "Instagram"]
    const parties = ["Kylie's Instagram", "Kim's Instagram", "Kylie Networth", "Kim Networth", "US Plastic Surgery", "Instagram"]
    const yearAnalysis = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
    //*************************4. Create Scale  



    const timeScale = d3.scaleTime()
        .domain(d3.extent(surgery, yearAccessor))
        .range([320, 500])
    // .nice()


    const milScale = d3.scaleLinear()
        .domain(d3.extent(millions, valueAccessor))
        .range([150, 70])
        .nice()

    const rateScale = d3.scaleLinear()
        .domain([-2, 9])
        .range([250, 170])
        .nice()


    const bilScale = d3.scaleLinear()
        .domain(d3.extent(billions, valueAccessor))
        .range([340, 270])
        .nice()


    const lineColorScale = d3.scaleOrdinal()
        .domain(surgeryTypes)
        .range(['#ac7ddf', '#8aa10e', '#FFFFFF', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080'])

    const partyColorScale = d3.scaleOrdinal()
        .domain(parties)
        .range(['#ac7ddf', '#FFFFFF', '#ac7ddf', '#FFFFFF', '#FFFFFF', '#ac7ddf'])



    //****************************5. Draw Peripherals

    //----------------------Draw Axis Generators

    const timeRateAxisGenerator = d3.axisBottom()
        .scale(timeScale)
        .ticks(5)

    const timeMilAxisGenerator = d3.axisBottom()
        .scale(timeScale)
        .ticks(4)

    // const axisFormatter = d3.format(".0%")
    const rateAxisGenerator = d3.axisLeft()
        .scale(rateScale)
        .ticks(4)
    // .tickFormat(axisFormatter(rateAccessor))

    const milAxisGenerator = d3.axisLeft()
        .scale(milScale)
        .ticks(4)

    const bilAxisGenerator = d3.axisLeft()
        .scale(bilScale)
        .ticks(4)

    //----------------------Draw Axes

    const rateAxis = boundsLine.append("g")
        .call(rateAxisGenerator)
        .style("transform", `translateX(310px)`)
        .attr("class", "axisAnalysis")

    // const timeRateAxis = boundsLine.append("g")
    //     .call(timeRateAxisGenerator)
    //     .style("transform", `translateY(30px)`)
    //     .attr("class", "axisRed")

    const milAxis = boundsLine.append("g")
        .call(milAxisGenerator)
        .style("transform", `translateX(310px)`)
        .attr("class", "axisAnalysis")

    const bilAxis = boundsLine.append("g")
        .call(bilAxisGenerator)
        .style("transform", `translateX(310px)`)
        .attr("class", "axisAnalysis")

    rateAxis.select(".domain").remove();
    milAxis.select(".domain").remove();
    bilAxis.select(".domain").remove();

    rateAxis.selectAll(".tick line")
        .attr("stroke", "#E04836")
        .attr("stroke-width", "0.5")
        .attr("stroke-height", "1")
        .attr("opacity", ".6");

    milAxis.selectAll(".tick line")
        .attr("stroke", "#E04836")
        .attr("stroke-width", "0.5")
        .attr("stroke-height", "1")
        .attr("opacity", ".6");

    bilAxis.selectAll(".tick line")
        .attr("stroke", "#E04836")
        .attr("stroke-width", "0.5")
        .attr("stroke-height", "1")
        .attr("opacity", ".6");
    //***************************6. Draw Chart Generators

    const lineGenerator = d3.line()
        .x(d => timeScale(yearAccessor(d)))
        .y(d => rateScale(rateAccessor(d)))
        .curve(d3.curveCardinal)
    // .curve(d3.curveCatmullRom.alpha(0.9))

    const lineMilGenerator = d3.line()
        .x(d => timeScale(yearAccessor(d)))
        .y(d => milScale(valueAccessor(d)))
        .curve(d3.curveCardinal)

    const lineBilGenerator = d3.line()
        .x(d => timeScale(yearAccessor(d)))
        .y(d => bilScale(valueAccessor(d)))
        .curve(d3.curveCardinal)
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
        .attr("stroke-width", 0.8)
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
        .attr("stroke-width", 0.8)
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
        .attr("stroke-width", 0.8)
        .attr("fill", "none")
        .attr("opacity", 1)



    //***************************8. Draw Chart Peripherals
    //------------------Draw Labels
    //for precision positioning, avoided loop, hardcoded positioning
    const labels = ["The Gaze", "The Surgery", "The Money"]

    const labelGroups = labelsGroup.selectAll("g")
        .data(labels)
        .join("g")

    const foreignGaze = labelGroups.append("foreignObject")
        .attr("x", 100)
        .attr("y", 60)
        .attr("width", 150)
        .attr("height", 400)
        .append("xhtml:div")
        .style("font", "0.5rem 'Open Sans'")
        .style("color", "#E8BEAC")
        .style("line-height", "12px")
        .html("<h1 style='font-weight: 800'>The Gaze</h1><p style='font-size: 8px; color: white;'>A trend line of estimated Kim and Kylie's Instagram followers and their networth in millions (count/$).");

    const foreignSry = labelGroups.append("foreignObject")
        .attr("x", 100)
        .attr("y", 170)
        .attr("width", 150)
        .attr("height", 400)
        .append("xhtml:div")
        .style("font", "0.5rem 'Open Sans'")
        .style("color", "#E8BEAC")
        .style("line-height", "12px")
        .html("<h1 style='font-weight: 800'>The Surgery</h1><p style='font-size: 8px; color: white;'>A trend line of annual growth rate vs 2012 of key plastic surgeries performed in America.");

    const foreignMoney = labelGroups.append("foreignObject")
        .attr("x", 100)
        .attr("y", 270)
        .attr("width", 150)
        .attr("height", 400)
        .append("xhtml:div")
        .style("font", "0.5rem 'Open Sans'")
        .style("color", "#E8BEAC")
        .style("line-height", "12px")
        .html("<h1 style='font-weight: 800'>The Money</h1><p style='font-size: 8px; color: white;'>A trend line of estimated Instagram annual ad revenue and reported US plastic surgery spending in billions ($).");

    //Draw Tooltip
    const tooltipBox = tooltipGroup.append('rect')
        .attr("x", 550)
        .attr("y", 60)
        .attr('width', 190)
        .attr('height', 280)
        .classed('tooltipBox', true)
        .attr("fill", "#E8BEAC")
        .attr("rx", 2)

    const tooltipMilHeader = tooltipGroup.append('g')
        .selectAll("text")
        .data(gazeType)
        .join("text")
        .attr("x", 560)
        .attr("y", (d, i) => i * 10 + 80)
        .text(d => d)
        .style("fill", d => partyColorScale(d))
        .style("font-family", "Open Sans")
        .style("font-size", 8)
        .raise()

    const tooltipSryHeader = tooltipGroup.append('g')
        .selectAll("text")
        .data(surgeryTypes)
        .join("text")
        .attr("x", 560)
        .attr("y", (d, i) => i * 10 + 180)
        .text(d => d)
        .style("fill", d => lineColorScale(d))
        .style("font-family", "Open Sans")
        .style("font-size", 8)
        .raise()


    const tooltipBilHeader = tooltipGroup.append('g')
        .selectAll("text")
        .data(moneyType)
        .join("text")
        .attr("x", 560)
        .attr("y", (d, i) => i * 10 + 290)
        .text(d => d)
        .style("fill", d => partyColorScale(d))
        .style("font-family", "Open Sans")
        .style("font-size", 8)
        .raise()

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


    //Draw Refrence Dots

    function drawReference(periodNum) {

        const sryFiltered = surgery.filter(d => d.periodnum === periodNum)
        const milFiltered = millions.filter(d => d.periodnum === periodNum)
        const bilFiltered = billions.filter(d => d.periodnum === periodNum)

        const lineRefChart = lineRefGroup.selectAll("rect")
            .data(sryFiltered)
            .join("rect")
            .attr("x", d => timeScale(yearAccessor(d)))
            .attr("y", 70)
            .attr("width", 0.2)
            .attr("height", 270)
            .attr("fill", "white")
            .attr("opacity", "0.3")

        const lineRefLabel = lineRefGroup.selectAll("text")
            .data(sryFiltered)
            .join("text")
            .attr("x", d => timeScale(yearAccessor(d)))
            .attr("y", 50)
            .text(noteAccessor)
            .style("fill", "#e8beac")
            .style("font-family", "Open Sans")
            .style("font-size", 10)


        const dotBilChart = dotBilGroup.selectAll("circle")
            .data(billions.filter(d => d.periodnum === periodNum))
            .join("circle")
            .attr("cx", d => timeScale(yearAccessor(d)))
            .attr("cy", d => bilScale(valueAccessor(d)))
            .attr("r", 2)
            .attr("fill", "white")
            .attr("opacity", 1)
            .raise()

        const dotMilChart = dotMilGroup.selectAll("circle")
            .data(millions.filter(d => d.periodnum === periodNum))
            .join("circle")
            .attr("cx", d => timeScale(yearAccessor(d)))
            .attr("cy", d => milScale(valueAccessor(d)))
            .attr("r", 2)
            .attr("fill", "white")
            .attr("opacity", 1)
            .raise()
        const dotSryChart = dotSryGroup.selectAll("circle")
            .data(sryFiltered)
            .join("circle")
            .attr("cx", d => timeScale(yearAccessor(d)))
            .attr("cy", d => rateScale(rateAccessor(d)))
            .attr("r", 2)
            .attr("fill", "white")
            .attr("opacity", 1)
            .raise()

        const tooltipMilContent = tooltipMil.selectAll("text")
            .data(milFiltered)
            .join("text")
            .attr("x", 660)
            .attr("y", (d, i) => i * 10 + 80)
            .text(d => d.category === "Networth" ? `$${d.value} mil dollars` : `${d.value} mil followers`)
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 8)
            .style("font-weight", 700)
            .style("text-anchor", "left")



        const formatter = d3.format(".0%")
        const tooltipSryContent = tooltipSurgery.selectAll("text")
            .data(sryFiltered)
            .join("text")
            .attr("x", 660)
            .attr("y", (d, i) => i * 10 + 180)
            .text(d => formatter(rateAccessor(d)))
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 8)
            .style("font-weight", 700)
            .style("text-anchor", "left")


        const tooltipbilContent = tooltipBil.selectAll("text")
            .data(bilFiltered)
            .join("text")
            .attr("x", 660)
            .attr("y", (d, i) => i * 10 + 290)
            .text(d => `$${d.value} bil dollars`)
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 8)
            .style("font-weight", 700)
            .style("text-anchor", "left")

    }

    drawReference(1)


    //---------------------------Draw Ordinal Scale Slider    
    //using d3=simple-slider package, note syntax slightly different from d3.js
    const sliderGenerator = d3.sliderHorizontal()
        .min(1)
        .max(9)
        .ticks(9)
        .tickFormat((d, i) => yearAnalysis[i])
        .step(1)
        .default(1)
        .width(180)
        .displayValue(false)
        .fill("#e8beac")
        .handle(
            d3.symbol()
                .type(d3.symbolCircle)
                .size(50)())


    const slider = boundsLine.append('g')
        .classed("slider", true)
        // .attr('width', 400)
        // .attr('height', 100)
        //note this is different from CSS, d3 standard `translate` syntax, `px` is omitted
        .attr('transform', `translate(320,360)`)
        .call(sliderGenerator);



    sliderGenerator.on('onchange', (value = 1) => {
        drawReference(value);
    })


} drawAnalysis()