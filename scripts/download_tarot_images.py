#!/usr/bin/env python3
"""
Download all 78 tarot card images locally for offline use.
Uses Wikimedia Commons as the source for all cards.
Creates directory structure for each deck.
"""

import os
import re
import requests
from pathlib import Path
from urllib.parse import urlparse
import time

# Base directory for tarot images
BASE_DIR = Path(__file__).parent.parent / "public" / "assets" / "tarot-cards"
DECKS = ['rider-waite', 'hero', 'lotus', 'mythic']

# Wikimedia Commons base URL
WIKIMEDIA_BASE = "https://commons.wikimedia.org/wiki/Special:FilePath"

def create_directories():
    """Create directory structure for all decks"""
    for deck in DECKS:
        deck_dir = BASE_DIR / deck
        deck_dir.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {deck_dir}")

def get_wikimedia_url(filename: str) -> str:
    """Get Wikimedia Commons direct image URL"""
    # Wikimedia uses Special:FilePath which redirects to the actual file
    # Format: https://commons.wikimedia.org/wiki/Special:FilePath/Filename.jpg
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{filename}"

def map_filename_to_wikimedia(original_filename: str) -> str:
    """Map tarotCards.ts filename format to Wikimedia Commons format"""
    # Major Arcana: ar00.jpg -> RWS_Tarot_00_Fool.jpg
    if original_filename.startswith('ar'):
        num = int(original_filename[2:4])
        major_names = [
            "00_Fool", "01_Magician", "02_High_Priestess", "03_Empress",
            "04_Emperor", "05_Hierophant", "06_Lovers", "07_Chariot",
            "08_Strength", "09_Hermit", "10_Wheel_of_Fortune", "11_Justice",
            "12_Hanged_Man", "13_Death", "14_Temperance", "15_Devil",
            "16_Tower", "17_Star", "18_Moon", "19_Sun", "20_Judgement", "21_World"
        ]
        if 0 <= num <= 21:
            return f"RWS_Tarot_{major_names[num]}.jpg"
    
    # Minor Arcana mapping
    # w01.jpg -> Wands01.jpg (Wands = w)
    # c01.jpg -> Cups01.jpg (Cups = c)
    # s01.jpg -> Swords01.jpg (Swords = s)
    # p01.jpg -> Pents01.jpg (Pentacles = p)
    # Special case: w09.jpg -> Tarot_Nine_of_Wands.jpg (Wands09 was deleted)
    suit_map = {
        'w': 'Wands',
        'c': 'Cups',
        's': 'Swords',
        'p': 'Pents'
    }
    
    if len(original_filename) >= 3:
        suit_char = original_filename[0]
        num_str = original_filename[1:3]
        if suit_char in suit_map and num_str.isdigit():
            num = int(num_str)
            if 1 <= num <= 14:
                # Special case: Wands09 was deleted, use alternative name
                if original_filename == 'w09.jpg':
                    return "Tarot_Nine_of_Wands.jpg"
                return f"{suit_map[suit_char]}{num:02d}.jpg"
    
    return original_filename

def extract_image_urls():
    """Extract all image URLs from tarotCards.ts"""
    tarot_file = Path(__file__).parent.parent / "src" / "data" / "tarotCards.ts"
    
    with open(tarot_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all imageUrl patterns
    pattern = r'imageUrl:\s*"([^"]+)"'
    urls = re.findall(pattern, content)
    
    print(f"📊 Found {len(urls)} image URLs in tarotCards.ts")
    return urls

def download_image(wikimedia_filename: str, deck: str, local_filename: str) -> bool:
    """Download a single image from Wikimedia Commons"""
    deck_dir = BASE_DIR / deck
    filepath = deck_dir / local_filename
    
    # Skip if already exists
    if filepath.exists():
        print(f"  ⏭️  Already exists: {local_filename}")
        return True
    
    try:
        url = get_wikimedia_url(wikimedia_filename)
        response = requests.get(url, timeout=15, stream=True, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; TarotImageDownloader/1.0)'
        })
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"  ✅ Downloaded: {local_filename}")
        return True
    except Exception as e:
        print(f"  ❌ Failed to download {local_filename}: {e}")
        return False

def download_all_images():
    """Download all images for all decks"""
    urls = extract_image_urls()
    
    print(f"\n📥 Downloading {len(urls)} images for {len(DECKS)} decks...")
    print("=" * 70)
    
    total = len(urls) * len(DECKS)
    downloaded = 0
    failed = 0
    skipped = 0
    
    for deck in DECKS:
        print(f"\n🎴 Deck: {deck.upper()}")
        print("-" * 70)
        
        for i, url in enumerate(urls, 1):
            # Extract original filename
            original_filename = url.split('/')[-1]
            
            # Map to Wikimedia Commons filename
            wikimedia_filename = map_filename_to_wikimedia(original_filename)
            
            # Download using Wikimedia filename, save with original filename
            if download_image(wikimedia_filename, deck, original_filename):
                downloaded += 1
            else:
                failed += 1
                # Try alternative: use original URL as fallback
                try:
                    response = requests.get(url, timeout=10, stream=True)
                    if response.status_code == 200:
                        filepath = BASE_DIR / deck / original_filename
                        with open(filepath, 'wb') as f:
                            for chunk in response.iter_content(chunk_size=8192):
                                f.write(chunk)
                        print(f"  ✅ Downloaded from fallback: {original_filename}")
                        downloaded += 1
                        failed -= 1
                except:
                    pass
            
            # Rate limiting
            if i % 10 == 0:
                time.sleep(0.3)
        
        print(f"  📊 Deck {deck}: {len(urls)} images processed")
    
    print("\n" + "=" * 70)
    print(f"✅ Download complete!")
    print(f"   Total images: {total}")
    print(f"   Downloaded: {downloaded}")
    print(f"   Failed: {failed}")
    print(f"   Skipped (already existed): {total - downloaded - failed}")
    print("=" * 70)

if __name__ == "__main__":
    print("🃏 Tarot Card Image Downloader (All 78 Cards)")
    print("=" * 70)
    
    create_directories()
    download_all_images()
    
    print("\n💡 All tarot card images should now be available locally!")
