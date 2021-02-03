// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { addresses, municipalities } from './vendor.js'

export type AzaTree = {
  [branch: string]: AzaTree
} & {
  leaf?: AzaMeta[]
}

export interface AzaMeta {
  id: string
  postalCodes: string[]
  postalCode?: string
  latitude: number
  longitude: number
}

export interface PrefectureTree {
  [prefectureCode :string]: {
    name: string
    municipalities: {
      [municipalityCode: string]: {
        name: string
      }
    }
  }
}

export interface AzaMetaWithName extends AzaMeta {
  name: string
  editDistance?: number
  prefecture?: string
  municipality?: string
}

const walkTree = (tree: AzaTree, [head, ...rest]: string[]): AzaTree => {
  if (tree[head]) {
    return walkTree(tree[head], rest)
  } else if (head) {
    return {}
  } else {
    return tree
  }
}

const gatherLeafs = (tree: AzaTree): AzaMetaWithName[] => {
  const results: AzaMetaWithName[] = []
  Object.keys(tree).forEach(key => {
    if (key === 'leaf') {
      tree.leaf?.forEach((l) => {
        results.push({ ...l, name: '' })
      })
    } else {
      results.push(...gatherLeafs(tree[key]).map(leaf => ({ ...leaf, name: key + leaf.name })))
    }
  })
  return results
}

const getMunicipality = (azaCode: string): { prefecture: string, municipality: string } => {
  const prefectureRoot = (municipalities as PrefectureTree)[azaCode.substring(0, 2)]
  const municipalityRoot = prefectureRoot.municipalities[azaCode.substring(0, 5)]

  return {
    prefecture: prefectureRoot.name,
    municipality: municipalityRoot?.name ?? azaCode.substring(0, 5)
  }
}

const numInKanji = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export const search = (term: string): AzaMetaWithName[] => {
  const sanitizedTerm = term.replace(/([\d０-９]{1,2})(丁目|条|$)/g, (_match, nums: string, suffix) => {
    const normalizedNumString = nums.split('').map(numString => numString.charCodeAt(0) >= '０'.charCodeAt(0) ? String.fromCharCode(numString.charCodeAt(0) - 0xFEE0) : numString)
    if (normalizedNumString.length == 2) {
      return ['十', '二十', '三十', '四十'][Number(normalizedNumString[0]) - 1] + numInKanji[Number(normalizedNumString[1])] + suffix
    } else {
      return numInKanji[Number(normalizedNumString)] + suffix
    }
  })

  const resultLeafs = gatherLeafs(walkTree(addresses as AzaTree, sanitizedTerm.split(''))).map((leaf) => {
    const { prefecture, municipality } = getMunicipality(leaf.id)
    return { ...leaf, name: sanitizedTerm + leaf.name, editDistance: leaf.name.length, postalCodes: leaf.postalCodes, prefecture, municipality }
  })

  const resultLeafsWithOhaza = gatherLeafs(walkTree(addresses as AzaTree, ('大字' + sanitizedTerm).split(''))).map((leaf) => {
    const { prefecture, municipality } = getMunicipality(leaf.id)
    return { ...leaf, name: '大字' + sanitizedTerm + leaf.name, editDistance: leaf.name.length, postalCodes: leaf.postalCodes, prefecture, municipality }
  })

  return [...resultLeafs, ...resultLeafsWithOhaza].sort((a, b) => {
    if (a.editDistance === b.editDistance) {
      if (a.municipality === b.municipality) {
        return a.id < b.id ? -1 : 1
      } else {
        return a.municipality < b.municipality ? -1 : 1
      }
    } else {
      return a.editDistance - b.editDistance
    }
  })
}
