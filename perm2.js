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

function nodeTreatmentPos(d) {
  return d.index % 2 == 0 ? trtCenter : cntrlCenter;
}

  const centPositions = {x: width / 2, y:height/3}

  const roleScale = d3.scaleOrdinal()
      .range(['coral', 'olive', 'skyblue']);
    
  let sampleData = d3.range(24).map((d,i) => ({r: 40 - i * 0.5}))
  
  // set params for force layout

  const center = d3.forceCenter().x(centPositions.x).y(centPositions.y)

  const manyBody = d3.forceManyBody().strength(10)
      
  // define force
  let force = d3.forceSimulation()
    .force('charge', manyBody)
    // .force('center', center)
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
  .alphaDecay(.08)
  force.force('x', d3.forceX().strength(2).x(nodeTreatmentPos))
  force.force('y', d3.forceY().strength(1.5).y(height / 3.5))
  force.alpha(.4).restart();
}

function moveToCenter() {
  
  force.force('center', null)
  .force('collision', d3.forceCollide(d => 30))
  // .velocityDecay(0.7)
  force.force('x', d3.forceX().strength(1.5).x( width / 2))
  // force.force('y', d3.forceY().strength(1.5).y(height / 3))
  force.alpha(.7).restart();
}


function nodeRandomPos(d) {
  return d.index  <= 12 ? trtCenter : cntrlCenter;
}


function moveRandomly() {

  // for each group, randomly select 4 llamas, and swap their role.
  force.force('center', null)
  .force('collision', d3.forceCollide(d => 33))
  force.velocityDecay(.7)
  force.force('x', d3.forceX().strength(2.5).x(nodeRandomPos))
  // force.force('y', d3.forceY().strength(1.5).y(height / 3.5))
  force.alpha(.4).restart();
}

  
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
// const controlMuCenter = (width / 2) + 100
// const treatmentMuCenter =   (width / 2) - 100
// const heightMuCenter = (height / 1.5)

// let muTreatment = svgD3.append('text')
//       .attr('x', treatmentMuCenter)
//       .attr('y', heightMuCenter)
//       .attr('class', 'muTreatment')
//       .html('&mu;')
//       .style('font-size', '2rem')
//       .append('tspan')
//         .text('treatment')
//         .attr('class', 'muTreatment')
//         .style('font-size', '.65rem')
//         .style('font-family', 'Indie Flower')
//         .attr('dx', '.05em')
//         .attr('dy', '.5em')

// let muControl = svgD3.append('text')
//       .attr('x', controlMuCenter)
//       .attr('y', heightMuCenter)
//       .attr('class', 'muControl')
//       .html('&mu;')
//       .style('font-size', '2rem')
//       .append('tspan')
//         .text('control')
//         .attr('class', 'muControl')
//         .style('font-size', '.65rem')
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
    .style('fill', 'rgba(131, 131, 131, .05')
}

// // create array to store positions
// // we'll use this later when shuffling assignment groups
// let positionArray = [];

function transitionOne() {
  // color based on treatment assignment
  d3.selectAll('.dot').select('path')
    .transition()
    .style('fill', (d,i) => d.index % 2 == 0 ? 'rgba(248,131,121, .15)' : 'rgba(131, 238, 248, .2')

  // position llamas in treatment groups
    moveNodes()
  // // show titles
  d3.selectAll('.groupTitle').each(function() {
    d3.select(this).transition().delay(800).attr('visibility', 'visible')
  })
}

function transitionTwoDown() {
  moveRandomly()
}



// function transitionThree() {
//   // randomly shuffle treatment group assignment
//   dot.each(function(d,i) {
//     shufflePosition = randomChoice(positionArray)
//     d3.select(this)
//       .attr('group', () => shufflePosition[0] > (width / 2) ? 'control' : 'treatment')
//       .transition()
//       .delay((d,i) => (i+1)*300)
//       .duration(2000)
//         .attr('transform', function() {
//             return 'translate(' + shufflePosition[0] + ',' + shufflePosition[1] + ')' 
//         })
//   })


//   // SCROLLING-UP STUFF BELOW
//   // ------------------------
//   // remove llamaText if scrolling up
//   d3.selectAll('.llamaText').each(function() {
//     d3.select(this).transition().delay(1500).attr('visibility', 'hidden')
//   })

//   // Hide mu titles if already scrolled down
//   d3.selectAll('.muTreatment').attr('visibility', 'hidden')
//   d3.selectAll('.muControl').attr('visibility', 'hidden')

// }


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


// var rc = rough.svg(svg);

// // load llama svg icons
// d3.html("noun_28240_cc.svg", loadRoughSVG)




// function loadRoughSVG(svgData) {
//   d3.selectAll('.dot').each(function(d,i) {
//     let gParent = this
//     d3.select(svgData).selectAll('path').each(function() {
//       console.log(i)
//       gParent.appendChild( rc.path(d3.select(this).node().getAttribute('d'), {
//       stroke: 'black',
//       fillStyle: 'hachure',
//       strokeWidth: 0.25,
//       fill: 'rgba(131, 131, 131, .05)',
//       roughness: 0.85,
//         })
//       )
//     })
//   })
// }



// annot
// const annotations = [
//         {
//           //below in makeAnnotations has type set to d3.annotationLabel
//           //you can add this type value below to override that default
//           type: d3.annotationCalloutCircle,
//           note: {
//             label: "Here's the text for 'label'",
//             title: "This is the text for  'title'",
//             wrap: 190 // how long label can be
//           },
//           //settings for the subject, in this case the circle radius
//           subject: {
//             radius: 146
//           },
//           x: trtCenter + 5, //
//           y: (height / 3.4), //
//           dy: 0, // y-pos for text
//           dx: 102 // x-pos for text
//         },
//         {
//           type: d3.annotationCalloutCircle,
//           note: {
//             label: "yep, that's smaller circle",
//             title: "small",
//             wrap: 90
//           },
//           connector: {
//             end: "arrow" // 'dot' also available
//           },
//           subject: {
//             radius: 20
//           },
//           x: cntrlCenter,
//           y: (height / 3.4),
//           dy: -60,
//           dx: 30
//         }].map(function(d){ d.color = "darkseagreen"; return d})

//         const makeAnnotations = d3.annotation()
//           .type(d3.annotationLabel)
//           .annotations(annotations)

//         d3.select("svg")
//           .append("g")
//           .attr("class", "annotation-group")
//           .call(makeAnnotations)

// d3.selectAll('.annotation-subject').select('path')
//   .attr('visibility', 'hidden')
      
// d3.selectAll('.annotation-subject').each(function() {
//     let gParent = this
//     console.log(gParent)
//     d3.select('svg').select('path.subject').each(function() {
//       gParent.appendChild( rc.path(d3.select(this).node().getAttribute('d'), {
//       stroke: 'black',
//       fillStyle: 'hachure',
//       strokeWidth: 0.55,
//       roughness: 2.5,
//         })
//       )
//     })
//   })