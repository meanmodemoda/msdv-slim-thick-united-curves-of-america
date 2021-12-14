/*global d3 */

async function draw2007() {

    //*************Draw 2007
    const svg2007 = d3.select("#chart2007").append("svg")
        .attr("viewBox", `0 0 300 150`)

    const boobJobs = svg2007.append("circle")
        .attr("cx", 150)
        .attr("cy", 50)
        .attr("r", 45)
        .attr("fill", "#ac7ddf")
        .style("opacity", 0.8)

    const boobJobsAnno = svg2007.append("rect")
        .attr("x", 150)
        .attr("y", 95)
        .attr("width", 250)
        .attr("height", 0.5)
        .attr("fill", "white")

    const boobJobsText = svg2007.append("text")
        .attr("x", 170)
        .attr("y", 113)
        .text("350k Boob Jobs")
        .attr("fill", "white")

    const buttJobs = svg2007.append("circle")
        .attr("cx", 150)
        .attr("cy", 50)
        .attr("r", 5)
        .attr("fill", "Black")

    const buttJobsAnno = svg2007.append("rect")
        .attr("x", 0)
        .attr("y", 55)
        .attr("width", 150)
        .attr("height", 0.5)
        .attr("fill", "white")

    const buttJobsText = svg2007.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .text("4k Butt Jobs")
        .attr("fill", "white")

    //*************Draw 2007

    const svg2020 = d3.select("#chart2020").append("svg")
    svg2020.attr("viewBox", `0 0 300 160`)

    const breastStat = svg2020.append("rect")
        .attr("y", 100)
        .attr("width", 60)
        .attr("height", 10)
        .attr("fill", "#ac7ddf")

    const breastGrowth = svg2020.append("text")
        .attr("x", 30)
        .attr("y", 90)
        .text("-33%")
        .attr("text-anchor", "middle")
        .attr("fill", "white")

    const buttStat = svg2020.append("rect")
        .attr("x", 62)
        .attr("y", 40)
        .attr("width", 50)
        .attr("height", 60)
        .attr("fill", "#8aa10e")


    const buttGrowth = svg2020.append("text")
        .attr("x", 90)
        .attr("y", 30)
        .text("+6x")
        .attr("text-anchor", "middle")
        .attr("fill", "white")

    const cheekStat = svg2020.append("rect")
        .attr("x", 116)
        .attr("y", 30)
        .attr("width", 50)
        .attr("height", 70)
        .attr("fill", "white")

    const cheekGrowth = svg2020.append("text")
        .attr("x", 140)
        .attr("y", 20)
        .text("+8x")
        .attr("text-anchor", "middle")
        .attr("fill", "white")

    const breastAnno = svg2020.append("text")
        .classed("anno_2020", true)
        .attr("x", 110)
        .attr("y", 68)
        .text("Breast")
        // .attr("transform", `rotate(-180deg)`)
        .attr("fill", "white")

    const buttAnno = svg2020.append("text")
        .classed("anno_2020", true)
        .attr("x", 144)
        .attr("y", 28)
        .text("Butt")
        // .attr("transform", `rotate(-180deg)`)
        .attr("fill", "white")

    const cheekAnno = svg2020.append("text")
        .classed("anno_2020", true)
        .attr("x", 174)
        .attr("y", -11)
        .text("Cheek")
        // .attr("transform", `rotate(-180deg)`)
        .attr("fill", "white")

}
draw2007()