// Traditional Chinese Guan Yin Ling Qian (观音灵签) 1-100
// Data source: Traditional Chinese temple divination system
// Note: This is a partial dataset. Full 100 lots to be completed.

export interface GuanYinLot {
  id: number;
  fortune: string; // e.g., "上上签", "中下签", "下下签"
  poem: string[]; // Lines of the poem (签文)
  poemAnalysis: string; // Poem interpretation (诗意)
  story: string; // Historical story/allegory (故事/典故)
  interpretation: string; // Basic meaning (解曰)
  meanings: {
    label: string; // Category (e.g., 家宅, 求财)
    value: string; // Prediction
  }[];
  advice: string; // Detailed advice
}

export const GUANYIN_LOTS: GuanYinLot[] = [
  {
    id: 1,
    fortune: "上上签",
    poem: ["天开地辟结良缘", "日吉时良万事全", "若得此签非小可", "人行中正帝王宣"],
    poemAnalysis: "此卦盘古初开天地之象,诸事皆吉",
    story: "锤离成道",
    interpretation: "急速兆速,年未值时,观音降笔,先报君知",
    meanings: [
      { label: "家宅", value: "祈福" },
      { label: "自身", value: "秋冬大利" },
      { label: "求财", value: "秋冬大利" },
      { label: "交易", value: "成" },
      { label: "婚姻", value: "成" },
      { label: "六甲", value: "生男" },
      { label: "行人", value: "至" },
      { label: "田蚕", value: "好" },
      { label: "六畜", value: "好" },
      { label: "寻人", value: "见" },
      { label: "公讼", value: "吉" },
      { label: "移徙", value: "吉" },
      { label: "失物", value: "东北" },
      { label: "疾病", value: "设送" },
      { label: "山坟", value: "吉" },
    ],
    advice: "此签为上上签,预示天地初开、万象更新的吉兆。若得此签,表示时机成熟,万事俱备,只要正直行事,必能成就大业,甚至得到贵人提拔。"
  },
  {
    id: 2,
    fortune: "中下签",
    poem: ["鲸鱼未化守江湖", "未许升腾离碧波", "异日峥嵘身变态", "从教一跃禹门过"],
    poemAnalysis: "此卦鲸鱼未变之象,凡事忍耐待时也",
    story: "苏秦不第",
    interpretation: "得忍且忍,得耐且耐,须待时至,功名还在",
    meanings: [
      { label: "家宅", value: "安" },
      { label: "自身", value: "吉" },
      { label: "求财", value: "待时" },
      { label: "交易", value: "待时" },
      { label: "婚姻", value: "待时" },
      { label: "六甲", value: "男" },
      { label: "行人", value: "迟" },
      { label: "田蚕", value: "晚收" },
      { label: "六畜", value: "不利" },
      { label: "寻人", value: "迟" },
      { label: "公讼", value: "延" },
      { label: "移徙", value: "守旧" },
      { label: "失物", value: "难寻" },
      { label: "疾病", value: "祭星" },
      { label: "山坟", value: "改" },
    ],
    advice: "此签告诫求签者,当前时机尚未成熟,应保持忍耐和等待,不可轻举妄动。如同鲸鱼尚未化龙,需待时机到来方可一跃龙门,成就功名。"
  },
  {
    id: 3,
    fortune: "下下签",
    poem: ["冲风冒雨去还归", "役役劳身似燕儿", "衔得泥来成垒後", "到头垒坏复成泥"],
    poemAnalysis: "此卦燕子衔泥之象,凡事劳心费力也",
    story: "董永遇仙",
    interpretation: "千般用计,晨昏不停,谁知此事,到底劳心",
    meanings: [
      { label: "家宅", value: "不安" },
      { label: "自身", value: "劳心" },
      { label: "求财", value: "劳力" },
      { label: "交易", value: "难" },
      { label: "婚姻", value: "不合" },
      { label: "六甲", value: "虚惊" },
      { label: "行人", value: "阻" },
      { label: "田蚕", value: "不利" },
      { label: "六畜", value: "损" },
      { label: "寻人", value: "难" },
      { label: "公讼", value: "亏" },
      { label: "移徙", value: "守旧" },
      { label: "失物", value: "凶" },
      { label: "疾病", value: "祭星" },
      { label: "山坟", value: "改" },
    ],
    advice: "此签为下下签,比喻像燕子辛劳奔波筑巢,最终却徒劳无功。暗示凡事劳心费力,可能结果不尽人意,需要调整策略,避免无谓的付出。"
  },
];

// Note: This dataset currently contains 3 lots.
// The full traditional Guan Yin Ling Qian contains 100 lots.
// Additional lots will be added to complete the dataset.
