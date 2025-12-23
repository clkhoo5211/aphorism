# TECHY REFLECT - Aphorism Blog

A modern web application featuring tarot card readings and Chinese divination systems.

## Features

### Tarot Cards
- **4 Decks**: Rider-Waite, Everyday Hero, Esoteric Lotus, Greek Mythic
- **78 Cards per Deck**: All cards with local images (312 total images)
- **6 Spreads**: 
  - Single Card
  - Past, Present, Future
  - Mind, Body, Spirit
  - Situation, Action, Outcome
  - Celtic Cross (10 cards)
  - Horseshoe Spread (7 cards)
- **Card Features**:
  - Fisher-Yates shuffle algorithm for proper randomization
  - Card reversal support
  - Detailed interpretation panel
  - Visual card selection feedback

### Chinese Divination Systems
- 观音灵签 (Guan Yin Oracle) - 100 lots
- 黄大仙 (Wong Tai Sin) - 100 lots
- 月老 (Yue Lao) - 100 lots
- 吕祖 (Lv Zu) - 100 lots
- 妈祖 (Mazu) - 100 lots

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router

## Installation

```bash
npm install
npm run dev
```

## Project Structure

```
techy-aphorism-blog/
├── src/
│   ├── components/
│   │   ├── Tarot/          # Tarot card components
│   │   └── Divination/     # Divination components
│   ├── data/               # Data files (cards, spreads, divination)
│   └── utils/              # Utility functions
├── public/
│   └── assets/
│       └── tarot-cards/    # Local tarot card images (312 images)
└── scripts/                # Python scripts for data collection
```

## Development

The project includes Python scripts in the `scripts/` directory for:
- Collecting divination data from online sources
- Downloading tarot card images
- Generating TypeScript data files

## License

MIT
