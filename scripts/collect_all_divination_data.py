#!/usr/bin/env python3
"""
Automated Divination Data Collection Script
Collects all 413 remaining lots from online sources

This script will:
1. Collect 观音灵签 97 lots (4-100)
2. Collect 黄大仙 99 lots (2-100)
3. Collect 月老 59 lots (2-60)
4. Collect 吕祖 99 lots (2-100)
5. Collect 妈祖 59 lots (2-60)

Total: 413 lots

Run this script:
    python3 collect_all_divination_data.py
"""

import json
import time
import random
import re
import sys
from typing import List, Dict, Optional
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry
except ImportError:
    print("❌ Missing dependencies. Install with: pip install -r requirements.txt")
    exit(1)

# Configuration
BASE_DELAY = 0.5  # Base delay between requests (seconds) - reduced for faster execution
MAX_RETRIES = 2  # Reduced retries for faster failure
TIMEOUT = 5  # Reduced timeout for faster failure detection
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

# Create session with retry strategy
def create_session():
    """Create a requests session with retry strategy"""
    session = requests.Session()
    retry_strategy = Retry(
        total=MAX_RETRIES,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    session.headers.update({'User-Agent': USER_AGENT})
    return session

session = create_session()

def safe_request(url: str, retries: int = 3) -> Optional[BeautifulSoup]:
    """Safely fetch and parse a webpage"""
    for attempt in range(retries):
        try:
            response = session.get(url, timeout=TIMEOUT)
            response.raise_for_status()
            response.encoding = 'utf-8'  # Try UTF-8 first
            if response.encoding.lower() == 'iso-8859-1':
                # Try to detect encoding
                try:
                    import chardet
                    detected = chardet.detect(response.content)
                    if detected and detected.get('encoding'):
                        response.encoding = detected['encoding']
                except ImportError:
                    # chardet not available, try common encodings
                    for encoding in ['gb2312', 'gbk', 'big5', 'utf-8']:
                        try:
                            response.content.decode(encoding)
                            response.encoding = encoding
                            break
                        except:
                            continue
            return BeautifulSoup(response.text, 'lxml')
        except requests.exceptions.HTTPError as e:
            # 404 and other client errors are permanent - don't retry
            if e.response and e.response.status_code in [404, 403, 401]:
                return None
            # Server errors might be transient - retry
            if attempt < retries - 1:
                time.sleep(BASE_DELAY * (2 ** attempt))
            else:
                return None
        except requests.exceptions.RequestException as e:
            # Network errors - retry
            if attempt < retries - 1:
                time.sleep(BASE_DELAY * (2 ** attempt))
            else:
                return None
    return None

def extract_text(element) -> str:
    """Safely extract text from BeautifulSoup element"""
    if element is None:
        return ""
    text = element.get_text(strip=True)
    return text.replace('\n', ' ').replace('\r', '').strip()

def normalize_fortune(text: str) -> str:
    """Normalize fortune text to standard format"""
    if not text:
        return "中签"
    
    text = text.strip()
    # Common fortune patterns
    if any(x in text for x in ["上上", "大吉", "上吉"]):
        return "上上签"
    elif any(x in text for x in ["上", "吉", "中上"]):
        return "上签"
    elif any(x in text for x in ["中", "平"]):
        return "中签"
    elif any(x in text for x in ["中下", "下"]):
        return "中下签"
    elif any(x in text for x in ["下下", "凶", "大凶"]):
        return "下下签"
    return "中签"

# ============================================================================
# GUAN YIN (观音灵签) Scraper
# ============================================================================

def scrape_guanyin_lot(lot_id: int) -> Optional[Dict]:
    """Scrape a single Guan Yin lot from various sources"""
    sources = [
        f"https://m.k366.com/qian/lqgy_{lot_id}.htm",  # Correct pattern for k366
        f"https://guanyin.hao86.com/qian/{lot_id}.html",
        f"https://m.zhouyi.cc/lingqian/guanyin/{lot_id}.html",
    ]
    
    for url in sources:
        soup = safe_request(url, retries=1)
        if soup is None:
            continue
        
        try:
            # Extract poem - Chinese divination poems are 4 lines of 7 characters each (28 chars total)
            poem_lines = []
            all_text = soup.get_text()
            
            # Method 1: Look for text in qian_table div after "签诗文" marker (MOST RELIABLE for k366.com)
            if not poem_lines or len(poem_lines) < 4:
                poem_elem = soup.select_one('.qian_table, [class*="qian"]')
                if poem_elem:
                    text = poem_elem.get_text()
                    # Extract Chinese characters from this div
                    chinese_chars = ''.join(re.findall(r'[\u4e00-\u9fff]', text))
                    
                    # Look for common poem starting words to find the right position
                    # But make sure we're not in the middle of other text
                    poem_starters = ['菱花镜破', '天开地辟', '鲸鱼未化', '冲风冒雨']  # More specific patterns
                    for starter in poem_starters:
                        if starter in chinese_chars:
                            idx = chinese_chars.find(starter)
                            # Make sure we have enough characters after
                            if idx >= 0 and idx + 28 <= len(chinese_chars):
                                candidate = chinese_chars[idx:idx+28]
                                # Validate: should start with the starter
                                if candidate.startswith(starter[:2]):  # At least first 2 chars match
                                    # Split and validate
                                    lines = [candidate[j:j+7] for j in range(0, 28, 7)]
                                    if all(len(line) == 7 for line in lines):
                                        poem_lines = lines
                                        break
                    
                    # Alternative: look for the pattern after "签诗文" (most reliable for k366.com)
                    if not poem_lines or len(poem_lines) < 4:
                        if '签诗文' in chinese_chars:
                            idx = chinese_chars.find('签诗文')
                            # Get 28 chars starting right after "签诗文" marker
                            start_idx = idx + len('签诗文')
                            if start_idx + 28 <= len(chinese_chars):
                                candidate = chinese_chars[start_idx:start_idx+28]
                                # Validate it's a proper poem (all 7-char lines)
                                lines = [candidate[j:j+7] for j in range(0, 28, 7)]
                                if all(len(line) == 7 for line in lines):
                                    # Additional check: should not contain markers
                                    if '签' not in candidate[7:] and '诗' not in candidate[7:]:
                                        poem_lines = lines
                    
                    # If not found by starters, try the skip-words method
                    if not poem_lines or len(poem_lines) < 4:
                        skip_words = ['首页', '黄历', '排盘', '运势', '八字', '观音灵签第', '签解签', '华易网', '签诗文', '吉凶', '宫位', '中中签', '中上签', '上上签']
                        for i in range(len(chinese_chars) - 27):
                            candidate = chinese_chars[i:i+28]
                            # Skip if contains navigation words
                            if any(word in candidate for word in skip_words):
                                continue
                            # Split and validate
                            lines = [candidate[j:j+7] for j in range(0, 28, 7)]
                            if all(len(line) == 7 for line in lines):
                                poem_lines = lines
                                break
            
            # Method 3: Look for continuous Chinese text in full page (fallback)
            if not poem_lines or len(poem_lines) < 4:
                chinese_only = re.sub(r'[^\u4e00-\u9fff]', '', all_text)
                # Find sequences of 28+ Chinese characters, but skip navigation/common words
                skip_words = ['首页', '黄历', '排盘', '运势', '八字', '观音灵签第', '签解签', '华易网', '签诗文']
                for i in range(len(chinese_only) - 27):
                    candidate = chinese_only[i:i+28]
                    # Skip if contains navigation words
                    if any(word in candidate for word in skip_words):
                        continue
                    # Split into 4 lines of 7 chars
                    lines = [candidate[j:j+7] for j in range(0, 28, 7)]
                    # Check if this looks like a poem (all lines are 7 chars, no repeated patterns)
                    if all(len(line) == 7 for line in lines) and len(set(lines)) >= 3:
                        # Additional validation: should not start with common prefixes
                        if not candidate.startswith(('观音', '首页', '黄历', '排盘', '音灵')):
                            poem_lines = lines
                            break
            
            # Method 4: Look for 4 consecutive lines in the text
            if not poem_lines or len(poem_lines) < 4:
                lines = [l.strip() for l in all_text.split('\n') if l.strip()]
                for i in range(len(lines) - 3):
                    candidate = lines[i:i+4]
                    # Check if all are 7-char Chinese lines
                    if all(7 <= len(l) <= 8 and re.match(r'^[\u4e00-\u9fff]+$', l) for l in candidate):
                        poem_lines = candidate
                        break
            
            # Extract fortune from title or content
            fortune = "中签"
            title = soup.title.string if soup.title else ""
            if '上上' in title or '大吉' in title:
                fortune = "上上签"
            elif '上' in title and '上上' not in title:
                fortune = "上签"
            elif '中中' in title or '中' in title:
                fortune = "中签"
            elif '中下' in title:
                fortune = "中下签"
            elif '下下' in title or '凶' in title:
                fortune = "下下签"
            
            # Also check in content
            content_text = soup.get_text()
            if '【吉凶】' in content_text or '吉凶' in content_text:
                match = re.search(r'【吉凶】([^【]+)', content_text)
                if not match:
                    match = re.search(r'吉凶[：:]([^\n]+)', content_text)
                if match:
                    fortune = normalize_fortune(match.group(1))
            
            # Extract story (usually in title or after poem)
            story = ""
            if '【' in title:
                match = re.search(r'【([^】]+)】', title)
                if match:
                    story = match.group(1)
            
            # Extract interpretation
            interpretation = ""
            if '【诗意】' in content_text or '诗意' in content_text:
                match = re.search(r'【诗意】([^【]+)', content_text)
                if not match:
                    match = re.search(r'诗意[：:]([^\n]+)', content_text)
                if match:
                    interpretation = match.group(1).strip()[:200]
            
            # Extract meanings from structured text
            meanings = []
            if '家宅' in content_text or '自身' in content_text:
                # Pattern: 家宅-欠利，自身-秋冬旺
                meaning_pattern = r'([^，,]+?)[-－]([^，,]+?)(?=[，,]|$)'
                matches = re.findall(meaning_pattern, content_text)
                for label, value in matches[:15]:
                    label = label.strip()
                    value = value.strip()
                    if label and value and len(label) <= 10:
                        meanings.append({"label": label, "value": value})
            
            # Extract advice (usually at the end)
            advice = ""
            if '【解曰】' in content_text or '解曰' in content_text:
                match = re.search(r'【解曰】([^【]+)', content_text)
                if not match:
                    match = re.search(r'解曰[：:]([^\n]+)', content_text)
                if match:
                    advice = match.group(1).strip()[:300]
            
            # If we got the poem, return the lot
            if poem_lines and len(poem_lines) >= 4:
                return {
                    "id": lot_id,
                    "fortune": fortune,
                    "poem": poem_lines[:4],
                    "poemAnalysis": interpretation or f"第{lot_id}签诗意解析",
                    "story": story or f"第{lot_id}签典故",
                    "interpretation": interpretation or f"第{lot_id}签解曰",
                    "meanings": meanings if meanings else [
                        {"label": "家宅", "value": "待补充"},
                        {"label": "自身", "value": "待补充"},
                        {"label": "求财", "value": "待补充"},
                        {"label": "交易", "value": "待补充"},
                        {"label": "婚姻", "value": "待补充"},
                    ],
                    "advice": advice or f"第{lot_id}签建议"
                }
        except Exception as e:
            continue
    
    return None

def collect_guanyin_lots() -> List[Dict]:
    """Collect 观音灵签 lots 4-100"""
    print("📿 Collecting 观音灵签 (Guan Yin)...")
    lots = []
    existing_ids = {1, 2, 3}  # Already have these
    
    # Try scraping all lots
    print("  🔍 Attempting to scrape from online sources...")
    scraped_count = 0
    for i in range(4, 101):
        if i in existing_ids:
            continue
        
        # Check if we already have this lot
        if any(l.get('id') == i for l in lots):
            continue
        
        if i % 10 == 0:
            print(f"    Progress: {i}/100...", flush=True)
        
        lot = scrape_guanyin_lot(i)
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            lots.append(lot)
            scraped_count += 1
        else:
            # Create placeholder structure
            lot = {
            "id": i,
            "fortune": "中签",
            "poem": [f"签文第{i}首第一句", f"签文第{i}首第二句", f"签文第{i}首第三句", f"签文第{i}首第四句"],
            "poemAnalysis": f"第{i}签诗意解析",
            "story": f"第{i}签典故",
            "interpretation": f"第{i}签解曰",
            "meanings": [
                {"label": "家宅", "value": "待补充"},
                {"label": "自身", "value": "待补充"},
                {"label": "求财", "value": "待补充"},
                {"label": "交易", "value": "待补充"},
                {"label": "婚姻", "value": "待补充"},
            ],
            "advice": f"第{i}签建议"
            }
            lots.append(lot)
        
        # Rate limiting - only delay if we got real data
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            time.sleep(0.3)  # Small delay for successful scrapes
        else:
            time.sleep(0.05)  # Very small delay for placeholders
    
    print(f"✅ Collected {len(lots)} 观音灵签 lots ({scraped_count} scraped, {len(lots)-scraped_count} placeholders)")
    return lots

# ============================================================================
# WONG TAI SIN (黄大仙) Scraper
# ============================================================================

def scrape_wongtaisin_lot(lot_id: int) -> Optional[Dict]:
    """Scrape a single Wong Tai Sin lot - uses same structure as Guan Yin"""
    sources = [
        f"https://m.k366.com/qian/lqhdx_{lot_id}.htm",  # Primary source (same pattern as Guan Yin)
        f"https://m.zhouyi.cc/lingqian/huangdaxian/{lot_id}.html",
    ]
    
    for url in sources:
        soup = safe_request(url, retries=1)
        if soup is None:
            continue
        
        try:
            # Use same extraction logic as Guan Yin
            poem_lines = []
            all_text = soup.get_text()
            
            # Method 1: Look for text in qian_table div after "签诗" marker
            poem_elem = soup.select_one('.qian_table, [class*="qian"]')
            if poem_elem:
                text = poem_elem.get_text()
                chinese_chars = ''.join(re.findall(r'[\u4e00-\u9fff]', text))
                
                # Look for pattern after "签诗"
                if '签诗' in chinese_chars:
                    idx = chinese_chars.find('签诗')
                    start_idx = idx + len('签诗')
                    if start_idx + 28 <= len(chinese_chars):
                        candidate = chinese_chars[start_idx:start_idx+28]
                        lines = [candidate[j:j+7] for j in range(0, 28, 7)]
                        if all(len(line) == 7 for line in lines):
                            if '签' not in candidate[7:] and '诗' not in candidate[7:]:
                                poem_lines = lines
            
            # Extract fortune, story, etc. (same as Guan Yin)
            fortune = "中签"
            title = soup.title.string if soup.title else ""
            if '上上' in title or '大吉' in title:
                fortune = "上上签"
            elif '上' in title and '上上' not in title:
                fortune = "上签"
            elif '中中' in title or '中' in title:
                fortune = "中签"
            elif '中下' in title:
                fortune = "中下签"
            elif '下下' in title or '凶' in title:
                fortune = "下下签"
            
            # Extract story from title
            story = ""
            if '【' in title or '、' in title:
                # Pattern: "第X签_故事名、..."
                parts = re.split(r'[、_]', title)
                if len(parts) > 1:
                    story = parts[1].split('解签')[0].strip()
            
            # Extract interpretation
            interpretation = ""
            content_text = soup.get_text()
            if '【解曰】' in content_text or '解曰' in content_text:
                match = re.search(r'【解曰】([^【]+)', content_text)
                if not match:
                    match = re.search(r'解曰[：:]([^\n]+)', content_text)
                if match:
                    interpretation = match.group(1).strip()[:200]
            
            # Extract advice
            advice = ""
            if '【详解】' in content_text or '详解' in content_text:
                match = re.search(r'【详解】([^【]+)', content_text)
                if match:
                    advice = match.group(1).strip()[:300]
            
            if poem_lines and len(poem_lines) >= 4:
                return {
                    "id": lot_id,
                    "fortune": fortune,
                    "poem": poem_lines[:4],
                    "story": story or f"第{lot_id}签典故",
                    "interpretation": interpretation or f"第{lot_id}签解签",
                    "advice": advice or f"第{lot_id}签建议"
                }
        except Exception as e:
            continue
    
    return None

def collect_wongtaisin_lots() -> List[Dict]:
    """Collect 黄大仙灵签 lots 2-100"""
    print("🏮 Collecting 黄大仙灵签 (Wong Tai Sin)...")
    lots = []
    existing_ids = {1}
    
    # Try scraping all lots
    print("  🔍 Attempting to scrape from online sources...")
    scraped_count = 0
    for i in range(2, 101):
        if i in existing_ids:
            continue
        
        if any(l.get('id') == i for l in lots):
            continue
        
        if i % 10 == 0:
            print(f"    Progress: {i}/100...", flush=True)
        
        lot = scrape_wongtaisin_lot(i)
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            lots.append(lot)
            scraped_count += 1
        else:
            lot = {
                "id": i,
                "fortune": "中签",
                "poem": [f"黄大仙第{i}签第一句", f"第二句", f"第三句", f"第四句"],
                "story": f"第{i}签典故",
                "interpretation": f"第{i}签解签",
                "advice": f"第{i}签建议"
            }
            lots.append(lot)
        
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            time.sleep(0.3)
        else:
            time.sleep(0.05)
    
    print(f"✅ Collected {len(lots)} 黄大仙 lots ({scraped_count} scraped, {len(lots)-scraped_count} placeholders)")
    return lots

# ============================================================================
# YUE LAO (月老) Scraper
# ============================================================================

def scrape_yuelao_lot(lot_id: int) -> Optional[Dict]:
    """Scrape a single Yue Lao lot - different format (not 7-char lines)"""
    sources = [
        f"https://m.smxs.com/ylyyq/jieqian/id/{lot_id}.html",  # Primary source
        f"https://services.shen88.cn/chouqian/yinyuan-{lot_id}.html",
    ]
    
    for url in sources:
        soup = safe_request(url, retries=1)
        if soup is None:
            continue
        
        try:
            poem_lines = []
            all_text = soup.get_text()
            
            # Extract poem from 【签文】 marker
            # Yue Lao poems are typically 2 lines (14 chars total) or 4 shorter lines
            if '【签文】' in all_text:
                parts = all_text.split('【签文】')
                if len(parts) > 1:
                    poem_section = parts[1].split('【')[0].strip()  # Get text before next marker
                    # Extract Chinese characters
                    chinese_chars = ''.join(re.findall(r'[\u4e00-\u9fff]', poem_section))
                    
                    # Yue Lao poems can be 2 lines of 7 chars (14 total) or 4 shorter lines
                    if len(chinese_chars) >= 14:
                        # Try 2 lines of 7 chars first
                        if len(chinese_chars) == 14:
                            poem_lines = [chinese_chars[0:7], chinese_chars[7:14]]
                        else:
                            # Split by punctuation for 4-line format
                            lines = re.split(r'[，。；\n]', poem_section)
                            poem_lines = [l.strip() for l in lines if l.strip() and len(l.strip()) >= 3][:4]
                    else:
                        # Fallback: split by punctuation
                        lines = re.split(r'[，。；\n]', poem_section)
                        poem_lines = [l.strip() for l in lines if l.strip() and len(l.strip()) >= 2][:4]
                    
                    # Ensure we have at least 2 lines, pad to 4 if needed
                    if len(poem_lines) == 2:
                        # Duplicate or pad to make 4 lines (some systems expect 4)
                        poem_lines = poem_lines + [''] * (4 - len(poem_lines))
                    elif len(poem_lines) < 2:
                        poem_lines = []
            
            # Extract fortune (Yue Lao uses different indicators)
            fortune = "中签"
            if '上签' in all_text or '上上签' in all_text:
                fortune = "上签"
            elif '中签' in all_text:
                fortune = "中签"
            elif '下签' in all_text or '下下签' in all_text:
                fortune = "下下签"
            
            # Extract story (usually in title or content)
            story = ""
            title = soup.title.string if soup.title else ""
            if '第' in title and '签' in title:
                # Extract story from title if available
                match = re.search(r'第\d+签[^解]*', title)
                if match:
                    story = match.group(0).replace('第', '').replace('签', '').strip()
            
            # Extract interpretation
            interpretation = ""
            if '【解签】' in all_text or '解签' in all_text:
                match = re.search(r'【解签】([^【]+)', all_text)
                if not match:
                    match = re.search(r'解签[：:]([^\n]+)', all_text)
                if match:
                    interpretation = match.group(1).strip()[:200]
            
            # Extract advice (from various sections)
            advice = ""
            # Yue Lao has specific indices - extract if available
            if '【缘份指数】' in all_text or '【幸福指数】' in all_text:
                # Extract index information as advice
                indices = []
                for idx_type in ['缘份指数', '幸福指数', '暧昧指数', '缠绵指数']:
                    match = re.search(rf'【{idx_type}】[^\d]*(\d+)', all_text)
                    if match:
                        indices.append(f'{idx_type}: {match.group(1)}')
                if indices:
                    advice = '；'.join(indices)
            
            # Yue Lao poems can be 2 or 4 lines
            if poem_lines and len(poem_lines) >= 2:
                # Ensure we have 4 elements (pad with empty strings if needed)
                while len(poem_lines) < 4:
                    poem_lines.append('')
                return {
                    "id": lot_id,
                    "fortune": fortune,
                    "poem": poem_lines[:4],
                    "story": story or f"第{lot_id}签典故",
                    "interpretation": interpretation or f"第{lot_id}签解签",
                    "advice": advice or f"第{lot_id}签姻缘建议"
                }
        except Exception as e:
            continue
    
    return None

def collect_yuelao_lots() -> List[Dict]:
    """Collect 月老灵签 lots 2-60"""
    print("💕 Collecting 月老灵签 (Yue Lao)...")
    lots = []
    existing_ids = {1}
    
    # Try scraping all lots
    print("  🔍 Attempting to scrape from online sources...")
    scraped_count = 0
    for i in range(2, 61):
        if i in existing_ids:
            continue
        
        if any(l.get('id') == i for l in lots):
            continue
        
        if i % 10 == 0:
            print(f"    Progress: {i}/60...", flush=True)
        
        lot = scrape_yuelao_lot(i)
        if lot and len(lot.get('poem', [])) >= 2 and any(l.strip() for l in lot.get('poem', [])[:2]) and '待补充' not in str(lot.get('poem', [])):
            lots.append(lot)
            scraped_count += 1
        else:
            lot = {
                "id": i,
                "fortune": "中签",
                "poem": [f"月老第{i}签第一句", f"第二句", f"第三句", f"第四句"],
                "story": f"第{i}签典故",
                "interpretation": f"第{i}签解签",
                "advice": f"第{i}签姻缘建议"
            }
            lots.append(lot)
        
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            time.sleep(0.3)
        else:
            time.sleep(0.05)
    
    print(f"✅ Collected {len(lots)} 月老 lots ({scraped_count} scraped, {len(lots)-scraped_count} placeholders)")
    return lots

# ============================================================================
# LV ZU (吕祖) Scraper
# ============================================================================

def scrape_lvzu_lot(lot_id: int) -> Optional[Dict]:
    """Scrape a single Lu Zu lot - uses same structure as Guan Yin"""
    sources = [
        f"https://m.k366.com/qian/lqlz_{lot_id}.htm",  # Primary source (same pattern)
        f"https://m.zhouyi.cc/lingqian/lvzu/{lot_id}.html",
    ]
    
    for url in sources:
        soup = safe_request(url, retries=1)
        if soup is None:
            continue
        
        try:
            # Use same extraction logic as Guan Yin
            poem_lines = []
            all_text = soup.get_text()
            
            # Method 1: Look for text in qian_table div after "签诗" marker
            poem_elem = soup.select_one('.qian_table, [class*="qian"]')
            if poem_elem:
                text = poem_elem.get_text()
                chinese_chars = ''.join(re.findall(r'[\u4e00-\u9fff]', text))
                
                # Look for pattern after "签诗"
                if '签诗' in chinese_chars:
                    idx = chinese_chars.find('签诗')
                    start_idx = idx + len('签诗')
                    if start_idx + 28 <= len(chinese_chars):
                        candidate = chinese_chars[start_idx:start_idx+28]
                        lines = [candidate[j:j+7] for j in range(0, 28, 7)]
                        if all(len(line) == 7 for line in lines):
                            if '签' not in candidate[7:] and '诗' not in candidate[7:]:
                                poem_lines = lines
            
            # Extract fortune, story, etc.
            fortune = "中签"
            title = soup.title.string if soup.title else ""
            if '上上' in title or '大吉' in title:
                fortune = "上上签"
            elif '上' in title and '上上' not in title:
                fortune = "上签"
            elif '中中' in title or '中' in title:
                fortune = "中签"
            elif '中下' in title:
                fortune = "中下签"
            elif '下下' in title or '凶' in title:
                fortune = "下下签"
            
            # Extract story from title
            story = ""
            if '【' in title or '、' in title or '古人' in title:
                # Pattern: "第X签_古人故事名、..."
                parts = re.split(r'[、_]', title)
                if len(parts) > 1:
                    story = parts[1].split('解签')[0].replace('古人', '').strip()
            
            # Extract interpretation
            interpretation = ""
            content_text = soup.get_text()
            if '【解曰】' in content_text or '解曰' in content_text:
                match = re.search(r'【解曰】([^【]+)', content_text)
                if not match:
                    match = re.search(r'解曰[：:]([^\n]+)', content_text)
                if match:
                    interpretation = match.group(1).strip()[:200]
            
            # Extract advice
            advice = ""
            if '【详解】' in content_text or '详解' in content_text:
                match = re.search(r'【详解】([^【]+)', content_text)
                if match:
                    advice = match.group(1).strip()[:300]
            
            if poem_lines and len(poem_lines) >= 4:
                return {
                    "id": lot_id,
                    "fortune": fortune,
                    "poem": poem_lines[:4],
                    "story": story or f"第{lot_id}签典故",
                    "interpretation": interpretation or f"第{lot_id}签解签",
                    "advice": advice or f"第{lot_id}签修行建议"
                }
        except Exception as e:
            continue
    
    return None

def collect_lvzu_lots() -> List[Dict]:
    """Collect 吕祖灵签 lots 2-100"""
    print("⚡ Collecting 吕祖灵签 (Lu Zu)...")
    lots = []
    existing_ids = {1}
    
    # Try scraping all lots
    print("  🔍 Attempting to scrape from online sources...")
    scraped_count = 0
    for i in range(2, 101):
        if i in existing_ids:
            continue
        
        if any(l.get('id') == i for l in lots):
            continue
        
        if i % 10 == 0:
            print(f"    Progress: {i}/100...", flush=True)
        
        lot = scrape_lvzu_lot(i)
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            lots.append(lot)
            scraped_count += 1
        else:
            lot = {
                "id": i,
                "fortune": "中签",
                "poem": [f"吕祖第{i}签第一句", f"第二句", f"第三句", f"第四句"],
                "story": f"第{i}签典故",
                "interpretation": f"第{i}签解签",
                "advice": f"第{i}签修行建议"
            }
            lots.append(lot)
        
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            time.sleep(0.3)
        else:
            time.sleep(0.05)
    
    print(f"✅ Collected {len(lots)} 吕祖 lots ({scraped_count} scraped, {len(lots)-scraped_count} placeholders)")
    return lots

# ============================================================================
# MAZU (妈祖) Scraper
# ============================================================================

def scrape_mazu_lot(lot_id: int) -> Optional[Dict]:
    """Scrape a single Mazu lot - different format"""
    sources = [
        f"https://m.smxs.com/mazu/jieqian/id/{lot_id}.html",  # Primary source
        f"https://services.shen88.cn/chouqian/tianhou-{lot_id}.html",
    ]
    
    for url in sources:
        soup = safe_request(url, retries=1)
        if soup is None:
            continue
        
        try:
            poem_lines = []
            all_text = soup.get_text()
            
            # Extract poem from 【签诗】 marker
            if '【签诗】' in all_text:
                parts = all_text.split('【签诗】')
                if len(parts) > 1:
                    poem_section = parts[1].split('【')[0].strip()  # Get text before next marker
                    # Split by punctuation (，。；)
                    lines = re.split(r'[，。；\n]', poem_section)
                    poem_lines = [l.strip() for l in lines if l.strip() and len(l.strip()) >= 3][:4]
            
            # Extract fortune from title
            fortune = "中签"
            title = soup.title.string if soup.title else ""
            if '上签' in title or '上上签' in title:
                fortune = "上签"
            elif '中签' in title:
                fortune = "中签"
            elif '下签' in title or '下下签' in title:
                fortune = "下下签"
            
            # Extract story from 【签诗典故】
            story = ""
            if '【签诗典故】' in all_text or '典故' in all_text:
                match = re.search(r'【签诗典故】([^【]+)', all_text)
                if not match:
                    # Look for story name in title
                    if '【' in title:
                        match = re.search(r'【([^】]+)】', title)
                        if match:
                            story = match.group(1).split('、')[0].strip()
            
            # Extract interpretation from 【解曰】
            interpretation = ""
            if '【解曰】' in all_text:
                match = re.search(r'【解曰】([^【]+)', all_text)
                if match:
                    interpretation = match.group(1).strip()[:200]
            
            # Extract advice from 【签诗语译】 or other sections
            advice = ""
            if '【签诗语译】' in all_text:
                match = re.search(r'【签诗语译】([^【]+)', all_text)
                if match:
                    advice = match.group(1).strip()[:300]
            
            if poem_lines and len(poem_lines) >= 4:
                return {
                    "id": lot_id,
                    "fortune": fortune,
                    "poem": poem_lines[:4],
                    "story": story or f"第{lot_id}签典故",
                    "interpretation": interpretation or f"第{lot_id}签解签",
                    "advice": advice or f"第{lot_id}签出行建议"
                }
        except Exception as e:
            continue
    
    return None

def collect_mazu_lots() -> List[Dict]:
    """Collect 妈祖灵签 lots 2-60"""
    print("🌊 Collecting 妈祖灵签 (Mazu)...")
    lots = []
    existing_ids = {1}
    
    # Try scraping all lots
    print("  🔍 Attempting to scrape from online sources...")
    scraped_count = 0
    for i in range(2, 61):
        if i in existing_ids:
            continue
        
        if any(l.get('id') == i for l in lots):
            continue
        
        if i % 10 == 0:
            print(f"    Progress: {i}/60...", flush=True)
        
        lot = scrape_mazu_lot(i)
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            lots.append(lot)
            scraped_count += 1
        else:
            lot = {
                "id": i,
                "fortune": "中签",
                "poem": [f"妈祖第{i}签第一句", f"第二句", f"第三句", f"第四句"],
                "story": f"第{i}签典故",
                "interpretation": f"第{i}签解签",
                "advice": f"第{i}签出行建议"
            }
            lots.append(lot)
        
        if lot and len(lot.get('poem', [])) == 4 and '待补充' not in str(lot.get('poem', [])):
            time.sleep(0.3)
        else:
            time.sleep(0.05)
    
    print(f"✅ Collected {len(lots)} 妈祖 lots ({scraped_count} scraped, {len(lots)-scraped_count} placeholders)")
    return lots

# ============================================================================
# Data Export Functions
# ============================================================================

def save_to_json(all_data: Dict, output_file: str = "collected_divination_data.json"):
    """Save collected data to JSON file"""
    print(f"\n💾 Saving to JSON: {output_file}...")
    
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Saved to {output_path.absolute()}")

def escape_ts_string(s: str) -> str:
    """Escape string for TypeScript"""
    if s is None:
        return ""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '')

def format_ts_value(value) -> str:
    """Format a Python value as TypeScript"""
    if isinstance(value, str):
        return f'"{escape_ts_string(value)}"'
    elif isinstance(value, (list, tuple)):
        items = ', '.join(format_ts_value(item) for item in value)
        return f'[{items}]'
    elif isinstance(value, dict):
        items = ', '.join(f'"{k}": {format_ts_value(v)}' for k, v in value.items())
        return f'{{{items}}}'
    elif value is None:
        return '""'
    else:
        return str(value)

def generate_typescript_file(all_data: Dict, output_file: str = "src/data/collected_divination_data.ts"):
    """Generate TypeScript file with collected data"""
    print(f"\n💾 Generating TypeScript file: {output_file}...")
    
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    ts_content = '''// Collected Divination Data
// Auto-generated by collect_all_divination_data.py
// This file contains all collected lots from 5 Chinese divination systems

export interface DivinationSystemLot {
  id: number;
  fortune: string;
  poem: string[];
  story: string;
  interpretation: string;
  advice: string;
}

export interface GuanYinLot extends DivinationSystemLot {
  poemAnalysis: string;
  meanings: { label: string; value: string }[];
}

export const COLLECTED_DIVINATION_DATA = {
'''
    
    # Add each system's data
    for system_name, lots in all_data.items():
        ts_content += f'  {system_name}: [\n'
        for lot in lots:
            ts_content += '    {\n'
            ts_content += f'      id: {lot["id"]},\n'
            ts_content += f'      fortune: {format_ts_value(lot["fortune"])},\n'
            ts_content += f'      poem: {format_ts_value(lot["poem"])},\n'
            
            if "poemAnalysis" in lot:
                ts_content += f'      poemAnalysis: {format_ts_value(lot["poemAnalysis"])},\n'
            
            ts_content += f'      story: {format_ts_value(lot["story"])},\n'
            ts_content += f'      interpretation: {format_ts_value(lot["interpretation"])},\n'
            
            if "meanings" in lot:
                ts_content += '      meanings: [\n'
                for meaning in lot["meanings"]:
                    ts_content += f'        {{ label: {format_ts_value(meaning["label"])}, value: {format_ts_value(meaning["value"])} }},\n'
                ts_content += '      ],\n'
            
            ts_content += f'      advice: {format_ts_value(lot["advice"])},\n'
            ts_content += '    },\n'
        
        ts_content += '  ],\n'
    
    ts_content += '''} as const;

export default COLLECTED_DIVINATION_DATA;
'''
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"✅ Generated TypeScript file: {output_path.absolute()}")

def main():
    print("🚀 Starting Divination Data Collection", flush=True)
    print("=" * 60, flush=True)
    print("This will collect 413 lots from 5 Chinese divination systems", flush=True)
    print("Estimated time: 10-15 minutes (with rate limiting)", flush=True)
    print("=" * 60, flush=True)
    print(flush=True)
    
    start_time = time.time()
    sys.stdout.flush()
    
    all_data = {
        "guanyin": collect_guanyin_lots(),
        "wongtaisin": collect_wongtaisin_lots(),
        "yuelao": collect_yuelao_lots(),
        "lvzu": collect_lvzu_lots(),
        "mazu": collect_mazu_lots()
    }
    
    total_collected = sum(len(lots) for lots in all_data.values())
    elapsed_time = time.time() - start_time
    
    print(f"\n🎉 Collection Complete!")
    print(f"📊 Total lots collected: {total_collected}/413")
    print(f"⏱️  Time elapsed: {elapsed_time/60:.1f} minutes")
    
    # Save to JSON
    save_to_json(all_data)
    
    # Generate TypeScript file
    generate_typescript_file(all_data)
    
    print("\n✅ All done!")
    print("\n📝 Next steps:")
    print("   1. Review collected_divination_data.json")
    print("   2. Check src/data/collected_divination_data.ts")
    print("   3. Merge with existing data in chineseDivinationSystems.ts")
    print("\n⚠️  NOTE: Some lots may have placeholder data if scraping failed.")
    print("   You may need to manually verify and update specific lots.")

if __name__ == "__main__":
    main()
