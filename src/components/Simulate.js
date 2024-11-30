/*import React, { useState } from 'react';
import '../styles/simulate.css';
import * as simFunctions from '../simulation/Simulation';
import * as Teams from '../simulation/Teams';

function Simulate() {
  let allGames = [];
 // let records = new Map();
  let week = 0;

  const [records, setRecords] = useState(new Map());
  const [standings, setStandings] = useState([]);

  function returnSeason() {
    allGames = [];
    let tempGames = simFunctions.initializeSeason(); 
    allGames = simFunctions.balanceSeason(tempGames);
    return allGames;
  }

  function returnSim() {
    let seasonRecap = simFunctions.simulateGames(allGames);
    simFunctions.runSzn(seasonRecap);
  }

  function simWeek() {
    records = simFunctions.simulateSingleWeek(allGames, week, records);
    console.log(week);
    week += 1;
  }

  function printStandings() {
    return simFunctions.printDivisionStandings(Teams.league, records)
  }

  function printPlayoffPicture() {
    let playoffPicture = simFunctions.determinePlayoffBracket(Teams.league, records);
    simFunctions.printPlayoffRankings(playoffPicture);
  }

  function logAllGames() {
    console.log(allGames);
  }

  function resetSeason() {
    allGames = [];
    records = new Map();
    week = 0;
  }

  function updateStandings() {
    const standingsData = [];
    const league = Teams.league;

    for (const conferenceName in league) {
      const conferenceStandings = { conferenceName, divisions: [] };
      for (const divisionName in league[conferenceName]) {
        const division = league[conferenceName][divisionName];
        const divisionRecords = division.map(team => ({
          teamName: team.teamName,
          record: records.get(team) || { wins: 0, losses: 0 }, // Default record if not found
        }));

        // Sort by wins
        divisionRecords.sort((a, b) => b.record.wins - a.record.wins);

        conferenceStandings.divisions.push({ divisionName, teams: divisionRecords });
      }
      standingsData.push(conferenceStandings);
    }

    setStandings(standingsData); // Update standings state
  }

  return(
    <div id="simulate-wrapper">
       <h3>Simulate</h3>
       <div className="sim-buttons-wrapper">
         <button onClick={returnSeason}>Setup Season</button>
         <button onClick={returnSim}>Simulate Season</button>
         <button onClick={simWeek}>Simulate Week</button> 
         <button onClick={logAllGames}>Log Games</button>
         <button onClick={printStandings}>Print Standings</button>
         <button onClick={printPlayoffPicture}>Print Playoff Picture</button>
         <button onClick={resetSeason}>Reset Season</button>
        </div>
        <div className="standings-wrapper">
          {standings.length > 0 ? (
            standings.map(({ conferenceName, divisions }) => (
              <div key={conferenceName}>
                <h4>{conferenceName}</h4>
                {divisions.map(({ divisionName, teams }) => (
                  <div key={divisionName}>
                    <h5>{divisionName}</h5>
                    <ul>
                      {teams.map(({ teamName, record }) => (
                        <li key={teamName}>
                          {teamName}: {record.wins}-{record.losses}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No standings available. Simulate some games!</p>
          )}
          </div>
    </div>
  );
};

export default Simulate;
*/


import React, { useState, useEffect, useRef } from 'react';
import '../styles/simulate.css';
import * as simFunctions from '../simulation/Simulation';
import * as Teams from '../simulation/Teams';
import * as d3 from "d3";

function Simulate() {

  const [allGames, setAllGames] = useState([]);
  const [records, setRecords] = useState(new Map());
  const [week, setWeek] = useState(0);
  const [standings, setStandings] = useState(null);
  const [playoffRankings, setPlayoffRankings] = useState(null); // New state for playoff rankings

  function returnSeason() {
    const tempGames = simFunctions.initializeSeason();
    const balancedSeason = simFunctions.balanceSeason(tempGames);
    setAllGames(balancedSeason);
  }

  function simWeek() {
    const updatedRecords = simFunctions.simulateSingleWeek(allGames, week, records);
    setRecords(new Map(updatedRecords));
    setWeek(week + 1);
  }

  function printStandings() {
    const standingsJSX = simFunctions.printDivisionStandings(Teams.league, records);
    setStandings(standingsJSX);
  }

  function printPlayoffPicture() {
    const playoffPicture = simFunctions.determinePlayoffBracket(Teams.league, records);
    const playoffRankingsJSX = simFunctions.printPlayoffRankings(playoffPicture);
    setPlayoffRankings(playoffRankingsJSX);
  }

  function logAllGames() {
    console.log(allGames);
  }

  useEffect(() => {
    if (records.size > 0) {
      const standingsJSX = simFunctions.printDivisionStandings(Teams.league, records);
      setStandings(standingsJSX);
    }
  }, [records]);

  useEffect(() => {
    if (allGames.length > 0) {
      const playoffPicture = simFunctions.determinePlayoffBracket(Teams.league, records);
      const playoffRankingsJSX = simFunctions.printPlayoffRankings(playoffPicture);
      setPlayoffRankings(playoffRankingsJSX);
    }
  }, [allGames, records]); // Run whenever `allGames` or `records` change

  return (
    <div id="simulate-wrapper">
      <h3>Simulate</h3>
      <div className="sim-buttons-wrapper">
        <button onClick={returnSeason}>Setup Season</button>
        <button onClick={simWeek}>Simulate Week</button>
        <button onClick={logAllGames}>Log Games</button>
        <button onClick={printStandings}>Print Standings</button>
        <button onClick={printPlayoffPicture}>Print Playoff Picture</button>
      </div>
      <div className="results">
        <h4>Division Standings:</h4>
        {standings || <p>No standings available. Simulate to view results.</p>}
      </div>
      <div className="results">
        <h4>Playoff Rankings:</h4>
        {playoffRankings || <p>No playoff rankings available. Simulate the season to view playoff results.</p>}
      </div>
    </div>
  );
}

export default Simulate;
