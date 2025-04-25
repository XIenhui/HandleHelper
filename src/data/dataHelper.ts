import {A as pinyinMap, I as idiomsOrigin, P} from './data.js'
import {ElMessage as _message} from "element-plus/es/components/message/index";
import {ref} from "vue";
import {onMounted} from "vue/dist/vue";
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
export const singlePinyinIndex = (cy) => {
    return [cy, Array.from(cy).map(char => {
        // 此处需接入真实拼音库，此处简化为示例
        const pinyins = hanziToPinyin.get(char) || [];
        return Array.from(pinyins); // 返回该字所有可能的拼音
    })];
}
export const initials = [
    'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
    'g', 'k', 'h', 'j', 'q', 'x',
    'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'
]
export const finals = [
    'a', 'o', 'e', 'i', 'u', 'ü',
    'ai', 'ei', 'ui', 'ao', 'ou', 'iu',
    'ie', 'üe', 'er',
    'an', 'en', 'in', 'un', 'ün',
    'ang', 'eng', 'ing', 'ong',
    'ia', 'ua', 'uo', 'ian', 'uan', 'üan',
    'iang', 'uang', 'iong'
]
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

export const parsePy = (pinyin) => {
    const tone = pinyin.match(/[1-4]$/)?.[0] || '0';
    const base = pinyin.replace(tone, '');
    // 分离声母和韵母（支持零声母）
    let initial = '';
    let final = base;
    const initials = ['b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s','y','w'];
    for (let i = Math.min(2, base.length); i > 0; i--) {
        const part = base.slice(0, i);
        if (initials.includes(part)) {
            initial = part;
            final = base.slice(i);
            break;
        }
    }
    return [ initial, final, parseInt(tone) || 0 ];
}
const removeMulti = (data) => {
    const res = new Set
    for (const result of data){
        if (result.length > 0 ) {
            result.forEach(item => {
                res.add(item)
            })
        }
    }
    return [...res]
}
const setChunks = (data) => {
    const chunks = []
    for (let i = 0; i < data.length; i += 6) {
        chunks.push(data.slice(i, i + 6));
    }
    return chunks
}
const pyFilter = (cy = [], type = 0, logic:(data: []) => Boolean): [] => {
    if(type){
        return cy.filter(item => {
            const pinyinArr = item[1].map(item => {
                return item[0].split(',').map(singlePy =>
                    parsePy(convertPinyin(singlePy.replace('ü','v')))
                )
            })
            return logic(pinyinArr)
        })
    }
    return cy.filter(item => {
        const pinyinStr = item[1]
        const pinyinArr = pinyinStr.split(' ').map(parsePy);
        return logic(pinyinArr)
    })
}
const hzFilter = (cy, logic:(data: []) => Boolean)=>{
    return cy.filter(item => {
        const hanziStr = item[0]
        const hanziArr = Array.from(hanziStr);
        return logic(hanziArr)
    })
}
/** type=0: 已有拼音(如['一丘之貉', 'yi1 qiu1 zhi1 he2']);
 * type=1 每个字从库中获取拼音(如['一丁不识', Array(4)]) */
const multiFilter = (cy, type = 0, logic:(data: []) => Boolean)=>{
    let ddd = true
    if(type){
        return cy.filter(item => {
            const hanziArr = Array.from(item[0]);
            const multiArr = item[1].map((pys, index) => {
                const pyArray = pys[0].split(',').map(singlePy =>
                    [...parsePy(convertPinyin(singlePy.replace('ü','v'))), hanziArr[index]]
                )
                return [...pyArray]
            })
            return logic(multiArr)
        })
    }
    return cy.filter(item => {
        const hanziArr = Array.from(item[0]);
        const pinyinStr = item[1];
        const multiArr = pinyinStr.split(' ').map((py, index) => {
            return [...parsePy(py), hanziArr[index]]
        });
        return logic(multiArr)
    })
}
interface FilterInner {
    /**传入filter的数组
     * 0=>拼音[[[声母、韵母、声调]*n]x4]
     * 1=>汉字[汉字x4]
     * 2=>拼音+汉字[[[声母、韵母、声调]*n、汉字]x4]
     * */
    type: Number,
    handle: (data) => Boolean,
}
export interface DataFilter {
    filter1: FilterInner,
    filter2: FilterInner,
}
export interface DataSplit {
    split1: (data) => Array,
    split2: (data) => Array,
}
const filterByType = (filter: FilterInner, data: any[], pyType: number = 0): [] => {
    if (filter.type === 0) {
        return pyFilter(data, pyType, filter.handle)
    }
    else if (filter.type === 1) {
        return hzFilter(data, filter.handle)
    }
    else if (filter.type === 2) {
        return multiFilter(data, pyType, filter.handle)
    }
    else return []
}
export const searchModal = (filters: DataFilter)=>{
    const data = {
        // data0: [...Object.entries(P)],
        data1: [...idiomPinyinIndex],
    }
    const results = []
    //cy => 成语
    for (const [name, cy] of Object.entries(data)){
        let res = cy
        if(name === 'data0'){
            res = filterByType(filters.filter1, res)
        }
        else if(name === 'data1'){
            res = filterByType(filters.filter2, res, 1)
        }
        results.push(res)
    }
    const result = removeMulti(results)
    const chunks = setChunks(result)
    return { result, chunks }
}
export const singleCheckModal = (filter: FilterInner, data)=>{
    const val = [data]
    return filterByType(filter, val, 1).length > 0
}