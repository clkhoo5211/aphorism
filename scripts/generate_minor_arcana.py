#!/usr/bin/env python3
"""
Generate complete Minor Arcana (56 cards) for the Tarot deck.
Based on traditional Rider-Waite meanings.
"""

SUITS = {
    "wands": {
        "element": "Fire",
        "theme": "Energy, passion, creativity, ambition",
        "cards": {
            "ace": {"upright": "New opportunities, creative spark, potential, inspired action", "reversed": "Delays, lack of direction, poor timing, lack of initiative"},
            "2": {"upright": "Planning, decisions, leaving comfort zone, future planning", "reversed": "Fear of unknown, lack of planning, disorganization"},
            "3": {"upright": "Expansion, foresight, overseas opportunities, leadership", "reversed": "Obstacles, delays, frustration, lack of foresight"},
            "4": {"upright": "Celebration, harmony, marriage, home, community", "reversed": "Lack of harmony, canceled celebrations, falling out with others"},
            "5": {"upright": "Competition, rivalry, conflict, disagreements", "reversed": "End of conflict, compromise, moving on"},
            "6": {"upright": "Victory, success, public recognition, progress", "reversed": "Defeat, lack of recognition, punishment, no progress"},
            "7": {"upright": "Challenge, competition, perseverance, defense", "reversed": "Giving up, overwhelmed, lack of courage"},
            "8": {"upright": "Speed, action, air travel, movement, swift change", "reversed": "Delays, frustration, resisting change, internal alignment"},
            "9": {"upright": "Resilience, grit, last stand, perseverance", "reversed": "Exhaustion, fatigue, questioning motivations, giving up"},
            "10": {"upright": "Burden, responsibility, hard work, stress, achievement", "reversed": "Inability to delegate, overstressed, burnt out"},
            "page": {"upright": "Exploration, excitement, freedom, new ideas", "reversed": "Lack of direction, procrastination, creating conflict"},
            "knight": {"upright": "Action, adventure, fearlessness, entrepreneurial", "reversed": "Anger, impulsiveness, recklessness, haste"},
            "queen": {"upright": "Courage, determination, joy, attraction, independence", "reversed": "Selfishness, jealousy, insecure, temperamental"},
            "king": {"upright": "Natural leader, vision, entrepreneur, honor", "reversed": "Impulsiveness, haste, ruthless, high expectations"}
        }
    },
    "cups": {
        "element": "Water",
        "theme": "Emotions, relationships, feelings, intuition",
        "cards": {
            "ace": {"upright": "New feelings, spirituality, intuition, love", "reversed": "Emotional loss, blocked creativity, emptiness, repressed emotions"},
            "2": {"upright": "Unity, partnership, connection, attraction", "reversed": "Imbalance, broken communication, tension, separation"},
            "3": {"upright": "Friendship, community, happiness, celebrations", "reversed": "Overindulgence, gossip, isolation, loneliness"},
            "4": {"upright": "Apathy, contemplation, reevaluation, meditation", "reversed": "Sudden awareness, choosing happiness, acceptance"},
            "5": {"upright": "Loss, grief, disappointment, sadness, regret", "reversed": "Acceptance, moving on, finding peace, contentment"},
            "6": {"upright": "Nostalgia, memories, reunion, childhood, innocence", "reversed": "Living in past, forgiveness, lacking playfulness"},
            "7": {"upright": "Illusion, choices, wishful thinking, fantasy", "reversed": "Clarity, making choices, disillusionment, reality check"},
            "8": {"upright": "Walking away, disillusionment, leaving behind, searching for truth", "reversed": "Avoidance, fear of change, fear of loss, staying in bad situation"},
            "9": {"upright": "Satisfaction, contentment, gratitude, wish come true", "reversed": "Dissatisfaction, smugness, materialism, lack of fulfillment"},
            "10": {"upright": "Harmony, happiness, alignment, family, emotional fulfillment", "reversed": "Misalignment, broken relationships, bad communication, neglect"},
            "page": {"upright": "Creative opportunities, curiosity, possibility, intuitive messages", "reversed": "Emotional immaturity, insecurity, disappointment"},
            "knight": {"upright": "Romance, charm, imagination, beauty, following your heart", "reversed": "Moodiness, disappointment, unrealistic expectations"},
            "queen": {"upright": "Compassion, calm, comfort, emotional stability, intuitive", "reversed": "Martyrdom, insecurity, dependence, giving too much"},
            "king": {"upright": "Emotional balance, control, generosity, diplomatic", "reversed": "Manipulation, emotional blackmail, moodiness"}
        }
    },
    "swords": {
        "element": "Air",
        "theme": "Intellect, thoughts, conflict, communication",
        "cards": {
            "ace": {"upright": "Breakthrough, clarity, sharp mind, new ideas, mental clarity", "reversed": "Confusion, miscommunication, hostility, arguments"},
            "2": {"upright": "Difficult choices, indecision, stalemate, blocked emotions", "reversed": "Lesser of two evils, no right choice, confusion, information overload"},
            "3": {"upright": "Heartbreak, suffering, grief, sorrow, pain", "reversed": "Recovery, forgiveness, moving on, releasing pain"},
            "4": {"upright": "Rest, restoration, contemplation, recuperation, passivity", "reversed": "Restlessness, burnout, lack of progress, awakening"},
            "5": {"upright": "Conflict, disagreements, competition, defeat, winning at all costs", "reversed": "Reconciliation, making amends, past resentment"},
            "6": {"upright": "Transition, leaving behind, moving on, rite of passage", "reversed": "Resistance to change, unfinished business, emotional baggage"},
            "7": {"upright": "Deception, betrayal, getting away with something, stealth", "reversed": "Getting caught, conscience, regret, coming clean"},
            "8": {"upright": "Imprisonment, entrapment, self-victimization, powerlessness", "reversed": "Self-acceptance, new perspective, freedom, release"},
            "9": {"upright": "Anxiety, hopelessness, trauma, despair, nightmares", "reversed": "Hope, reaching out, despair ending, recovery"},
            "10": {"upright": "Painful endings, deep wounds, betrayal, crisis, rock bottom", "reversed": "Recovery, regeneration, fear of ruin, inevitable end"},
            "page": {"upright": "Curiosity, restlessness, mental energy, vigilance", "reversed": "Deception, manipulation, all talk, lack of planning"},
            "knight": {"upright": "Action, impulsiveness, defending beliefs, rushing in", "reversed": "No direction, disregard for consequences, unpredictability"},
            "queen": {"upright": "Independent, unbiased judgement, clear boundaries, direct communication", "reversed": "Cold-hearted, cruel, bitterness, harsh"},
            "king": {"upright": "Mental clarity, intellectual power, authority, truth", "reversed": "Manipulation, cruel, weakness, powerlessness"}
        }
    },
    "pentacles": {
        "element": "Earth",
        "theme": "Material world, finances, career, physical",
        "cards": {
            "ace": {"upright": "Opportunity, prosperity, new venture, manifestation, abundance", "reversed": "Lost opportunity, missed chance, bad investment"},
            "2": {"upright": "Balancing decisions, priorities, adapting to change, time management", "reversed": "Loss of balance, disorganized, overwhelmed"},
            "3": {"upright": "Teamwork, collaboration, building, competence, learning", "reversed": "Lack of teamwork, disorganized, group conflict"},
            "4": {"upright": "Conservation, frugality, security, control, scarcity mindset", "reversed": "Greediness, stinginess, possessiveness, letting go"},
            "5": {"upright": "Need, poverty, insecurity, isolation, worry", "reversed": "Recovery, charity, improvement, end of hard times"},
            "6": {"upright": "Charity, generosity, sharing, equality, prosperity", "reversed": "Strings attached, stinginess, power and domination"},
            "7": {"upright": "Perseverance, investment, long-term view, sustainable results", "reversed": "Lack of long-term vision, limited success, lack of rewards"},
            "8": {"upright": "Apprenticeship, passion, high standards, mastery, skill development", "reversed": "Lack of passion, uninspired, no motivation, mediocrity"},
            "9": {"upright": "Fruits of labor, rewards, luxury, self-sufficiency, financial independence", "reversed": "Reckless spending, living beyond means, false success"},
            "10": {"upright": "Legacy, inheritance, culmination, wealth, family, establishment", "reversed": "Fleeting success, lack of stability, lack of resources"},
            "page": {"upright": "Ambition, desire, diligence, new financial opportunity, manifestation", "reversed": "Lack of commitment, greediness, laziness, short-term focus"},
            "knight": {"upright": "Efficiency, hard work, responsibility, routine, conservatism", "reversed": "Laziness, obsessiveness, work without reward, perfectionism"},
            "queen": {"upright": "Practical, homely, motherly, down-to-earth, resourceful, generous", "reversed": "Jealousy, smothering, insecurity, lack of independence"},
            "king": {"upright": "Abundance, prosperity, security, ambitious, safe, grounded", "reversed": "Greed, materialism, wasteful, chauvinism, poor financial decisions"}
        }
    }
}

def generate_minor_arcana():
    """Generate all 56 Minor Arcana cards"""
    cards = []
    card_id = 22  # Start after Major Arcana (0-21)
    
    for suit_name, suit_data in SUITS.items():
        for card_rank, meanings in suit_data["cards"].items():
            # Determine card name
            if card_rank == "ace":
                name = f"Ace of {suit_name.capitalize()}"
            elif card_rank in ["page", "knight", "queen", "king"]:
                name = f"{card_rank.capitalize()} of {suit_name.capitalize()}"
            else:
                name = f"{card_rank} of {suit_name.capitalize()}"
            
            # Generate image URL (sacred-texts.com pattern)
            suit_abbr = suit_name[0]  # w, c, s, p
            if card_rank == "ace":
                img_num = "01"
            elif card_rank == "page":
                img_num = "11"
            elif card_rank == "knight":
                img_num = "12"
            elif card_rank == "queen":
                img_num = "13"
            elif card_rank == "king":
                img_num = "14"
            else:
                img_num = f"{int(card_rank):02d}"
            
            image_url = f"https://www.sacred-texts.com/tarot/pkt/img/{suit_abbr}{img_num}.jpg"
            
            card = {
                "id": str(card_id),
                "name": name,
                "meaningUpright": meanings["upright"],
                "meaningReversed": meanings["reversed"],
                "imageUrl": image_url,
                "suit": suit_name,
                "element": suit_data["element"]
            }
            
            cards.append(card)
            card_id += 1
    
    return cards

def generate_typescript():
    """Generate TypeScript code for Minor Arcana"""
    cards = generate_minor_arcana()
    
    ts_code = '''
// Minor Arcana - Complete 56 cards
export const MINOR_ARCANA: TarotCard[] = [
'''
    
    for card in cards:
        ts_code += f'''  {{
    id: "{card['id']}",
    name: "{card['name']}",
    meaningUpright: "{card['meaningUpright']}",
    meaningReversed: "{card['meaningReversed']}",
    imageUrl: "{card['imageUrl']}",
    mappings: {{
      riderWaite: {{
        name: "{card['name']}",
        theme: "{card['element']} - {card['suit'].capitalize()}",
        description: "Traditional Rider-Waite interpretation of the {card['name']}.",
      }},
    }},
  }},
'''
    
    ts_code += '''];

// Export complete deck (Major + Minor Arcana)
export const COMPLETE_TAROT_DECK = [...MAJOR_ARCANA, ...MINOR_ARCANA];
'''
    
    return ts_code

if __name__ == "__main__":
    print("✅ Generated 56 Minor Arcana cards")
    print("\nTo add to tarotCards.ts:")
    print("1. Append the MINOR_ARCANA array after MAJOR_ARCANA")
    print("2. Add COMPLETE_TAROT_DECK export at the end")
    print("\nGenerating TypeScript code...")
    
    ts_code = generate_typescript()
    
    with open("minor_arcana_generated.ts", "w") as f:
        f.write(ts_code)
    
    print("✅ Saved to minor_arcana_generated.ts")
    print(f"✅ Total cards: {len(generate_minor_arcana())} Minor Arcana")
