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
}

const svgD3 = d3.select('svg')

const width = svgD3.node().getBoundingClientRect().width
const height = svgD3.node().getBoundingClientRect().height
// console.log('width: ' + width)
// console.log('height: ' + height);

const data = [[2,3], [2,4], [5,2], [6,3], [3,4], [6,2],
              [4,5], [1,1], [2,2], [3,3], [3.4, 1.5], [5.5,6], 
              [5, .5], [.7, 5], [1, 6], [2, 5.5],
              [5, 5], [5, 3], [1, 7.4], [2, 8]];
              // [1, 7.4], [2, 8], [3, 7.3], [4, 7.6], [6.1, 6.5]];




const margin = 20
// const iter = (i, d) => i === 1 ? [2,2] : d
let minigrid = svgD3.append('g')
	.attr('class','minigrid')

const xScale = d3.scaleLinear().domain([0, 8]).range([margin, width - margin])
const yScale = xScale.copy().range([height - margin, margin])
const yGroupScale = yScale.copy().range([height / 5, height / 6])
const colorScale = d3.scaleOrdinal().domain(['even', 'odd']).range(['red', 'blue'])

const xAxis = d3.axisBottom(xScale).ticks(4)
const yAxis = d3.axisLeft(yScale).ticks(4)

// group titles (transition 1 -> beyond)
const treatmentTitleCenter = width / 4.5
const controlTitleCenter =   width / 1.39
let treatmentTitle = svgD3.append('text')
  .html('TREATMENT')
  .attr('x', treatmentTitleCenter)
  .attr('y', height / 9)
  .attr('class', 'groupTitle')
  // .style('fill', d3.rgb('coral').darker(2))
  .style('fill', 'black')
  .attr('visibility', 'hidden')
let controlTitle = svgD3.append('text')
  .html('CONTROL')
  .attr('x', controlTitleCenter)
  .attr('y', height / 9)
  .attr('class', 'groupTitle')
  .style('fill', 'black')
  .attr('visibility', 'hidden')



// mu titles
// Titles for algebra in transition four
const controlMuCenter = (width / 2) + 100
const treatmentMuCenter =   (width / 2) - 100
const heightMuCenter = (height / 1.5)

let muTreatment = svgD3.append('text')
      .attr('x', treatmentMuCenter)
      .attr('y', heightMuCenter)
      .attr('class', 'muTreatment')
      .html('&mu;')
      .style('font-size', '2rem')
      .append('tspan')
        .text('treatment')
        .attr('class', 'muTreatment')
        .style('font-size', '.65rem')
        .style('font-family', 'Indie Flower')
        .attr('dx', '.05em')
        .attr('dy', '.5em')

let muControl = svgD3.append('text')
      .attr('x', controlMuCenter)
      .attr('y', heightMuCenter)
      .attr('class', 'muControl')
      .html('&mu;')
      .style('font-size', '2rem')
      .append('tspan')
        .text('control')
        .attr('class', 'muControl')
        .style('font-size', '.65rem')
        .style('font-family', 'Indie Flower')
        .attr('dx', '.05em')
        .attr('dy', '.5em')

d3.selectAll('.muTreatment').attr('visibility', 'hidden')
d3.selectAll('.muControl').attr('visibility', 'hidden')



function groupClass(d) {
  if (d % 4 == 0){
    return xScale(1.8)
  } else if (d % 4 == 1) {
    return xScale(2.2)
  } else if (d % 4 == 2) {
    return xScale(5.8)
  } else {
    return xScale(6.2)
  }
}




groupXPosition = {'one': xScale(1.8), 
                  'two': xScale(2.2),
                  'three': xScale(5.8),
                  'four': xScale(6.2)
                  }



minigrid.selectAll('.dot')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'dot')
  // .attr('grp', (d,i) => i % 2 == 0 ? 'even' : 'odd')
  .attr('grp', (d,i) => groupClass(i))
  .attr('transform', d => {
    return 'translate(' + (xScale(d[0])) + ',' + yScale(d[1]) + ')'
  })

let dot = svgD3.selectAll('g.dot')


function transitionZero() {
  // initial position for dots
  dot
    .transition()
      .delay(500)
      .duration(1750)
      .attr('fill', 'black')
      .attr('transform', d => {
        return 'translate(' + (xScale(d[0])) + ',' + yScale(d[1]) + ')'
      })

  d3.selectAll('.groupTitle').each(function() {
    d3.select(this).transition().delay(1500).attr('visibility', 'hidden')
  })
}

// create array to store positions
// we'll use this later when shuffling assignment groups
let positionArray = [];

function transitionOne() {
  // color based on treatment assignment
  dot
    .transition()
    .duration((d,i) => i*30)
    .attr('fill', (d,i) => i % 2 == 0 ? 'coral' : 'skyblue')
  //   .attr('fill', (d, i) => d.group == 'control' ? 'red' : 'green')

  // for each path.llama, get the group of the parent calss
  console.log('lets view the dots')
  d3.selectAll('path.llama').each( function() {
    console.log(d3.select(this.parentNode))
  })

  // position llamas in treatment groups
  dot.transition()
    .delay((d,i) => (i+1)*30)
    .duration(2000)
    .attr('transform', function(d,i) {
        if (positionArray.length < 20) {
          positionArray.push([groupClass(i), ( (height/8) + (23*(i%5)))])
        }
    return 'translate(' + groupClass(i) + ',' + ((height/8) + (23*(i%5))) + ')'
      })
  // show titles
  d3.selectAll('.groupTitle').each(function() {
    d3.select(this).transition().delay(1500).attr('visibility', 'visible')
  })
}



function transitionThree() {
  // randomly shuffle treatment group assignment
  dot.each(function(d,i) {
    shufflePosition = randomChoice(positionArray)
    d3.select(this)
      .attr('group', () => shufflePosition[0] > (width / 2) ? 'control' : 'treatment')
      .transition()
      .delay((d,i) => (i+1)*300)
      .duration(2000)
        .attr('transform', function() {
            return 'translate(' + shufflePosition[0] + ',' + shufflePosition[1] + ')' 
        })
  })


  // SCROLLING-UP STUFF BELOW
  // ------------------------
  // remove llamaText if scrolling up
  d3.selectAll('.llamaText').each(function() {
    d3.select(this).transition().delay(1500).attr('visibility', 'hidden')
  })

  // Hide mu titles if already scrolled down
  d3.selectAll('.muTreatment').attr('visibility', 'hidden')
  d3.selectAll('.muControl').attr('visibility', 'hidden')

}


function transitionThreeUp() {
  // reverse transition of transitionFour
  d3.selectAll('.muTreatment').attr('visibility', 'hidden')
  d3.selectAll('.muControl').attr('visibility', 'hidden')
  d3.selectAll('.llamaText').attr('visibility', 'visible')

  d3.selectAll('.llamaText')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(' + (15) + ',' + (30) + ')')

  d3.selectAll('.llamaText')
    .transition()
    .delay(1500)
    .attr('visibility', ' hidden')
}

function transitionFour() {

  let centerX = width / 4
  let centerY = height / 4
  dot.append('text')
    .attr('class', 'llamaText')
    .html(() => Math.round(Math.random() * 10))
    .attr('fill', 'black')
    .style('font-family', 'consolas')
    .style('font-size', '1.4rem')
    .attr('transform', 'translate(15,' + (30) + ')')
    .attr('visibility', 'hidden')
    .raise()

  // delayed reveal of response values (for each llama)
  d3.selectAll('.llamaText')
    .transition()
    .delay(500)
    .attr('visibility', 'visible')

  // code to move response values to mu positions
  // TODO

  // Show mu title just under response clump, then replace response values
  // with mean
  // TODO: move response here
  d3.selectAll('.muTreatment').transition().delay(1000).attr('visibility', 'visible')
  d3.selectAll('.muControl').transition().delay(1000).attr('visibility', 'visible')

  d3.selectAll('.llamaText')
    .transition()
    .delay(1500)
    .duration(1000)
    .attr('transform', function(d,i) {
      let transX = getTranslation(d3.select(this.parentNode).attr('transform'))[0]
      let transY = getTranslation(d3.select(this.parentNode).attr('transform'))[1]
      // console.log('transX: ', transX, ' transY: ', transY)
      let groupAsn = d3.select(this.parentNode).attr('group')
      let currentLlamaX = groupAsn == 'treatment' ? treatmentMuCenter : controlMuCenter
      return 'translate(' + (currentLlamaX - transX) + ',' + (heightMuCenter - transY) + ')'
    })
    // .transition()
    // .delay(500)
    // .attr('visibility', 'hidden')

}


var rc = rough.svg(svg);

// load llama svg icons
d3.html("noun_28240_cc.svg", loadRoughSVG)

// function loadSVG(svgData) {
//   d3.selectAll('.dot').each(function() {
//     var gParent = this
//     d3.select(svgData).selectAll('path').each(function() {
//       // resize icon
//       d3.select(this).attr('class', 'llama')
//           .attr('transform', 'scale(1)') 
//       gParent.appendChild(this.cloneNode(true))
//     })
//   })
// }



function loadRoughSVG(svgData) {
  d3.selectAll('.dot').each(function() {
    let gParent = this
    d3.select(svgData).selectAll('path').each(function() {
      gParent.appendChild( rc.path(d3.select(this).node().getAttribute('d'), {
      stroke: 'black',
      fillStyle: 'hachure',
      strokeWidth: 0.25,
      fill: 'coral',
      roughness: 0.75,
        })
      )
    })
  })
}

