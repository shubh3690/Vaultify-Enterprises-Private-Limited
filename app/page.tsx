import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatorCategories } from "@/lib/calculator-data"
import Link from "next/link"

function greenTick() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4.5-4.5a1 1 0 011.414-1.414L7.5 12.086l7.793-7.793a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl text-white p-8 md:p-12 max-w-6xl mx-auto shadow-2xl">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-4xl font-bold mb-4">WELCOME TO FINANCIAL CALCULATORS</h1>
                        <p className="text-base md:text-lg mb-8 text-blue-100 max-w-3xl mx-auto">
                            Calculate compound interest, savings growth, loan payments, and more with our comprehensive suite of
                            financial tools. Make informed financial decisions with accurate calculations.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                {greenTick()}
                                <span className="text-sm font-medium">29 Financial Calculators</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                {greenTick()}
                                <span className="text-sm font-medium">Real-time Calculations</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                {greenTick()}
                                <span className="text-sm font-medium">100% Free to Use</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculator Categories */}
            <div className="container mx-auto px-4 py-12 max-w-[90%]">
                <div className="grid gap-8">
                    {calculatorCategories.map((category) => (
                        <Card key={category.id} className="overflow-hidden shadow-2xl rounded-3xl">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">{category.icon}</div>
                                    <div>
                                        <CardTitle className="text-xl text-white">{category.title}</CardTitle>
                                        <CardDescription className="text-blue-100">{category.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {category.calculators.map((calc) => (
                                        <Link
                                            key={calc.slug}
                                            href={`/calculators/${calc.slug}`}
                                            className="group block p-4 rounded-lg border hover:border-primary/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                                        >
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{calc.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{calc.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
