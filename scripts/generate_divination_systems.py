#!/usr/bin/env python3
"""
Create a comprehensive Chinese divination system with multiple traditions.
This is a starter template - you can extend with full datasets.
"""

# Sample data for different divination systems
DIVINATION_SYSTEMS = {
    "guanyin": {
        "name": "观音灵签",
        "name_en": "Guan Yin Oracle",
        "description": "Compassionate guidance from Avalokitesvara Bodhisattva",
        "total_lots": 100,
        "sample_lots": [
            {
                "id": 1,
                "fortune": "上上签",
                "poem": ["天开地辟结良缘", "日吉时良万事全", "若得此签非小可", "人行中正帝王宣"],
                "story": "锤离成道",
                "interpretation": "急速兆速,年未值时,观音降笔,先报君知",
                "advice": "此签为上上签,预示天地初开、万象更新的吉兆。"
            }
        ]
    },
    "wongtaisin": {
        "name": "黄大仙灵签",
        "name_en": "Wong Tai Sin Oracle",
        "description": "Powerful divination from the Immortal Wong Tai Sin",
        "total_lots": 100,
        "sample_lots": [
            {
                "id": 1,
                "fortune": "上上签",
                "poem": ["开天辟地作良缘", "吉日良时万物全", "若得此签非小可", "人行忠正帝王宣"],
                "story": "宋太祖黄袍加身",
                "interpretation": "此卦盘古初开天地之象,诸事皆吉",
                "advice": "时来运到,万事如意,可以大展鸿图。"
            }
        ]
    },
    "yuelao": {
        "name": "月老灵签",
        "name_en": "Yue Lao Oracle",
        "description": "Divine guidance for love and marriage from the Matchmaker God",
        "total_lots": 60,
        "sample_lots": [
            {
                "id": 1,
                "fortune": "上签",
                "poem": ["关关雎鸠在河之洲", "窈窕淑女君子好逑", "求之不得寤寐思服", "悠哉悠哉辗转反侧"],
                "story": "关雎之诗",
                "interpretation": "姻缘天定,有缘千里来相会",
                "advice": "此签主姻缘美满,有情人终成眷属。"
            }
        ]
    },
    "lvzu": {
        "name": "吕祖灵签",
        "name_en": "Lu Zu Oracle",
        "description": "Mystical wisdom from Immortal Lu Dongbin",
        "total_lots": 100,
        "sample_lots": [
            {
                "id": 1,
                "fortune": "上上签",
                "poem": ["日出便见风云散", "光明清净照世间", "一向前途通大道", "万事清吉保平安"],
                "story": "吕祖得道",
                "interpretation": "云开见日,否极泰来",
                "advice": "前路光明,诸事顺遂,宜积极进取。"
            }
        ]
    },
    "mazu": {
        "name": "妈祖灵签",
        "name_en": "Mazu Oracle",
        "description": "Protection and guidance from the Goddess of the Sea",
        "total_lots": 60,
        "sample_lots": [
            {
                "id": 1,
                "fortune": "上签",
                "poem": ["天后慈悲降吉祥", "风调雨顺保平安", "出入行船皆顺利", "家宅兴旺福禄全"],
                "story": "妈祖显灵",
                "interpretation": "天后庇佑,出入平安",
                "advice": "此签主平安顺遂,适合出行经商。"
            }
        ]
    }
}

def generate_typescript():
    """Generate TypeScript file with all divination systems"""
    
    ts_content = '''// Comprehensive Chinese Divination Systems
// Multiple traditional oracle systems integrated

export interface DivinationSystemLot {
  id: number;
  fortune: string;
  poem: string[];
  story: string;
  interpretation: string;
  advice: string;
}

export interface DivinationSystem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  totalLots: number;
  lots: DivinationSystemLot[];
}

export const DIVINATION_SYSTEMS: Record<string, DivinationSystem> = {
'''
    
    for sys_id, system in DIVINATION_SYSTEMS.items():
        ts_content += f'''  {sys_id}: {{
    id: "{sys_id}",
    name: "{system['name']}",
    nameEn: "{system['name_en']}",
    description: "{system['description']}",
    totalLots: {system['total_lots']},
    lots: [
'''
        for lot in system['sample_lots']:
            ts_content += f'''      {{
        id: {lot['id']},
        fortune: "{lot['fortune']}",
        poem: {str(lot['poem']).replace("'", '"')},
        story: "{lot['story']}",
        interpretation: "{lot['interpretation']}",
        advice: "{lot['advice']}"
      }},
'''
        ts_content += '''    ]
  },
'''
    
    ts_content += '''};

// Helper to get available systems
export const getAvailableSystems = () => Object.keys(DIVINATION_SYSTEMS);

// Helper to get system by ID
export const getSystem = (id: string) => DIVINATION_SYSTEMS[id];
'''
    
    return ts_content

if __name__ == "__main__":
    ts_code = generate_typescript()
    
    output_file = "src/data/chineseDivinationSystems.ts"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(ts_code)
    
    print(f"✅ Generated {output_file} with {len(DIVINATION_SYSTEMS)} Chinese divination systems:")
    for sys_id, system in DIVINATION_SYSTEMS.items():
        print(f"   - {system['name']} ({system['name_en']}) - {system['total_lots']} lots")
    print("\n📝 Note: This is a starter dataset with 1 sample lot per system.")
    print("   You can extend each system with the full lot collection.")
