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

  var gradientGreen = defs.append("linearGradient")
      .attr("id", "gradientGreen")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "0%");
    gradientGreen.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0A0").attr("stop-opacity", 0);
    gradientGreen.append("stop")
      .attr("offset", "20%")
      .attr("stop-color", "#0A0").attr("stop-opacity", 0.9);
    gradientGreen.append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#0A0").attr("stop-opacity", 0.9);
    gradientGreen.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0A0").attr("stop-opacity", 0);

  // Create the center circle
  var circle = svg.append("circle")
      .style("fill", "#000")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 15);


  // Wave simulation
  var N = 30;
  var r = 15;
  var A = 3;
  var dt = 0.01;
  var maxSlope = 0.1;

  function initializeWaveArray(N,r,A) {
    var arr = [];
    var phase = Math.PI * Math.random();
    var amplitude = 0.5*A + A*Math.random();
    for (var i = 0; i < N; i++) arr.push({
      x: r*2/N*i-r*(N-1)/N,
      y: amplitude * Math.sin(4*Math.PI/N*i + phase),
      v: 0
    });

    return arr;
  }

  function updateWaveArray(data) {
    var h = r*2/N;
    var c = h/dt;
    var k = (c*c)/(h*h);
    var s = 0.95;

    return data.map(function (curr, i, u) {
      var prev = (i == 0) ? curr.y : u[i-1].y;
      var next = (i == u.length-1) ? curr.y : u[i+1].y;
      var f = k * (prev + next - 2 * curr.y);
      var v = s * ( curr.v + f * dt );

      return {
        x: curr.x,
        y: curr.y + v * dt,
        v: v
      }
    });
  }

  function waveLine(d) {
    return (d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; })
        .curve(d3.curveBasis))(d);
  }

  function initializeWave(name) {
    var data = initializeWaveArray(N,r,A);
    svg.append("path")
        .attr("class", "wave")
        .style("fill", "transparent")
        .attr("stroke", "url(#gradient"+name+")")
        .attr("stroke-width", "0.3")
        .attr("d", waveLine(data));
    return data;
  }

  function applyForce(wave, f) {
    var target = Math.floor( N * Math.random() );
    return wave.map(function (d, i) {
      if (i === target) {
        return {
          x: d.x,
          y: d.y - f*10,
          v: d.v
        };
      }
      return d;
    });
  }

  var waves = [
    initializeWave("Red"),
    initializeWave("Blue"),
    initializeWave("Green")
  ];

  (function waveSimulation() {

    svg.selectAll("path.wave")
      .transition()
        .duration(dt * 10000)
        .ease(d3.easeLinear)
        .attr("stroke-width", function (d, i) {
          return 0.1 + 0.2 * Math.random();
        })
        .attr("d", function (d, i) {
          waves[i] = updateWaveArray(waves[i]);
          return waveLine(waves[i]);
        });

    setTimeout(waveSimulation, dt * 10000);
  })();


  // Text
  var words = [{ text:"amet",color:"#000"}, { text:"consectetur",color:"#0A0"}, { text:"adipiscing",color:"#00A"}, { text:"elit",color:"#000"}, { text:"In",color:"#00A"}, { text:"pellentesque",color:"#000"}, { text:"enim",color:"#0A0"}, { text:"at",color:"#A00"}, { text:"enim",color:"#000"}, { text:"auctor",color:"#000"}, { text:"mollis",color:"#A00"}, { text:"Vestibulum",color:"#000"}, { text:"ante",color:"#0A0"}, { text:"ipsum",color:"#0A0"}, { text:"primis",color:"#000"}, { text:"in",color:"#00A"}, { text:"faucibus",color:"#000"}, { text:"orci",color:"#000"}, { text:"luctus",color:"#0A0"}, { text:"ultrices",color:"#A00"}, { text:"posuere",color:"#A00"}, { text:"cubilia",color:"#A00"}, { text:"Curae",color:"#00A"}, { text:"Morbi",color:"#000"}, { text:"ultricies",color:"#000"}, { text:"orci",color:"#000"}, { text:"ipsum",color:"#A00"}, { text:"maximus",color:"#000"}, { text:"accumsan",color:"#000"}, { text:"Lorem",color:"#000"}, { text:"ipsum",color:"#000"}, { text:"dolor",color:"#000"}, { text:"sit",color:"#00A"}, { text:"amet",color:"#000"}, { text:"consectetur",color:"#000"}, { text:"adipiscing",color:"#000"}, { text:"elit",color:"#000"}, { text:"In",color:"#00A"}, { text:"pellentesque",color:"#000"}, { text:"enim",color:"#000"}, { text:"at",color:"#000"}, { text:"enim",color:"#000"}, { text:"auctor",color:"#000"}, { text:"mollis",color:"#000"}, { text:"Vestibulum",color:"#000"}, { text:"ante",color:"#000"}, { text:"ipsum",color:"#000"}, { text:"primis",color:"#A00"}, { text:"in",color:"#000"}, { text:"faucibus",color:"#00A"}, { text:"orci",color:"#00A"}, { text:"luctus",color:"#00A"}, { text:"ultrices",color:"#000"}, { text:"posuere",color:"#000"}, { text:"cubilia",color:"#A00"}, { text:"Curae",color:"#A00"}, { text:"Morbi",color:"#000"}, { text:"ultricies",color:"#000"}, { text:"orci",color:"#000"}, { text:"ipsum",color:"#000"}, { text:"maximus",color:"#00A"}, { text:"accumsan",color:"#000"}];

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
