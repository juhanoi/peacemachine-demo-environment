import { initializeLinearGradient } from "./modules/gradients.js";

export default function visualization() {

  // Find the SVG to draw on
  const svg = d3.select("svg");
  const defs = svg.append("defs");

  const gradientRed = initializeLinearGradient(defs, "Red", "#A00");
  const gradientBlue = initializeLinearGradient(defs, "Blue", "#00A");
  const gradientGreen = initializeLinearGradient(defs, "Green", "#0A0");
  const gradientPurple = initializeLinearGradient(defs, "Purple", "#70A");


  // Create the center circle
  const circle = svg.append("circle")
      .style("fill", "#222")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 15);


  // Wave simulation
  const N = 30;
  const r = 15;
  const A = 1;
  const dt = 0.015;
  const maxSlope = 0.1;

  function initializeWaveArray(N,r,A) {
    let arr = [];
    const phase = Math.PI * Math.random();
    const amplitude = 0.5*A + A*Math.random();
    for (let i = 0; i < N; i++) arr.push({
      x: r*2/N*i-r*(N-1)/N,
      y: amplitude * Math.sin(4*Math.PI/N*i + phase),
      v: 0
    });

    return arr;
  }

  function updateWaveArray(data) {
    const h = r*2/N;
    const c = h/dt;
    const k = (c*c)/(h*h);
    const s = 0.95;

    return data.map(function (curr, i, u) {
      const prev = (i == 0) ? -curr.y : u[i-1].y;
      const next = (i == u.length-1) ? -curr.y : u[i+1].y;
      const f = k * (prev + next - 2 * curr.y);
      const v = s * ( curr.v + f * dt );

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

  function countWaveEnergy(wave) {
    return wave.reduce(function (acc, curr) {
      return acc + Math.abs(curr.y);
    }, 0);
  }

  function initializeWave(name) {
    const data = initializeWaveArray(N,r,A);
    svg.append("path")
        .attr("class", "wave")
        .style("fill", "transparent")
        .attr("stroke", "url(#gradient"+name+")")
        .attr("stroke-width", "0.3")
        .attr("d", waveLine(data));
    return data;
  }

  function applyForce(wave, f) {
    const target = Math.floor(N * Math.random());
    //var target = Math.round(N/2);
    const direction = ((Math.random < 0.5) ? -1 : 1);
    return wave.map(function (d, i) {
      if (i === target) {
        return {
          x: d.x,
          y: d.y - direction * f,
          v: d.v
        };
      } else if (i === target-1 || i === target+1) {
        return {
          x: d.x,
          y: d.y - direction * 0.25 * f,
          v: d.v
        }
      }
      return Object.assign({}, d);
    });
  }

  const waves = [
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
          var energy = countWaveEnergy(waves[i]);
          return 0.1 + 0.2 * energy / 200;
          //return 0.1 + 0.2 * Math.random();
        })
        .attr("d", function (d, i) {
          waves[i] = updateWaveArray(waves[i]);
          return waveLine(waves[i]);
        });

    setTimeout(waveSimulation, dt * 10000);
  })();


  // Text
  function wordPosition(i) {
    const alpha = 5.8 * i;  // deg // 62 lines can fit one circle
    const beta = Math.PI / 180 * alpha; // rad
    const x = 16 * Math.cos(beta);
    const y = 16 * Math.sin(beta);
    return { alpha: alpha, beta: beta, x: x, y: y };
  }

  function showSentences(sentences, callback) {
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
              const p = wordPosition(i);
              return "translate(" + [ p.x, p.y ] + ")rotate(" + p.alpha + ")";
            })
            .text(function (d) { return d.text; })
            .transition()
                .delay(function(d,i) { return 200*i; })
                .duration(152)
                .attr("fill-opacity", 1)
                .on("end", function(d,i) {
                  if (d.anger > 0) waves[0] = applyForce(waves[0], d.anger*10);
                  if (d.fear > 0) waves[1] = applyForce(waves[1], d.fear*10);
                  if (d.joy > 0) waves[2] = applyForce(waves[2], d.joy*10);
                  if (d.sadness > 0) waves[3] = applyForce(waves[3], d.sadness*10);
                })
            .transition()
                .delay(1000)
                .duration(1000)
                .attr("fill-opacity", 0)
                .on("end", function(d,i) {
                  if (svg.selectAll("text").size() === 1) {
                    callback.call();
                  }
                })
            .remove();
  };

  (function readFiles(index) {
    const files = [
      "/data/lorem.json",
      "/data/lorem2.json"
    ];

    d3.json(files[index], function (data) {
      showSentences(data, function() {
        if (index === files.length-1) {
          setTimeout(() => readFiles(0), 1000);
        } else {
          setTimeout(() => readFiles(index+1), 1000);
        }
      });
    });
  })(0);


}
