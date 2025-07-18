import Link from "next/link"
import { Calculator } from "lucide-react"

export function Header() {
    return (
        <header className="bg-black text-white border-b border-gray-800 h-24">
            <div className="container mx-auto px-4 sm:px-16 h-full">
                <div className="flex h-full items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative p-2 bg-primary/10 rounded-xl hover:bg-primary/20 transition">
                            <Calculator className="h-6 w-6 text-[#4ecdc4]" />
                        </div>
                        <span className="text-xl font-bold text-[#4ecdc4]">Calculator Site</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}
