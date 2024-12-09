import React from 'react';
import { Bracket, RoundProps, RenderSeedProps, Seed, SeedItem, SeedTeam } from 'react-brackets';

// Bracket Component
const BracketComponent = ({ teams }) => {
  // Create the rounds dynamically based on the teams list
  const rounds: RoundProps[] = [
    {
      title: 'Round 1',
      seeds: [
        {
          nextMatchId: 3,
          id: 1,
          teams: [
            { name: `#3 ${teams[2]._teamName}`, customStyle: { backgroundColor: teams[0]._primaryColor } }, // 3 vs 6
            { name: `#6 ${teams[5]._teamName}`, customStyle: { backgroundColor: teams[5]._primaryColor } } 
          ]
        },
        {
          id: 2,
          teams: [
            { name: `#2 ${teams[1]._teamName}`, customStyle: { backgroundColor: '#ffcc00' } }, // 4 vs 5
            { name: "(1st Round Bye)"}
          ]
        },
        {
          id: 3,
          teams: [
            { name: teams[3]._teamName, customStyle: { backgroundColor: '#ffcc00' } }, // 4 vs 5
            { name: teams[4]._teamName, customStyle: { backgroundColor: '#ff6666' } }
          ]
         },
        {
          id: 4,
          teams: [
            { name: teams[0]._teamName, customStyle: { backgroundColor: '#ffcc00' } }, // 4 vs 5
            { name: "(1st Round Bye)"}
          ]
        }
      ]
    },
    {
      title: 'Semifinals',
      seeds: [
        {
          id: 5,
          teams: [
            { name: teams[1]._teamName, customStyle: { backgroundColor: '#99ff99' } },
            { name: 'Winner of (3 vs 6)', customStyle: { backgroundColor: '#ff3333' } }
          ]
        },
        {
          id: 6,
          teams: [
            { name: 'Winner of (4 vs 5)', customStyle: { backgroundColor: '#ff00ff' } },
            { name: teams[0]._teamName, customStyle: { backgroundColor: '#00ff00' } } // This could be a bye round team
          ]
        }
      ]
    },
    {
      title: 'Finals',
      seeds: [
        {
          id: 7,
          teams: [
            { name: 'Winner of Semifinal 1', customStyle: { backgroundColor: '#3333ff' } },
            { name: 'Winner of Semifinal 2', customStyle: { backgroundColor: '#ff33cc' } }
          ]
        }
      ]
    }
  ];

  return (
    <div>
      <h2>6-Team Playoff Bracket</h2>
      <Bracket
        rounds={rounds}
        mobileBreakpoint={600} // Set a breakpoint for mobile
      />
    </div>
  );
};

export default BracketComponent;
