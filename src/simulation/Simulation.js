import { Team, saints, giants, indies, knights,heat, devils, red_sharks, tornadoes, cavs, rebels, natives, soul,islanders, grizzlies, dynamite, aggies, gladiators, arrows, spartins, flames,mustangs, falcons, coasters, mountaineers, squids, braves, gold, colonials,stars, ducks, quakes, slisers, league } from './Teams.js';
import React from 'react';

export const allGames = [];
export const maxGamesPerTeam = 15;
export const gamesPlayed = new Map();


export function simulateSingleWeek(schedule, week, records) {
  let games = schedule[week];
  // Initialize records for all teams
  for (let i = 0; i < games.length; i++) {
    const homeTeam = games[i][0];
    const awayTeam = games[i][1];

    if (!records.has(homeTeam)) {
      records.set(homeTeam, { wins: 0, losses: 0 });
    }
    if (!records.has(awayTeam)) {
      records.set(awayTeam, { wins: 0, losses: 0 });
    }
  }

  // Simulate each game
  for (let i = 0; i < games.length; i++) {
    const homeTeam = games[i][0];
    const awayTeam = games[i][1];
    const winner = getRandomWinner(homeTeam, awayTeam);
    const loser = winner === homeTeam ? awayTeam : homeTeam;

    // console.log(`${winner.teamName} has beaten ${loser.teamName} ${winner === homeTeam ? "at home" : "on the road"}`);

    // Update records
    const winnerRecord = records.get(winner);
    const loserRecord = records.get(loser);

    winnerRecord.wins++;
    loserRecord.losses++;
  }

  return records;
}

export function getRandomWinner(team1, team2) {
  const totalRating = team1.teamRating + team2.teamRating;
  const team1WinProbability = team1.teamRating / totalRating; // Normalize ratings to probabilities
  const randomValue = Math.random(); // Generate a random number between 0 and 1

  return randomValue < team1WinProbability ? team1 : team2;
}

export function createDivisionalGames(division) {
  const divisionGames = [];
  
  for (let i = 0; i < division.length; i++) {
    for (let j = i + 1; j < division.length; j++) {
      // Each pair of teams plays twice (home-and-away)
      divisionGames.push([division[i], division[j]]); // Game 1: Team i vs Team j
      divisionGames.push([division[j], division[i]]); // Game 2: Team j vs Team i
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
 
  for (let i = 0; i < 15; i++) {
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

    // Append weekly games to the season schedule
    season.push(weeklyGames);
  }

  season = shuffleArray(season);

  return season;
}


export function simulateGames(games) {
  const records = new Map(); 

  // Initialize records for all teams
  for (let i = 0; i < games.length; i++) {
    const homeTeam = games[i][0];
    const awayTeam = games[i][1];

    if (!records.has(homeTeam)) {
      records.set(homeTeam, { wins: 0, losses: 0 });
    }
    if (!records.has(awayTeam)) {
      records.set(awayTeam, { wins: 0, losses: 0 });
    }
  }

  // Simulate each game
  for (let i = 0; i < games.length; i++) {
    const homeTeam = games[i][0];
    const awayTeam = games[i][1];
    const winner = getRandomWinner(homeTeam, awayTeam);
    const loser = winner === homeTeam ? awayTeam : homeTeam;

   //  console.log(`${winner.teamName} has beaten ${loser.teamName} ${winner === homeTeam ? "at home" : "on the road"}`);

    // Update records
    const winnerRecord = records.get(winner);
    const loserRecord = records.get(loser);

    winnerRecord.wins++;
    loserRecord.losses++;
  }

  return records;
}

export function determinePlayoffBracket(league, recap) {
  const playoffBracket = { Beast: [], Strong: [] };

  // Loop through each conference in the league
  for (const conferenceName in league) {
    const conference = league[conferenceName];
    const divisionWinners = [];
    const remainingTeams = [];

    // Loop through each division in the conference
    for (const division in conference) {
      const divisionTeams = conference[division];

      // Get the team records from the recap map
      const divisionRecords = new Map();
      divisionTeams.forEach(team => {
        const teamRecord = recap.get(team);
        if (teamRecord) {
          divisionRecords.set(team, teamRecord);
        }
      });

      // Ensure divisionRecords is not empty before reducing
      if (divisionRecords.size > 0) {
        // Find the division winner based on the most wins
        const divisionWinner = [...divisionRecords.entries()].reduce((bestTeam, currentTeam) => {
          return currentTeam[1].wins > bestTeam[1].wins ? currentTeam : bestTeam;
        });

        // Add the division winner to the divisionWinners list
        divisionWinners.push({
          teamObject: divisionWinner[0], // Store the actual team object
          record: divisionWinner[1],
        });

        // Add the remaining teams for wildcard consideration
        divisionRecords.forEach((record, teamObject) => {
          if (teamObject !== divisionWinner[0]) {
            remainingTeams.push({ teamObject, record });
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

export function printDivisionStandings(league, records) {
  let standingsJSX = [];

  // Loop through each conference in the league
  for (const conferenceName in league) {
    standingsJSX.push(<h3 key={`conference-${conferenceName}`}>Division Standings for Conference: {conferenceName}</h3>);

    // Loop through each division in the conference
    for (const divisionName in league[conferenceName]) {
      const division = league[conferenceName][divisionName];
      const divisionRecords = division.map(team => {
        return {
          teamName: team.teamName,
          record: records.get(team),
        };
      });

      // Sort the teams by wins (descending)
      divisionRecords.sort((a, b) => b.record.wins - a.record.wins);

      // Create a section for the division standings
      standingsJSX.push(
        <h4 key={`division-${conferenceName}-${divisionName}`}>Division: {divisionName}</h4>
      );

      divisionRecords.forEach(({ teamName, record }) => {
        standingsJSX.push(
          <p key={`team-${conferenceName}-${divisionName}-${teamName}`}>
            {teamName}: {record.wins}-{record.losses}
          </p>
        );
      });
    }
  }

  return <div>{standingsJSX}</div>;
}

// In simFunctions.js
export function printPlayoffRankings(playoffs) {
  let playoffRankingsJSX = [];

  // Loop through each conference in the playoffs
  for (const conferenceName in playoffs) {
    playoffRankingsJSX.push(
      <h3 key={`conference-${conferenceName}`}>Playoff Rankings for Conference: {conferenceName}</h3>
    );

    // Get the teams in the playoff bracket for the conference
    const teams = playoffs[conferenceName];

    // Add the rankings for each team in the conference
    teams.forEach((team, index) => {
      playoffRankingsJSX.push(
        <p key={`team-${conferenceName}-${index}`}>
          Rank {index + 1}: {team.teamObject._teamLocation} {team.teamObject._teamName} - {team.record.wins}-{team.record.losses}
        </p>
      );
    });
  }

  return <div>{playoffRankingsJSX}</div>; // Return the JSX structure
}


export function getRandomWinnerWithScore(team1, team2) {
  const totalRating = team1.teamRating + team2.teamRating;
  const team1WinProbability = team1.teamRating / totalRating; // Normalize ratings to probabilities
  const randomValue = Math.random(); // Generate a random number between 0 and 1

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
      [winner._teamName]: winnerScore,
      [loser._teamName]: loserScore,
    },
  };
}

// Simulate Score of Game
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


export function simulatePlayoffMatches(playoffs) {
  // Helper function to simulate a conference playoff with scores
  function simulateConferencePlayoff(conferenceName, conferenceTeams) {
    console.log(`\n=== ${conferenceName} Conference Playoffs ===\n`);

    // First Round
    console.log(`#3 ${conferenceTeams[2].teamObject._teamName} vs. #6 ${conferenceTeams[5].teamObject._teamName}`);
    const lowerSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[2].teamObject,
      conferenceTeams[5].teamObject
    );
    const lowerSeed = lowerSeedMatch.winner === conferenceTeams[2].teamObject ? 3 : 6;
    console.log(`Winner: #${lowerSeed} ${lowerSeedMatch.winner._teamName}`);
    console.log(`Final Score:`, lowerSeedMatch.finalScore, "\n");

    console.log(`#4 ${conferenceTeams[3].teamObject._teamName} vs. #5 ${conferenceTeams[4].teamObject._teamName}`);
    const higherSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[3].teamObject,
      conferenceTeams[4].teamObject
    );
    const higherSeed = higherSeedMatch.winner === conferenceTeams[3].teamObject ? 4 : 5;
    console.log(`Winner: #${higherSeed} ${higherSeedMatch.winner._teamName}`);
    console.log(`Final Score:`, higherSeedMatch.finalScore, "\n");

    // Second Round (Top seeds vs. First Round winners)
    console.log(`#1 ${conferenceTeams[0].teamObject._teamName} vs. #${higherSeed} ${higherSeedMatch.winner._teamName}`);
    const firstSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[0].teamObject,
      higherSeedMatch.winner
    );
    const firstSeedFinalSeed = firstSeedMatch.winner === conferenceTeams[0].teamObject ? 1 : higherSeed;
    console.log(`Winner: #${firstSeedFinalSeed} ${firstSeedMatch.winner._teamName}`);
    console.log(`Final Score:`, firstSeedMatch.finalScore, "\n");

    console.log(`#2 ${conferenceTeams[1].teamObject._teamName} vs. #${lowerSeed} ${lowerSeedMatch.winner._teamName}`);
    const secondSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[1].teamObject,
      lowerSeedMatch.winner
    );
    const secondSeedFinalSeed = secondSeedMatch.winner === conferenceTeams[1].teamObject ? 2 : lowerSeed;
    console.log(`Winner: #${secondSeedFinalSeed} ${secondSeedMatch.winner._teamName}`);
    console.log(`Final Score:`, secondSeedMatch.finalScore, "\n");

    // Conference Final
    console.log(`\n=== ${conferenceName} Conference Final ===`);
    console.log(
      `#${firstSeedFinalSeed} ${firstSeedMatch.winner._teamName} vs. #${secondSeedFinalSeed} ${secondSeedMatch.winner._teamName}`
    );
    const conferenceFinalMatch = getRandomWinnerWithScore(
      firstSeedMatch.winner,
      secondSeedMatch.winner
    );
    const conferenceChampionSeed =
      conferenceFinalMatch.winner === firstSeedMatch.winner ? firstSeedFinalSeed : secondSeedFinalSeed;
    console.log(`Winner: #${conferenceChampionSeed} ${conferenceFinalMatch.winner._teamName}`);
    console.log(`Final Score:`, conferenceFinalMatch.finalScore, "\n");

    return { team: conferenceFinalMatch.winner, seed: conferenceChampionSeed };
  }

  // Simulate playoffs for both conferences
  const beastChampion = simulateConferencePlayoff("Beast", playoffs.Beast);
  const strongChampion = simulateConferencePlayoff("Strong", playoffs.Strong);

  // League Championship
  console.log("\n=== League Championship ===");
  console.log(
    `#${beastChampion.seed} ${beastChampion.team._teamName} vs. #${strongChampion.seed} ${strongChampion.team._teamName}`
  );
  const leagueFinalMatch = getRandomWinnerWithScore(beastChampion.team, strongChampion.team);
  console.log(`Winner: ${leagueFinalMatch.winner._teamName}`);
  console.log(`Final Score:`, leagueFinalMatch.finalScore, "\n");
}

export function main() {
  initializeSeason();
  let seasonRecap = simulateGames(allGames);
  printDivisionStandings(league, seasonRecap);
  let playoffs = determinePlayoffBracket(league, seasonRecap);
  printPlayoffRankings(playoffs, "\n");
  simulatePlayoffMatches(playoffs);
}

export function runSzn(seasonRecap) {
  printDivisionStandings(league, seasonRecap);
  let playoffs = determinePlayoffBracket(league, seasonRecap);
  printPlayoffRankings(playoffs, "\n");
  simulatePlayoffMatches(playoffs);
}
