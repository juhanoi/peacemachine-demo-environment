export function initializeLinearGradient(defs, name, color) {
    const id = "gradient" + name;
    var gradient = defs.append("linearGradient")
        .attr("id", id)
        .attr("x1", "0%").attr("x2", "100%")
        .attr("y1", "0%").attr("y2", "0%");
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color).attr("stop-opacity", 0);
      gradient.append("stop")
        .attr("offset", "20%")
        .attr("stop-color", color).attr("stop-opacity", 0.9);
      gradient.append("stop")
        .attr("offset", "80%")
        .attr("stop-color", color).attr("stop-opacity", 0.9);
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color).attr("stop-opacity", 0);

    return {
      element: gradient,
      id: id
    };
}
