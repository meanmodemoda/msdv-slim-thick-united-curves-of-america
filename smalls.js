/*global d3 */

async function draw2007() {

    const svg2007 = d3.select("#chart2007").append("svg")
    svg2007.attr("width", 100)
        .attr("height", 100)

    svg2007.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 50)
        .attr("fill", "red")


    const svg2020 = d3.select("#chart2020").append("svg")
    svg2020.attr("width", 100)
        .attr("height", 100)

    svg2020.append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 50)
        .attr("fill", "green")
}
draw2007()