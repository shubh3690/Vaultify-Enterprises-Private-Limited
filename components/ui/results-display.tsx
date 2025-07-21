import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultItem {
    label: string
    value: string
}

interface ResultsDisplayProps {
    title: string
    results: ResultItem[]
}

export function ResultsDisplay({ title, results }: ResultsDisplayProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {results.map((result, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{result.label}:</span>
                            <span className="font-semibold">{result.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
