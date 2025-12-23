export interface TarotCardData {
  id: string;
  name: string;
  meaningUpright: string;
  meaningReversed: string;
  imageUrl: string;
}

export interface DeckMapping {
  name: string;
  theme: string;
  description: string;
}

export interface TarotCard extends TarotCardData {
  mappings: {
    [deckId: string]: DeckMapping;
  };
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: "0",
    name: "The Fool",
    meaningUpright: "A new beginning, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe.",
    meaningReversed: "A reckless move, being too bold, being foolish, being gullible, risk taking, literalness and lack of foresight.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg",
    mappings: {
      riderWaite: {
        name: "The Fool",
        theme: "The Traveler",
        description: "A young man standing on the edge of a cliff, about to step off into the unknown.",
      },
      hero: {
        name: "The Fool",
        theme: "A delivery cyclist",
        description: "Navigating busy city streets with confidence and a sense of adventure.",
      },
      lotus: {
        name: "The Fool",
        theme: "Pure Potential",
        description: "A seed ready to sprout, containing all possibilities within it.",
      },
      mythic: {
        name: "Dionysos",
        theme: "The Divine Madman",
        description: "The god of wine and ecstasy, representing the irrational and the start of a journey.",
      },
    },
  },
  {
    id: "1",
    name: "The Magician",
    meaningUpright: "Having things under control, performing a minor miracle, being focused, making a wish come true and taking action.",
    meaningReversed: "Trickery, deception, poor planning, lack of focus, and being unsure of one's own skill.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg",
    mappings: {
      riderWaite: {
        name: "The Magician",
        theme: "The Alchemist",
        description: "Having all the tools at one's disposal to create and manifest desires.",
      },
      hero: {
        name: "The Magician",
        theme: "A chef",
        description: "Mastering the elements and ingredients to create something extraordinary.",
      },
      lotus: {
        name: "The Magician",
        theme: "Creative Will",
        description: "Focusing the mind to bring thought into physical reality.",
      },
      mythic: {
        name: "Hermes",
        theme: "The Messenger",
        description: "The swift god of communication and magic, the mediator between worlds.",
      },
    },
  },
  {
    id: "2",
    name: "The High Priestess",
    meaningUpright: "Listening to your intuition, seeing through a situation, trusting your gut, keeping a secret, being patient and waiting for the right time.",
    meaningReversed: "Secrets, hidden agendas, lack of intuition, and a need to listen more carefully to what's being said.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg",
    mappings: {
      riderWaite: {
        name: "The High Priestess",
        theme: "The Oracle",
        description: "The guardian of the unconscious, sitting between the pillars of light and dark.",
      },
      hero: {
        name: "The High Priestess",
        theme: "A librarian",
        description: "The keeper of vast knowledge and quiet wisdom.",
      },
      lotus: {
        name: "The High Priestess",
        theme: "Inner Wisdom",
        description: "Listening to the quiet voice within and trust in one's intuition.",
      },
      mythic: {
        name: "Persephone",
        theme: "Queen of the Underworld",
        description: "The dual goddess who travels between the worlds of the living and the dead.",
      },
    },
  },
  {
    id: "3",
    name: "The Empress",
    meaningUpright: "The mother, fertility, abundance, prosperity, luxury, nature, beauty, and the physical world.",
    meaningReversed: "Creative block, dependence on others, infertility, and a lack of self-discipline.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg",
    mappings: {
      riderWaite: {
        name: "The Empress",
        theme: "The Mother",
        description: "A lush garden surroundings, representing fertility and abundance.",
      },
      hero: {
        name: "The Empress",
        theme: "A midwife",
        description: "Bringing new life and nurturing growth with expertise and care.",
      },
      lotus: {
        name: "The Empress",
        theme: "Abundant Nature",
        description: "The creative force of the Earth, manifesting life in all its forms.",
      },
      mythic: {
        name: "Demeter",
        theme: "Goddess of Harvest",
        description: "The provider of sustenance and the cyclic nature of growth.",
      },
    },
  },
  {
    id: "4",
    name: "The Emperor",
    meaningUpright: "The father, structure, authority, logic, reason, order, power, and the material world.",
    meaningReversed: "Tyranny, lack of discipline, misuse of power, and a failure to take responsibility.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg",
    mappings: {
      riderWaite: {
        name: "The Emperor",
        theme: "The Leader",
        description: "Sitting on a stone throne, representing stability and worldly power.",
      },
      hero: {
        name: "The Emperor",
        theme: "A construction foreman",
        description: "Structuring and directing complex projects to completion.",
      },
      lotus: {
        name: "The Emperor",
        theme: "Divine Order",
        description: "Applying logic and reason to create a stable foundation.",
      },
      mythic: {
        name: "Zeus",
        theme: "King of the Gods",
        description: "The ultimate authority and lawgiver focused on order and justice.",
      },
    },
  },
  {
    id: "5",
    name: "The Hierophant",
    meaningUpright: "Traditional values, institutional knowledge, spiritual wisdom, group membership, and seeking guidance from a teacher.",
    meaningReversed: "Challenging traditions, non-conformity, corruption within an institution, and finding your own spiritual path.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg",
    mappings: {
      riderWaite: {
        name: "The Hierophant",
        theme: "The Teacher",
        description: "Inspirational spiritual leader conveying traditional knowledge.",
      },
      hero: {
        name: "The Hierophant",
        theme: "A teacher",
        description: "Passing on established knowledge and guiding the next generation.",
      },
      lotus: {
        name: "The Hierophant",
        theme: "Sacred Tradition",
        description: "Connecting the physical and spiritual through ritual and belief.",
      },
      mythic: {
        name: "Chiron",
        theme: "The Wise Centaur",
        description: "The master teacher who bridges the gap between animal nature and divine wisdom.",
      },
    },
  },
  {
    id: "6",
    name: "The Lovers",
    meaningUpright: "Soulmates, partnership, choices, values alignment, connection, and falling in love.",
    meaningReversed: "Disharmony, imbalance, a difficult choice, misaligned values, and a lack of self-love.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg",
    mappings: {
      riderWaite: {
        name: "The Lovers",
        theme: "The Union",
        description: "An angel blessing two figures, representing choice and unity.",
      },
      hero: {
        name: "The Lovers",
        theme: "Counselors",
        description: "Guiding others through difficult choices and fostering understanding.",
      },
      lotus: {
        name: "The Lovers",
        theme: "Harmonious Union",
        description: "The integration of opposites and the path of the heart.",
      },
      mythic: {
        name: "Paris",
        theme: "The Golden Apple",
        description: "The choice between different paths and the consequences of the heart's desire.",
      },
    },
  },
  {
    id: "7",
    name: "The Chariot",
    meaningUpright: "Victory, control, self-discipline, determination, willpower, and moving forward in a focused way.",
    meaningReversed: "Lack of control, lack of direction, aggression, and being blocked by internal or external conflict.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg",
    mappings: {
      riderWaite: {
        name: "The Chariot",
        theme: "The Victory",
        description: "A warrior in a chariot pulled by two sphinxes, representing directed will.",
      },
      hero: {
        name: "The Chariot",
        theme: "A racing driver",
        description: "Focus and skill used to navigate high-speed challenges.",
      },
      lotus: {
        name: "The Chariot",
        theme: "Directed Energy",
        description: "Harnessing opposing forces to move forward with purpose.",
      },
      mythic: {
        name: "Ares",
        theme: "The Charioteer",
        description: "The god of war, representing the raw power and drive to conquer.",
      },
    },
  },
  {
    id: "8",
    name: "Strength",
    meaningUpright: "Inner strength, courage, patience, compassion, influence, and soft power.",
    meaningReversed: "Self-doubt, lack of inner strength, impatience, and being controlled by fear or raw emotion.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg",
    mappings: {
      riderWaite: {
        name: "Strength",
        theme: "Fortitude",
        description: "A woman gently closing a lion's jaws, showing power through compassion.",
      },
      hero: {
        name: "Strength",
        theme: "A social worker",
        description: "Using inner reserves and patience to handle difficult human situations.",
      },
      lotus: {
        name: "Strength",
        theme: "Gentle Power",
        description: "Taming the animal nature with love and inner conviction.",
      },
      mythic: {
        name: "Heracles",
        theme: "The Hero",
        description: "Demonstrating physical and moral strength through heroic labors.",
      },
    },
  },
  {
    id: "9",
    name: "The Hermit",
    meaningUpright: "Self-reflection, introspection, solitude, soul-searching, inner guidance, and seeking the truth.",
    meaningReversed: "Isolation, withdrawal, loneliness, and being disconnected from one's own inner wisdom.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg",
    mappings: {
      riderWaite: {
        name: "The Hermit",
        theme: "The Seeker",
        description: "An old man holding a lantern, searching for truth in the darkness.",
      },
      hero: {
        name: "The Hermit",
        theme: "A researcher",
        description: "Seeking knowledge in isolation, dedicated to deep investigation.",
      },
      lotus: {
        name: "The Hermit",
        theme: "Inner Light",
        description: "Finding the truth within, away from the distractions of the world.",
      },
      mythic: {
        name: "Cronos",
        theme: "Old Father Time",
        description: "The ancient one who holds the wisdom of the ages and the passage of time.",
      },
    },
  },
  {
    id: "10",
    name: "Wheel of Fortune",
    meaningUpright: "Good luck, a turning point, life cycles, destiny, and unexpected events working in your favor.",
    meaningReversed: "Bad luck, resistance to change, breaking free from a cycle, and facing the consequences of past actions.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg",
    mappings: {
      riderWaite: {
        name: "Wheel of Fortune",
        theme: "Destiny",
        description: "A giant wheel surrounded by symbolic figures, representing the cycles of life.",
      },
      hero: {
        name: "Wheel of Fortune",
        theme: "A day trader",
        description: "Navigating the ups and downs of life and market cycles.",
      },
      lotus: {
        name: "Wheel of Fortune",
        theme: "Cyclic Change",
        description: "Accepting that all things pass and new opportunities arise.",
      },
      mythic: {
        name: "The Moirai",
        theme: "The Fates",
        description: "The three sisters who spin, measure, and cut the thread of life.",
      },
    },
  },
  {
    id: "11",
    name: "Justice",
    meaningUpright: "Justice, fairness, truth, karma, law, and cause and effect.",
    meaningReversed: "Unfairness, lack of accountability, dishonesty, and legal complications.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg",
    mappings: {
      riderWaite: {
        name: "Justice",
        theme: "Equity",
        description: "A figure holding scales and a sword, representing balance and truth.",
      },
      hero: {
        name: "Justice",
        theme: "A judge",
        description: "Weighing evidence and making decisions for the common good.",
      },
      lotus: {
        name: "Justice",
        theme: "Balance and Truth",
        description: "Achieving equilibrium through honest assessment and karma.",
      },
      mythic: {
        name: "Athene",
        theme: "Goddess of Wisdom",
        description: "The daughter of Zeus, representing cool reason and strategic justice.",
      },
    },
  },
  {
    id: "12",
    name: "The Hanged Man",
    meaningUpright: "Pause, surrender, letting go, new perspectives, and a temporary halt to progress for enlightenment.",
    meaningReversed: "Delays, resistance, stalling, and being stuck in an old pattern without growth.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg",
    mappings: {
      riderWaite: {
        name: "The Hanged Man",
        theme: "Sacrifice",
        description: "A figure hanging upside down from a tree, showing a change in perspective.",
      },
      hero: {
        name: "The Hanged Man",
        theme: "A yoga practitioner",
        description: "Intentional pause and seeing the world differently through discipline.",
      },
      lotus: {
        name: "The Hanged Man",
        theme: "Enlightened Surrender",
        description: "Sacrificing the ego for a more profound understanding of reality.",
      },
      mythic: {
        name: "Prometheus",
        theme: "The Titan",
        description: "Sacrificing oneself for the benefit of humanity and gaining foresight.",
      },
    },
  },
  {
    id: "13",
    name: "Death",
    meaningUpright: "Endings, change, transformation, transition, and clearing the path for something new.",
    meaningReversed: "Resistance to change, fear of endings, and being stuck in a decaying situation.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg",
    mappings: {
      riderWaite: {
        name: "Death",
        theme: "Transformation",
        description: "A skeleton on a horse, clearing the path for new growth.",
      },
      hero: {
        name: "Death",
        theme: "A demolition worker",
        description: "Removing the old to make way for new structures and ideas.",
      },
      lotus: {
        name: "Death",
        theme: "Rebirth",
        description: "The necessary ending that allows for a new beginning.",
      },
      mythic: {
        name: "Hades",
        theme: "Lord of the Underworld",
        description: "The inevitable transformation and the richness of what lies beneath.",
      },
    },
  },
  {
    id: "14",
    name: "Temperance",
    meaningUpright: "Balance, moderation, patience, purpose, and blending different elements to create harmony.",
    meaningReversed: "Imbalance, excess, lack of long-term vision, and disharmony.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg",
    mappings: {
      riderWaite: {
        name: "Temperance",
        theme: "Moderation",
        description: "An angel mixing water and wine, representing the middle path.",
      },
      hero: {
        name: "Temperance",
        theme: "A chemist",
        description: "Carefully blending elements to create a harmonious result.",
      },
      lotus: {
        name: "Temperance",
        theme: "Harmonious Flow",
        description: "Finding the right rhythm and balance in all areas of life.",
      },
      mythic: {
        name: "Iris",
        theme: "The Rainbow Messenger",
        description: "The bridge between heaven and earth, representing communication and blend.",
      },
    },
  },
  {
    id: "15",
    name: "The Devil",
    meaningUpright: "Addiction, entrapment, materialism, shadow self, and feeling powerless to change a negative situation.",
    meaningReversed: "Releasing limiting beliefs, detachment, breaking free from addiction, and facing your inner demons.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg",
    mappings: {
      riderWaite: {
        name: "The Devil",
        theme: "The Shadow",
        description: "Figures chained to a pedestal, representing self-imposed limitations.",
      },
      hero: {
        name: "The Devil",
        theme: "A corporate shark",
        description: "Driven by greed and power, often at the cost of personal values.",
      },
      lotus: {
        name: "The Devil",
        theme: "Lust for Matter",
        description: "Becoming trapped in the physical world and forgetting the spiritual.",
      },
      mythic: {
        name: "Pan",
        theme: "The God of Nature",
        description: "The wild, unbridled energy of nature and the instinctual self.",
      },
    },
  },
  {
    id: "16",
    name: "The Tower",
    meaningUpright: "Sudden upheaval, chaos, destruction of false structures, awakening, and a painful but necessary revelation.",
    meaningReversed: "Personal transformation, averting disaster, and fear of a necessary change.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg",
    mappings: {
      riderWaite: {
        name: "The Tower",
        theme: "The Upheaval",
        description: "A tower struck by lightning, representing the destruction of false foundations.",
      },
      hero: {
        name: "The Tower",
        theme: "A whistle-blower",
        description: "Revealing the truth that shatters established but corrupt structures.",
      },
      lotus: {
        name: "The Tower",
        theme: "Shattering Ego",
        description: "The rapid destruction of illusions to reveal the underlying truth.",
      },
      mythic: {
        name: "The Labyrinth",
        theme: "The Fallen Palace",
        description: "The destruction of King Minos's labyrinth by Poseidon's earthquakes.",
      },
    },
  },
  {
    id: "17",
    name: "The Star",
    meaningUpright: "Hope, inspiration, faith, renewal, spirituality, and divine timing.",
    meaningReversed: "Lack of faith, despair, discouragement, and missed opportunities.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg",
    mappings: {
      riderWaite: {
        name: "The Star",
        theme: "The Hope",
        description: "A woman pouring water into a pool, representing inspiration and renewal.",
      },
      hero: {
        name: "The Star",
        theme: "An environmentalist",
        description: "Working towards a better future with hope and dedication.",
      },
      lotus: {
        name: "The Star",
        theme: "Celestial Guidance",
        description: "Connecting with the higher self and the infinite possibilities of the universe.",
      },
      mythic: {
        name: "Pandora",
        theme: "The Gift of Hope",
        description: "Opening the jar that released troubles, but also the hope that remains.",
      },
    },
  },
  {
    id: "18",
    name: "The Moon",
    meaningUpright: "Illusion, hidden things, intuition, dreams, subconscious mind, and uncertainty.",
    meaningReversed: "Clarity, release of fear, uncovering the truth, and moving past confusion.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg",
    mappings: {
      riderWaite: {
        name: "The Moon",
        theme: "The Dream",
        description: "A path winding between two towers under the moonlight, representing the journey of the soul.",
      },
      hero: {
        name: "The Moon",
        theme: "An artist",
        description: "Exploring the depths of the subconscious to find creative inspiration.",
      },
      lotus: {
        name: "The Moon",
        theme: "Subconscious Reflection",
        description: "Navigating the realm of dreams and the hidden aspects of the mind.",
      },
      mythic: {
        name: "Hecate",
        theme: "Goddess of the Crossroads",
        description: "The mysterious goddess of the moon, magic, and the unseen realms.",
      },
    },
  },
  {
    id: "19",
    name: "The Sun",
    meaningUpright: "Joy, success, positivity, vitality, confidence, and literal or metaphorical sunshine.",
    meaningReversed: "Lack of success, pessimism, over-confidence, and a temporary setback.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg",
    mappings: {
      riderWaite: {
        name: "The Sun",
        theme: "The Success",
        description: "A child on a horse under a bright sun, representing clarity and joy.",
      },
      hero: {
        name: "The Sun",
        theme: "A child at play",
        description: "Pure joy, vitality, and the simple celebration of life.",
      },
      lotus: {
        name: "The Sun",
        theme: "Radiant Truth",
        description: "The light of consciousness illuminating all things with clarity and warmth.",
      },
      mythic: {
        name: "Apollo",
        theme: "God of Light",
        description: "The radiant god of music, prophecy, and the sun, representing reason and order.",
      },
    },
  },
  {
    id: "20",
    name: "Judgement",
    meaningUpright: "Rebirth, inner calling, absolution, awakening, and taking responsibility for your past.",
    meaningReversed: "Self-doubt, refusal of self-examination, inner critic, and a missed calling.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg",
    mappings: {
      riderWaite: {
        name: "Judgement",
        theme: "The Rebirth",
        description: "An angel blowing a trumpet, calling souls to rise and be reborn.",
      },
      hero: {
        name: "Judgement",
        theme: "A graduate",
        description: "A moment of reckoning and transition to a new phase of life.",
      },
      lotus: {
        name: "Judgement",
        theme: "Awakening",
        description: "Heeding the call of the soul and stepping into a new level of consciousness.",
      },
      mythic: {
        name: "Hermes",
        theme: "The Psychopomp",
        description: "The guide who leads souls to their final destination and new beginnings.",
      },
    },
  },
  {
    id: "21",
    name: "The World",
    meaningUpright: "Completion, integration, travel, accomplishment, and the successful conclusion of a long journey.",
    meaningReversed: "Lack of closure, shortcuts, delays, and a failure to see the big picture.",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg",
    mappings: {
      riderWaite: {
        name: "The World",
        theme: "The Completion",
        description: "A figure surrounded by a wreath, representing the successful conclusion of a cycle.",
      },
      hero: {
        name: "The World",
        theme: "An explorer",
        description: "Having traveled the world and gained a comprehensive understanding of life.",
      },
      lotus: {
        name: "The World",
        theme: "Cosmic Union",
        description: "The integration of all parts into a perfect whole, the dance of creation.",
      },
      mythic: {
        name: "Hermaphroditus",
        theme: "The Integrated One",
        description: "The union of male and female, representing the ultimate wholeness and completion.",
      },
    },
  },
];

// Minor Arcana - Complete 56 cards
export const MINOR_ARCANA: TarotCard[] = [
  {
    id: "22",
    name: "Ace of Wands",
    meaningUpright: "New opportunities, creative spark, potential, inspired action",
    meaningReversed: "Delays, lack of direction, poor timing, lack of initiative",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w01.jpg",
    mappings: {
      riderWaite: {
        name: "Ace of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the Ace of Wands.",
      },
    },
  },
  {
    id: "23",
    name: "2 of Wands",
    meaningUpright: "Planning, decisions, leaving comfort zone, future planning",
    meaningReversed: "Fear of unknown, lack of planning, disorganization",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w02.jpg",
    mappings: {
      riderWaite: {
        name: "2 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 2 of Wands.",
      },
    },
  },
  {
    id: "24",
    name: "3 of Wands",
    meaningUpright: "Expansion, foresight, overseas opportunities, leadership",
    meaningReversed: "Obstacles, delays, frustration, lack of foresight",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w03.jpg",
    mappings: {
      riderWaite: {
        name: "3 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 3 of Wands.",
      },
    },
  },
  {
    id: "25",
    name: "4 of Wands",
    meaningUpright: "Celebration, harmony, marriage, home, community",
    meaningReversed: "Lack of harmony, canceled celebrations, falling out with others",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w04.jpg",
    mappings: {
      riderWaite: {
        name: "4 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 4 of Wands.",
      },
    },
  },
  {
    id: "26",
    name: "5 of Wands",
    meaningUpright: "Competition, rivalry, conflict, disagreements",
    meaningReversed: "End of conflict, compromise, moving on",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w05.jpg",
    mappings: {
      riderWaite: {
        name: "5 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 5 of Wands.",
      },
    },
  },
  {
    id: "27",
    name: "6 of Wands",
    meaningUpright: "Victory, success, public recognition, progress",
    meaningReversed: "Defeat, lack of recognition, punishment, no progress",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w06.jpg",
    mappings: {
      riderWaite: {
        name: "6 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 6 of Wands.",
      },
    },
  },
  {
    id: "28",
    name: "7 of Wands",
    meaningUpright: "Challenge, competition, perseverance, defense",
    meaningReversed: "Giving up, overwhelmed, lack of courage",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w07.jpg",
    mappings: {
      riderWaite: {
        name: "7 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 7 of Wands.",
      },
    },
  },
  {
    id: "29",
    name: "8 of Wands",
    meaningUpright: "Speed, action, air travel, movement, swift change",
    meaningReversed: "Delays, frustration, resisting change, internal alignment",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w08.jpg",
    mappings: {
      riderWaite: {
        name: "8 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 8 of Wands.",
      },
    },
  },
  {
    id: "30",
    name: "9 of Wands",
    meaningUpright: "Resilience, grit, last stand, perseverance",
    meaningReversed: "Exhaustion, fatigue, questioning motivations, giving up",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w09.jpg",
    mappings: {
      riderWaite: {
        name: "9 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 9 of Wands.",
      },
    },
  },
  {
    id: "31",
    name: "10 of Wands",
    meaningUpright: "Burden, responsibility, hard work, stress, achievement",
    meaningReversed: "Inability to delegate, overstressed, burnt out",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w10.jpg",
    mappings: {
      riderWaite: {
        name: "10 of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the 10 of Wands.",
      },
    },
  },
  {
    id: "32",
    name: "Page of Wands",
    meaningUpright: "Exploration, excitement, freedom, new ideas",
    meaningReversed: "Lack of direction, procrastination, creating conflict",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w11.jpg",
    mappings: {
      riderWaite: {
        name: "Page of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the Page of Wands.",
      },
    },
  },
  {
    id: "33",
    name: "Knight of Wands",
    meaningUpright: "Action, adventure, fearlessness, entrepreneurial",
    meaningReversed: "Anger, impulsiveness, recklessness, haste",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w12.jpg",
    mappings: {
      riderWaite: {
        name: "Knight of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the Knight of Wands.",
      },
    },
  },
  {
    id: "34",
    name: "Queen of Wands",
    meaningUpright: "Courage, determination, joy, attraction, independence",
    meaningReversed: "Selfishness, jealousy, insecure, temperamental",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w13.jpg",
    mappings: {
      riderWaite: {
        name: "Queen of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the Queen of Wands.",
      },
    },
  },
  {
    id: "35",
    name: "King of Wands",
    meaningUpright: "Natural leader, vision, entrepreneur, honor",
    meaningReversed: "Impulsiveness, haste, ruthless, high expectations",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/w14.jpg",
    mappings: {
      riderWaite: {
        name: "King of Wands",
        theme: "Fire - Wands",
        description: "Traditional Rider-Waite interpretation of the King of Wands.",
      },
    },
  },
  {
    id: "36",
    name: "Ace of Cups",
    meaningUpright: "New feelings, spirituality, intuition, love",
    meaningReversed: "Emotional loss, blocked creativity, emptiness, repressed emotions",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c01.jpg",
    mappings: {
      riderWaite: {
        name: "Ace of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the Ace of Cups.",
      },
    },
  },
  {
    id: "37",
    name: "2 of Cups",
    meaningUpright: "Unity, partnership, connection, attraction",
    meaningReversed: "Imbalance, broken communication, tension, separation",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c02.jpg",
    mappings: {
      riderWaite: {
        name: "2 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 2 of Cups.",
      },
    },
  },
  {
    id: "38",
    name: "3 of Cups",
    meaningUpright: "Friendship, community, happiness, celebrations",
    meaningReversed: "Overindulgence, gossip, isolation, loneliness",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c03.jpg",
    mappings: {
      riderWaite: {
        name: "3 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 3 of Cups.",
      },
    },
  },
  {
    id: "39",
    name: "4 of Cups",
    meaningUpright: "Apathy, contemplation, reevaluation, meditation",
    meaningReversed: "Sudden awareness, choosing happiness, acceptance",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c04.jpg",
    mappings: {
      riderWaite: {
        name: "4 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 4 of Cups.",
      },
    },
  },
  {
    id: "40",
    name: "5 of Cups",
    meaningUpright: "Loss, grief, disappointment, sadness, regret",
    meaningReversed: "Acceptance, moving on, finding peace, contentment",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c05.jpg",
    mappings: {
      riderWaite: {
        name: "5 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 5 of Cups.",
      },
    },
  },
  {
    id: "41",
    name: "6 of Cups",
    meaningUpright: "Nostalgia, memories, reunion, childhood, innocence",
    meaningReversed: "Living in past, forgiveness, lacking playfulness",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c06.jpg",
    mappings: {
      riderWaite: {
        name: "6 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 6 of Cups.",
      },
    },
  },
  {
    id: "42",
    name: "7 of Cups",
    meaningUpright: "Illusion, choices, wishful thinking, fantasy",
    meaningReversed: "Clarity, making choices, disillusionment, reality check",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c07.jpg",
    mappings: {
      riderWaite: {
        name: "7 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 7 of Cups.",
      },
    },
  },
  {
    id: "43",
    name: "8 of Cups",
    meaningUpright: "Walking away, disillusionment, leaving behind, searching for truth",
    meaningReversed: "Avoidance, fear of change, fear of loss, staying in bad situation",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c08.jpg",
    mappings: {
      riderWaite: {
        name: "8 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 8 of Cups.",
      },
    },
  },
  {
    id: "44",
    name: "9 of Cups",
    meaningUpright: "Satisfaction, contentment, gratitude, wish come true",
    meaningReversed: "Dissatisfaction, smugness, materialism, lack of fulfillment",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c09.jpg",
    mappings: {
      riderWaite: {
        name: "9 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 9 of Cups.",
      },
    },
  },
  {
    id: "45",
    name: "10 of Cups",
    meaningUpright: "Harmony, happiness, alignment, family, emotional fulfillment",
    meaningReversed: "Misalignment, broken relationships, bad communication, neglect",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c10.jpg",
    mappings: {
      riderWaite: {
        name: "10 of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the 10 of Cups.",
      },
    },
  },
  {
    id: "46",
    name: "Page of Cups",
    meaningUpright: "Creative opportunities, curiosity, possibility, intuitive messages",
    meaningReversed: "Emotional immaturity, insecurity, disappointment",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c11.jpg",
    mappings: {
      riderWaite: {
        name: "Page of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the Page of Cups.",
      },
    },
  },
  {
    id: "47",
    name: "Knight of Cups",
    meaningUpright: "Romance, charm, imagination, beauty, following your heart",
    meaningReversed: "Moodiness, disappointment, unrealistic expectations",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c12.jpg",
    mappings: {
      riderWaite: {
        name: "Knight of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the Knight of Cups.",
      },
    },
  },
  {
    id: "48",
    name: "Queen of Cups",
    meaningUpright: "Compassion, calm, comfort, emotional stability, intuitive",
    meaningReversed: "Martyrdom, insecurity, dependence, giving too much",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c13.jpg",
    mappings: {
      riderWaite: {
        name: "Queen of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the Queen of Cups.",
      },
    },
  },
  {
    id: "49",
    name: "King of Cups",
    meaningUpright: "Emotional balance, control, generosity, diplomatic",
    meaningReversed: "Manipulation, emotional blackmail, moodiness",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/c14.jpg",
    mappings: {
      riderWaite: {
        name: "King of Cups",
        theme: "Water - Cups",
        description: "Traditional Rider-Waite interpretation of the King of Cups.",
      },
    },
  },
  {
    id: "50",
    name: "Ace of Swords",
    meaningUpright: "Breakthrough, clarity, sharp mind, new ideas, mental clarity",
    meaningReversed: "Confusion, miscommunication, hostility, arguments",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s01.jpg",
    mappings: {
      riderWaite: {
        name: "Ace of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the Ace of Swords.",
      },
    },
  },
  {
    id: "51",
    name: "2 of Swords",
    meaningUpright: "Difficult choices, indecision, stalemate, blocked emotions",
    meaningReversed: "Lesser of two evils, no right choice, confusion, information overload",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s02.jpg",
    mappings: {
      riderWaite: {
        name: "2 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 2 of Swords.",
      },
    },
  },
  {
    id: "52",
    name: "3 of Swords",
    meaningUpright: "Heartbreak, suffering, grief, sorrow, pain",
    meaningReversed: "Recovery, forgiveness, moving on, releasing pain",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s03.jpg",
    mappings: {
      riderWaite: {
        name: "3 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 3 of Swords.",
      },
    },
  },
  {
    id: "53",
    name: "4 of Swords",
    meaningUpright: "Rest, restoration, contemplation, recuperation, passivity",
    meaningReversed: "Restlessness, burnout, lack of progress, awakening",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s04.jpg",
    mappings: {
      riderWaite: {
        name: "4 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 4 of Swords.",
      },
    },
  },
  {
    id: "54",
    name: "5 of Swords",
    meaningUpright: "Conflict, disagreements, competition, defeat, winning at all costs",
    meaningReversed: "Reconciliation, making amends, past resentment",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s05.jpg",
    mappings: {
      riderWaite: {
        name: "5 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 5 of Swords.",
      },
    },
  },
  {
    id: "55",
    name: "6 of Swords",
    meaningUpright: "Transition, leaving behind, moving on, rite of passage",
    meaningReversed: "Resistance to change, unfinished business, emotional baggage",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s06.jpg",
    mappings: {
      riderWaite: {
        name: "6 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 6 of Swords.",
      },
    },
  },
  {
    id: "56",
    name: "7 of Swords",
    meaningUpright: "Deception, betrayal, getting away with something, stealth",
    meaningReversed: "Getting caught, conscience, regret, coming clean",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s07.jpg",
    mappings: {
      riderWaite: {
        name: "7 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 7 of Swords.",
      },
    },
  },
  {
    id: "57",
    name: "8 of Swords",
    meaningUpright: "Imprisonment, entrapment, self-victimization, powerlessness",
    meaningReversed: "Self-acceptance, new perspective, freedom, release",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s08.jpg",
    mappings: {
      riderWaite: {
        name: "8 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 8 of Swords.",
      },
    },
  },
  {
    id: "58",
    name: "9 of Swords",
    meaningUpright: "Anxiety, hopelessness, trauma, despair, nightmares",
    meaningReversed: "Hope, reaching out, despair ending, recovery",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s09.jpg",
    mappings: {
      riderWaite: {
        name: "9 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 9 of Swords.",
      },
    },
  },
  {
    id: "59",
    name: "10 of Swords",
    meaningUpright: "Painful endings, deep wounds, betrayal, crisis, rock bottom",
    meaningReversed: "Recovery, regeneration, fear of ruin, inevitable end",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s10.jpg",
    mappings: {
      riderWaite: {
        name: "10 of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the 10 of Swords.",
      },
    },
  },
  {
    id: "60",
    name: "Page of Swords",
    meaningUpright: "Curiosity, restlessness, mental energy, vigilance",
    meaningReversed: "Deception, manipulation, all talk, lack of planning",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s11.jpg",
    mappings: {
      riderWaite: {
        name: "Page of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the Page of Swords.",
      },
    },
  },
  {
    id: "61",
    name: "Knight of Swords",
    meaningUpright: "Action, impulsiveness, defending beliefs, rushing in",
    meaningReversed: "No direction, disregard for consequences, unpredictability",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s12.jpg",
    mappings: {
      riderWaite: {
        name: "Knight of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the Knight of Swords.",
      },
    },
  },
  {
    id: "62",
    name: "Queen of Swords",
    meaningUpright: "Independent, unbiased judgement, clear boundaries, direct communication",
    meaningReversed: "Cold-hearted, cruel, bitterness, harsh",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s13.jpg",
    mappings: {
      riderWaite: {
        name: "Queen of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the Queen of Swords.",
      },
    },
  },
  {
    id: "63",
    name: "King of Swords",
    meaningUpright: "Mental clarity, intellectual power, authority, truth",
    meaningReversed: "Manipulation, cruel, weakness, powerlessness",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/s14.jpg",
    mappings: {
      riderWaite: {
        name: "King of Swords",
        theme: "Air - Swords",
        description: "Traditional Rider-Waite interpretation of the King of Swords.",
      },
    },
  },
  {
    id: "64",
    name: "Ace of Pentacles",
    meaningUpright: "Opportunity, prosperity, new venture, manifestation, abundance",
    meaningReversed: "Lost opportunity, missed chance, bad investment",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p01.jpg",
    mappings: {
      riderWaite: {
        name: "Ace of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the Ace of Pentacles.",
      },
    },
  },
  {
    id: "65",
    name: "2 of Pentacles",
    meaningUpright: "Balancing decisions, priorities, adapting to change, time management",
    meaningReversed: "Loss of balance, disorganized, overwhelmed",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p02.jpg",
    mappings: {
      riderWaite: {
        name: "2 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 2 of Pentacles.",
      },
    },
  },
  {
    id: "66",
    name: "3 of Pentacles",
    meaningUpright: "Teamwork, collaboration, building, competence, learning",
    meaningReversed: "Lack of teamwork, disorganized, group conflict",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p03.jpg",
    mappings: {
      riderWaite: {
        name: "3 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 3 of Pentacles.",
      },
    },
  },
  {
    id: "67",
    name: "4 of Pentacles",
    meaningUpright: "Conservation, frugality, security, control, scarcity mindset",
    meaningReversed: "Greediness, stinginess, possessiveness, letting go",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p04.jpg",
    mappings: {
      riderWaite: {
        name: "4 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 4 of Pentacles.",
      },
    },
  },
  {
    id: "68",
    name: "5 of Pentacles",
    meaningUpright: "Need, poverty, insecurity, isolation, worry",
    meaningReversed: "Recovery, charity, improvement, end of hard times",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p05.jpg",
    mappings: {
      riderWaite: {
        name: "5 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 5 of Pentacles.",
      },
    },
  },
  {
    id: "69",
    name: "6 of Pentacles",
    meaningUpright: "Charity, generosity, sharing, equality, prosperity",
    meaningReversed: "Strings attached, stinginess, power and domination",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p06.jpg",
    mappings: {
      riderWaite: {
        name: "6 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 6 of Pentacles.",
      },
    },
  },
  {
    id: "70",
    name: "7 of Pentacles",
    meaningUpright: "Perseverance, investment, long-term view, sustainable results",
    meaningReversed: "Lack of long-term vision, limited success, lack of rewards",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p07.jpg",
    mappings: {
      riderWaite: {
        name: "7 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 7 of Pentacles.",
      },
    },
  },
  {
    id: "71",
    name: "8 of Pentacles",
    meaningUpright: "Apprenticeship, passion, high standards, mastery, skill development",
    meaningReversed: "Lack of passion, uninspired, no motivation, mediocrity",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p08.jpg",
    mappings: {
      riderWaite: {
        name: "8 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 8 of Pentacles.",
      },
    },
  },
  {
    id: "72",
    name: "9 of Pentacles",
    meaningUpright: "Fruits of labor, rewards, luxury, self-sufficiency, financial independence",
    meaningReversed: "Reckless spending, living beyond means, false success",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p09.jpg",
    mappings: {
      riderWaite: {
        name: "9 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 9 of Pentacles.",
      },
    },
  },
  {
    id: "73",
    name: "10 of Pentacles",
    meaningUpright: "Legacy, inheritance, culmination, wealth, family, establishment",
    meaningReversed: "Fleeting success, lack of stability, lack of resources",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p10.jpg",
    mappings: {
      riderWaite: {
        name: "10 of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the 10 of Pentacles.",
      },
    },
  },
  {
    id: "74",
    name: "Page of Pentacles",
    meaningUpright: "Ambition, desire, diligence, new financial opportunity, manifestation",
    meaningReversed: "Lack of commitment, greediness, laziness, short-term focus",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p11.jpg",
    mappings: {
      riderWaite: {
        name: "Page of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the Page of Pentacles.",
      },
    },
  },
  {
    id: "75",
    name: "Knight of Pentacles",
    meaningUpright: "Efficiency, hard work, responsibility, routine, conservatism",
    meaningReversed: "Laziness, obsessiveness, work without reward, perfectionism",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p12.jpg",
    mappings: {
      riderWaite: {
        name: "Knight of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the Knight of Pentacles.",
      },
    },
  },
  {
    id: "76",
    name: "Queen of Pentacles",
    meaningUpright: "Practical, homely, motherly, down-to-earth, resourceful, generous",
    meaningReversed: "Jealousy, smothering, insecurity, lack of independence",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p13.jpg",
    mappings: {
      riderWaite: {
        name: "Queen of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the Queen of Pentacles.",
      },
    },
  },
  {
    id: "77",
    name: "King of Pentacles",
    meaningUpright: "Abundance, prosperity, security, ambitious, safe, grounded",
    meaningReversed: "Greed, materialism, wasteful, chauvinism, poor financial decisions",
    imageUrl: "https://www.sacred-texts.com/tarot/pkt/img/p14.jpg",
    mappings: {
      riderWaite: {
        name: "King of Pentacles",
        theme: "Earth - Pentacles",
        description: "Traditional Rider-Waite interpretation of the King of Pentacles.",
      },
    },
  },
];

// Export complete deck (Major + Minor Arcana)
export const COMPLETE_TAROT_DECK = [...MAJOR_ARCANA, ...MINOR_ARCANA];
