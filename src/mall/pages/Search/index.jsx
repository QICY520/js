import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getSearchGuess,
  getSearchRankings,
  getSearchSuggest,
  getProducts,
} from '@/utils/api'
import useSearchHistory from '@/mall/hooks/useSearchHistory'
import SearchBarHeader from '@/mall/components/search/SearchBarHeader'
import HistorySection from '@/mall/components/search/HistorySection'
import GuessSection from '@/mall/components/search/GuessSection'
import HotRankingList from '@/mall/components/search/HotRankingList'
import ProductWaterfall from '@/mall/components/ProductWaterfall'
import { HomePageSkeleton } from '@/mall/components/PageSkeleton'

function SuggestPanel({ keyword, suggestions, onSelect }) {
  if (!keyword.trim()) return null

  return (
    <section className="mb-6">
      <p className="text-xs text-olive-600 font-medium mb-2 flex items-center gap-1">
        <span className="px-1.5 py-0.5 rounded bg-olive-100 text-[10px]">AI</span>
        智能联想
      </p>
      <div className="rounded-2xl bg-white border border-cream-200 overflow-hidden shadow-md">
        {suggestions.length === 0 ? (
          <p className="px-4 py-3 text-sm text-stone-400">输入更多字符获取联想…</p>
        ) : (
          suggestions.map((item) => (
            <button
              key={item.text}
              type="button"
              onClick={() => onSelect(item.text)}
              className="w-full text-left px-4 py-3 text-sm text-stone-700 border-b border-cream-100 last:border-0 active:bg-cream-50 flex items-center gap-2"
            >
              {item.type === 'ai' && (
                <span className="text-[10px] text-olive-500 shrink-0">AI</span>
              )}
              {item.text}
            </button>
          ))
        )}
      </div>
    </section>
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialKeyword = searchParams.get('q') || ''
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory()

  const [searchKey, setSearchKey] = useState(initialKeyword)
  const [guessItems, setGuessItems] = useState([])
  const [rankingTabs, setRankingTabs] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(!!initialKeyword)

  useEffect(() => {
    Promise.all([getSearchGuess(), getSearchRankings()])
      .then(([guessRes, rankRes]) => {
        setGuessItems(guessRes.data || [])
        setRankingTabs(rankRes.data || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!searchKey.trim() || searched) {
      setSuggestions([])
      return undefined
    }
    const timer = setTimeout(() => {
      getSearchSuggest(searchKey.trim())
        .then((res) => setSuggestions(res.data || []))
        .catch(() => setSuggestions([]))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchKey, searched])

  const doSearch = useCallback(async (value) => {
    const q = value.trim()
    if (!q) return
    setSearchKey(q)
    setSearched(true)
    addHistory(q)
    setSearchParams({ q })
    setLoading(true)
    try {
      const res = await getProducts({ keyword: q, status: 1, pageSize: 20 })
      setProducts(res.data.list)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [addHistory, setSearchParams])

  useEffect(() => {
    if (initialKeyword) doSearch(initialKeyword)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = () => {
    setSearchKey('')
    setSearched(false)
    setProducts([])
    setSearchParams({})
  }

  const showDiscovery = !searched
  const showSuggest = searchKey.trim() && !searched

  return (
    <div className="min-h-screen bg-white pb-8">
      <SearchBarHeader
        searchKey={searchKey}
        onSearchKeyChange={(val) => {
          setSearchKey(val)
          if (!val.trim()) {
            setSearched(false)
            setProducts([])
            setSearchParams({})
          }
        }}
        onSearch={doSearch}
      />

      <main className="mall-container pt-4 min-h-[calc(100vh-8rem)]">
        {showSuggest && (
          <SuggestPanel
            keyword={searchKey}
            suggestions={suggestions}
            onSelect={doSearch}
          />
        )}

        {showDiscovery && !showSuggest && (
          <>
            <HistorySection
              history={history}
              onSelect={doSearch}
              onClear={clearHistory}
              onRemove={removeHistory}
            />
            <GuessSection items={guessItems} onSelect={doSearch} />
            <HotRankingList tabs={rankingTabs} />
          </>
        )}

        {searched && (
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold text-stone-800">搜索结果</h3>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-stone-400"
              >
                返回发现
              </button>
            </div>
            {loading && products.length === 0 ? (
              <HomePageSkeleton />
            ) : (
              <ProductWaterfall products={products} loading={loading} />
            )}
          </section>
        )}
      </main>
    </div>
  )
}
