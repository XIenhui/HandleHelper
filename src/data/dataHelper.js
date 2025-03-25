import { A as pinyinMap, I as idiomsOrigin } from './data.js'
export const pinyinToHanzi = new Map(
    Object.entries(pinyinMap)
        .filter(([_, chars]) => chars)
        .map(([py, chars]) => [py, Array.from(chars)])
);

// 汉字到拼音的映射（支持多音字）
export const hanziToPinyin = new Map();
for (const [py, chars] of pinyinToHanzi) {
    for (const char of chars) {
        if (!hanziToPinyin.has(char)) hanziToPinyin.set(char, new Set());
        hanziToPinyin.get(char).add(py);
    }
}

const idioms = idiomsOrigin.split('\n').filter(Boolean); // ["一丁不识", "一不小心", ...]

// 每个成语转换为拼音数组（示例："一丁不识" → ["yi1", "ding1", "bu4", "shi2"])
export const idiomPinyinIndex = idioms.map(idiom => {
    return [idiom, Array.from(idiom).map(char => {
        // 此处需接入真实拼音库，此处简化为示例
        const pinyins = hanziToPinyin.get(char) || [];
        return Array.from(pinyins); // 返回该字所有可能的拼音
    })];
});

export const toneMap = {
    // 元音字母声调映射
    'ā': ['a', 1], 'á': ['a', 2], 'ǎ': ['a', 3], 'à': ['a', 4],
    'ē': ['e', 1], 'é': ['e', 2], 'ě': ['e', 3], 'è': ['e', 4],
    'ī': ['i', 1], 'í': ['i', 2], 'ǐ': ['i', 3], 'ì': ['i', 4],
    'ō': ['o', 1], 'ó': ['o', 2], 'ǒ': ['o', 3], 'ò': ['o', 4],
    'ū': ['u', 1], 'ú': ['u', 2], 'ǔ': ['u', 3], 'ù': ['u', 4],
    'ǖ': ['ü', 1], 'ǘ': ['ü', 2], 'ǚ': ['ü', 3], 'ǜ': ['ü', 4]
};

export function convertPinyin(pinyin) {
    let tone = 0;
    const converted = [];

    // 分解拼音字符并替换带调字符
    for (const char of pinyin) {
        if (toneMap[char]) {
            const [baseChar, detectedTone] = toneMap[char];
            converted.push(baseChar);
            tone = detectedTone; // 始终记录最后一个声调
        } else {
            converted.push(char);
        }
    }

    // 返回转换结果（格式：基础拼音 + 声调数字）
    return converted.join('') + (tone || 0);
}