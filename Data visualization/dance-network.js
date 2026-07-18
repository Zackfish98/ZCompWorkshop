// dance-network.js — force-directed network graph of dance style relationships
//
// Adapted from the "Relational Structures" course's graph-from-csv example.
// That example expects two files (nodes.csv + edges.csv). DanceStyles.csv is
// a single edge list, so instead of a separate nodes file, the node list is
// derived automatically from every unique name in the source/target columns.

(function() {
  const width = 800;
  const height = 500;

  // DanceStyles.csv has ", " after commas in a few places, which leaves a
  // leading space on those fields — trim everything so "West Coast Swing"
  // (as a source) and " West Coast Swing" (as a target) count as the same node.
  d3.csv('Data%20visualization/DanceStyles.csv', d => ({
    source: (d.source || '').trim(),
    target: (d.target || '').trim(),
    relationship: (d.relationship || '').trim(),
    strength: +d.strength,
    type: (d.type || '').trim()
  })).then(function(links) {
    const names = Array.from(new Set(links.flatMap(d => [d.source, d.target])));
    const nodes = names.map(name => ({ id: name }));
    createGraph(nodes, links);
  }).catch(function(error) {
    console.error('Error loading DanceStyles.csv:', error);
    d3.select('#d3-container-3').append('p')
      .style('color', '#e16e57')
      .text('Could not load DanceStyles.csv — check the console.');
  });

  function createGraph(nodes, links) {
    const svg = d3.select('#d3-container-3')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');

    // Arrowhead marker, reused on every directed link
    g.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 26)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', '#191919');

    svg.call(d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => g.attr('transform', event.transform)));

    svg.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .style('font-family', 'Space Grotesk, sans-serif')
      .style('font-size', '12px')
      .attr('fill', 'rgba(25,25,25,0.5)')
      .text('Scroll to zoom, drag the background to pan, drag a node to move it');

    // Relationship type -> brand color. Includes the CSV's "studend-teacher"
    // typo so that row still gets colored instead of falling back to gray.
    const relationshipColor = d3.scaleOrdinal()
      .domain(['friends', 'colleagues', 'student-teacher', 'studend-teacher'])
      .range(['#e16e57', '#2e72a4', '#c4bb7b', '#c4bb7b']);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-260))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(34));

    const link = g.append('g')
      .attr('stroke-width', 2)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => relationshipColor(d.relationship))
      .attr('stroke-opacity', 0.7)
      .attr('marker-end', d => d.type === 'directed' ? 'url(#arrowhead)' : null);

    const node = g.append('g')
      .attr('stroke', '#f8f3e8')
      .attr('stroke-width', 2)
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 22)
      .attr('fill', '#191919')
      .call(drag(simulation));

    node.on('mouseover', function(event, d) {
      link.attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.12);
      showTooltip(event, d);
    })
    .on('mouseout', function() {
      link.attr('stroke-opacity', 0.7);
      hideTooltip();
    });

    g.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -30)
      .style('font-family', 'Space Grotesk, sans-serif')
      .style('font-size', '11px')
      .style('font-weight', 700)
      .attr('fill', '#191919')
      .text(d => d.id)
      .attr('class', 'node-label');

    const label = g.selectAll('.node-label');

    const tooltip = d3.select('body').append('div')
      .style('position', 'absolute')
      .style('background', '#191919')
      .style('color', '#f8f3e8')
      .style('padding', '8px 12px')
      .style('border-radius', '8px')
      .style('font-family', 'Space Grotesk, sans-serif')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    function showTooltip(event, d) {
      const connections = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
      tooltip.transition().duration(150).style('opacity', 1);
      tooltip.html(`<strong>${d.id}</strong><br/>${connections} connection${connections === 1 ? '' : 's'}`)
        .style('left', (event.pageX + 12) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    }

    function hideTooltip() {
      tooltip.transition().duration(300).style('opacity', 0);
    }

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x; d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
      }
      return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    }
  }
})();
