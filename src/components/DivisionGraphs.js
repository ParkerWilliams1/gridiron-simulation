import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { league } from '../simulation/Teams';

function DivisionGraphs({ recordsHistory }) {
  const graphRef = useRef();

  useEffect(() => {
    if (recordsHistory.length === 0) return;

    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const divisions = Object.entries(league).flatMap(([conference, divisions]) =>
      Object.entries(divisions).map(([divisionName, teams]) => ({
        conference,
        divisionName,
        teams,
      }))
    );

    const svgContainer = d3.select(graphRef.current);
    svgContainer.selectAll('*').remove();

    divisions.forEach((division, divIndex) => {
      const container = svgContainer.append('div').style('margin-bottom', '20px');
      const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xScale = d3.scaleLinear().domain([0, recordsHistory.length - 1]).range([0, width]);
      const yScale = d3.scaleLinear().domain([0, recordsHistory.length - 1])
        .range([height, 0]);

      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
      svg.append('g').call(d3.axisLeft(yScale));

      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text(`${division.conference} - ${division.divisionName}`);

      division.teams.forEach((team, teamIndex) => {
        const teamData = recordsHistory.map((teams_in_week, currWeek) => {
          const teamInfo = teams_in_week.find(currTeam => currTeam._teamName === team.teamName);

          return {
            week: currWeek,
            wins: teamInfo ? teamInfo._record.wins : 0,
          };
        });

        const line = d3
          .line()
          .x(d => xScale(d.week))
          .y(d => yScale(d.wins));

        svg.append('path')
          .datum(teamData)
          .attr('fill', 'none')
          .attr('stroke', team._primaryColor || colors(teamIndex))
          .attr('stroke-width', 2)
          .attr('d', line);

        svg
          .append('rect')
          .attr('x', 20)
          .attr('y', teamIndex * 20)
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', team._primaryColor || colors(teamIndex));

        svg
          .append('text')
          .attr('x', width - 360)
          .attr('y', teamIndex * 20 + 12)
          .text(team.teamName)
          .style('font-size', '12px')
          .style('color', 'black')
      });
    });
  }, [recordsHistory]);
  return <div ref={graphRef}></div>;
}

export default DivisionGraphs;
