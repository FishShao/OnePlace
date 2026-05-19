import { useState, useEffect } from 'react'
import {
  collection, addDoc, deleteDoc, getDocs, writeBatch,
  onSnapshot, query, orderBy, where, serverTimestamp, doc,
} from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

export interface CustomSection {
  id: string
  name: string
  createdAt: Timestamp | null
}

export function useSections() {
  const [sections, setSections] = useState<CustomSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'sections'), orderBy('createdAt', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setSections(
        snap.docs.map((d) => {
          const data = d.data() as { name: string; createdAt: Timestamp | null }
          return { id: d.id, name: data.name, createdAt: data.createdAt ?? null }
        })
      )
      setLoading(false)
    })
    return unsub
  }, [])

  return { sections, loading }
}

export async function addSection(name: string): Promise<string> {
  const ref = await addDoc(collection(db, 'sections'), {
    name: name.trim().toLowerCase(),
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function deleteSection(sectionId: string): Promise<void> {
  await deleteDoc(doc(db, 'sections', sectionId))
}

export async function renameSection(
  sectionId: string,
  oldName: string,
  newName: string
): Promise<void> {
  const trimmed = newName.trim().toLowerCase()
  const batch = writeBatch(db)
  batch.update(doc(db, 'sections', sectionId), { name: trimmed })
  const snap = await getDocs(
    query(collection(db, 'items'), where('section', '==', oldName))
  )
  snap.docs.forEach((d) => batch.update(d.ref, { section: trimmed }))
  await batch.commit()
}
