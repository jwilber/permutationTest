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

const headPath = "M251.249,127.907c17.7,0,32.781-6.232,45.254-18.7c12.467-12.467,18.699-27.554,18.699-45.253 c0-17.705-6.232-32.783-18.699-45.255C284.029,6.233,268.948,0,251.249,0c-17.705,0-32.79,6.23-45.254,18.699 c-12.465,12.469-18.699,27.55-18.699,45.255c0,17.703,6.23,32.789,18.699,45.253C218.462,121.671,233.549,127.907,251.249,127.907 z";

const trtCenter = width / 5;
const cntrlCenter = width / 1.5;
const heightMuCenter = (height / 1.8)

const nodeTreatmentWidth = (d) => {
  if (d.nodeGroup == 'resp') {
    return width / 2
  } else if (d.index % 2 == 0) {
    return trtCenter
  } else {
    return cntrlCenter
  }
};

const nodeTreatmentHeight = (d) => {
  if (d.nodeGroup == 'resp') {
    return height / 1.1
  } else {
    return height / 3.5
  }
};

const nodeGroupInitialForceCollide = (d) => {
    return d.nodeGroup === 'llama' ? 45 : 20;
  }

const nodeGroupMoveForceCollide = (d) => {
    return d.nodeGroup === 'llama' ? 45 : 15;
  }

const nodeInitialXPlacement = (d) => {
    return d.nodeGroup === 'llama' ? (width / 2) : (width / 5);
  };

const nodeInitialYPlacement = (d) => {
    return d.nodeGroup === 'llama' ? (height / 3) : (height / 1.1);
  }

  const centPositions = {x: width / 2, y:height/3}

  const roleScale = d3.scaleOrdinal()
      .range(['coral', 'olive', 'skyblue']);
    
  let sampleData = d3.range(35).map((d,i) => ({r: 40 - i * 0.5,
                                               nodeGroup: i <= 23 ? 'llama' : 'resp'}));
  let sampleResponse = d3.range(1).map((d,i) => ({r: d3.randomUniform(1, 5)()}));
  
  // set params for force layout

  const center = d3.forceCenter().x(centPositions.x).y(centPositions.y)

  const manyBody = d3.forceManyBody().strength(1)
      

  let force = d3.forceSimulation()
    .force('charge', manyBody)
    force.force('x', d3.forceX().strength(1.5).x(nodeInitialXPlacement))
    force.force('y', d3.forceY().strength(5.5).y(nodeInitialYPlacement))
    .force('collision', d3.forceCollide(nodeGroupInitialForceCollide))     
    .alphaDecay(.3)
    .nodes(sampleData)
    .on('tick', changeNetwork)

  let dots = svgD3.selectAll('.dot')
    .data(sampleData)
    .enter()
    .append('g')
    .attr('class', d => d.nodeGroup === 'llama' ? 'dot' : 'dotResponse')
    .attr('group', (d,i) => i % 2 == 0 ? 'true' : 'false');

  d3.selectAll('.dotResponse')
    .attr('testStatGroup', (d,i) => {
      if (d.nodeGroup === 'resp') {
        if (i == 1) {
        return 'testStat1'
      } else if (i == 2) {
        return 'testStat2'
      } else if (i >= 3 & i < 7) {
        return 'testStat6'
      } else {
        return 'testStats'
      } } else {
        return 'ignore'
      }
    })

  // let responseDots = svgD3.selectAll('.dotResponse')    
  //   .append('g')
  //   .attr('class', (d,i) => {
  //     if (i == 1) {
  //       return 'testStat1'
  //     } else if (i == 2) {
  //       return 'testStat2'
  //     } else if (i >= 3 & i < 7) {
  //       return 'testStat6'
  //     } else {
  //       return 'testStat'
  //     }
  //   });

  function changeNetwork() {
    d3.selectAll('g.dot')
      .attr('transform', d=> `translate(${d.x}, ${d.y})`)

    d3.selectAll('g.dotResponse')
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


d3.selectAll('.dotResponse').append('g').attr('class', 'testStat').each(function(d,i) {
      d3.select(this).node().appendChild( rc.path(headPath, {
      stroke: 'black',
      fillStyle: 'hachure',
      strokeWidth: 2.25,
      fill: 'red',
      roughness: 5.85,
        })
      )
    });

  d3.selectAll('.dotResponse').selectAll('path').attr("transform", "scale(0.15,0.15) translate(-250,-50)")



function moveNodes() {

  force.force('center', null)
  .force('collision', d3.forceCollide(d => 33))
  .alphaDecay(.0005)
  .velocityDecay(0.5)
  force.force('x', d3.forceX().strength(1).x(nodeTreatmentWidth))
  force.force('y', d3.forceY().strength(1).y(nodeTreatmentHeight))
  .force('collision', d3.forceCollide(nodeGroupMoveForceCollide))
  force.alpha(.1).restart();
}

function moveToCenter() {
  
  force.force('center', null)  
    .alphaDecay(.045)
    .velocityDecay(0.7)
    force.force('x', d3.forceX().strength(1.5).x(nodeInitialXPlacement))
    force.force('y', d3.forceY().strength(5.5).y(nodeInitialYPlacement))
    .force('collision', d3.forceCollide(nodeGroupInitialForceCollide))
  force.alpha(.1).restart();
}


function nodeRandomPos(d) {
  if (d.nodeGroup === 'llama') {
    return d.index  <= 12 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

  
const margin = 20;


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
      
  let respGroups = dots.filter(d => d.nodeGroup === 'llama')
    .selectAll('g.responseStuff')
    .data(sampleResponse)
    .enter()
    .append('g')
    .attr('class', 'responseStuff') // issue because no tran

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
    .html(() => '&tau; ' + Math.round(Math.random() * 9))
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
  d3.select('.testStat')
    .transition()
    .attr('transform', 'translate(0, 0)')

}

function transitionFourDown() {
  // select chosen class and move it
  d3.select('.testStat')
    .transition()
    .attr('fill', 'red')
    .attr('transform', 'translate(-50, -150) scale(2, 2)')
    .attr('r', 15)

}



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