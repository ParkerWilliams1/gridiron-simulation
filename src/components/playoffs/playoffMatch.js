import React from "react";
import '../../styles/playoffMatch.css';

const PlayoffMatch = ({ team1, team2 }) => (
  <div
    className="playoff-match-element-wrapper"
    style={{
      "--team1-color": team1.primaryColor,
      "--team2-color": team2.primaryColor,
    }}
  >
    <div className="playoff-team-container">
      <div className="team-details">
        <span className="team-name">{team1.teamName}</span>
        <span className="record">{team1.record.wins}-{team1.record.losses}</span>
      </div>
    </div>
    <div className="playoff-team-container">
      <div className="team-details">
        <span className="team-name">{team2.teamName}</span>
        <span className="record">{team2.record.wins}-{team2.record.losses}</span>
      </div>
    </div>
  </div>
);

export default PlayoffMatch;
