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

const headPath = "M251.249,127.907c17.7,0,32.781-6.232,45.254-18.7c12.467-12.467,18.699-27.554,18.699-45.253 c0-17.705-6.232-32.783-18.699-45.255C284.029,6.233,268.948,0,251.249,0c-17.705,0-32.79,6.23-45.254,18.699 c-12.465,12.469-18.699,27.55-18.699,45.255c0,17.703,6.23,32.789,18.699,45.253C218.462,121.671,233.549,127.907,251.249,127.907 z";

// const headPath = "M0.198079 0.134472c0.0123346,-0.0082874 0.0297362,-0.0150669 0.0563622,-0.0218661 -0.0309094,0.0218031 -0.0410472,0.0410157 -0.0446614,0.0639528 0.0133268,-0.0299803 0.0277717,-0.0445906 0.0853701,-0.0593031 -0.0566024,0.0399331 -0.0357835,0.0732362 -0.0405787,0.134547l-0.168051 4.72441e-005c-0.00428346,-0.0551024 -0.000307087,-0.0985945 -0.0483425,-0.132472 0.019815,0.00505906 0.0345157,0.0101102 0.0458307,0.0157795 -0.00287402,-0.00502362 -0.00643701,-0.0101024 -0.0108583,-0.0153583 0.0167205,0.00719685 0.0260906,0.0143701 0.032315,0.0241102 0.00720866,-0.030126 0.0167165,-0.0462323 0.0466654,-0.0624252 -0.0100276,0.0149803 -0.0162205,0.0289449 -0.0200827,0.0433071 0.00645669,0.00348031 0.0114646,0.00709843 0.0154803,0.011126 0.00312205,-0.00224409 0.00657087,-0.00437402 0.0104449,-0.0064252 0.00706693,-0.0212677 0.0178583,-0.0346102 0.0426378,-0.0480079 -0.00879921,0.0131417 -0.0146457,0.0255079 -0.0185551,0.0380433 0.00702756,-0.00234252 0.0149449,-0.00462992 0.0239055,-0.00692126 -0.0126102,0.00889764 -0.0217559,0.0173583 -0.0284213,0.0258228 -0.000771654,0.00447244 -0.00137008,0.00902756 -0.00184252,0.0136969 0.00565748,-0.00673228 0.0127087,-0.0124646 0.0223819,-0.0176535zm-0.0715157 0.0253543c0.00310236,-0.00551969 0.0065315,-0.0104409 0.0107008,-0.0149173 -0.00181102,-0.00441339 -0.00406693,-0.00879528 -0.00688976,-0.013252 -0.0019685,0.00903937 -0.00311417,0.018315 -0.00381102,0.0281693z"
const trtCenter = width / 5;
const cntrlCenter = width / 1.5;
const heightMuCenter = (height / 1.8)


//////////////////////////
/////// node functions ////////
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
  } else {
    return height / 3.5
  }
};

const nodeGroupInitialForceCollide = (d) => {
    return d.nodeGroup === 'llama' ? 35 : 10;
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

  const centPositions = {x: width / 2, y: height / 3}

  const roleScale = d3.scaleOrdinal()
      .range(['coral', 'olive', 'skyblue']);
    
  let sampleData = d3.range(40).map((d,i) => ({r: 40 - i * 0.5,
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
    .attr('testStatGroup', function(d,i) {
      if (d.nodeGroup === 'resp') {
        testStatClass = 'testStat'.concat(i)
        d3.select(this).classed(testStatClass, true)
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
        roughness: 0.85,
          })
        )
      })
    })
}

var rc = rough.svg(svg);

d3.html("noun_28240_cc.svg", loadRoughsvgD3) 


// add test statistics
d3.selectAll('.dotResponse').append('g').attr('class', 'testStat').each(function(d,i) {
      d3.select(this).node().appendChild( rc.path(headPath, {
      stroke: 'black',
      fillStyle: 'hachure',
      strokeWidth: 2.25,
      fill: 'red',
      roughness: 6.85,
        })
      )
    });

d3.selectAll('.dotResponse').selectAll('path').attr("transform", `scale(${initialScale}, ${initialScale}) translate(-250,-50)`)


// function removeTestStat(testStats) {
//   // remove added test statistic nodes

  // d3.selectAll(testStat)
  //   .select('.testStat')
  //   .transition()
  //   .duration(700)
  //   .attr('transform', 'translate(0, 0) scale(0, 0)')
// }

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
    .select('.testStat')
    .transition()
    .duration(700)
    .attr('transform', `translate(0, 0) scale(${showScale}, ${showScale})`)
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
  d3.selectAll('circle.responseValue')
    .attr('stroke-width', 0)
    .transition()
    .duration(1000)
    .attr('r', 0)
    .remove()

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
    .select('.testStat')
    .transition()
    .duration(2000)
    .attr('transform', 'translate(0, 0)')
}

function transitionTwoDown() {
      
  let respGroups = dots.filter(d => d.nodeGroup === 'llama')
    .selectAll('g.responseStuff')
    .data(sampleResponse)
    .enter()
    .append('g')
    .attr('class', 'responseStuff') 

  respGroups.append('circle')
    .attr('class', 'responseValue')
    .attr('r', 0)
    .attr('cx', 20)
    .attr('cy', 62)
    .style('opacity', .75)
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
    .select('.testStat')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')

  // move testStat1 back to center of focus
  d3.selectAll('.testStat0')
    .select('.testStat')
    .transition()
    .duration(2000)
    .attr('transform', `translate(-50, -150) scale(${showScale}, ${showScale})`)
}

function transitionThreeDown() {
  // select chosen class and move it
  d3.selectAll('.testStat0')
    .select('.testStat')
    .transition()
    .duration(50)
    .attr('transform', 'translate(-50, -150)')
    .transition()
    .duration(2000)
    .attr('transform', `translate(-50, -150) scale(${showScale}, ${showScale})`)
}

function transitionFourUp() {
  // move node back to original position
  d3.selectAll('.testStat0')
    .select('.testStat')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')

  // hide all test statistic nodes
  Array.from(Array(16).keys()).slice(4,16).map(i => '.testStat'.concat(i)).map( testStat => {
      d3.selectAll(testStat)
        .select('.testStat')
        .transition()
        .duration(700)
        .attr('transform', 'translate(0, 0) scale(0, 0)') 
  });

}

function transitionFourDown() {
  // shuffle ('permute') nodes
  randomizeNodes(nodeRandomPos)

  // move test statistic1 back to it's original position
  d3.selectAll('.testStat0')
    .select('.testStat')
    .transition()
    .duration(2000)
    .attr('transform', `translate(0, 0) scale(${showScale}, ${showScale})`)

  // move test statistic 2 to center of focus
  d3.selectAll('.testStat2')
    .select('.testStat')
    .transition()
    .duration(50)
    .attr('transform', 'translate(-50, -150)')
    .transition()
    .duration(2000)
    .attr('transform', `translate(-50, -150) scale(${showScale}, ${showScale})`)
}

function transitionFiveUp() {
  // return llamas to their positions
  d3.selectAll('.dot').selectAll('path').transition().duration(1600).attr('transform', 'translate(0, 0)');

}


function transitionFiveDown() {

  // move test statistic1 back to it's original position
  d3.selectAll('.testStat2')
    .select('.testStat')
    .transition()
    .duration(700)
    .attr('transform', `translate(0, 0) scale(${showScale}, ${showScale})`)

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
  // move llamas off-screen
  d3.selectAll('.dot').selectAll('path').transition().duration(2000).attr('transform', `translate(0, ${-height})`);
}




