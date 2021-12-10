/*global d3 */

async function drawAnalysis() {
    //*************************1. Draw Dimensions 

    //------------------------ Area Chart Dimensions     

    const dimensionsLine = {
        width: 600,
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
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 100)
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

    surgery.sort((a, b) => b.year - a.year);
    // console.table(surgery[0])
    // console.log(surgery[0])

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
        .range([dimensionsLine.margin.left, dimensionsLine.boundedWidth])
        .nice()

    const rateScale = d3.scaleLinear()
        .domain(d3.extent(surgery, rateAccessor))
        .range([dimensionsLine.boundedHeight, dimensionsLine.margin.top])




} drawAnalysis()