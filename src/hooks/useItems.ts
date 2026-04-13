import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import type { Section } from '../api/claude'

interface SavedItemWrite {
  content: string
  userNote: string
  section: Section
  title: string
  summary: string
  createdAt: ReturnType<typeof serverTimestamp>
}

export interface SavedItem {
  id: string
  content: string
  userNote: string
  section: Section
  title: string
  summary: string
  createdAt: Timestamp | null
}

export function useItems() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<SavedItem, 'id'>),
        }))
      )
      setLoading(false)
    })
    return unsub
  }, [])

  return { items, loading }
}

export async function saveItem(
  content: string,
  userNote: string,
  section: Section,
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
