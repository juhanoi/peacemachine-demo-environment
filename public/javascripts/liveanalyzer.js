import {initializeLinearGradient} from './modules/gradients';

export default function liveanalyzer() {

  // Find the SVG to draw on
  const svg = d3.select("svg");
  const defs = svg.append("defs");

  // Create the center circle
  const circle = svg.append("circle")
      .style("fill", "#222")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 15);

  // Add a line
  const gradient = initializeLinearGradient(defs, "White", "#FFF");
  const path = svg.append("path")
    .attr("class", "wave")
    .style("fill", "transparent")
    .attr("stroke", "white")
    .attr("stroke-width", "0.3")
    .attr("d", "M -15 0 L 15 0 Z");

}
