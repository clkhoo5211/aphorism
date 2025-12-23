#!/usr/bin/env python3
"""
Test script to verify all tarot functionality:
- All 4 decks have images
- All 6 spreads are configured
- Image paths are correct
- Shuffling logic is in place
"""

import json
from pathlib import Path
import re

def test_images():
    """Test that all images exist for all decks"""
    print("1️⃣ IMAGE VERIFICATION")
    print("-" * 70)
    
    # Get project root (scripts/ is in project root)
    project_root = Path(__file__).parent.parent
    
    decks = ['rider-waite', 'hero', 'lotus', 'mythic']
    all_cards = []
    
    # Major Arcana
    for i in range(22):
        all_cards.append(f'ar{i:02d}.jpg')
    
    # Minor Arcana
    for suit in ['w', 'c', 's', 'p']:
        for i in range(1, 15):
            all_cards.append(f'{suit}{i:02d}.jpg')
    
    print(f"Expected: {len(all_cards)} cards per deck (22 Major + 56 Minor)")
    print()
    
    all_present = True
    for deck in decks:
        deck_dir = project_root / 'public' / 'assets' / 'tarot-cards' / deck
        missing = []
        for card in all_cards:
            if not (deck_dir / card).exists():
                missing.append(card)
        
        if missing:
            print(f"❌ {deck:15} - Missing {len(missing)} cards: {missing[:3]}...")
            all_present = False
        else:
            print(f"✅ {deck:15} - All {len(all_cards)} cards present")
    
    return all_present

def test_spreads():
    """Test that all spreads are configured"""
    print("\n2️⃣ SPREAD CONFIGURATION")
    print("-" * 70)
    
    project_root = Path(__file__).parent.parent
    spreads_file = project_root / 'src' / 'data' / 'tarotSpreads.ts'
    content = spreads_file.read_text()
    
    spreads = [
        ('single', 1),
        ('past-present-future', 3),
        ('mind-body-spirit', 3),
        ('situation-action-outcome', 3),
        ('celtic-cross', 10),
        ('horseshoe', 7)
    ]
    
    all_configured = True
    for spread_id, count in spreads:
        id_check = f"id: '{spread_id}'" in content or f'id: "{spread_id}"' in content
        count_check = f'cardCount: {count}' in content
        name_check = spread_id.replace('-', ' ').title() in content or spread_id.replace('-', ', ').title() in content
        
        if id_check and count_check:
            print(f"✅ {spread_id:25} - {count} cards configured")
        else:
            print(f"❌ {spread_id:25} - Configuration issue")
            all_configured = False
    
    return all_configured

def test_code_integration():
    """Test that code integration is correct"""
    print("\n3️⃣ CODE INTEGRATION")
    print("-" * 70)
    
    project_root = Path(__file__).parent.parent
    
    checks = [
        ('src/utils/tarotLogic.ts', 'getCardImageUrl', 'Image URL function'),
        ('src/utils/tarotLogic.ts', 'shuffleDeck', 'Shuffle function'),
        ('src/utils/tarotLogic.ts', 'createShuffledDeck', 'Deck creation'),
        ('src/utils/tarotLogic.ts', 'drawFromShuffledDeck', 'Card drawing'),
        ('src/components/Tarot/InteractiveDeck.tsx', 'useState', 'State management'),
        ('src/components/Tarot/InteractiveDeck.tsx', 'shuffledDeck', 'Deck state'),
        ('src/components/Tarot/TarotCard.tsx', 'getCardDisplayInfo', 'Card display'),
    ]
    
    all_present = True
    for file_path, check, description in checks:
        file = project_root / file_path
        if file.exists():
            content = file.read_text()
            if check in content:
                print(f"✅ {description:30} - Found in {file.name}")
            else:
                print(f"❌ {description:30} - Missing in {file.name}")
                all_present = False
        else:
            print(f"❌ {description:30} - File not found: {file_path}")
            all_present = False
    
    return all_present

def test_image_paths():
    """Test that image paths are correctly configured"""
    print("\n4️⃣ IMAGE PATH CONFIGURATION")
    print("-" * 70)
    
    project_root = Path(__file__).parent.parent
    logic_file = project_root / 'src' / 'utils' / 'tarotLogic.ts'
    content = logic_file.read_text()
    
    checks = [
        ('/assets/tarot-cards/', 'Local path prefix'),
        ('rider-waite', 'Rider-Waite deck path'),
        ('hero', 'Hero deck path'),
        ('lotus', 'Lotus deck path'),
        ('mythic', 'Mythic deck path'),
    ]
    
    all_present = True
    for check, description in checks:
        if check in content:
            print(f"✅ {description:30} - Configured")
        else:
            print(f"❌ {description:30} - Missing")
            all_present = False
    
    return all_present

def test_deck_configuration():
    """Test that all decks are configured"""
    print("\n5️⃣ DECK CONFIGURATION")
    print("-" * 70)
    
    project_root = Path(__file__).parent.parent
    decks_file = project_root / 'src' / 'data' / 'tarotDecks.ts'
    content = decks_file.read_text()
    
    expected_decks = ['riderWaite', 'hero', 'lotus', 'mythic']
    all_present = True
    
    for deck_id in expected_decks:
        if f"id: '{deck_id}'" in content or f'id: "{deck_id}"' in content:
            print(f"✅ {deck_id:15} - Configured")
        else:
            print(f"❌ {deck_id:15} - Missing")
            all_present = False
    
    return all_present

if __name__ == "__main__":
    print("🧪 TAROT FUNCTIONALITY COMPREHENSIVE TEST")
    print("=" * 70)
    print()
    
    results = {
        'Images': test_images(),
        'Spreads': test_spreads(),
        'Code Integration': test_code_integration(),
        'Image Paths': test_image_paths(),
        'Deck Configuration': test_deck_configuration(),
    }
    
    print("\n" + "=" * 70)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 70)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:10} {test_name}")
    
    all_passed = all(results.values())
    print("=" * 70)
    if all_passed:
        print("✅ ALL TESTS PASSED - Ready for browser testing!")
    else:
        print("⚠️  SOME TESTS FAILED - Please review above")
    print("=" * 70)

