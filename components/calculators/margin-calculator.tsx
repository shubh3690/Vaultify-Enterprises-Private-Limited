"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateMargin, type MarginParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function MarginCalculator() {
    const [params, setParams] = useState<MarginParams>({
        stockPrice: 100,
        shares: 100,
        marginRate: 50,
        maintenanceMargin: 25,
    })

    const [results, setResults] = useState(calculateMargin(params))

    const updateParam = (key: keyof MarginParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateMargin(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Margin Calculator</CardTitle>
                    <CardDescription>Calculate margin requirements for stock trading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="stockPrice">Stock Price</Label>
                        <Input
                            id="stockPrice"
                            type="number"
                            step="0.01"
                            value={params.stockPrice}
                            onChange={(e) => updateParam("stockPrice", Number(e.target.value))}
                            placeholder="100"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="shares">Number of Shares</Label>
                        <Input
                            id="shares"
                            type="number"
                            value={params.shares}
                            onChange={(e) => updateParam("shares", Number(e.target.value))}
                            placeholder="100"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="marginRate">Initial Margin Rate (%)</Label>
                        <Input
                            id="marginRate"
                            type="number"
                            value={params.marginRate}
                            onChange={(e) => updateParam("marginRate", Number(e.target.value))}
                            placeholder="50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="maintenanceMargin">Maintenance Margin (%)</Label>
                        <Input
                            id="maintenanceMargin"
                            type="number"
                            value={params.maintenanceMargin}
                            onChange={(e) => updateParam("maintenanceMargin", Number(e.target.value))}
                            placeholder="25"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Margin Requirements"
                    results={[
                        { label: "Total Position Value", value: formatCurrency(results.totalValue) },
                        { label: "Initial Margin Required", value: formatCurrency(results.marginRequired) },
                        { label: "Buying Power", value: formatCurrency(results.buyingPower) },
                        { label: "Maintenance Margin", value: formatCurrency(results.maintenanceRequired) },
                        { label: "Margin Call Price", value: formatCurrency(results.marginCallPrice) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Margin Trading Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Stock Price:</span>
                                <span className="font-medium">{formatCurrency(params.stockPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shares:</span>
                                <span className="font-medium">{params.shares}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Position Value:</span>
                                <span className="font-medium">{formatCurrency(results.totalValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cash Required:</span>
                                <span className="font-medium">{formatCurrency(results.marginRequired)}</span>
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-sm text-yellow-800">
                                    <strong>Risk Warning:</strong> Margin trading involves significant risk. You can lose more than your
                                    initial investment. Ensure you understand the risks before trading on margin.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
