import { league } from './Teams.js';
import React from 'react';

export const allGames = [];
export const maxGamesPerTeam = 31;
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
  const team1WinProbability = team1.teamRating / totalRating; // Normalize ratings to probabilities
  const randomValue = Math.random(); // Generate a random number between 0 and 1

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

    // Append weekly games to the season schedule
    season.push(weeklyGames);
  }

  season = shuffleArray(season);

  return season;
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

        // Add the division winner to the list
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
          Rank {index + 1}: {team.teamLocation} {team.teamName} - {team.record.wins}-{team.record.losses}
        </p>
      );
    });
  }

  return <div>{playoffRankingsJSX}</div>; // Return the JSX structure
}

export function printDivisionStandings(league) {
  let standingsJSX = [];

  // Loop through each conference in the league
  for (const conferenceName in league) {
    let conferenceContent = [];

    conferenceContent.push(
      <h3 key={`conference-${conferenceName}`}>Division Standings for Conference: {conferenceName}</h3>
    );

    // Loop through each division in the conference
    for (const divisionName in league[conferenceName]) {
      const division = league[conferenceName][divisionName];

      // Ensure division is an array (if it's an object, convert it)
      const teamsArray = Array.isArray(division) ? division : Object.values(division);
      // Sort the teams in the division by wins (descending)
      const sortedTeams = teamsArray.sort((a, b) => b.record.wins - a.record.wins);

      // Create a section for the division standings
      conferenceContent.push(
        <h4 key={`division-${conferenceName}-${divisionName}`}>Division: {divisionName}</h4>
      );

      // Loop through sorted teams and display standings
      sortedTeams.forEach(team => {
        conferenceContent.push(
          <p key={`team-${conferenceName}-${divisionName}-${team.teamName}`}>
            {team.teamName}: {team.record.wins}-{team.record.losses}
          </p>
        );
      });
    }

    standingsJSX.push(
      <div className="conference-wrapper" key={`conference-wrapper-${conferenceName}`}>
        {conferenceContent}
      </div>
    );
  }

  return <div className="results-wrapper">{standingsJSX}</div>;
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
    console.log(`#3 ${conferenceTeams[2]._teamName} vs. #6 ${conferenceTeams[5]._teamName}`);
    const lowerSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[2],
      conferenceTeams[5]
    );
    const lowerSeed = lowerSeedMatch.winner === conferenceTeams[2] ? 3 : 6;
    console.log(`Winner: #${lowerSeed} ${lowerSeedMatch.winner._teamName}`);
    console.log(`Final Score:`, lowerSeedMatch.finalScore, "\n");

    console.log(`#4 ${conferenceTeams[3]._teamName} vs. #5 ${conferenceTeams[4]._teamName}`);
    const higherSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[3],
      conferenceTeams[4]
    );
    const higherSeed = higherSeedMatch.winner === conferenceTeams[3] ? 4 : 5;
    console.log(`Winner: #${higherSeed} ${higherSeedMatch.winner._teamName}`);
    console.log(`Final Score:`, higherSeedMatch.finalScore, "\n");

    // Second Round (Top seeds vs. First Round winners)
    console.log(`#1 ${conferenceTeams[0]._teamName} vs. #${higherSeed} ${higherSeedMatch.winner._teamName}`);
    const firstSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[0],
      higherSeedMatch.winner
    );
    const firstSeedFinalSeed = firstSeedMatch.winner === conferenceTeams[0] ? 1 : higherSeed;
    console.log(`Winner: #${firstSeedFinalSeed} ${firstSeedMatch.winner._teamName}`);
    console.log(`Final Score:`, firstSeedMatch.finalScore, "\n");

    console.log(`#2 ${conferenceTeams[1]._teamName} vs. #${lowerSeed} ${lowerSeedMatch.winner._teamName}`);
    const secondSeedMatch = getRandomWinnerWithScore(
      conferenceTeams[1],
      lowerSeedMatch.winner
    );
    const secondSeedFinalSeed = secondSeedMatch.winner === conferenceTeams[1] ? 2 : lowerSeed;
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

