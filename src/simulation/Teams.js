export default class Team {
  constructor(teamId, teamLocation, teamName, primaryColor, secondaryColor, teamRating, record) {
    this._teamId = teamId; 
    this._teamLocation = teamLocation;
    this._teamName = teamName;
    this._primaryColor = primaryColor;
    this._secondaryColor = secondaryColor;
    this._teamRating = teamRating;
    this._record = { wins: 0, losses: 0 };
  }

  // team getter functions
  get teamId() { return this._teamId; }
  get teamLocation() { return this._teamLocation; }
  get teamName() { return this._teamName; }
  get primaryColor() { return this._primaryColor; }
  get secondaryColor() { return this._secondaryColor; }
  get teamRating() { return this._teamRating; }
  get record() { return this._record; }

  // team setter functions
  set record(value) { this._record = value }
}

// Beast: North Division:
export const saints = new Team(1, "St. Louis", "Saints", "#0b0757", "#857310", 75);
export const giants = new Team(2, "Detroit", "Giants", "#1630a1", "#9fa9d4", 80);
export const indies = new Team(3, "Indianapolis", "Indies", "#1f1f1f", "secondaryColor", 55);
export const knights = new Team(4, "Pittsburgh", "Knights", "#1f1f1f", "secondaryColor", 92);

// Beast: South Division:
export const heat = new Team(5, "Arizona", "Heat", "#1f1f1f", "secondaryColor", 45);
export const devils = new Team(6, "Tampa Bay", "Sun Devils", "#590414", "secondaryColor", 60);
export const red_sharks = new Team(7, "Miami", "Red Sharks", "#e0260d", "#ffffff", 84);
export const tornadoes = new Team(8, "Tennessee", "Tornadoes", "#c9800a", "#949494", 88);

// Beast: East Division:
export const cavs = new Team(9, "Cleveland", "Cavs", "#ba2e1c", "secondaryColor", 77);
export const rebels = new Team(10, "Boston", "Rebels", "#9e0606", "#8f7501", 78);
export const natives = new Team(11, "Nashville", "Natives", "#60009c", "#000000", 85);
export const soul = new Team(12, "Philadelphia", "Soul", "#1f1f1f", "secondaryColor", 72);

// Beast: West Division:
export const islanders = new Team(13, "Hawaii", "Islanders", "#06942c", "#0974ad", 84);
export const grizzlies = new Team(14, "Sacramento", "Grizzlies", "#573209", "#918e8c", 73);
export const dynamite = new Team(15, "Denver", "Dynamite", "#c90000", "#e3b419", 63);
export const aggies = new Team(16, "Kansas", "Aggies", "#5c0b04", "#c2bebe", 93);

// Strong: North Division:
export const gladiators = new Team(17, "Green Bay", "Gladiators", "#0d3b01", "#31382f", 84);
export const arrows = new Team(18, "Washington", "Arrows", "#cc0b04", "#000000", 88);
export const spartins = new Team(19, "Cincinnati", "Spartins", "#c90a0a", "#ffffff", 80);
export const flames = new Team(20, "Chicago", "Flames", "#bf460d", "#ffee00", 66);

// Strong: South Division:
export const mustangs = new Team(21, "Texas", "Mustangs", "#2923a6", "#450301", 94);
export const falcons = new Team(22, "Florida", "Falcons", "#0c8c00", "#f8fff7", 83);
export const coasters = new Team(23, "Orlando", "Coasters", "#066347", "#050505", 76);
export const mountaineers = new Team(24, "Colorado", "Mountaineers", "#1f1f1f", "secondaryColor", 69);

// Strong: East Division:
export const squids = new Team(25, "New Jersey", "Squids", "#8f1010", "#030303", 80);
export const braves = new Team(26, "Brooklyn", "Braves", "#1f1f1f", "secondaryColor", 72);
export const gold = new Team(27, "New York", "Gold", "#b89a07", "#27308a", 82);
export const colonials = new Team(28, "Charlotte", "Colonials", "#0013bf", "#bf0d00", 83);

// Strong: West Division:
export const stars = new Team(29, "Los Angeles", "Stars", "#04b4c4", "121212", 30);
export const ducks = new Team(30, "San Diego", "Ducks", "#e87909", "#085c8c", 125);
export const quakes = new Team(31, "San Francisco", "Quakes", "#1a1b47", "#bfbf62", 30);
export const slisers = new Team(32, "San Jose", "Slisers", "#483fa1", "#49069c", 30);

export const teams_list = [saints, giants, indies, knights, 
  heat, devils, red_sharks, tornadoes, 
  cavs, rebels, natives, soul, 
  islanders, grizzlies, dynamite, aggies, 
  gladiators, arrows, spartins, flames, 
  mustangs, falcons, coasters, mountaineers, 
  squids, braves, gold, colonials, 
  stars, ducks, quakes, slisers];

export const league = {
  Beast: {
    North: [saints, giants, indies, knights],
    South: [heat, devils, red_sharks, tornadoes],
    East: [cavs, rebels, natives, soul],
    West: [islanders, grizzlies, dynamite, aggies]
  },
  Strong: {
    North: [gladiators, arrows, spartins, flames],
    South: [mustangs, falcons, coasters, mountaineers],
    East: [squids, braves, gold, colonials],
    West: [stars, ducks, quakes, slisers]
  }
};
