'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Screen Recorder MVP</h1>
      <p className="mb-6">
        
      </p>

      <Link
        href="/record"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Recorder
      </Link>

      <div className="mt-6 text-sm text-gray-500">
        
      </div>
    </main>
  )
}
