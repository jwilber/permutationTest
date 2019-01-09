//////////////////////////
////// util funcs ////////
//////////////////////////

function loop() {
  // loop through async func calls
  var args = arguments;
  if (args.length <= 0)
      return;
  (function chain(i) {
      if (i >= args.length || typeof args[i] !== 'function')
          return;
      window.setTimeout(function() {
          args[i]();
          chain(i + 1);
      }, 300);
  })(0);
} 

//////////////////////////
/////// constants ////////
//////////////////////////

const svgD3 = d3.select('svg');
const width = svgD3.node().getBoundingClientRect().width;
const height = svgD3.node().getBoundingClientRect().height;
const margin = 20;

const initialScale = 0.01;
const showScale = 15;

// const roundPath = "M251.249,127.907c17.7,0,32.781-6.232,45.254-18.7c12.467-12.467,18.699-27.554,18.699-45.253 c0-17.705-6.232-32.783-18.699-45.255C284.029,6.233,268.948,0,251.249,0c-17.705,0-32.79,6.23-45.254,18.699 c-12.465,12.469-18.699,27.55-18.699,45.255c0,17.703,6.23,32.789,18.699,45.253C218.462,121.671,233.549,127.907,251.249,127.907 z";

const trtCenter = width / 5;
const cntrlCenter = width / 1.5;
const heightMuCenter = height / 1.8;

const radius = 5;

  function changeNetwork2() {
      d3.selectAll('.dotResponse')
        .attr('transform', d => `translate(${d.x}, ${Math.min(d.y, height + 500 - 1)})`)
    }

//////////////////////////
///// node functions /////
//////////////////////////

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
  } else if (d.nodeGroup == 'llama') {
    return height / 3.5
  } else {
    return height * 1.5
  }
};

const nodeGroupInitialForceCollide = (d) => {
    return d.nodeGroup === 'llama' ? 35 : 10;
  }

const nodeGroupMoveForceCollide = (d) => {
    return d.nodeGroup === 'llama' ? 45 : 15;
  }

const nodeInitialXPlacement = (d) => {
    if (d.nodeGroup === 'llama') {
      return (width / 2)
    } else if (d.nodeGroup === 'resp') {
      return (width / 5)
    } else {
      return (width / 5)
    }
  };

const nodeInitialYPlacement = (d) => {
  if (d.nodeGroup === 'llama') {
      return (height / 3)
    } else if (d.nodeGroup === 'resp') {
      return (width / 1.1)
    } else {
      return height
    }
  };

  const centPositions = {x: width / 2, y: height / 3}

  const roleScale = d3.scaleOrdinal()
      .range(['coral', 'olive', 'skyblue']);
    

  // dsn dots need to live off-screen, until the final dsn build (so don't mess w/ other nodes)
  let sampleData = d3.range(100).map((d,i) => ({r: 40 - i * 0.5,
                                                value: width/2 + d3.randomNormal(0, 1.5)() * 50,
                                                nodeGroup: i <= 23 ? 'llama' : i <= 39 ? 'resp' : 'dsn',
                                                dotValue: i % 2 === 0 ? 
                                                  d3.randomNormal(8, 2.5)().toFixed(1): 
                                                  d3.randomNormal(4.5, .75)().toFixed(1)
                                                }));
  
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
    .append('circle')
    .style('opacity', .75)
    .attr('fill' ,'pink')
    .attr('r', 0)
    .attr('stroke-width', .51)
    .attr('stroke', 'black')
    .attr('testStatGroup', function(d,i) {
      if (d.nodeGroup === 'resp') {
        testStatClass = 'testStat'.concat(i)
        d3.select(this).classed(testStatClass, true)
      } else {
        d3.select(this).classed('testStatDsn', true)
      }
    })

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
        roughness: 0.75,
          })
        )
      })
    })
}

var rc = rough.svg(svg);

d3.html("noun_28240_cc.svg", loadRoughsvgD3) 


// add test statistics
// d3.selectAll('.dotResponse').append('g').attr('class', 'testStat').each(function(d,i) {
//       d3.select(this).node().appendChild( rc.path(roundPath, {
//       stroke: 'black',
//       fillStyle: 'hachure',
//       strokeWidth: 2.25,
//       fill: 'red',
//       roughness: 6.85,
//         })
//       )
//     });

// d3.selectAll('.dotResponse').selectAll('path').attr("transform", `scale(${initialScale}, ${initialScale}) translate(-250,-50)`)

function nodeRandomPos(d) {
  if (d.nodeGroup === 'llama') {
    return d.index  <= 12 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosTwo(d) {
  if (d.nodeGroup === 'llama') {
    return d.index  > 12 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosThree(d) {
  if (d.nodeGroup === 'llama') {
    return [1, 4, 7, 10, 11, 12, 13, 14, 15, 22, 21, 20].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosFour(d) {
  if (d.nodeGroup === 'llama') {
    return [2, 4, 6, 9, 11, 16, 17, 18, 19, 22, 21, 20].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosFive(d) {
  if (d.nodeGroup === 'llama') {
    return [3, 4, 7, 10, 11, 14, 15, 16, 19, 22, 21, 20].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosSix(d) {
  if (d.nodeGroup === 'llama') {
    return [2, 4, 6, 9, 11, 16, 17, 1, 5, 8, 21, 20].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosSeven(d) {
  if (d.nodeGroup === 'llama') {
    return [2, 4, 6, 9, 11, 16, 17, 18, 19, 3, 5, 7].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosEight(d) {
  if (d.nodeGroup === 'llama') {
    return [1, 2, 3, 9, 11, 16, 17, 12, 14, 15, 21, 20].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosNine(d) {
  if (d.nodeGroup === 'llama') {
    return [12, 14, 6, 9, 11, 16, 17, 18, 19, 22, 21, 20].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosTen(d) {
  if (d.nodeGroup === 'llama') {
    return [12, 14, 5, 8, 12, 15, 14, 18, 19, 22, 2, 20].indexOf(d.index) > -1 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};

function nodeRandomPosition(d) {
  if (d.nodeGroup === 'llama') {
    return d.index  > 12 ? trtCenter : cntrlCenter;
  } else {
    return (width / 2)
  }
};


function shuffleTestStat(nodePositions, testStat) {
  randomizeNodes(nodePositions)
  // select chosen class and move it
  d3.selectAll(testStat)
    .transition()
    .duration(700)
    .attr('transform', `translate(0, 0)`)
    .attr('r', 10)
}


function moveNodes() {
  // move nodes to treatment groups
  force.force('center', null)
  .force('collision', d3.forceCollide(d => 33))
  .alphaDecay(.0005)
  .velocityDecay(0.5)
  force.force('x', d3.forceX().strength(1).x(nodeTreatmentWidth))
  force.force('y', d3.forceY().strength(1).y(nodeTreatmentHeight))
  .force('collision', d3.forceCollide(nodeGroupMoveForceCollide))
  force.alpha(.1).restart();
}

function moveHist(){
  force.force('center', null)
  .force('collision', d3.forceCollide(d => 12).strength(1))
  .alphaDecay(.025) 
    .force('x', d3.forceX((d,i) => d.value).strength(5))
    .force('y', d3.forceY(height - radius).strength(.7))
    .on('tick', changeNetwork2)
    force.alpha(.1).restart()
}

function randomizeNodes(nodePositions) {
  // shuffle ('permute') nodes
  force.force('center', null)
    .force('collision', d3.forceCollide(nodeGroupMoveForceCollide))
    .alphaDecay(.0005)
    .velocityDecay(0.5)
    .force('x', d3.forceX().strength(1).x(nodePositions))
    .alpha(.1).restart();
}


function moveToCenter() {
  // move nodes to center (initial state)
  force.force('center', null)  
    .alphaDecay(.045)
    .velocityDecay(0.7)
    force.force('x', d3.forceX().strength(1.5).x(nodeInitialXPlacement))
    force.force('y', d3.forceY().strength(5.5).y(nodeInitialYPlacement))
    .force('collision', d3.forceCollide(nodeGroupInitialForceCollide))
  force.alpha(.1).restart();
}


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


//////////////////////////////////////////////////
////////// Transition Functions /////////////////
//////////////////////////////////////////////////

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

function transitionZeroDown() {
  // initial position for dots

  d3.selectAll('.groupTitle').each(function() {
    d3.select(this).transition().delay(100).attr('visibility', 'hidden')
  })
}

function transitionOneUp() {
  d3.selectAll('text.responseText').remove();
  // d3.selectAll('circle.responseValue')
  //   .attr('stroke-width', 0)
  //   .transition()
  //   .duration(1000)
  //   .attr('r', 0)
  //   .remove()

  d3.selectAll('g.responseStuff')
    .transition().duration(1100).remove()
}

function transitionOneDown() {
  // color based on eatment assignment
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

function transitionTwoUp() {
  // move node back to original position
  d3.selectAll('.testStat0')
    .transition()
    .duration(2000)
    .attr('transform', 'translate(0, 0)')
    .attr('r', 0)
}

function transitionTwoDown() {
      
  let respGroups = dots.filter(d => d.nodeGroup === 'llama')
    .append('g')
    .attr('class', 'responseStuff');

  // respGroups.append('circle')
  //   .attr('class', 'responseValue')
  //   .attr('r', 0)
  //   .attr('cx', 20)
  //   .attr('cy', 62)
  //   .style('opacity', .75)
  //   .transition()
  //   .duration(1000)
  //   .attr('r', d => 6.4)
  //   .attr('fill' ,'pink')
  //   // .attr('stroke', 'black')
  //   .attr('stroke-width', .1)
  //   .transition()
  //   .duration(100)
  //   .attr('r', 8)
  //   .attr('stroke-width', .51)
  //   .attr('stroke', 'black')
  //   .transition()
  //   .delay(450)

  respGroups.append('text')
    .attr('class', 'responseText')
    .html(d => d.dotValue)
    .attr('fill', 'white')
    .style('font-size', '.6rem')
    .attr('stroke', 'black')
    .attr('stroke-width', .3)
    .attr('x', 17.8)
    .attr('y', 65.2)
    // .style('font-family', 'Indie Flower')
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
  // move llamas back to original group
  moveNodes()

  // move testStat2 back to original position
  d3.selectAll('.testStat2')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')
    .attr('r', 0)

  // move testStat1 back to center of focus
  d3.selectAll('.testStat0')
    .transition()
    .duration(2000)
    .attr('transform', `translate(-50, -150)`)
    .attr('r', 10)
}

function transitionThreeDown() {
  // select chosen class and move it
  d3.selectAll('.testStat0')
    .transition()
    .duration(50)
    .attr('transform', 'translate(-50, -150)')
    .transition()
    .duration(2000)
    .attr('r', 12)
}

function transitionFourUp() {
  // move node back to original position
  d3.selectAll('.testStat0')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')

  // hide all test statistic nodes
  Array.from(Array(16).keys()).slice(3,16).map(i => '.testStat'.concat(i)).map( testStat => {
      d3.selectAll(testStat)
        .transition()
        .duration(700)
        .attr('transform', 'translate(0, 0)') 
        .attr('r', 0)
  });

}

function transitionFourDown() {
  // shuffle ('permute') nodes
  randomizeNodes(nodeRandomPos)

  // move test statistic1 back to it's original position
  d3.selectAll('.testStat0')
    .transition()
    .duration(2000)
    .attr('transform', `translate(0, 0)`)
    .attr

  // move test statistic 2 to center of focus
  d3.selectAll('.testStat2')
    .transition()
    .duration(50)
    .attr('transform', 'translate(-50, -150)')
    .transition()
    .duration(2000)
    .attr('transform', `translate(-50, -150)`)
    .attr('r', 10)

  // TODO, calculate desired test-statistic value. (left response - right response)
  // give it to .teststat0.testStat as an attribute
  // function should be global
}

function transitionFiveUp() {
  // return llamas to their positions
  d3.selectAll('.dot').selectAll('path').transition().duration(1600).attr('transform', 'translate(0, 0)');
  d3.selectAll('.responseText').transition().duration(1600).attr('y', 65.2) 
  // re-add group titles
  d3.selectAll('.groupTitle').transition().delay(1400).attr('visibility', 'visible')

}


function transitionFiveDown() {

  // move test statistic1 back to it's original position
  d3.selectAll('.testStat2')
    .transition()
    .duration(700)
    .attr('transform', `translate(0, 0)`)

  // permute llama groupings multiple times
  loop(
    function() { shuffleTestStat(nodeRandomPosTwo, '.testStat3') },
    function() { shuffleTestStat(nodeRandomPosThree, '.testStat4') },
    function() { shuffleTestStat(nodeRandomPosFour, '.testStat5') }, 
    function() { shuffleTestStat(nodeRandomPosFive, '.testStat6') },
    function() { shuffleTestStat(nodeRandomPosSix, '.testStat7') },
    function() { shuffleTestStat(nodeRandomPosSeven, '.testStat8') },
    function() { shuffleTestStat(nodeRandomPosEight, '.testStat9') },
    function() { shuffleTestStat(nodeRandomPosNine, '.testStat10') },
    function() { shuffleTestStat(nodeRandomPosTen, '.testStat11') },
    function() { shuffleTestStat(nodeRandomPosEight, '.testStat0') }, )
  ;
}

function transitionSixUp() {
  return 'pass'
}

function transitionSixDown() {
  // move llamas off-screen, test-statistics off-screen & hide titles
  d3.selectAll('.dot').selectAll('path').transition().duration(2000).attr('transform', `translate(0, ${-height})`);
  // d3.selectAll('.responseValue').transition().duration(2000).attr('cy', -2000) 
  d3.selectAll('.responseText').transition().duration(2000).attr('y', -2000) 
  d3.selectAll('.groupTitle').transition().delay(1400).attr('visibility', 'hidden')

  // do stuff with test-statistic nodes
  d3.selectAll('.testStatDsn')
    .transition()
    .duration(2000)
    .attr('transform', `translate(-50, -550)`)
    .attr('r', 20)
  moveHist()
}

function calculateTestStatistic() {
  let testStatistics = d3.selectAll('.dot')
  // Calculate TREATMENT mean
  leftStats = testStatistics.filter(d => d.x < (width / 2) + 15)['_groups'][0];
  leftMean = d3.mean(leftStats, d => d['__data__'].dotValue);
  // Calculate CONTROL mean
  rightStats = testStatistics.filter(d => d.x >= (width / 2) + 15)['_groups'][0];
  rightMean = d3.mean(rightStats, d => d['__data__'].dotValue);

  return leftMean - rightMean;

}



