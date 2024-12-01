import React, { useState, useEffect } from 'react';
import '../styles/simulate.css';
import DivisionGraphs from './DivisionGraphs';
import * as simFunctions from '../simulation/Simulation';
import * as Teams from '../simulation/Teams';

function Simulate() {
  const [allGames, setAllGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [week, setWeek] = useState(-1);
  const [standings, setStandings] = useState(null);
  const [playoffRankings, setPlayoffRankings] = useState(null);
  const [recordsHistory, setRecordsHistory] = useState([]);

  function returnSeason() {
    const tempGames = simFunctions.initializeSeason();
    const balancedSeason = simFunctions.balanceSeason(tempGames);
    
    // Set the teams from the teams_list
    setTeams(Teams.teams_list);
    setAllGames(balancedSeason);
  }

  function simWeek() {
    if (week > 30) {
      let playoff = simFunctions.determinePlayoffBracket(Teams.league);
      let playoffJSX = simFunctions.simulatePlayoffMatches(playoff);
      return;
    }

    simFunctions.simulateSingleWeek(allGames, week);
    setTeams([...teams]);
    // Clone teams to capture current state for records history
    const teamsClone = JSON.parse(JSON.stringify(teams));
    setRecordsHistory(prevHistory => [...prevHistory, teamsClone]);

    setWeek(week + 1);
  }

  function logAllRecords() {
    console.log(recordsHistory);
  }

  useEffect(() => {
    if (teams.length > 0) {
      // Update standings whenever teams change
      const standingsJSX = simFunctions.printDivisionStandings(Teams.league);
      setStandings(standingsJSX);
    }
  }, [teams]);

  useEffect(() => {
    if (allGames.length > 0 && teams.length > 0) {
      // Update playoff picture whenever allGames or teams change
      const playoffPicture = simFunctions.determinePlayoffBracket(Teams.league);
      const playoffRankingsJSX = simFunctions.printPlayoffRankings(playoffPicture);
      setPlayoffRankings(playoffRankingsJSX);
    }
  }, [allGames, teams]);

  return (
    <div id="simulate-wrapper">
      <div className="sim-buttons-wrapper">
        <button onClick={returnSeason}>Setup Season</button>
        <button onClick={simWeek}>Simulate Week</button>
        <button onClick={logAllRecords}>Log Records</button>
      </div>
      <div className="results-wrapper">
        <div className="standings-results">
          {standings || <p>No standings available. Simulate to view results.</p>}
        </div>
        <div className="playoff-results">
          {playoffRankings || <p>No playoff rankings available. Simulate the season to view playoff results.</p>}
        </div>
        { <DivisionGraphs recordsHistory={recordsHistory} /> }
      </div>
    </div>
  );
}

export default Simulate;
