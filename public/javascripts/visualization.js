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
      .transition().duration(1200)
      .attr("d", "M -15 0 C -5 -10 5 10 15 0")
      .transition().duration(800)
      .attr("d", "M -15 0 C -5 10 5 -10 15 0");

    sineRed
      .transition().duration(800)
      .attr("d", "M -15 0 C -5 10 5 -10 15 0")
      .transition().duration(1200)
      .attr("d", "M -15 0 C -5 -10 5 10 15 0")
      .on("end", repeatSines);
  })();

  // Text
  var words = [{ text:"amet",color:"#000"}, { text:"consectetur",color:"#000"}, { text:"adipiscing",color:"#00A"}, { text:"elit",color:"#000"}, { text:"In",color:"#00A"}, { text:"pellentesque",color:"#000"}, { text:"enim",color:"#000"}, { text:"at",color:"#A00"}, { text:"enim",color:"#000"}, { text:"auctor",color:"#000"}, { text:"mollis",color:"#A00"}, { text:"Vestibulum",color:"#000"}, { text:"ante",color:"#000"}, { text:"ipsum",color:"#000"}, { text:"primis",color:"#000"}, { text:"in",color:"#00A"}, { text:"faucibus",color:"#000"}, { text:"orci",color:"#000"}, { text:"luctus",color:"#000"}, { text:"ultrices",color:"#A00"}, { text:"posuere",color:"#A00"}, { text:"cubilia",color:"#A00"}, { text:"Curae",color:"#00A"}, { text:"Morbi",color:"#000"}, { text:"ultricies",color:"#000"}, { text:"orci",color:"#000"}, { text:"ipsum",color:"#A00"}, { text:"maximus",color:"#000"}, { text:"accumsan",color:"#000"}, { text:"Lorem",color:"#000"}, { text:"ipsum",color:"#000"}, { text:"dolor",color:"#000"}, { text:"sit",color:"#00A"}, { text:"amet",color:"#000"}, { text:"consectetur",color:"#000"}, { text:"adipiscing",color:"#000"}, { text:"elit",color:"#000"}, { text:"In",color:"#00A"}, { text:"pellentesque",color:"#000"}, { text:"enim",color:"#000"}, { text:"at",color:"#000"}, { text:"enim",color:"#000"}, { text:"auctor",color:"#000"}, { text:"mollis",color:"#000"}, { text:"Vestibulum",color:"#000"}, { text:"ante",color:"#000"}, { text:"ipsum",color:"#000"}, { text:"primis",color:"#A00"}, { text:"in",color:"#000"}, { text:"faucibus",color:"#00A"}, { text:"orci",color:"#00A"}, { text:"luctus",color:"#00A"}, { text:"ultrices",color:"#000"}, { text:"posuere",color:"#000"}, { text:"cubilia",color:"#A00"}, { text:"Curae",color:"#A00"}, { text:"Morbi",color:"#000"}, { text:"ultricies",color:"#000"}, { text:"orci",color:"#000"}, { text:"ipsum",color:"#000"}, { text:"maximus",color:"#00A"}, { text:"accumsan",color:"#000"}];

  function wordPosition(i) {
    var alpha = 5.8 * i;  // deg
    var beta = Math.PI / 180 * alpha; // rad
    var x = 16 * Math.cos(beta);
    var y = 16 * Math.sin(beta);
    return { alpha: alpha, beta: beta, x: x, y: y };
  }

  (function repeatWords() {
    svg.selectAll("text")
        .data(words).enter()
        .append("text")
            .style("font-size", "1px")
            .style("font-weight", function (d,i) { return (d.color === "#000") ? "normal" : "bold"; })
            .style("fill", function (d,i) { return d.color; })
            .attr("fill-opacity", "0")
            .attr("text-anchor", "start")
            .attr("transform", function (d,i) {
              var p = wordPosition(i);
              return "translate(" + [ p.x, p.y ] + ")rotate(" + p.alpha + ")";
            })
            .text(function (d) { return d.text; })
            .transition()
                .delay(function(d,i) { return 48*i; })
                .duration(152)
                .attr("fill-opacity", 1)
            .transition()
                .delay(200)
                .duration(350)
                .attr("fill-opacity", 0)
            .remove();

    setTimeout(repeatWords, 61*48+152+550);
  })();

})();
