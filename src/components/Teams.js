import * as TeamData from '../simulation/Teams';
import '../styles/teams.css';

function Home() {
  let teams = getAllTeamsNames();
  let league = TeamData.league;

  return (
    <div id="teams-home-wrapper">
     {Object.entries(league).map(([conference, divisions]) => (
        <div key={conference} className="teams-conference">
          <h2 className="teams-conference-title">{conference} Conference</h2>
          {Object.entries(divisions).map(([division, teams]) => (
            <div key={division} className="teams-division">
              <h3>{division} Division</h3>
              <ul>
                {teams.map((team, index) => (
                  <li className="teams-team-element" 
                  style={{ backgroundColor: team.primaryColor }}
                  key={index}>{team.teamLocation} {team.teamName}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getAllTeamsNames() {
  let teams = [
    TeamData.saints, TeamData.giants, TeamData.indies, TeamData.knights,
    TeamData.heat, TeamData.devils, TeamData.red_sharks, TeamData.tornadoes,
    TeamData.cavs, TeamData.rebels, TeamData.natives, TeamData.soul, 
    TeamData.islanders, TeamData.grizzlies, TeamData.dynamite, TeamData.aggies, 
    TeamData.gladiators, TeamData.arrows, TeamData.spartins, TeamData.flames, 
    TeamData.mustangs, TeamData.falcons, TeamData.coasters, TeamData.mountaineers, 
    TeamData.squids, TeamData.braves, TeamData.gold, TeamData.colonials, 
    TeamData.stars, TeamData.ducks, TeamData.quakes, TeamData.slisers
  ];

  return teams;
}

export default Home;
