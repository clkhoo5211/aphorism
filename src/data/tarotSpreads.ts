// Traditional Tarot Spread Configurations

export interface SpreadPosition {
  id: string;
  name: string;
  description: string;
  x: number; // Grid position X (0-100%)
  y: number; // Grid position Y (0-100%)
  rotation?: number; // Optional rotation in degrees
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: 'single',
    name: 'Single Card',
    description: 'Quick insight or daily guidance',
    cardCount: 1,
    positions: [
      { id: 'card1', name: 'Your Card', description: 'The answer to your question', x: 50, y: 50 }
    ]
  },
  {
    id: 'past-present-future',
    name: 'Past, Present, Future',
    description: 'See how your situation evolved and where it\'s heading',
    cardCount: 3,
    positions: [
      { id: 'past', name: 'Past', description: 'Influences from the past affecting current events', x: 25, y: 50 },
      { id: 'present', name: 'Present', description: 'Your current position and challenges', x: 50, y: 50 },
      { id: 'future', name: 'Future', description: 'Likely outcome based on current path', x: 75, y: 50 }
    ]
  },
  {
    id: 'mind-body-spirit',
    name: 'Mind, Body, Spirit',
    description: 'Explore your mental, physical, and spiritual states',
    cardCount: 3,
    positions: [
      { id: 'mind', name: 'Mind', description: 'Your mental state and thoughts', x: 25, y: 50 },
      { id: 'body', name: 'Body', description: 'Your physical health and energy', x: 50, y: 50 },
      { id: 'spirit', name: 'Spirit', description: 'Your spiritual connection and intuition', x: 75, y: 50 }
    ]
  },
  {
    id: 'situation-action-outcome',
    name: 'Situation, Action, Outcome',
    description: 'Understand your situation and the best path forward',
    cardCount: 3,
    positions: [
      { id: 'situation', name: 'Situation', description: 'The current state of affairs', x: 25, y: 50 },
      { id: 'action', name: 'Action', description: 'What you should do', x: 50, y: 50 },
      { id: 'outcome', name: 'Outcome', description: 'The likely result of taking action', x: 75, y: 50 }
    ]
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    description: 'Comprehensive 10-card reading for deep insight',
    cardCount: 10,
    positions: [
      { id: 'present', name: 'Present', description: 'Your current situation', x: 40, y: 50 },
      { id: 'challenge', name: 'Challenge', description: 'What crosses you', x: 40, y: 50, rotation: 90 },
      { id: 'crown', name: 'Crown', description: 'Your conscious goal', x: 40, y: 30 },
      { id: 'foundation', name: 'Foundation', description: 'Subconscious influences', x: 40, y: 70 },
      { id: 'past', name: 'Past', description: 'Recent past influences', x: 20, y: 50 },
      { id: 'future', name: 'Future', description: 'Near future', x: 60, y: 50 },
      { id: 'self', name: 'Self', description: 'Your attitude', x: 80, y: 70 },
      { id: 'environment', name: 'Environment', description: 'External influences', x: 80, y: 55 },
      { id: 'hopes', name: 'Hopes & Fears', description: 'Your aspirations and anxieties', x: 80, y: 40 },
      { id: 'outcome', name: 'Outcome', description: 'Final result', x: 80, y: 25 }
    ]
  },
  {
    id: 'horseshoe',
    name: 'Horseshoe Spread',
    description: '7-card spread for decision making',
    cardCount: 7,
    positions: [
      { id: 'past', name: 'Past', description: 'Past influences', x: 20, y: 70 },
      { id: 'present', name: 'Present', description: 'Current situation', x: 30, y: 50 },
      { id: 'hidden', name: 'Hidden Influences', description: 'Unknown factors', x: 40, y: 35 },
      { id: 'advice', name: 'Advice', description: 'Guidance for you', x: 50, y: 25 },
      { id: 'external', name: 'External', description: 'Outside influences', x: 60, y: 35 },
      { id: 'hopes', name: 'Hopes', description: 'Your desires', x: 70, y: 50 },
      { id: 'outcome', name: 'Outcome', description: 'Likely result', x: 80, y: 70 }
    ]
  }
];

export const getSpreadById = (id: string): TarotSpread | undefined => {
  return TAROT_SPREADS.find(spread => spread.id === id);
};
