// util funcs
function randomChoice(choices) {
  let index = Math.floor(Math.random() * choices.length);
  // get desired element
  let elm = choices[index]
  // remove element from arrays
  choices.splice(index, 1)
  return elm;
}

function getTranslation(transform) {
  // Get translation of a transformation
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttributeNS(null, "transform", transform);
  var matrix = g.transform.baseVal.consolidate().matrix;
  return [matrix.e, matrix.f];
};

const svgD3 = d3.select('svg')

const width = svgD3.node().getBoundingClientRect().width
const height = svgD3.node().getBoundingClientRect().height

const trtCenter = width / 5;
const cntrlCenter = width / 1.5;
const heightMuCenter = (height / 1.8)

function nodeTreatmentPos(d) {
  return d.index % 2 == 0 ? trtCenter : cntrlCenter;
}

  const centPositions = {x: width / 2, y:height/3}

  const roleScale = d3.scaleOrdinal()
      .range(['coral', 'olive', 'skyblue']);
    
  let sampleData = d3.range(24).map((d,i) => ({r: 40 - i * 0.5}));
  let sampleResponse = d3.range(1).map((d,i) => ({r: d3.randomUniform(1, 5)()}));
  
  // set params for force layout

  const center = d3.forceCenter().x(centPositions.x).y(centPositions.y)

  const manyBody = d3.forceManyBody().strength(1)
      

  let force = d3.forceSimulation()
    .force('charge', manyBody)
    force.force('x', d3.forceX().strength(1.5).x( width/2))
    force.force('y', d3.forceY().strength(5.5).y(height/3))
    .force('collision', d3.forceCollide(d => 45))     
    .alphaDecay(.3)
    .nodes(sampleData)
    .on('tick', changeNetwork)

  let dots = svgD3.selectAll('.dot')
    .data(sampleData)
    .enter()
    .append('g')
    .attr('class', 'dot')
    .attr('group', (d,i) => i % 2 == 0 ? 'true' : 'false')


  function changeNetwork() {
    d3.selectAll('g.dot')
      .attr('transform', d=> `translate(${d.x}, ${d.y})`)
  }
  
  function loadRoughsvgD3(svgD3Data) {
  d3.selectAll('.dot').each(function(d,i) {
    let gParent = this
    d3.select(svgD3Data).selectAll('path').each(function() {
      gParent.appendChild( rc.path(d3.select(this).node().getAttribute('d'), {
      stroke: 'black',
      fillStyle: 'hachure',
      strokeWidth: 0.25,
      fill: 'rgba(131,131,131, .15)',
      roughness: 0.85,
        })
      )
    })
  })
}

var rc = rough.svg(svg);

d3.html("noun_28240_cc.svg", loadRoughsvgD3) 


function moveNodes() {

  force.force('center', null)
  .force('collision', d3.forceCollide(d => 33))
  .alphaDecay(.0005)
  .velocityDecay(0.5)
  force.force('x', d3.forceX().strength(1).x(nodeTreatmentPos))
  force.force('y', d3.forceY().strength(1).y(height / 3.5))
  force.alpha(.1).restart();
}

function moveToCenter() {
  
  force.force('center', null)  
    // .force('charge', manyBody)
    .alphaDecay(.045)
    .velocityDecay(0.7)
    force.force('x', d3.forceX().strength(1.5).x( width/2))
    force.force('y', d3.forceY().strength(5.5).y(height/3))
    .force('collision', d3.forceCollide(d => 45))
  // force.force('y', d3.forceY().strength(1.5).y(height / 3))
  force.alpha(.1).restart();
}


function nodeRandomPos(d) {
  return d.index  <= 12 ? trtCenter : cntrlCenter;
}


// function moveRandomly() {

//   // for each group, randomly select 4 llamas, and swap their role.
//   force.force('center', null)
//     .force('collision', d3.forceCollide(d => 33))
//     .velocityDecay(.7)
//     .force('x', d3.forceX().strength(2.5).x(nodeRandomPos))
//     .alpha(.4).restart();
// }

  
const margin = 20;

// const xScale = d3.scaleLinear().domain([0, 8]).range([margin, width - margin])
// const yScale = xScale.copy().range([height - margin, margin])
// const yGroupScale = yScale.copy().range([height / 5, height / 6])
// const colorScale = d3.scaleOrdinal().domain(['even', 'odd']).range(['red', 'blue'])

// const xAxis = d3.axisBottom(xScale).ticks(4)
// const yAxis = d3.axisLeft(yScale).ticks(4)

// group titles (transition 1 -> beyond)
const treatmentTitleCenter = trtCenter
const controlTitleCenter =   cntrlCenter
let treatmentTitle = svgD3.append('text')
  .html('TREATMENT')
  .attr('x', treatmentTitleCenter - 10)
  .attr('y', margin)
  .attr('class', 'groupTitle')
  // .style('fill', d3.rgb('coral').darker(2))
  .style('fill', 'black')
  .attr('text-align', 'right')
  .attr('visibility', 'hidden')
let controlTitle = svgD3.append('text')
  .html('CONTROL')
  .attr('x', controlTitleCenter)
  .attr('y', margin)
  .attr('class', 'groupTitle')
  .style('fill', 'black')
  .attr('visibility', 'hidden')



// // mu titles
// // Titles for algebra in transition four

// let muTreatment = svgD3.append('text')
//       .attr('x', trtCenter + 100)
//       .attr('y', heightMuCenter + 100)
//       .attr('class', 'muTreatment')
//       .html('&mu;')
//       .style('font-size', '1.8rem')
//       .append('tspan')
//         .text('treatment')
//         .attr('class', 'muTreatment')
//         .style('font-size', '.6rem')
//         .style('font-family', 'Indie Flower')
//         .attr('dx', '.05em')
//         .attr('dy', '.5em')

// let muControl = svgD3.append('text')
//       .attr('x', cntrlCenter - 100)
//       .attr('y', heightMuCenter + 100)
//       .attr('class', 'muControl')
//       .html('&mu;')
//       .style('font-size', '1.8rem')
//       .append('tspan')
//         .text('control')
//         .attr('class', 'muControl')
//         .style('font-size', '.6rem')
//         .style('font-family', 'Indie Flower')
//         .attr('dx', '.05em')
//         .attr('dy', '.5em')

// d3.selectAll('.muTreatment').attr('visibility', 'hidden')
// d3.selectAll('.muControl').attr('visibility', 'hidden')



// function groupClass(d) {
//   if (d % 4 == 0){
//     return xScale(1.8)
//   } else if (d % 4 == 1) {
//     return xScale(2.2)
//   } else if (d % 4 == 2) {
//     return xScale(5.8)
//   } else {
//     return xScale(6.2)
//   }
// }




// groupXPosition = {'one': xScale(1.8), 
//                   'two': xScale(2.2),
//                   'three': xScale(5.8),
//                   'four': xScale(6.2)
//                   }



function transitionZeroDown() {
  // initial position for dots

  d3.selectAll('.groupTitle').each(function() {
    d3.select(this).transition().delay(100).attr('visibility', 'hidden')
  })
}

function transitionZeroUp() {
  // initial position for dots
  moveToCenter()
  d3.selectAll('.groupTitle').each(function() {
    d3.select(this).transition().delay(100).attr('visibility', 'hidden')
  })

  d3.selectAll('.dot').select('path')
    .transition()
    .style('fill', 'rgba(131, 131, 131, .05)')
}

function transitionOne() {
  // color based on treatment assignment
  d3.selectAll('.dot').select('path')
    .transition()
    .style('fill', (d,i) => d.index % 2 == 0 ? 'rgba(248,131,121, .15)' : 'rgba(131, 238, 248, .2)')

  // position llamas in treatment groups
    moveNodes()
  // // show titles
  d3.selectAll('.groupTitle').each(function() {
    d3.select(this).transition().delay(800).attr('visibility', 'visible')
  })
}

function transitionTwoDown() {
  force.force('center', null)
    .force('collision', d3.forceCollide(d => 33))
    .alphaDecay(.0005)
    .velocityDecay(0.5)
    .force('x', d3.forceX().strength(1).x(nodeRandomPos))
    .alpha(.1).restart();
}

function transitionTwoUp() {
  d3.selectAll('text.responseText').remove();
  d3.selectAll('circle.responseValue')
    .attr('stroke-width', 0)
    .transition()
    .duration(1000)
    .attr('r', 0)
    .remove()

  d3.selectAll('g.responseStuff')
    .transition().duration(1100).remove()
}

function transitionThreeDown() {
      
  let respGroups = dots.selectAll('g.responseStuff')
    .data(sampleResponse)
    .enter()
    .append('g')
    .attr('class', 'responseStuff')
    .attr('ggg', function() {
      return getTranslation(d3.select(this.parentNode).attr('transform'))[0] < (width / 2)
    })

  respGroups.append('circle')
    .attr('class', 'responseValue')
    // .attr('respGroup', ())
    .attr('r', 0)
    .attr('cx', 20)
    .attr('cy', 62)
    .style('opacity', .85)
    .transition()
    .duration(1000)
    .attr('r', d => 6.4)
    .attr('fill' ,'pink')
    // .attr('stroke', 'black')
    .attr('stroke-width', .1)
    .transition()
    .duration(100)
    .attr('r', 8)
    .attr('stroke-width', .51)
    .attr('stroke', 'black')
    .transition()
    .delay(450)

  respGroups.append('text')
    .attr('class', 'responseText')
    .html(() => Math.round(Math.random() * 9))
    .attr('fill', 'white')
    .style('font-size', '.6rem')
    .attr('stroke', 'black')
    .attr('stroke-width', .3)
    .attr('x', 17.8)
    .attr('y', 65.2)
    .attr('visibility', 'hidden')
    .raise()

  d3.selectAll('.responseText')
    .transition()
    .delay(900)
    .attr('visibility', 'visible')
    .transition()
    .delay(0)

}

function transitionThreeUp() {

  d3.selectAll('.tauTreatment').remove();

}

function transitionFourDown() {

  let tau = svgD3.append('text')
      .attr('x', (width / 2) - 5)
      .attr('y', heightMuCenter + 150)
      .attr('class', 'tauTreatment')
      .html('&tau;')
      .style('font-size', '2rem')
      .append('tspan')
        .text('0')
        .attr('class', 'tauTreatment')
        .style('font-size', '.4rem')
        .style('font-family', 'Indie Flower')
        .attr('dx', '.05em')
        .attr('dy', '.6em')
        .attr('text-anchor', 'start')

  svgD3.append('circle')
    .attr('class', 'responseValue')
    .attr('r', 0)
    .attr('cx', (width / 2))
    .attr('cy', heightMuCenter + 100)
    .style('opacity', .85)
    .transition()
    .delay(1270)
    .duration(200)
    .attr('r', 19)
    .attr('fill' ,'pink')
    .attr('stroke', 'black')
    .attr('stroke-width', .1)
    .transition()
    .attr('r', 16)
}


// function transitionThreeUp() {
//   // reverse transition of transitionFour
//   d3.selectAll('.muTreatment').attr('visibility', 'hidden')
//   d3.selectAll('.muControl').attr('visibility', 'hidden')
//   d3.selectAll('.llamaText').attr('visibility', 'visible')

//   d3.selectAll('.llamaText')
//     .transition()
//     .duration(1000)
//     .attr('transform', 'translate(' + (15) + ',' + (30) + ')')

//   d3.selectAll('.llamaText')
//     .transition()
//     .delay(1500)
//     .attr('visibility', ' hidden')
// }

// function transitionFour() {

//   let centerX = width / 4
//   let centerY = height / 4
//   dot.append('text')
//     .attr('class', 'llamaText')
//     .html(() => Math.round(Math.random() * 10))
//     .attr('fill', 'black')
//     .style('font-family', 'consolas')
//     .style('font-size', '1.4rem')
//     .attr('transform', 'translate(15,' + (30) + ')')
//     .attr('visibility', 'hidden')
//     .raise()

//   // delayed reveal of response values (for each llama)
//   d3.selectAll('.llamaText')
//     .transition()
//     .delay(500)
//     .attr('visibility', 'visible')

//   // code to move response values to mu positions
//   // TODO

//   // Show mu title just under response clump, then replace response values
//   // with mean
//   // TODO: move response here
//   d3.selectAll('.muTreatment').transition().delay(1000).attr('visibility', 'visible')
//   d3.selectAll('.muControl').transition().delay(1000).attr('visibility', 'visible')

//   d3.selectAll('.llamaText')
//     .transition()
//     .delay(1500)
//     .duration(1000)
//     .attr('transform', function(d,i) {
//       let transX = getTranslation(d3.select(this.parentNode).attr('transform'))[0]
//       let transY = getTranslation(d3.select(this.parentNode).attr('transform'))[1]
//       // console.log('transX: ', transX, ' transY: ', transY)
//       let groupAsn = d3.select(this.parentNode).attr('group')
//       let currentLlamaX = groupAsn == 'treatment' ? treatmentMuCenter : controlMuCenter
//       return 'translate(' + (currentLlamaX - transX) + ',' + (heightMuCenter - transY) + ')'
//     })

// }


function circleGen() {
  //set defaults
  var r = function(d) { return d.radius; },
      x = function(d) { return d.x; },
      y = function(d) { return d.y; };
  
  //returned function to generate circle path
  function circle(d) {
    var cx = d3.functor(x).call(this, d),
        cy = d3.functor(y).call(this, d),
        myr = d3.functor(r).call(this, d);

    return "M" + cx + "," + cy + " " +
           "m" + -myr + ", 0 " +
           "a" + myr + "," + myr + " 0 1,0 " + myr*2  + ",0 " +
           "a" + myr + "," + myr + " 0 1,0 " + -myr*2 + ",0Z";
  }
  
  //getter-setter methods
  circle.r = function(value) {
    if (!arguments.length) return r; r = value; return circle;
  };  
  circle.x = function(value) {
    if (!arguments.length) return x; x = value; return circle;
  };  
  circle.y = function(value) {
    if (!arguments.length) return y; y = value; return circle;
  };
  
  return circle;
}