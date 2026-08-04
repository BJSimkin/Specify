'use client'
import { useEffect, useState, useCallback } from 'react'

interface MediaItem {
  id: string
  public_url: string
  media_type: 'image' | 'audio'
  img_category: string | null
  prompt_category_id: string | null
  prompt_vector_name: string | null
  prompt_text: string | null
  created_at: string
}

interface Props {
  mediaType?: 'image' | 'audio'
  imgCategory?: 'aligned' | 'benign' | 'jailbreak'
  promptCategoryId?: string
  promptVectorName?: string
  onSelect: (item: MediaItem) => void
  selectedId?: string
  teamId?: string
}

export default function MediaLibrary({ mediaType, imgCategory, promptCategoryId, promptVectorName, onSelect, selectedId, teamId }: Props) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [catFilter, setCatFilter] = useState<string>(imgCategory ?? 'all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (mediaType) params.set('type', mediaType)
      if (catFilter !== 'all') params.set('category', catFilter)
      if (promptCategoryId) params.set('categoryId', promptCategoryId)
      if (promptVectorName) params.set('vectorName', promptVectorName)
      if (teamId) params.set('teamId', teamId)
      const res = await fetch('/api/media?' + params.toString())
      const data = await res.json() as { media: MediaItem[] }
      setItems(data.media ?? [])
    } finally { setLoading(false) }
  }, [mediaType, catFilter, promptCategoryId, promptVectorName, teamId])

  useEffect(() => { load() }, [load])

  if (loading) return <p className="text-xs text-gray-400">Loading library…</p>
  if (items.length === 0) return (
    <div className="text-center py-4">
      <p className="text-xs text-gray-400">No saved media yet.</p>
      <p className="text-xs text-gray-300 mt-1">Generate images or audio and they&apos;ll appear here.</p>
    </div>
  )

  return (
    <div className="space-y-2">
      {mediaType === 'image' && (
        <div className="flex gap-1">
          {['all', 'aligned', 'benign', 'jailbreak'].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className="px-2 py-0.5 rounded text-xs border capitalize transition-all"
              style={catFilter === c
                ? { backgroundColor: '#EEF2FF', color: '#3730A3', borderColor: '#818CF8' }
                : { color: '#6B7280', borderColor: '#E5E7EB' }}>
              {c}
            </button>
          ))}
          <button onClick={load} className="ml-auto px-2 py-0.5 rounded text-xs border border-gray-200 text-gray-400 hover:text-gray-600">↻</button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {items.map(item => (
          <button key={item.id} onClick={() => onSelect(item)}
            className="rounded-lg overflow-hidden border-2 transition-all text-left"
            style={{ borderColor: selectedId === item.id ? '#4F46E5' : '#E5E7EB' }}>
            {item.media_type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.public_url} alt={item.prompt_text ?? ''} className="w-full h-16 object-cover" />
            ) : (
              <div className="w-full h-16 flex items-center justify-center bg-gray-50">
                <span className="text-2xl">🎙️</span>
              </div>
            )}
            <div className="px-1 py-0.5">
              {item.img_category && (
                <span className="text-xs" style={{ color: item.img_category === 'aligned' ? '#16A34A' : item.img_category === 'jailbreak' ? '#DC2626' : '#6B7280' }}>
                  {item.img_category}
                </span>
              )}
              <p className="text-xs text-gray-400 truncate">{item.prompt_vector_name ?? item.prompt_text?.slice(0, 20) ?? '—'}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recommended — items from same category/vector */}
      {promptCategoryId && items.filter(i => i.prompt_category_id === promptCategoryId).length > 0 && (
        <div className="border-t border-gray-100 pt-2">
          <p className="text-xs font-semibold text-indigo-500 mb-1">Recommended for this prompt</p>
          <div className="flex gap-2 overflow-x-auto">
            {items
              .filter(i => i.prompt_category_id === promptCategoryId)
              .slice(0, 6)
              .map(item => (
                <button key={'rec-' + item.id} onClick={() => onSelect(item)}
                  className="flex-shrink-0 rounded-lg overflow-hidden border-2 w-16 transition-all"
                  style={{ borderColor: selectedId === item.id ? '#4F46E5' : '#C7D2FE' }}>
                  {item.media_type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.public_url} alt="" className="w-16 h-12 object-cover" />
                  ) : (
                    <div className="w-16 h-12 flex items-center justify-center bg-indigo-50">🎙️</div>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
