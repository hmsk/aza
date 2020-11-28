import { createReadStream, writeFileSync } from 'fs'
import { join } from 'path'
import csv from 'csv-parser'

import type { AzaMeta, AzaTree, PrefectureTree } from '../src'

const ORIGINAL_DATA_FILE = join(__dirname, '..', 'src/vendor/japanese-addresses/data/latest.csv')
const SANITIZED_KEN_ALL_FILE = join(__dirname, '..', 'src/vendor/x-ken-all.csv')
const AZA_TREE_FILE = join(__dirname, '..', 'src/vendor/japanese-addresses-aza.json')
const MUNICIPALITY_TREE_FILE = join(__dirname, '..', 'src/vendor/japanese-addresses-municipality.json')

// Download from x-ken-all.csv from http://zipcloud.ibsnet.co.jp/
// Convert encoding with: iconv -f SHIFT-JIS -t UTF-8 x-ken-all.csv
// Then give the first line:
//   "市区町村コード","旧郵便番号","郵便番号","都道府県カナ","市区町村カナ","字カナ","都道府県","市区町村","大字","unknown","unknown","unknown","unknown","unknown","unknown"
interface SanitizedKenAll {
  '市区町村コード': string
  '旧郵便番号': string
  '郵便番号': string
  '都道府県カナ': string
  '市区町村カナ': string
  '都道府県': string
  '市区町村': string
  '大字': string
}

type PostalInfo = { municipalityCode: string; aza: string; postalCode: string }[]

const prepareKenAll = (): Promise<PostalInfo> => {
  return new Promise((resolve) => {
    const postalInfo: PostalInfo = []
    createReadStream(SANITIZED_KEN_ALL_FILE)
      .pipe(csv())
      .on('data', (line: SanitizedKenAll) => {
        postalInfo.push({ municipalityCode: line['市区町村コード'], aza: line['大字'], postalCode: line['郵便番号'] })
      })
      .on('end', () => {
        resolve(postalInfo)
      })
  })
}

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
    if (!branch[head].leaf) {
      branch[head].leaf = []
    }
    branch[head].leaf?.push(leafMeta)
  } else {
    appendTree(branch[head], rest, leafMeta)
  }
}

const tree: AzaTree = {}
const prefectures: PrefectureTree = {}

prepareKenAll().then((postalInfo: PostalInfo) => {
  const municipalityFiltered = new Map()
  let fallbackNum = 0
  let multipleNum = 0

  createReadStream(ORIGINAL_DATA_FILE)
    .pipe(csv())
    .on('data', (line: JapaneseAddress) => {
      let filteredPostalInfo: { data: PostalInfo, fallback: string }
      if (municipalityFiltered.get(line['市区町村コード'])) {
        filteredPostalInfo = municipalityFiltered.get(line['市区町村コード'])
      } else {
        const filtered = postalInfo.filter(info => info.municipalityCode === line['市区町村コード'])
        const fallback = filtered.find(info => info.aza === '' )?.postalCode || ''
        filteredPostalInfo = { data: filtered, fallback }
        municipalityFiltered.set(line['市区町村コード'], filteredPostalInfo)
      }

      let postalCodes: string[] = []
      const conditions = [
        (info: PostalInfo[number]) => info.aza === line['大字町丁目名'],
        (info: PostalInfo[number]) => info.aza === line['大字町丁目名'].replace(/[一二三四五六七八九十]+丁目$/, ''),
        (info: PostalInfo[number]) => info.aza === line['大字町丁目名'].replace(/[一二三四五六七八九十]+丁目$/, '').replace(/^大字/, ''),
        (info: PostalInfo[number]) => info.aza === line['大字町丁目名'].replace(/[一二三四五六七八九十]+丁目$/, '').replace(/^字/, '')
      ]

      for (let cond of conditions) {
        postalCodes = filteredPostalInfo.data.filter(info => (cond(info))).map(info => info.postalCode)
        if (postalCodes.length > 0) break
      }

      if (postalCodes.length === 0) {
        postalCodes.push(filteredPostalInfo.fallback)
        fallbackNum++
      }

      if (postalCodes.length !== 1) {
        // console.warn('multiple postal', line['都道府県名'] + line['市区町村名'] + line['大字町丁目名'])
        multipleNum++
      }

      appendTree(tree, line['大字町丁目名'].split(''), { id: line['大字町丁目コード'], latitude: Number(line['緯度']), longitude: Number(line['経度']), postalCodes })
    })
    .on('data', (line: JapaneseAddress) => {
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
      console.log('multiple zip', multipleNum)
      console.log('fallback zip', fallbackNum)
      writeFileSync(AZA_TREE_FILE, JSON.stringify(tree))
      writeFileSync(MUNICIPALITY_TREE_FILE, JSON.stringify(prefectures))
    })
})
