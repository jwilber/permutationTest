// Ensure refresh starts at top (so scrolly stuff doesn't get weird)
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

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
const mobileWidth = 390;
console.log(width)
console.log(height)
// const roundPath = "M251.249,127.907c17.7,0,32.781-6.232,45.254-18.7c12.467-12.467,18.699-27.554,18.699-45.253 c0-17.705-6.232-32.783-18.699-45.255C284.029,6.233,268.948,0,251.249,0c-17.705,0-32.79,6.23-45.254,18.699 c-12.465,12.469-18.699,27.55-18.699,45.255c0,17.703,6.23,32.789,18.699,45.253C218.462,121.671,233.549,127.907,251.249,127.907 z";

const trtCenter = width / 5;
const cntrlCenter = width / 1.5;
const heightMuCenter = height / 1.8;
let scaleWidth = width > mobileWidth ? 0.75 : 0.35;

// const radius = 5;

//////////////////////////
///// node functions /////
//////////////////////////

const nodeTreatmentWidth = (d) => {
  if (d.nodeGroup === 'resp' || d.nodeGroup === 'dsn') {
    return width / 2
  } else if (d.index % 2 == 0) {
    if (width > mobileWidth) {
      return trtCenter
    } else {
      return trtCenter
    }
  } else {
    if (width > mobileWidth) {
      return cntrlCenter
    } else {
      return width / 1.35
    }
  }
};

const nodeTreatmentHeight = (d) => {
  if (d.nodeGroup == 'resp') {
    return height / 1.1
  } else if (d.nodeGroup == 'llama') {
    return height / 3.5
  } else {
    return height / 1.1
  }
};

const nodeGroupInitialForceCollide = (d) => {
    // return d.nodeGroup === 'llama' ? 35 : 10;
    if (d.nodeGroup === 'llama' & width > mobileWidth) {
      return 35
    } else if (d.nodeGroup === 'llama') {
      return 18 // mobile cluster of llama
    } else {
      return 10
    }
  }

const nodeGroupMoveForceCollide = (d) => {
  if (d.nodeGroup === 'llama' & width > mobileWidth) {
    return 37
  } else if (d.nodeGroup === 'llama') {
    return 14
  } else {
    return 0
  }
};

const nodeGroupMoveForceCollideUp = (d) => {
  if (d.nodeGroup == 'resp') {
    return 15
  } else if (d.nodeGroup == 'llama') {
    return 37
  } else {
    return 15
  }
};

const nodeInitialXPlacement = (d) => {
    if (d.nodeGroup === 'llama') {
      return (width / 2)
    } else if (d.nodeGroup === 'resp') {
      return (width / 5)
    } else { // dsn
      return (width / 5)
    }
  };

const nodeInitialYPlacement = (d) => {
  if (d.nodeGroup === 'llama') {
      return (height / 3)
    } else if (d.nodeGroup === 'resp') {
      return (height / 1.1)
    } else { // dsn
      return height / 1.1
    }
  };

  const centPositions = {x: width / 2, y: height / 3}

  const roleScale = d3.scaleOrdinal()
      .range(['coral', 'olive', 'skyblue']);
    

  // dsn dots need to live off-screen, until the final dsn build (so don't mess w/ other nodes)
  let sampleData = d3.range(250).map((d,i) => ({r: 40 - i * 0.5,
                                                value: width/2 + d3.randomNormal(0, 1.5)() * 50,
                                                nodeGroup: i <= 23 ? 'llama' : i <= 39 ? 'resp' : 'dsn',
                                                dotValue: i % 2 === 0 ? 
                                                  d3.randomNormal(7, 2.5)().toFixed(1): 
                                                  d3.randomNormal(4.5, .75)().toFixed(1),
                                                'permDsn': d3.randomNormal(0, 1)().toFixed(1)
                                                }));


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

  function changeNetwork() {
    d3.selectAll('g.dot')
      .attr('transform', d=> `translate(${d.x}, ${d.y})`)

    // d3.selectAll('g.dotResponse')
    //   .attr('transform', d=> `translate(${d.x}, ${d.y})`)
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
        roughness: 0.54,
          })
        )
      })
    })


    // get window height to help with scale
    // console.log(document.body);
    // scale icon size
    d3.selectAll('g.dot').selectAll('path').attr('transform', `scale(${scaleWidth})`)
}

var rc = rough.svg(svg);

d3.html("noun_28240_cc.svg", loadRoughsvgD3) 

function nodeRandomPos(d) {
  if (d.nodeGroup === 'llama') {
    if (width > mobileWidth) {
      return d.index  <= 12 ? trtCenter : cntrlCenter;
    } else {
      return d.index  <= 12 ? trtCenter : (width / 1.35);
    }
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
    // randomly assign i-th llamas to treatment center, others to control center
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


function shuffleTestStat(nodePositions, responseNode) {
  randomizeNodes(nodePositions)
  // select chosen class and move it
  d3.selectAll(responseNode)
    .transition()
    .attr('r', d => d.radius / 0.8)
    .transition()
    .duration(800)
    .attr('r', d => d.radius / 1.05)
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

function showAllTestDsnNodes() {
  d3.selectAll('.testStatDsn')
    .transition()
    .duration(100) //1000
    .attr('r', 10);

  force.force('center', null)
    .force('collision', d3.forceCollide(d => 33))
    .alphaDecay(.02)
    .velocityDecay(0.5)
  force.force('x', d3.forceX().strength(1).x(nodeTreatmentWidth))
  force.force('y', d3.forceY().strength(1).y(nodeTreatmentHeight))
    .force('collision', d3.forceCollide(nodeGroupMoveForceCollideUp))
    .on('tick', changeNetwork)
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

function randomizeNodes2(nodePositions) {
  // shuffle ('permute') nodes
  force.force('center', null)
    .force('collision', d3.forceCollide(nodeGroupMoveForceCollide))
    .alphaDecay(.0005)
    .velocityDecay(0.5)
    .force('x', d3.forceX().strength(1).x(nodePositions))
    .alpha(.6).restart();
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
const treatmentTitleCenter = trtCenter;
// const treatmentTitleCenter = width > mobileWidth ? trtCenter : (width / 2);
const controlTitleCenter =   cntrlCenter
let treatmentTitle = svgD3.append('text')
  .html('TREATMENT')
  .attr('x', width > mobileWidth ? trtCenter - 10 : trtCenter - 30)
  .attr('y', width > mobileWidth ? margin : (margin * 3))
  .attr('class', 'groupTitle')
  .style('fill', 'black')
  .attr('text-align', 'right')
  .attr('visibility', 'hidden')
let controlTitle = svgD3.append('text')
  .html('CONTROL')
  .attr('x', controlTitleCenter)
  .attr('y', width > mobileWidth ? margin : (margin * 3))
  .attr('class', 'groupTitle')
  .style('fill', 'black')
  .attr('visibility', 'hidden')


  // stuff for distribution
  let dotDistRangeStart = width > mobileWidth ? (width / 4) : (width / 8);
  let dotDistRangeEnd = width > mobileWidth ? (width / 1.5) : (width / 1.15);
  let dotDistHeight = width > mobileWidth ? height : height - 35;
  //x scales
const x = d3.scaleLinear()
    .domain(d3.extent(sampleData.filter(d => d.nodeGroup === 'dsn'), d => +d.permDsn))
    .rangeRound([dotDistRangeStart, dotDistRangeEnd]); // hist width(left, right)

const nbins = 18;

function assignResponseNodes(d,i) {
  'testStat'.concat(i)
  if (i < 1 && d.dataIndex < 15) {
    d3.select(this).classed('resonse'.concat(d.dataIndex), true)
  }
}

function dotDistribution(){

    let data = sampleData.filter(d => d.nodeGroup === 'dsn')

    //histogram binning
    const histogram = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(nbins))
      .value(d => d.permDsn);

    //binning data and filtering out empty bins
    const bins = histogram(data);

    //g container for each bin
    let binContainer = svgD3.append('g')
      .selectAll(".gBin")
      .data(bins);

    let binContainerEnter = binContainer.enter()
      .append("g")
        .attr("class", "gBin")
        .attr("transform", d => `translate(${x(d.x0)}, ${dotDistHeight})`)

    //need to populate the bin containers with data the first time
    binContainerEnter.selectAll(".preHistPosit")
        .data((d,i) => d.map((p, j) => {
          return {idx: j,
                  dataIndex: i,
                  value: p.Value,
                  radius: (x(d.x1)-x(d.x0))/1.9
                }
        }))
      .enter()
      .append("circle")
      .attr('class', 'histCirc')
      .attr('testStatValue', d => d.permDsn)
      .attr('', function(d, i) {
        if (i < 1 && d.dataIndex == 20) {
          d3.select(this).classed('response1', true)
        } else if (i < 1 && d.dataIndex == 9) {
          d3.select(this).classed('response2', true)
        } else if (i < 1 && d.dataIndex == 5) {
          d3.select(this).classed('response3', true)
        } else if (i < 1 && d.dataIndex == 11) {
          d3.select(this).classed('response4', true)
        } else if (i < 1 && d.dataIndex == 7) {
          d3.select(this).classed('response5', true)
        } else if (i < 1 && d.dataIndex == 6) {
          d3.select(this).classed('response6', true)
        } else if (i < 1 && d.dataIndex == 13) {
          d3.select(this).classed('response7', true)
        } else if (i < 1 && d.dataIndex == 8) {
          d3.select(this).classed('response8', true)
        } else if (i < 1 && d.dataIndex == 2) {
          d3.select(this).classed('response9', true)
        } else {
          d3.select(this).classed('histogramNode', true)
        }
      })
      .attr('', function(d) {
        if (d.dataIndex > 19) { // determine which test-stat nodes to highlight
          d3.select(this).classed('extreme', true)
        } else {
          d3.select(this).classed('notExtreme', true)
        }
      })
      .transition()
        .attr("cx", 0) //g element already at correct x pos
        .attr("cy", d => - d.idx * 2 * d.radius - d.radius - (dotDistHeight/8)) // control height here
        .attr("r", 0)
        .transition()
          .duration(800)
          .attr('r', d => 0)
          .style('opacity', 1)
          .attr('fill' ,'pink')
          .transition()
          .attr('stroke-width', 0.2)
          .attr('stroke', 'black')

    binContainerEnter.merge(binContainer)
        .attr("transform", d => `translate(${x(d.x0)}, ${dotDistHeight})`)

    //enter/update/exit for circles, inside each container
    let dots = binContainer.selectAll("circle")
        .data(d => d.map((p, i) => {
          return {idx: i,
                  value: p.Value,
                  radius: (x(d.x1)-x(d.x0))/2
                }
        }))

    //ENTER new elements present in new data.
    dots.enter()
      .append("circle")
        .attr("class", "enter")
        .attr("cx", 0) //g element already at correct x pos
        .attr("cy", function(d) {
          return - d.idx * 2 * d.radius - d.radius; })
        .attr("r", 0)
      .merge(dots)
        .transition()
          .duration(500)
          .attr("r", d => d.radius )
          // .attr("r", function(d) {
          // return (d.length==0) ? 0 : d.radius; })



};//update


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

  dotDistribution();

}

function transitionTwoUp() {
  // move node back to original position
  d3.selectAll('.testStat0')
    .transition()
    .duration(2000)
    .attr('transform', 'translate(0, 0)')
    .attr('r', 0)

  // hide response node
  d3.selectAll('circle.response1')
    .transition()
    .attr('r', d => 0)
}

let responseTextSize = width > mobileWidth ? '0.95rem' : '0.5rem';
  let responseTextX = width > mobileWidth ? 8.8 : 1;
  let responseTextY = width > mobileWidth ? 52.2 : 24;
  let responseTextStrokWidth = width > mobileWidth ? 0.45 : 0.25;

function transitionTwoDown() {
      
  let respGroups = dots.filter(d => d.nodeGroup === 'llama')
    .append('g')
    .attr('class', 'responseStuff');

  respGroups.append('text')
    .attr('class', 'responseText')
    .html(d => {
      if (d.dotValue == 9.4) {
        return 4.4
      } else if (d.dotValue == 8.2) {
        return 5.8
      } else if (d.dotValue == 9.1) {
        return 4.1
      } else if (d.dotValue == 8.7) {
        return 7.7
      } else {
        return d.dotValue
      }
    })
    .attr('fill', 'white')
    .attr('font-size', responseTextSize)
    .attr('stroke', 'black')
    .attr('stroke-width', responseTextStrokWidth)
    .attr('x', responseTextX)
    .attr('y', responseTextY)
    .style('font-family', 'Gaegu')
    .attr('visibility', 'hidden')
    .raise()

    

  d3.selectAll('.responseText')
    .transition()
    .delay(100)
    .attr('visibility', 'visible')
    .attr('font-size', '1.2rem')
    .transition()
    .attr('font-size', `${responseTextSize}`);

}

function transitionThreeUp() {
  // move llamas back to original group
  moveNodes()

  d3.selectAll('circle.response2')
    .transition()
    .attr('r', d => 0)
}

function transitionThreeDown() {

  d3.selectAll('circle.response1')
    .transition()
    .attr('r', d => d.radius / .5)
    .attr('fill', 'coral')
    .transition()
    .attr('r', d => d.radius / 1.05)

  d3.select('circle.histCirc.response1.extreme')
    .append('g')
    .attr('class', 'fuck')
    .append('text')
    .html('FUCK')
    .attr('font-size', '10.95rem')
    .attr('x', width / 3.1)
    .attr('y', height / 1.105)

}

function transitionFourUp() {

  shuffleTestStat(nodeRandomPosTwo, '.response3')
  Array.from(Array(10).keys()).slice(3,10).map(i => '.response'.concat(i)).map( responseNode => {
      d3.selectAll(responseNode)
        .transition()
        .duration(700)
        .attr('r', 0)
  });

}

function transitionFourDown() {
  // shuffle ('permute') nodes
  randomizeNodes(nodeRandomPos)

  // HIST ENTER
  d3.selectAll('circle.response2')
    .transition()
    .attr('r', d => d.radius / 0.8 )
    .transition()
    .attr('r', d => d.radius / 1.05)
}

function transitionFiveUp() {
  // return llamas to their positions
  d3.selectAll('.dot').selectAll('path').transition().duration(1600).attr('transform', `translate(0, 0) scale(${scaleWidth})`);
  d3.selectAll('.responseText').transition().duration(1600).attr('y', responseTextY) 
  // re-add group titles
  d3.selectAll('.groupTitle').transition().delay(1400).attr('visibility', 'visible')

  // remove histogram nodes
  d3.selectAll('circle.histogramNode')
    .transition()
    .duration(800)
    .attr('r', 0)

  // remove axis
  d3.select('.axis--x').remove();


  force.force('center', null)
    .force('collision', d3.forceCollide(d => 33))
    .alphaDecay(.0005)
    .velocityDecay(0.5)
    force.force('x', d3.forceX().strength(1).x(nodeTreatmentWidth))
    force.force('y', d3.forceY().strength(1).y(nodeTreatmentHeight))
    .force('collision', d3.forceCollide(nodeGroupMoveForceCollide))
    .on('tick', changeNetwork)
  force.alpha(.1).restart();
shuffleTestStat(nodeRandomPosFive, '.response6')
}


function transitionFiveDown() {

  // move test statistic1 back to it's original position
  d3.selectAll('.testStat2')
    .transition()
    .duration(700)
    .attr('transform', `translate(0, 0)`)

  // permute llama groupings multiple times
  loop(
    function() { shuffleTestStat(nodeRandomPosTwo, '.response3') },
    function() { shuffleTestStat(nodeRandomPosThree, '.response4') },
    function() { shuffleTestStat(nodeRandomPosFour, '.response5') }, 
    function() { shuffleTestStat(nodeRandomPosFive, '.response6') },
    function() { shuffleTestStat(nodeRandomPosSix, '.response7') },
    function() { shuffleTestStat(nodeRandomPosSeven, '.response8') },
    function() { shuffleTestStat(nodeRandomPosEight, '.response9') },
    );
}

function transitionSixUp() {
  d3.selectAll('circle.extreme')
    .attr('fill', 'pink')
    .attr('stroke-width', 0.2)
}

// hacky way to ensure smallest node keeps relative size (idk why this is a problem, but this solves it!)
let small_node_size_force = 5.5;

function transitionSixDown() {
  // move llamas off-screen, test-statistics off-screen & hide titles
  d3.selectAll('.dot').selectAll('path').transition().duration(2000).attr('transform', `translate(0, ${-height})`);
  d3.selectAll('.responseText').transition().duration(2000).attr('y', -2000) 
  d3.selectAll('.groupTitle').transition().delay(700).attr('visibility', 'hidden')

  // move nodes to distribution
  d3.selectAll('circle.histogramNode')
    .transition()
    .duration(1400)
    .attr('r', (d,i) => {
      if (i === 190) small_node_size_force = d.radius / 1.05;
      return i === 200 ? small_node_size_force : d.radius / 1.05;
    })

  svgD3.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + (dotDistHeight/1.12) + ")")
  .call(d3.axisBottom(x));
}

function transitionSevenDown() {
  d3.selectAll('circle.extreme')
    .transition()
    .duration(500)
    .attr('r', (d,i) => i === 15 ? small_node_size_force + 2 : 2 + d.radius / 1.05)
    .attr('stroke-width', .5)
    .attr('fill', 'coral')
    .transition()
    .attr('r', (d,i) => i === 15 ? small_node_size_force : d.radius / 1.05)
    .attr('stroke-width', 0.2)
}

function transitionSevenUp() {

  svgD3.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + (dotDistHeight/1.12) + ")")
  .call(d3.axisBottom(x));

  d3.selectAll('circle.notExtreme')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')

  d3.selectAll('circle.extreme')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')

  d3.selectAll('.finalText').remove()


}

let finalTextSize = width > mobileWidth ? 20 : 14;
let finalTextY = width > mobileWidth ? (height / 1.105) : (height / 1.205);
let finalTitleSize = width > mobileWidth ? 28 : 16;
let finalTitleY = width > mobileWidth ? (margin * 4) : (height - margin * 1.5);

function transitionEightDown() {

  svgD3.append('text')
    .attr('x', width > mobileWidth ? (width / 3.1) : (width / 4))
    .attr('y', finalTextY)
    .text('n = 200')
    .attr('class', 'finalText')
    .style('font-family', 'Gaegu')
    .attr('font-size', 0)
    .transition()
    .duration(1500)
    .attr('font-size', finalTextSize)

  svgD3.append('text')
    .attr('x', width > mobileWidth ? (width / 1.55) : (width / 1.2))
    .attr('y', finalTextY)
    .text('n = 16')
    .attr('class', 'finalText')
    .style('font-family', 'Gaegu')
    // .style('font-weight', 'bold')
    .attr('font-size', 0)
    .transition()
    .duration(1500)
    .attr('font-size', finalTextSize)

    svgD3.append('text')
    .attr('x', width > mobileWidth ? (width / 2.9) : (width / 3.2))
    .attr('y', finalTitleY)
    .text('P-Value: 16/200 = 0.08')
    .attr('class', 'finalText')
    .style('font-family', 'Gaegu')
    .style('font-weight', width > mobileWidth ? 'bold' : '500')
    .attr('font-size', 0)
    .transition()
    .delay(500)
    .duration(1500)
    .attr('font-size', finalTitleSize)

  // remove axis
  d3.select('.axis--x').remove();

  // split dot distribution into two
  let splitValue = width > mobileWidth ? 75 : 35;

  d3.selectAll('circle.notExtreme')
    .transition()
    .duration(1500)
    .attr('transform', `translate(-${splitValue},0)`)

  d3.selectAll('circle.extreme')
    .transition()
    .duration(1500)
    .attr('transform', `translate(${splitValue + 5},0)`)
      
}

function transitionEightUp() {
  d3.selectAll('circle')
    .transition()
    .duration(1000)
    .attr('r', d => d.radius / 1.05)
}
function transitionExit() {
  // d3.selectAll('circle')
  //   .transition()
  //   .duration(4000)
  //   .attr('r', 0)
}

