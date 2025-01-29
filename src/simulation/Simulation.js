import { Team, league } from './Teams.js';
import React from 'react';

export const allGames = [];
export const maxGamesPerTeam = 15;
export const gamesPlayed = new Map();

export function simulateSingleWeek(schedule, week) {
  if (week == -1) return;

  let games = schedule[week];

  // Simulate each game
  for (let i = 0; i < games.length; i++) {
    const homeTeam = games[i][0];
    const awayTeam = games[i][1];
    const winner = getRandomWinner(homeTeam, awayTeam);
    const loser = winner === homeTeam ? awayTeam : homeTeam;

    // console.log(`${winner.teamName} has beaten ${loser.teamName} ${winner === homeTeam ? "at home" : "on the road"}`);

    // Update records
    const winnerRecord = winner.record;
    const loserRecord = loser.record;

    winnerRecord.wins++;
    loserRecord.losses++;
  
    winner.record = winnerRecord;
    loser.record = loserRecord;
  }
}

export function getRandomWinner(team1, team2) {
  const totalRating = team1.teamRating + team2.teamRating;
  const team1WinProbability = team1.teamRating / totalRating;
  const randomValue = Math.random();

  return randomValue < team1WinProbability ? team1 : team2;
}

export function createDivisionalGames(division) {
  const divisionGames = [];
  
  for (let i = 0; i < division.length; i++) {
    for (let j = i + 1; j < division.length; j++) {
      // Each pair of teams plays twice (home-and-away)
      divisionGames.push([division[i], division[j]]);
      divisionGames.push([division[j], division[i]]);
    }
  }

  return divisionGames;
}

export function createInterConferenceGames(conference1, conference2) {
  const interConferenceGames = [];
  for (let i = 0; i < conference1.length; i++) {
    for (let j = 0; j < conference2.length; j++) {
      if (gamesPlayed.get(conference1[i]) < maxGamesPerTeam && gamesPlayed.get(conference2[j]) < maxGamesPerTeam) {
        interConferenceGames.push([conference1[i], conference2[j]]);
        gamesPlayed.set(conference1[i], gamesPlayed.get(conference1[i]) + 1);
        gamesPlayed.set(conference2[j], gamesPlayed.get(conference2[j]) + 1);
      }
    }
  }
  return interConferenceGames;
}

export function initializeSeason() {
  // Initialize gamesPlayed map with each team set to 0 games played
  Object.keys(league).forEach(leagueName => {
    Object.values(league[leagueName]).forEach(division => {
      division.forEach(team => {
        gamesPlayed.set(team, 0);
      });
    });
  });

  // Adding all divisional games
  for (const leagueName in league) {
    for (const divisionName in league[leagueName]) {
      const division = league[leagueName][divisionName];
      allGames.push(...createDivisionalGames(division));
    }
  }

  // Adding intra-conference games (same conference, different division)
  const conferences = Object.values(league);
  conferences.forEach(conference => {
    const conferenceDivisions = Object.values(conference);
    for (let i = 0; i < conferenceDivisions.length; i++) {
      for (let j = i + 1; j < conferenceDivisions.length; j++) {
        const games = createInterConferenceGames(conferenceDivisions[i], conferenceDivisions[j]);
        allGames.push(...games);
      }
    }
  });

  // Adding inter-conference games (different conferences)
  const conferenceNames = Object.keys(league);
  for (let i = 0; i < conferenceNames.length; i++) {
    for (let j = i + 1; j < conferenceNames.length; j++) {
      const conference1 = league[conferenceNames[i]];
      const conference2 = league[conferenceNames[j]];
      for (const division1 in conference1) {
        for (const division2 in conference2) {
          const games = createInterConferenceGames(conference1[division1], conference2[division2]);
          allGames.push(...games);
        }
      }
    }
  }

  return allGames;
}

export function balanceSeason(allGames) {
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  let season = [];
 
  for (let i = 0; i < maxGamesPerTeam; i++) {
    const weeklyGames = [];
    const weeklyMap = new Map(); 
    let itr = 0;

    while (weeklyGames.length < 16) {
      if (itr >= allGames.length) {
        throw new Error("Not enough games to complete the schedule");
      }

      const [team1, team2] = allGames[itr];
      
      if (!weeklyMap.has(team1) && !weeklyMap.has(team2)) {
        weeklyGames.push(allGames[itr]);
        weeklyMap.set(team1);
        weeklyMap.set(team2);
        allGames.splice(itr, 1);
      } else {
        itr++;
      }
    }

    season.push(weeklyGames);
  }

  return shuffleArray(season);
}

export function determinePlayoffBracket(league) {
  const playoffBracket = { Beast: [], Strong: [] };

  // Loop through each conference in the league
  for (const conferenceName in league) {
    const conference = league[conferenceName];
    const divisionWinners = [];
    const remainingTeams = [];

    // Loop through each division in the conference
    for (const division in conference) {
      const divisionTeams = conference[division];

      // Find the division winner
      if (divisionTeams.length > 0) {
        const divisionWinner = divisionTeams.reduce((bestTeam, currentTeam) => {
          return currentTeam.record.wins > bestTeam.record.wins ? currentTeam : bestTeam;
        });

        divisionWinners.push(divisionWinner);

        // Add the remaining teams to the wildcard pool
        divisionTeams.forEach(team => {
          if (team !== divisionWinner) {
            remainingTeams.push(team);
          }
        });
      }
    }

    // Sort division winners and remaining teams by wins
    divisionWinners.sort((a, b) => b.record.wins - a.record.wins);
    remainingTeams.sort((a, b) => b.record.wins - a.record.wins);

    // Select the top two teams (wildcards) that didn't win their division
    const wildcards = remainingTeams.slice(0, 2);

    // Combine division winners and wildcards
    playoffBracket[conferenceName] = [...divisionWinners, ...wildcards];
  }

  return playoffBracket;
}

function findTeamDivision(teamName, conferenceName) {
  const divisions = league[conferenceName.conferenceName];
  
  for (const [divisionName, teams] of Object.entries(divisions)) {
    if (teams.includes(teamName)) {
      return divisionName;
    }
  }
  return null;  
}

export function printPlayoffRankings(playoffs) {
  let playoffRankingsJSX = [];

  // Loop through each conference in the playoffs
  for (const conferenceName in playoffs) {
    let conferencejsx = [];
    conferencejsx.push(
      <h3 className="playoff-conference-name" key={`conference-${conferenceName}`}>{conferenceName}</h3>
    );

    // Get the teams in the playoff bracket for the conference
    const teams = playoffs[conferenceName];

    // Add the rankings for each team in the conference
    teams.forEach((team, index) => {
     let teamDivision = findTeamDivision(team, {conferenceName});

      conferencejsx.push(
        <div className="playoff-team-element" 
        style={{
          backgroundColor: team.primaryColor
          }}>
          <p className="playoff-team-rank">{index + 1}</p>
          <p className="playoff-team-name" key={`team-${conferenceName}-${index}`}>{team.teamLocation} {team.teamName}</p>
          <div className="playoff-team-record-info">
            <p className="playoff-team-record">{team.record.wins}-{team.record.losses}</p>
            <p className="playoff-team-division">{conferenceName} {teamDivision}</p>
          </div>
        </div>
      );
    });

    playoffRankingsJSX.push(<div className="playoff-conference-wrapper">{conferencejsx}</div>);
  }

  return <div className="playoff-wrap">{playoffRankingsJSX}</div>;
}

export function printDivisionStandings(league) {
  let standingsJSX = [];

  // Loop through each conference in the league
  for (const conferenceName in league) {
    let conferenceContent = [];

    /*conferenceContent.push(
      <h1 className="division-conference-title" key={`conference-${conferenceName}`}>Division Standings for Conference: {conferenceName}</h1>
    );*/
    
    // Loop through each division in the conference
    for (const divisionName in league[conferenceName]) {
      const division = league[conferenceName][divisionName];
      let divisionContent = [];

      // Ensure division is an array (if it's an object, convert it)
      const teamsArray = Array.isArray(division) ? division : Object.values(division);
      // Sort the teams in the division by wins (descending)
      const sortedTeams = teamsArray.sort((a, b) => b.record.wins - a.record.wins);

      // Create a section for the division standings
      divisionContent.push(
        <h4 key={`division-${conferenceName}-${divisionName}`}>Division: {divisionName}</h4>
      );

      sortedTeams.forEach(team => {
        divisionContent.push(
          <div className="division-team-element" 
          style={{
            backgroundColor: team.primaryColor
            }}>
            <p className="division-team-name">{team.teamLocation} {team.teamName}</p>
            <p className="division-team-record">{team.record.wins}-{team.record.losses}</p>
          </div>
        );
      });

      conferenceContent.push(<div className="standings-division-wrapper">{divisionContent}</div>);
   }


    standingsJSX.push(
      <div className="conference-standings-wrapper" key={`conference-wrapper-${conferenceName}`}>
        {conferenceContent}
      </div>
    );
  }

  return <div>{standingsJSX}</div>;
}



export function getRandomWinnerWithScore(team1, team2) {
  const totalRating = team1.teamRating + team2.teamRating;
  const team1WinProbability = team1.teamRating / totalRating;
  const randomValue = Math.random();

  // Determine winner
  const winner = randomValue < team1WinProbability ? team1 : team2;
  const loser = winner === team1 ? team2 : team1;

  // Generate scores for both teams
  const winnerScore = simulateScore(winner.teamRating);
  const loserScore = simulateScore(loser.teamRating, winnerScore);

  // Return winner and score details
  return {
    winner,
    loser,
    finalScore: {
      winner: winnerScore,
      loser: loserScore,
    },
  };
}

export function simulateScore(teamRating, opponentScore = null, ensureWin = false) {
  const baseScore = Math.round((teamRating / 100) * 20);
  const variability = Math.floor(Math.random() * 20);
  let totalScore = baseScore + variability;

  const possibleScores = [0, 3, 6, 7, 10, 13, 14, 17, 20, 21, 24, 27, 28, 31, 35, 38, 42, 49, 56];

  if (opponentScore !== null) {
    if (ensureWin) {
      // Winner's score must always be greater than opponent's score
      totalScore = Math.max(opponentScore + 3, baseScore + variability);
    } else {
      // Loser's score must always be less than opponent's score
      totalScore = Math.min(opponentScore - 3, baseScore + variability);
    }
  }

  // Snap to closest football-specific score
  return possibleScores.reduce((prev, curr) => (Math.abs(curr - totalScore) < Math.abs(prev - totalScore) ? curr : prev));
}

export function simPlayoffMatches(playoffs) {
  let returnjsx = [];

  function simConferencePlayoff(conferenceName, conferenceTeams) {
    let jsx = [];
    jsx.push(<h2>=== {conferenceName} Conference Playoffs ===</h2>);

    // First Round Matches
    // #3 vs #6
    jsx.push(<h3>#3 {conferenceTeams[2]._teamName} vs. #6 {conferenceTeams[5]._teamName}</h3>);
    const lowerSeedMatch = getRandomWinnerWithScore(conferenceTeams[2], conferenceTeams[5]);
    const lowerSeed = lowerSeedMatch.winner === conferenceTeams[2] ? 3 : 6;

    jsx.push(<p>Winner: #{lowerSeed} {lowerSeedMatch.winner._teamName}</p>);
    jsx.push(<p>Final Score: {lowerSeedMatch.winner._teamName}: {lowerSeedMatch.finalScore.winner}, {lowerSeedMatch.loser._teamName}: {lowerSeedMatch.finalScore.loser}</p>);

    // #4 vs #5
    jsx.push(<h3>#4 {conferenceTeams[3]._teamName} vs. #5 {conferenceTeams[4]._teamName}</h3>);
    const higherSeedMatch = getRandomWinnerWithScore(conferenceTeams[3], conferenceTeams[4]);
    const higherSeed = higherSeedMatch.winner === conferenceTeams[3] ? 4 : 5;

    jsx.push(<p>Winner: #{higherSeed} {higherSeedMatch.winner._teamName}</p>);
    jsx.push(<p>Final Score: {higherSeedMatch.winner._teamName}: {higherSeedMatch.finalScore.winner}, {higherSeedMatch.loser._teamName}: {higherSeedMatch.finalScore.loser}</p>);

    // Second Round (Top seeds vs. First Round winners)
    jsx.push(<h3>#1 {conferenceTeams[0]._teamName} vs.#{higherSeed} {higherSeedMatch.winner._teamName}</h3>);
    const firstSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[0],
      higherSeedMatch.winner
    );
    const firstSeedFinalSeed = firstSeedMatch.winner === conferenceTeams[0] ? 1 : higherSeed;

    jsx.push(<p>Winner: #{firstSeedFinalSeed} {firstSeedMatch.winner._teamName}</p>);
    jsx.push(<p>Final Score: {firstSeedMatch.winner._teamName}: {firstSeedMatch.finalScore.winner}, {firstSeedMatch.loser._teamName}: {firstSeedMatch.finalScore.loser}</p>);


    jsx.push(<h3>#2 {conferenceTeams[1]._teamName} vs.#{lowerSeed} {lowerSeedMatch.winner._teamName}</h3>);
    const secondSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[1],
      lowerSeedMatch.winner
    );
    const secondSeedFinalSeed = secondSeedMatch.winner === conferenceTeams[1] ? 2 : lowerSeed;
    jsx.push(<p>Winner: #{secondSeedFinalSeed} {secondSeedMatch.winner._teamName}</p>);
    jsx.push(<p>Final Score: {secondSeedMatch.winner._teamName}: {secondSeedMatch.finalScore.winner}, {secondSeedMatch.loser._teamName}: {secondSeedMatch.finalScore.loser}</p>);

    // Conference Final Match
    jsx.push(<h3>=== {conferenceName} Conference Final ===</h3>);
    jsx.push(<h3>#{firstSeedFinalSeed} {firstSeedMatch.winner._teamName} vs.#{secondSeedFinalSeed} {secondSeedMatch.winner._teamName}</h3>);
    const conferenceFinalMatch = getRandomWinnerWithScore(
      firstSeedMatch.winner,
      secondSeedMatch.winner
    );
    const conferenceChampionSeed = conferenceFinalMatch.winner === firstSeedMatch.winner ? firstSeedFinalSeed : secondSeedFinalSeed;

    jsx.push(<p>Winner: #{conferenceChampionSeed} {conferenceFinalMatch.winner._teamName}</p>);
    jsx.push(<p>Final Score: {conferenceFinalMatch.winner._teamName}: {conferenceFinalMatch.finalScore.winner}, {conferenceFinalMatch.loser._teamName}: {conferenceFinalMatch.finalScore.loser}</p>);

    returnjsx.push(jsx);
    return { team: conferenceFinalMatch.winner, seed: conferenceChampionSeed };
  }

  // Simulate playoffs for both conferences
  const beastChampion = simConferencePlayoff("Beast", playoffs.Beast);
  const strongChampion = simConferencePlayoff("Strong", playoffs.Strong);
  
  // Simulate League Finals
  returnjsx.push(<h2>=== League Championship ===</h2>);
  returnjsx.push(<h3>#{beastChampion.seed} {beastChampion.team._teamName} vs. #{strongChampion.seed} {strongChampion.team._teamName}</h3>);

  const championshipMatch = getRandomWinnerWithScore(beastChampion.team, strongChampion.team);

  returnjsx.push(<p>Winner: {championshipMatch.winner._teamName}</p>);
  returnjsx.push(<p>Final Score: {championshipMatch.winner._teamName}: {championshipMatch.finalScore.winner}, {championshipMatch.loser._teamName}: {championshipMatch.finalScore.loser}</p>);

  return returnjsx;
}

// ***********************************************
//
//    Playoff Probability
//
// ***********************************************

export function getRemainingGames(allGames, currentWeek) {
  // Flatten the array from currentWeek onward
  const remainingGames = allGames
    .slice(currentWeek)
    .flat();

  return remainingGames;
}

export function calculatePlayoffProbabilities(allGames, currentWeek, league) {
  const remainingGames = getRemainingGames(allGames, currentWeek);
  let playoffAppearances = new Array(31).fill(0);

  for (let i = 0; i < 10; i++) {
    // Simulate the season using the cloned league
    let playoffOutcome = simulateEntireSeason(remainingGames, league);

    for (let conference in playoffOutcome) {
      for (let j = 0; j < 6; j++) {
        let currTeamId = playoffOutcome[conference][j].teamId;
        playoffAppearances[currTeamId] += 1;
      }
    }
  }

  return playoffAppearances;
}

export function simulateEntireSeason(games, league) {
  // Create a deep clone of the league to avoid mutating the original
  // TODO: Not properly cloning the league
  const clonedLeague = deepCloneLeague(league);

  for (let k = 0; k < games.length; k++) {
    const homeTeam = games[k][0];
    const awayTeam = games[k][1];
    const winner = getRandomWinner(homeTeam, awayTeam);
    const loser = winner === homeTeam ? awayTeam : homeTeam;

    // Ensure we are modifying the records on the cloned teams, not the originals
    const winnerRecord = winner.record;
    const loserRecord = loser.record;

    winnerRecord.wins++;
    loserRecord.losses++;

    // Since we are modifying the cloned teams' records, no need to assign back to winner.record and loser.record
  }

  // After the simulation, return the result of the playoff determination on the cloned league
  let playoffRes = determinePlayoffBracket(clonedLeague);
  console.log(playoffRes);

  return playoffRes;
}

function deepCloneLeague(league) {
  const clonedLeague = JSON.parse(JSON.stringify(league));

  console.log("Here is the league", clonedLeague);
  for (let conference in clonedLeague) {
    for (let division in conference) {
      console.log(conference, division);
      for (let team in division) {
        console.log(team);
      }
    }
  }

  return clonedLeague;
}
