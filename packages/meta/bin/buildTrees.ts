import { createReadStream, writeFileSync } from 'fs'
import { join } from 'path'
import csv from 'csv-parser'

import { AzaMeta, AzaTree, PrefectureTree } from '../src'

const ORIGINAL_DATA_FILE = join(__dirname, '..', 'src/vendor/japanese-addresses/data/latest.csv')
const AZA_TREE_FILE = join(__dirname, '..', 'src/vendor/japanese-addresses-aza.json')
const MUNICIPALITY_TREE_FILE = join(__dirname, '..', 'src/vendor/japanese-addresses-municipality.json')

interface JapaneseAddress {
  '都道府県コード': string
  '都道府県名': string
  '都道府県名カナ': string
  '都道府県名ローマ字': string
  '市区町村コード': string
  '市区町村名': string
  '市区町村名カナ': string
  '市区町村名ローマ字': string
  '大字町丁目コード': string
  '大字町丁目名': string
  '緯度': string
  '経度': string
}

const appendTree = (branch: AzaTree, [head, ...rest]: string[], leafMeta: AzaMeta) => {
  if (!branch[head]) branch[head] = {}
  if (rest.length === 0) {
    branch[head].leaf = leafMeta
  } else {
    appendTree(branch[head], rest, leafMeta)
  }
}

const tree: AzaTree = {}
const prefectures: PrefectureTree = {}
createReadStream(ORIGINAL_DATA_FILE)
  .pipe(csv())
  .on('data', (line: JapaneseAddress) => {
    const azaChars = line['大字町丁目名'].split('')
    appendTree(tree, azaChars, { id: line['大字町丁目コード'], latitude: Number(line['緯度']), longitude: Number(line['経度']) })

    if (!prefectures[line['都道府県コード']]) {
      prefectures[line['都道府県コード']] = {
        name: line['都道府県名'],
        municipalities: {}
      }
    }
    if (!prefectures[line['都道府県コード']].municipalities[line['市区町村コード']]) {
      prefectures[line['都道府県コード']].municipalities[line['市区町村コード']] = {
        name: line['市区町村名']
      }
    }
  })
  .on('end', () => {
    writeFileSync(AZA_TREE_FILE, JSON.stringify(tree))
    writeFileSync(MUNICIPALITY_TREE_FILE, JSON.stringify(prefectures))
  })
