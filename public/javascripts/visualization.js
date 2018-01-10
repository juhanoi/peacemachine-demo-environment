(function() {

  // TODO: Clean this hack away from here when you finalize the architecture
  if (!$("#visualization").length) return;

  // Find the SVG to draw on
  var svg = d3.select("svg");
  var defs = svg.append("defs");

  // Gradient colors
  var gradientRed = defs.append("linearGradient")
      .attr("id", "gradientRed")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "0%");
    gradientRed.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#A00").attr("stop-opacity", 0);
    gradientRed.append("stop")
      .attr("offset", "20%")
      .attr("stop-color", "#A00").attr("stop-opacity", 0.9);
    gradientRed.append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#A00").attr("stop-opacity", 0.9);
    gradientRed.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#A00").attr("stop-opacity", 0);

  var gradientBlue = defs.append("linearGradient")
      .attr("id", "gradientBlue")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "0%");
    gradientBlue.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00A").attr("stop-opacity", 0);
    gradientBlue.append("stop")
      .attr("offset", "20%")
      .attr("stop-color", "#00A").attr("stop-opacity", 0.9);
    gradientBlue.append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#00A").attr("stop-opacity", 0.9);
    gradientBlue.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00A").attr("stop-opacity", 0);

  // Create the center circle
  var circle = svg.append("circle")
      .style("fill", "#000")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 15);

  // Create sine waves
  var sineRed = svg.append("path")
      .style("fill", "transparent")
      .attr("stroke", "url(#gradientRed)")
      .attr("stroke-width", "0.2")
      .attr("d", "M -15 0 C -5 -10 5 10 15 0");

  var sineBlue = svg.append("path")
      .style("fill", "transparent")
      .attr("stroke", "url(#gradientBlue)")
      .attr("stroke-width", "0.2")
      .attr("d", "M -15 0 C -5 10 5 -10 15 0");


  (function repeatSines() {
    sineBlue
      .transition().duration(1000)
      .attr("d", "M -15 0 C -5 -10 5 10 15 0")
      .transition().duration(1000)
      .attr("d", "M -15 0 C -5 10 5 -10 15 0");

    sineRed
      .transition().duration(1000)
      .attr("d", "M -15 0 C -5 10 5 -10 15 0")
      .transition().duration(1000)
      .attr("d", "M -15 0 C -5 -10 5 10 15 0")
      .on("end", repeatSines);
  })();

  // Text
  var words = [ "amet",  "consectetur",  "adipiscing",  "elit",  "In",  "pellentesque",  "enim",  "at",  "enim",  "auctor",  "mollis",  "Vestibulum",  "ante",  "ipsum",  "primis",  "in",  "faucibus",  "orci",  "luctus",  "ultrices",  "posuere",  "cubilia",  "Curae",  "Morbi",  "ultricies",  "orci",  "ipsum",  "maximus",  "accumsan",  "Lorem",  "ipsum",  "dolor",  "sit",  "amet",  "consectetur",  "adipiscing",  "elit",  "In",  "pellentesque",  "enim",  "at",  "enim",  "auctor",  "mollis",  "Vestibulum",  "ante",  "ipsum",  "primis",  "in",  "faucibus",  "orci",  "luctus",  "ultrices",  "posuere",  "cubilia",  "Curae",  "Morbi",  "ultricies",  "orci",  "ipsum",  "maximus",  "accumsan"];

  function wordPosition(i) {
    var alpha = 360 - 5.8 * i;  // deg
    var beta = Math.PI / 180 * alpha; // rad
    var x = 16 * Math.cos(beta);
    var y = 16 * Math.sin(beta);
    return { alpha: alpha, beta: beta, x: x, y: y };
  }

  svg.selectAll("text")
      .data(words).enter().append("text")
          .style("font-size", "1px")
          .style("fill", "#000")
          .attr("text-anchor", "start")
          .attr("transform", function (d,i) {
            var p = wordPosition(i);
            return "translate(" + [ p.x, p.y ] + ")rotate(" + p.alpha + ")";
          })
          .text(function (d) { return d; });

})();
