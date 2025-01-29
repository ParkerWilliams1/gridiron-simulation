import React, { useState } from 'react';
import PlayoffMatch from './playoffs/playoffMatch';
import '../styles/playoffMatch.css';

const BracketComponent = ({ teams }) => {
  // First round matchups
  const round1Matches = [
    { team1: teams[3], team2: teams[4] },
    { team1: teams[2], team2: teams[5] },
  ];

  // Second round matchups (winners of the first round)
  const round2Matches = [
    { team1: round1Matches[0].team1, team2: teams[0] },
    { team1: round1Matches[1].team1, team2: teams[1] },
  ];

  // Final matchup (winners of the second round)
  const finalMatch = { team1: round2Matches[0].team1, team2: round2Matches[1].team1 };

  return (
    <div className="bracket-container">
      <div className="round round-1">
        {round1Matches.map((match, index) => (
          <PlayoffMatch key={`round1-match-${index}`} team1={match.team1} team2={match.team2} />
        ))}
      </div>

      <div className="round round-2">
        {round2Matches.map((match, index) => (
          <PlayoffMatch key={`round2-match-${index}`} team1={match.team1} team2={match.team2} />
        ))}
      </div>

      <div className="round final">
        <PlayoffMatch key="final-match" team1={finalMatch.team1} team2={finalMatch.team2} />
      </div>
    </div>
  );
};

export default BracketComponent;
