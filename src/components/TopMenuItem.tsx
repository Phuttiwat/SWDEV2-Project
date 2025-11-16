import Link from 'next/link'

export default function TopMenuItem({ title, pageRef }: { title: string, pageRef: string }) {
    return (
        <Link href={pageRef} className="bg-gray-100 px-4 py-2 rounded text-center hover:bg-gray-200 transition-colors">
            <div className="font-bold text-cyan-600">{title}</div>
        </Link>
    )
}