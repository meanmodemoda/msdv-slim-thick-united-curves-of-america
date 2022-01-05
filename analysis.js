/*global d3 */

//***************************Add Title Animation */
// get the element to animate
const element = document.getElementById('analysis_spaceholder');
let elementHeight = element.clientHeight;

// listen for scroll event and call animate function
document.addEventListener('scroll', animate);

// check if element is in view
function inView() {
    // get window height
    const windowHeight = window.innerHeight;
    // get number of pixels that the document is scrolled
    let scrollY = window.scrollY || window.pageYOffset;

    // get current scroll position (distance from the top of the page to the bottom of the current viewport)
    let scrollPosition = scrollY + windowHeight;
    // get element position (distance from the top of the page to the bottom of the element)
    let elementPosition = element.getBoundingClientRect().top + scrollY + elementHeight;

    // is scroll position greater than element position? (is element in view?)
    if (scrollPosition > elementPosition) {
        return true;
    }

    return false;
}

// animate element when it is in view
function animate() {
    // is element in view?
    if (inView()) {
        // element is in view, add class to element
        element.classList.add('animate');
    }
}

async function drawAnalysis() {



    //*************************1. Draw Dimensions 

    //------------------------ Area Chart Dimensions     

    const dimensionsLine = {
        width: 800,
        height: 800,
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
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

    const tooltipSryCount = boundsLine.append("g")

    const tooltipMilIG = boundsLine.append("g")
    const tooltipMilNW = boundsLine.append("g")

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

    const annotationGroup = boundsLine.append("g")
        .classed("annoGroup", true)

    const foreignGroup = labelsGroup.append("svg")
    // .attr("width", 960)
    // .attr("height", 500);

    const conclusionGroup = boundsLine.append("g")
        .classed("final", true)

    //append a glow filter
    // const defs = boundsLine.append("defs");

    //Filter for the outside glow
    // const filter = defs.append("filter")
    //     .attr("id", "glow");
    // filter.append("feGaussianBlur")
    //     .attr("stdDeviation", "3.5")
    //     .attr("result", "coloredBlur");

    // const feMerge = filter.append("feMerge");
    // feMerge.append("feMergeNode")
    //     .attr("in", "coloredBlur");

    // feMerge.append("feMergeNode")
    //     .attr("in", "SourceGraphic");
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
    analysis.sort((a, b) => a.year - b.year);
    // console.table(surgery[0])
    // console.log(surgery[0])
    // console.table(analysis[0])
    // console.log(analysis[0])

    const sumSry = d3.group(surgery, d => d.surgery);
    // console.log(sumSry)

    const millions = analysis.filter(d => d.unit === "million");
    const millionsNew = analysis.filter(d => d.unit === "million");
    const billions = analysis.filter(d => d.unit === "billion")
    const millionsIG = millions.filter(d => d.category === "Instagram Followers");
    const millionsNW = millions.filter(d => d.category === "Networth");
    const sumMilIG = d3.group(millionsIG, d => d.party);
    const sumMilNW = d3.group(millionsNW, d => d.party);
    const sumBil = d3.group(billions, d => d.party);


    // console.log(sumMil)
    // console.log(sumBil)

    const billionsIG = billions.filter(d => d.party === "Instagram")
    //--------------------Create Accessors
    const pctFormatter = d3.format(".0%")
    const numFormatter = d3.format(".2s")
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

    // console.log(numFormatter(countAccessor(surgery[0])))
    //periodnum
    const periodNumAccessor = d => d.periodnum;
    //category
    const categoryAccessor = d => d.category;
    const valueAccessor = d => d.value;
    //note accessor
    const noteAccessor = d => d.note;
    //party accessor
    const partyAccessor = d => d.party;

    //set up Arrays manually so I can control the order;
    const surgeryTypes = ["Breast augmentation", "Buttock surgeries", "Cheek implant", "Chin augmentation", "Facelift", "Lip augmentation", "Liposuction", "Nose reshaping", "Tummy tuck"]
    const categories = ["Instagram Followers", "Networth", "Spending", "Ad Revenue"]
    const milType = ["Kim's Instagram", "Kylie's Instagram", "Kim's Networth", "Kylie's Networth"]
    const partyType = ["Kylie", "Kim"]
    const bilType = ["US Plastic Surgery", "Instagram"]
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

    //const surgeryTypes = ["Breast augmentation", "Buttock surgeries", "Cheek implant", "Chin augmentation", "Facelift", "Lip augmentation", "Liposuction", "Nose reshaping", "Tummy tuck"]
    const lineColorScale = d3.scaleOrdinal()
        .domain(surgeryTypes)
        .range(['#6667ab', '#8aa10e', '#FFFFFF', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080'])

    //const milType = ["Kim's Instagram", "Kylie's Instagram", "Kim's Networth","Kylie's Networth"]

    const milColorScale = d3.scaleOrdinal()
        .domain(partyType)
        .range(['#6667ab', '#8aa10e'])

    //const bilType = ["US Plastic Surgery", "Instagram"]       
    const bilColorScale = d3.scaleOrdinal()
        .domain(bilType)
        .range(['#6667ab', '#8aa10e'])

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
        .tickFormat(pctFormatter)
        .tickSize(-2)

    const milAxisGenerator = d3.axisLeft()
        .scale(milScale)
        .ticks(4)
        .tickFormat((d, i) => `${d} mil`)
        .tickSize(-2);

    const bilAxisGenerator = d3.axisLeft()
        .scale(bilScale)
        .ticks(4)
        .tickSize(-2)
        .tickFormat((d, i) => `$${d} bil`);

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


    const lineMilNWChart = boundsLine.selectAll(".path")
        .data(sumMilNW)
        // .attr("class", "path")
        .join("path")
        // .transition()
        // .duration(600)
        .attr("d", d => lineMilGenerator(d[1]))
        .attr("stroke", d => milColorScale(d[0]))
        .style("stroke-dasharray", ("3, 2"))
        .attr("stroke-width", 0.8)
        .attr("fill", "none")
        .attr("opacity", 1)

    const lineMilChart = boundsLine.selectAll(".path")
        .data(sumMilIG)
        // .attr("class", "path")
        .join("path")
        // .transition()
        // .duration(600)
        .attr("d", d => lineMilGenerator(d[1]))
        .attr("stroke", d => milColorScale(d[0]))
        // .style(d => d.category === "Instagram Followers" ? "stroke-dasharray" : "stroke")
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
        .attr("stroke", d => bilColorScale(d[0]))
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
        .attr("y", 65)
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
        .html("<h1 style='font-weight: 800'>The Surgery</h1><p style='font-size: 8px; color: white;'>A trend line of annual growth rate (vs 2012) of key plastic surgeries performed in America (%).");

    const foreignMoney = labelGroups.append("foreignObject")
        .attr("x", 100)
        .attr("y", 270)
        .attr("width", 150)
        .attr("height", 400)
        .append("xhtml:div")
        .style("font", "0.5rem 'Open Sans'")
        .style("color", "#E8BEAC")
        .style("line-height", "12px")
        .html("<h1 style='font-weight: 800'>The Money</h1><p style='font-size: 8px; color: white;'>A trend line of US plastic surgery spending and estimated Instagram annual ad revenue in billions ($).");

    //Draw Tooltip
    const tooltipBox = tooltipGroup.append('rect')
        .attr("x", 550)
        .attr("y", 60)
        .attr('width', 190)
        .attr('height', 280)
        .classed('tooltipBox', true)
        .attr("fill", "#E8BEAC")
        .attr("rx", 2)

    const milHeader = tooltipGroup.append('text')
        .text("Influencers")
        .attr("x", 560)
        .attr("y", 85)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 800)


    const igHeader = tooltipGroup.append('text')
        .text("Followers")
        .attr("x", 630)
        .attr("y", 85)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 800)

    const nwHeader = tooltipGroup.append('text')
        .text("Net Worth")
        .attr("x", 680)
        .attr("y", 85)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 800)

    const milDivider = tooltipGroup.append('rect')
        .attr("x", 560)
        .attr("y", 87)
        .attr("width", 168)
        .attr("height", 0.25)
        .style("fill", "black")

    const tooltipMilHeader = tooltipGroup.append('g')
        .selectAll("text")
        .data(partyType)
        .join("text")
        .attr("x", 560)
        .attr("y", (d, i) => i * 9 + 100)
        .text(d => d)
        .style("fill", d => bilColorScale(d))
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 700)
        .raise()

    const sryHeader = tooltipGroup.append('text')
        .text("Plastic Surgeries in US")
        .attr("x", 560)
        .attr("y", 165)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 800)


    const countHeader = tooltipGroup.append('text')
        .text("Count")
        .attr("x", 660)
        .attr("y", 165)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 800)

    const sryCount = tooltipGroup.append('text')
        .text("vs 2012")
        .attr("x", 700)
        .attr("y", 165)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 800)

    const sryDivider = tooltipGroup.append('rect')
        .attr("x", 560)
        .attr("y", 168)
        .attr("width", 168)
        .attr("height", 0.25)
        .style("fill", "black")


    const tooltipSryHeader = tooltipGroup.append('g')
        .selectAll("text")
        .data(surgeryTypes)
        .join("text")
        .attr("x", 560)
        .attr("y", (d, i) => i * 9 + 180)
        .text(d => d)
        .style("fill", d => lineColorScale(d))
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 700)


    const tooltipBilHeader = tooltipGroup.append('g')
        .selectAll("text")
        .data(bilType)
        .join("text")
        .attr("x", 560)
        .attr("y", (d, i) => i * 9 + 300)
        .text(d => d)
        .style("fill", d => bilColorScale(d))
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 700)
        .raise()

    const bilBiz = tooltipGroup.append('text')
        .text("Businesses")
        .attr("x", 560)
        .attr("y", 285)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 700)

    const bilHeader = tooltipGroup.append('text')
        .text("Annual Revenue")
        .attr("x", 660)
        .attr("y", 285)
        .style("fill", "black")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 700)

    const bilDivider = tooltipGroup.append('rect')
        .attr("x", 560)
        .attr("y", 288)
        .attr("width", 168)
        .attr("height", 0.25)
        .style("fill", "black")

    //-------------------Draw Annotation


    const dashAnno = annotationGroup.append("line")
        .attr("x1", 330)
        .attr("x2", 350)
        .attr("y1", 70)
        .attr("y2", 70)
        .style("stroke", "grey")
        .style("stroke-dasharray", ("3, 2"))
        .attr("stroke-width", 0.6)

    const dashAnnoText = annotationGroup.append("text")
        .text("Net Worth")
        .attr("x", 355)
        .attr("y", 70)
        .style("fill", "#A9A9A9")
        .style("font-family", "Open Sans")
        .style("font-size", 6)
        .style("font-weight", 500)
        .style("alignment-baseline", "middle")

    const lineAnno = annotationGroup.append("line")
        .attr("x1", 330)
        .attr("x2", 350)
        .attr("y1", 80)
        .attr("y2", 80)
        .style("stroke", "grey")
        .attr("stroke-width", 0.6)

    const lineAnnoText = annotationGroup.append("text")
        .text("IG Followers")
        .attr("x", 355)
        .attr("y", 80)
        .style("fill", "#A9A9A9")
        .style("font-family", "Open Sans")
        .style("font-size", 6)
        .style("font-weight", 500)
        .style("alignment-baseline", "middle")

    const sliderLine = annotationGroup.append("line")
        .classed("sliderref", true)
        .attr("x1", 300)
        .attr("x2", 315)
        .attr("y1", 380)
        .attr("y2", 367)
        .style("stroke", "#E8BEAC")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.8)

    const sliderLabel = annotationGroup.append("text")
        .classed("sliderref", true)
        .text("Slide over to view annual data in details")
        .attr("x", 165)
        .attr("y", 380)
        .style("fill", "#E8BEAC")
        .style("font-family", "Open Sans")
        .style("font-size", 7)
        .style("font-weight", 500)
        .style("alignment-baseline", "middle")


    // d3.selectAll(".sliderref")
    //     .style("filter", "url(#glow)");

    // Draw Conclusion

    const conclusionBox = conclusionGroup.append("rect")
        .attr("x", 0)
        .attr("y", 550)
        .attr("width", 850)
        .attr("height", 350)
        .attr("fill", "black")

    const conclusionText = conclusionGroup.append("foreignObject")
        .attr("x", 250)
        .attr("y", 420)
        .attr("width", 320)
        .attr("height", 600)
        .append("xhtml:div")
        .style("font", "0.5rem 'Open Sans'")
        .style("color", "#E8BEAC")
        .style("line-height", "13px")
        .html("<h1 style='font-weight: 800'>Conclusion</h1><p style='font-size: 9px; color: white;'>Slim Thick seems to have started off as a classic example of the capitalist exploitation of the Black female body and gradually spun into its own whirlpool of problems. I am particularly concerned about how it has infiltrated the life of teenage girls. A generic search of #fitness on Instagram or TikTok corners you into endless videos of young girls deadlifting. Content on the banned Slim Thick drug Apetamin bypasses lazy checkpoints and circulates as usual. BBL continues to gain momentum amongst late teens. In a land that promises free will, American daughters take on the \"free will\" to please a bit too soon.");


    const citation = conclusionGroup.append("foreignObject")
        .classed("citation", true)
        .attr("x", 250)
        .attr("y", 600)
        .attr("width", 350)
        .attr("height", 400)
        .append("xhtml:div")
        .style("font", "0.3rem 'Open Sans'")
        .style("color", "#E8BEAC")
        .style("line-height", "10px")
        .html("<h1 style='font-weight: 800; font-size: 12px'>References & Data</h1><div class='citation' style='font-size: 7px; color: white; '><ul style='margin:0;padding:0;'><li>Mbowe, Khadija. <a href='https://www.youtube.com/watch?v=H69-QpX-wG0' target='_blank'>\“The reign of the Slim-Thick Influencer.\”</a> Aug 22, 2021. </li><li>Beauvoir, Simone. <i>The Second Sex</i>. New York: Vintage Books, 1989.</li><li>Richardson, Kiesha. <a href='https://genelmag.com/article/stop-trying-to-redefine-thicc' target='_blank'>\“Stop Trying to Redefine ‘Thicc girls’ to Mean Skinny With a Booty.\”</a> GNL Magazine. Sep 29, 2021. </li><li>Tolentino, Jia. <a href='https://www.newyorker.com/culture/decade-in-review/the-age-of-instagram-face' target='_blank'>\“The Age of Instagram Face.” </a>The New Yorker. Dec 12, 2019. </li><li>Greatiest.com. <a href='https://greatist.com/grow/100-years-womens-body-image#1' target='_blank'>\“See How Much the ‘Perfect’ Female Body Has Changed in 100 Years (It's Crazy!).\” </a></li> <li>Sicardi, Arabelle.<a href='https://www.allure.com/story/the-kardashian-effect' target='_blank'> \“The Kardashian Effect.\”</a>Allure. Feb 16, 2021.</li><li>Roundtree, Cheyenne.<a href ='https://www.thedailybeast.com/how-the-kardashians-changed-the-face-of-plastic-surgery' target='_blank'>\“How the Kardashians Changed the Face of Plastic Surgery.\”</a> The Daily Beast. June 12, 2021.</li><li>Kim, Eunice. <a href='https://ucsdguardian.org/2021/03/07/the-marketing-of-black-womens-body-in-hip-hop' target='_blank'>\“The Marketing of Black Women’s Body in Hip-Hop.\” </a>UCSD Guardian. Mar 7, 2021.</li><li>US Plastic Surgery Statistics. <a href='https://www.plasticsurgery.org/news/plastic-surgery-statistics' target='_blank'>American Society of Plastic Surgeons.</a></li><li>Data on Instagram and Kardashians: various sources including Bloomberg, eMarketer, Statista and <a href='https://www.celebritynetworth.com' target='_blank'>Celebrity Net Worth.</a></li></ul ></div >");




    //Draw Refrence Dots

    function drawReference(periodNum) {

        const sryFiltered = surgery.filter(d => d.periodnum === periodNum);
        const milFiltered = millions.filter(d => d.periodnum === periodNum);
        const igMil = milFiltered.filter(d => d.category === "Instagram Followers");
        const nwMil = milFiltered.filter(d => d.category === "Networth");
        const igGroup = d3.group(igMil, d => d.party)
        // console.log(igGroup)
        const bilFiltered = billions.filter(d => d.periodnum === periodNum);

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
            .style("fill", "#E8BEAC")
            .style("font-family", "Open Sans")
            .style("font-size", 10)

        const dotMilChart = dotMilGroup.selectAll("circle")
            .data(millions.filter(d => d.periodnum === periodNum))
            .join("circle")
            .attr("cx", d => timeScale(yearAccessor(d)))
            .attr("cy", d => milScale(valueAccessor(d)))
            .attr("r", 2)
            .attr("fill", d => milColorScale(partyAccessor(d)))
            .attr("opacity", 1)
            .raise()

        const dotBilChart = dotBilGroup.selectAll("circle")
            .data(billions.filter(d => d.periodnum === periodNum))
            .join("circle")
            .attr("cx", d => timeScale(yearAccessor(d)))
            .attr("cy", d => bilScale(valueAccessor(d)))
            .attr("r", 2)
            .attr("fill", d => milColorScale(partyAccessor(d)))
            .attr("opacity", 1)
            .raise()


        const dotSryChart = dotSryGroup.selectAll("circle")
            .data(sryFiltered)
            .join("circle")
            .attr("cx", d => timeScale(yearAccessor(d)))
            .attr("cy", d => rateScale(rateAccessor(d)))
            .attr("r", 2)
            .attr("fill", d => lineColorScale(surgeryAccessor(d)))
            .attr("opacity", 1)
            .raise()

        const tooltipsMilIG = tooltipMilIG.selectAll("text")
            .data(igMil)
            .join("text")
            .attr("x", 630)
            .attr("y", (d, i) => i * 9 + 100)
            .text(d => `${d.value} mil`)
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 7)
            .style("font-weight", 500)
            .style("text-anchor", "left")

        const tooltipsMilNetworth = tooltipMilNW.selectAll("text")
            .data(nwMil)
            .join("text")
            .attr("x", 680)
            .attr("y", (d, i) => i * 9 + 100)
            .text(d => `$${d.value} mil dollars`)
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 7)
            .style("font-weight", 500)
            .style("text-anchor", "left")

        const tooltipCount = tooltipSryCount.selectAll("text")
            .data(sryFiltered)
            .join("text")
            .attr("x", 660)
            .attr("y", (d, i) => i * 9 + 180)
            .text(d => numFormatter(countAccessor(d)))
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 7)
            .style("font-weight", 500)
            .style("text-anchor", "left")


        const tooltipSryContent = tooltipSurgery.selectAll("text")
            .data(sryFiltered)
            .join("text")
            .attr("x", 700)
            .attr("y", (d, i) => i * 9 + 180)
            .text(d => pctFormatter(rateAccessor(d)))
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 7)
            .style("font-weight", 500)
            .style("text-anchor", "left")


        const tooltipbilContent = tooltipBil.selectAll("text")
            .data(bilFiltered)
            .join("text")
            .attr("x", 660)
            .attr("y", (d, i) => i * 9 + 300)
            .text(d => `$${d.value} bil dollars`)
            .style("fill", "black")
            .style("font-family", "Open Sans")
            .style("font-size", 7)
            .style("font-weight", 500)
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