import Link from 'next/link'

export const metadata = { title: 'Education — Specify' }

export default function EducationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-3" style={{ color: '#1E1B4B' }}>Education</h1>
      <p className="text-gray-500 mb-10">Resources for understanding AI system requirements, risks, and assurance.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/education/definitions"
          className="p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all">
          <div className="text-2xl mb-2">📖</div>
          <p className="font-semibold text-gray-900 mb-1">Definitions</p>
          <p className="text-sm text-gray-500">Glossary of AI system requirements terminology.</p>
        </Link>
        <div className="p-5 rounded-xl border border-dashed border-gray-200 opacity-50">
          <div className="text-2xl mb-2">🎓</div>
          <p className="font-semibold text-gray-900 mb-1">Guides</p>
          <p className="text-sm text-gray-500">Coming soon.</p>
        </div>
      </div>
    </div>
  )
}
