import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, getDocs, doc, updateDoc, onSnapshot, query, orderBy, limit, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

const HIGHLIGHT_MS = 60_000

interface SavedItemWrite {
  content: string
  userNote: string
  section: string
  title: string
  summary: string
  createdAt: ReturnType<typeof serverTimestamp>
}

export interface SavedItem {
  id: string
  content: string
  userNote: string
  section: string
  title: string
  summary: string
  createdAt: Timestamp | null
  updatedAt?: Timestamp | null
  sourceLabel?: string
  url?: string
  isDone?: boolean
}

export function useItems() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set())
  const seenIds = useRef<Set<string>>(new Set())
  const firstSnapshot = useRef(true)
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const next: SavedItem[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SavedItem, 'id'>),
      }))

      if (firstSnapshot.current) {
        next.forEach((item) => seenIds.current.add(item.id))
        firstSnapshot.current = false
      } else {
        const freshIds: string[] = []
        next.forEach((item) => {
          if (!seenIds.current.has(item.id)) {
            seenIds.current.add(item.id)
            freshIds.push(item.id)
          }
        })
        if (freshIds.length > 0) {
          setHighlightedIds((prev) => {
            const copy = new Set(prev)
            freshIds.forEach((id) => copy.add(id))
            return copy
          })
          freshIds.forEach((id) => {
            const t = setTimeout(() => {
              setHighlightedIds((prev) => {
                if (!prev.has(id)) return prev
                const copy = new Set(prev)
                copy.delete(id)
                return copy
              })
              timers.current.delete(id)
            }, HIGHLIGHT_MS)
            timers.current.set(id, t)
          })
        }
      }

      setItems(next)
      setLoading(false)
    })

    return () => {
      unsub()
      timers.current.forEach((t) => clearTimeout(t))
      timers.current.clear()
    }
  }, [])

  return { items, loading, highlightedIds }
}

export async function getRecentItems(): Promise<SavedItem[]> {
  const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'), limit(200))
  const snap = await getDocs(q)
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<SavedItem, 'id'>),
  }))
}

export async function moveItem(itemId: string, newSection: string): Promise<void> {
  await updateDoc(doc(db, 'items', itemId), { section: newSection })
}

export async function updateItem(
  itemId: string,
  changes: Partial<Pick<SavedItem, 'content' | 'sourceLabel' | 'section'>>
): Promise<void> {
  await updateDoc(doc(db, 'items', itemId), {
    ...changes,
    updatedAt: serverTimestamp(),
  })
}

export async function saveItem(
  content: string,
  userNote: string,
  section: string,
  title: string,
  summary: string
): Promise<string> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firestore write timed out — check security rules')), 10000)
  )

  const write = addDoc(collection(db, 'items'), {
    content,
    userNote,
    section,
    title,
    summary,
    createdAt: serverTimestamp(),
  } satisfies SavedItemWrite)

  const docRef = await Promise.race([write, timeout])
  return docRef.id
}
