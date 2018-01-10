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

  var gradientPurple = defs.append("linearGradient")
      .attr("id", "gradientPurple")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "0%");
    gradientPurple.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#70A").attr("stop-opacity", 0);
    gradientPurple.append("stop")
      .attr("offset", "20%")
      .attr("stop-color", "#70A").attr("stop-opacity", 0.9);
    gradientPurple.append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#70A").attr("stop-opacity", 0.9);
    gradientPurple.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#70A").attr("stop-opacity", 0);

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
      var prev = (i == 0) ? -curr.y : u[i-1].y;
      var next = (i == u.length-1) ? -curr.y : u[i+1].y;
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
    var target = Math.floor(N * Math.random());
    //var target = Math.round(N/2);
    return wave.map(function (d, i) {
      if (i === target) {
        return {
          x: d.x,
          y: d.y - ((Math.random < 0.5) ? -1 : 1) * f,
          v: d.v
        };
      }
      return d;
    });
  }

  var waves = [
    initializeWave("Red"),
    initializeWave("Blue"),
    initializeWave("Green"),
    initializeWave("Purple")
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
  var sentences = [
    {text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Donec ullamcorper lacus quis auctor sodales. ",anger:0,fear:0.6,joy:0,sadness:0},
    {text:"In id metus in urna tristique sagittis quis et lacus. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Ut quis nisi non orci pretium bibendum. ",anger:0,fear:0,joy:0,sadness:0.75},
    {text:"Suspendisse pharetra lorem eu augue dapibus molestie. ",anger:0.2,fear:0.4,joy:0,sadness:0},
    {text:"Etiam at leo suscipit, semper arcu eget, tempor diam. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Sed non augue eu nisi sodales ornare. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Curabitur non orci ut sem facilisis semper. ",anger:0,fear:0,joy:0.1,sadness:0},
    {text:"Donec ultrices lectus in turpis sollicitudin sollicitudin. ",anger:0.75,fear:0,joy:0,sadness:0.3},
    {text:"Cras non justo id enim pulvinar egestas vel sit amet lectus. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Sed vulputate sem eget justo efficitur placerat. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Curabitur a mi iaculis, consectetur elit id, dignissim turpis. ",anger:0,fear:0,joy:0,sadness:0.3},
    {text:"Integer ut sapien ut leo scelerisque blandit. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Phasellus quis diam tristique lectus consequat dignissim. ",anger:0.2,fear:0,joy:0,sadness:0},
    {text:"Ut non dolor imperdiet eros dictum iaculis id sed diam. ",anger:0,fear:0,joy:0.9,sadness:0},
    {text:"Sed vel orci sed mauris bibendum feugiat. ",anger:0,fear:0,joy:0.2,sadness:0},
    {text:"Donec semper turpis eget lacus hendrerit, aliquet ullamcorper nisi ultricies. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Etiam et diam ac neque fringilla euismod. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Sed eleifend ligula vel ante tempus lobortis. ",anger:0.25,fear:0,joy:0.5,sadness:0},
    {text:"Fusce sed magna fermentum, blandit augue at, pretium massa. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",anger:0,fear:0.3,joy:0,sadness:0},
    {text:"Etiam et lectus ac tortor venenatis molestie sit amet nec leo. ",anger:0,fear:0,joy:0.5,sadness:0},
    {text:"Mauris rhoncus tellus at enim ultrices commodo. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Proin pellentesque orci cursus, aliquam nibh eget, commodo ex. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Aenean eleifend odio suscipit enim faucibus, vel feugiat dolor posuere. ",anger:0,fear:0,joy:0,sadness:0.45},
    {text:"Aliquam dignissim tellus a lectus fringilla tristique. ",anger:0,fear:0.12,joy:0,sadness:0},
    {text:"Ut sed velit non erat posuere laoreet ut in arcu. ",anger:0,fear:0,joy:0.67,sadness:0},
    {text:"Duis et purus vehicula quam fermentum commodo. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Sed sit amet purus ac nunc condimentum eleifend ut vitae est. ",anger:0,fear:0.9,joy:0,sadness:0.2},
    {text:"Nunc egestas quam sollicitudin turpis varius iaculis. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Nullam tempus augue quis feugiat tempor. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Morbi molestie leo vitae eleifend malesuada. ",anger:0,fear:0.1,joy:0,sadness:0},
    {text:"Cras imperdiet augue at dignissim maximus. ",anger:0.1,fear:0,joy:0,sadness:0},
    {text:"Proin tincidunt ante vel posuere tincidunt. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Nunc hendrerit ligula sed eros lobortis varius. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"In tempus mauris id mauris interdum dictum. ",anger:0,fear:0,joy:0.24,sadness:0.56},
    {text:"Fusce sollicitudin nisi a lobortis gravida. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Quisque eu nisi quis est tincidunt iaculis in eu tortor. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",anger:0,fear:0,joy:0.21,sadness:0},
    {text:"Vestibulum id sem hendrerit, posuere sapien quis, dapibus nulla. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Integer ut nulla in metus vulputate cursus. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Vivamus vel erat nec urna faucibus tincidunt. ",anger:0,fear:0,joy:0.12,sadness:0},
    {text:"Proin vulputate risus sed ultricies accumsan. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Praesent eget nibh quis erat hendrerit condimentum eu vestibulum ex. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Aliquam laoreet turpis in diam congue tincidunt. ",anger:0,fear:0,joy:0.12,sadness:0},
    {text:"Aenean egestas dolor at felis euismod, placerat suscipit ipsum lacinia. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Etiam sit amet elit hendrerit metus finibus egestas. ",anger:0,fear:0,joy:0.2,sadness:0},
    {text:"Vestibulum a odio congue, placerat tellus quis, ultrices enim. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Curabitur vulputate enim a lorem viverra ullamcorper. ",anger:0.23,fear:0,joy:0,sadness:0.532},
    {text:"Nullam tempus dui vitae vestibulum aliquam. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Duis faucibus diam sed nunc tincidunt, non dignissim felis tempor. ",anger:0,fear:0.234,joy:0,sadness:0},
    {text:"Vivamus ornare libero venenatis bibendum malesuada. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Nulla at diam eu mauris posuere dapibus. ",anger:0,fear:0,joy:0,sadness:0.234},
    {text:"Aliquam varius nisl at cursus commodo. ",anger:0,fear:0.856,joy:0,sadness:0.54},
    {text:"Nunc sollicitudin purus consectetur ante sodales, sed mollis nisl egestas. ",anger:0,fear:0.345,joy:0,sadness:0},
    {text:"Phasellus rhoncus turpis ac ante feugiat interdum. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"Proin in lectus eu diam eleifend varius. ",anger:0,fear:0.7,joy:0,sadness:0.34},
    {text:"Phasellus laoreet nulla eu nulla vehicula, vel aliquet arcu fringilla. ",anger:0,fear:0,joy:0,sadness:0},
    {text:"In vel lectus sit amet metus pretium lobortis et nec ligula. ",anger:0,fear:0,joy:0.34,sadness:0.67},
    {text:"Quisque consectetur lacus rutrum, sagittis urna sit amet, pretium nibh. ",anger:0,fear:0.23,joy:0,sadness:0},
    {text:"Etiam vestibulum dolor at nulla ullamcorper ornare quis ut enim.",anger:0,fear:0,joy:0,sadness:0.56}
  ];

  function wordPosition(i) {
    var alpha = 5.8 * i;  // deg
    var beta = Math.PI / 180 * alpha; // rad
    var x = 16 * Math.cos(beta);
    var y = 16 * Math.sin(beta);
    return { alpha: alpha, beta: beta, x: x, y: y };
  }

  (function repeatWords() {
    svg.selectAll("text")
        .data(sentences).enter()
        .append("text")
            .style("font-size", "0.8px")
            .style("font-weight", function (d,i) { return (!!d.anger || !!d.fear || !!d.joy || !!d.sadness) ? "normal" : "bold"; })
            .style("fill", function (d,i) {
              if (d.anger > 0) return "#A00";
              if (d.fear > 0) return "#00A";
              if (d.joy > 0) return "#0A0";
              if (d.sadness > 0) return "#70A";
              return "#000";
            })
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
                .on("end", function(d,i) {
                  if (d.anger > 0) waves[0] = applyForce(waves[0], d.anger*10);
                  if (d.fear > 0) waves[1] = applyForce(waves[1], d.fear*10);
                  if (d.joy > 0) waves[2] = applyForce(waves[2], d.joy*10);
                  if (d.sadness > 0) waves[3] = applyForce(waves[3], d.sadness*10);
                })
            .transition()
                .delay(200)
                .duration(350)
                .attr("fill-opacity", 0)
            .remove();

    setTimeout(repeatWords, 61*48+152+550);
  })();

})();
