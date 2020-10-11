// @ts-ignore
import { addresses, municipalities } from './vendor.js'

export type AzaTree = {
  [branch: string]: AzaTree
} & {
  leaf?: AzaMeta[]
}

export interface AzaMeta {
  id: string
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

export const search = (term: string): AzaMetaWithName[] => {
  const closestTree = walkTree(addresses as AzaTree, term.split(''))
  return gatherLeafs(closestTree).map((leaf) => {
    const { prefecture, municipality } = getMunicipality(leaf.id)
    return { ...leaf, name: term + leaf.name, prefecture, municipality }
  });
}
