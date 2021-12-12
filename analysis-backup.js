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
    console.log(sumMil)
    console.log(sumBil)
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
    const unit = ["million", "billion"]
    const categories = ["Instagram Followers", "Networth", "Spending", "Ad Revenue"]
    const parties = ["Kylie IG", "Kim IG", "Kylie Networth", "Kim Networth"]
    //*************************4. Create Scale  


    const timeScale = d3.scaleTime()
        .domain(d3.extent(surgery, yearAccessor))
        .range([100, 280])
        .nice()

    const rateScale = d3.scaleLinear()
        .domain([-2, 9])
        .range([dimensionsLine.boundedHeight / 4, 50])
        .nice()

    const lineColorScale = d3.scaleOrdinal()
        .domain(surgeryTypes)
        .range(['#8b0000', '#8b0000', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080'])


    const milScale = d3.scaleLinear()
        .domain(d3.extent(millions, valueAccessor))
        .range([dimensionsLine.boundedHeight / 4 - 28, 50])
        .nice()

    const bilScale = d3.scaleLinear()
        .domain(d3.extent(billions, valueAccessor))
        .range([dimensionsLine.boundedHeight / 4 - 28, 50])
        .nice()

    const partyColorScale = d3.scaleOrdinal()
        .domain(parties)
        .range(['#11ae7a', '#808080', '#cbd438', '#8b0000'])

    //****************************5. Draw Peripherals

    //----------------------Draw Axis Generators

    const timeAxisGenerator = d3.axisBottom()
        .scale(timeScale)

    const rateAxisGenerator = d3.axisLeft()
        .scale(rateScale)

    const milAxisGenerator = d3.axisLeft()
        .scale(milScale)

    const bilAxisGenerator = d3.axisRight()
        .scale(bilScale)

    //----------------------Draw Axes

    const timeAxis = boundsLine.append("g")
        .call(timeAxisGenerator)
        .style("transform", `translateY(${dimensionsLine.boundedHeight / 4 - 28}px)`)
        .attr("class", "axisRed")

    const rateAxis = boundsLine.append("g")
        .call(rateAxisGenerator)
        .style("transform", `translateX(100px)`)
        .attr("class", "axisRed")

    const timeDupeAxis = boundsLine.append("g")
        .call(timeAxisGenerator)
        .style("transform", `translate(220px,${dimensionsLine.boundedHeight / 4 - 28}px)`)
        .attr("class", "axisRed")

    const milAxis = boundsLine.append("g")
        .call(milAxisGenerator)
        .style("transform", `translateX(320px)`)
        .attr("class", "axisRed")

    const bilAxis = boundsLine.append("g")
        .call(bilAxisGenerator)
        .style("transform", `translateX(${dimensionsLine.boundedWidth - 100}px)`)
        .attr("class", "axisRed")

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


    const lineMilChart = boundsLine.selectAll(".path")
        .data(sumMil)
        // .attr("class", "path")
        .join("path")
        .transition()
        .attr("d", d => lineMilGenerator(d[1]))
        .attr("stroke", d => partyColorScale(d[0]))
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("opacity", 1)


} drawAnalysis()