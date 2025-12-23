import { COLLECTED_DIVINATION_DATA } from './collected_divination_data';

export interface DivinationSystemLot {
  id: number;
  fortune: string;
  poem: readonly string[];
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
  lots: readonly DivinationSystemLot[];
}

// Helper to get lots or fallback to sample
const getLots = (systemKey: keyof typeof COLLECTED_DIVINATION_DATA, sampleLots: readonly DivinationSystemLot[]) => {
  const collected = COLLECTED_DIVINATION_DATA[systemKey];
  return collected && collected.length > 0 ? collected : sampleLots;
};

export const DIVINATION_SYSTEMS: Record<string, DivinationSystem> = {
  guanyin: {
    id: "guanyin",
    name: "观音灵签",
    nameEn: "Guan Yin Oracle",
    description: "Compassionate guidance from Avalokitesvara Bodhisattva",
    totalLots: 100,
    lots: getLots('guanyin', [
      {
        id: 1,
        fortune: "上上签",
        poem: ["天开地辟结良缘", "日吉时良万事全", "若得此签非小可", "人行中正帝王宣"],
        story: "锤离成道",
        interpretation: "急速兆速,年未值时,观音降笔,先报君知",
        advice: "此签为上上签,预示天地初开、万象更新的吉兆。"
      }
    ])
  },
  wongtaisin: {
    id: "wongtaisin",
    name: "黄大仙灵签",
    nameEn: "Wong Tai Sin Oracle",
    description: "Powerful divination from the Immortal Wong Tai Sin",
    totalLots: 100,
    lots: getLots('wongtaisin', [
      {
        id: 1,
        fortune: "上上签",
        poem: ["开天辟地作良缘", "吉日良时万物全", "若得此签非小可", "人行忠正帝王宣"],
        story: "宋太祖黄袍加身",
        interpretation: "此卦盘古初开天地之象,诸事皆吉",
        advice: "时来运到,万事如意,可以大展鸿图。"
      }
    ])
  },
  yuelao: {
    id: "yuelao",
    name: "月老灵签",
    nameEn: "Yue Lao Oracle",
    description: "Divine guidance for love and marriage from the Matchmaker God",
    totalLots: 60,
    lots: getLots('yuelao', [
      {
        id: 1,
        fortune: "上签",
        poem: ["关关雎鸠在河之洲", "窈窕淑女君子好逑", "求之不得寤寐思服", "悠哉悠哉辗转反侧"],
        story: "关雎之诗",
        interpretation: "姻缘天定,有缘千里来相会",
        advice: "此签主姻缘美满,有情人终成眷属。"
      }
    ])
  },
  lvzu: {
    id: "lvzu",
    name: "吕祖灵签",
    nameEn: "Lu Zu Oracle",
    description: "Mystical wisdom from Immortal Lu Dongbin",
    totalLots: 100,
    lots: getLots('lvzu', [
      {
        id: 1,
        fortune: "上上签",
        poem: ["日出便见风云散", "光明清净照世间", "一向前途通大道", "万事清吉保平安"],
        story: "吕祖得道",
        interpretation: "云开见日,否极泰来",
        advice: "前路光明,诸事顺遂,宜积极进取。"
      }
    ])
  },
  mazu: {
    id: "mazu",
    name: "妈祖灵签",
    nameEn: "Mazu Oracle",
    description: "Protection and guidance from the Goddess of the Sea",
    totalLots: 60,
    lots: getLots('mazu', [
      {
        id: 1,
        fortune: "上签",
        poem: ["天后慈悲降吉祥", "风调雨顺保平安", "出入行船皆顺利", "家宅兴旺福禄全"],
        story: "妈祖救难",
        interpretation: "天后庇佑,出入平安",
        advice: "此签主平安顺遂,适合出行经商。"
      }
    ])
  }
};

// Helper to get available systems
export const getAvailableSystems = () => Object.keys(DIVINATION_SYSTEMS);

// Helper to get system by ID
export const getSystem = (id: string) => DIVINATION_SYSTEMS[id];
