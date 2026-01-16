'use client'

import Recorder from '@/components/Recorder'

export default function RecordPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Screen Recorder
      </h1>

      <Recorder />
    </main>
  )
}
