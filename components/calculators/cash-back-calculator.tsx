"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateCashBack, type CashBackParams } from "@/lib/financial-calculations"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function CashBackCalculator() {
    const [params, setParams] = useState<CashBackParams>({
        purchaseAmount: 1000,
        cashBackRate: 2,
        cashBackLimit: 0
    })

    const [results, setResults] = useState(calculateCashBack(params))

    const updateParam = (key: keyof CashBackParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateCashBack(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Cash Back Calculator</CardTitle>
                    <CardDescription>Calculate cash back rewards from credit cards and purchases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="purchaseAmount">Purchase Amount (₹)</Label>
                        <Input
                            id="purchaseAmount"
                            type="number"
                            step="0.01"
                            value={params.purchaseAmount}
                            onChange={(e) => updateParam("purchaseAmount", Number(e.target.value))}
                            placeholder="1000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cashBackRate">Cash Back Rate (%)</Label>
                        <Input
                            id="cashBackRate"
                            type="number"
                            step="0.1"
                            value={params.cashBackRate}
                            onChange={(e) => updateParam("cashBackRate", Number(e.target.value))}
                            placeholder="2"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="optional" htmlFor="cashBackLimit">Cash Back Limit (₹) (optional)</Label>
                        <Input
                            id="cashBackLimit"
                            type="number"
                            value={params.cashBackLimit}
                            onChange={(e) => updateParam("cashBackLimit", Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Cash Back Results"
                    results={[
                        { label: "Cash Back Earned", value: formatCurrency(results.cashBackEarned) },
                        { label: "Purchase Amount", value: formatCurrency(params.purchaseAmount) },
                        { label: "Cash Back Rate", value: formatPercentage(params.cashBackRate) },
                        { label: "Effective Savings", value: formatPercentage(results.effectiveDiscount) },
                    ]}
                />

                <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">
                        <strong>Tip:</strong> Maximize your cash back by using the right card for each category and paying off
                        your balance monthly to avoid interest charges.
                    </p>
                </div>
            </div>
        </div>
    )
}
