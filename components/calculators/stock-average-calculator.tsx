"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"
import { Plus, Minus } from "lucide-react"

interface StockPurchase {
    shares: number
    price: number
}

export function StockAverageCalculator() {
    const [purchases, setPurchases] = useState<StockPurchase[]>([
        { shares: 100, price: 50 },
        { shares: 50, price: 45 },
    ])

    const addPurchase = () => {
        setPurchases([...purchases, { shares: 0, price: 0 }])
    }

    const removePurchase = (index: number) => {
        if (purchases.length > 1) {
            setPurchases(purchases.filter((_, i) => i !== index))
        }
    }

    const updatePurchase = (index: number, field: keyof StockPurchase, value: number) => {
        const newPurchases = [...purchases]
        newPurchases[index][field] = value
        setPurchases(newPurchases)
    }

    const totalShares = purchases.reduce((sum, purchase) => sum + purchase.shares, 0)
    const totalCost = purchases.reduce((sum, purchase) => sum + purchase.shares * purchase.price, 0)
    const averagePrice = totalShares > 0 ? totalCost / totalShares : 0

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Stock Average Calculator</CardTitle>
                    <CardDescription>Calculate your average stock purchase price across multiple transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label>Stock Purchases</Label>
                        {purchases.map((purchase, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2 items-center">
                                <Input
                                    type="number"
                                    placeholder="Shares"
                                    value={purchase.shares}
                                    onChange={(e) => updatePurchase(index, "shares", Number(e.target.value))}
                                />
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price per share"
                                    value={purchase.price}
                                    onChange={(e) => updatePurchase(index, "price", Number(e.target.value))}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removePurchase(index)}
                                    disabled={purchases.length <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addPurchase} className="w-full bg-transparent">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Purchase
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Stock Average Results"
                    results={[
                        { label: "Average Price per Share", value: formatCurrency(averagePrice) },
                        { label: "Total Shares", value: formatNumber(totalShares) },
                        { label: "Total Investment", value: formatCurrency(totalCost) },
                        { label: "Number of Purchases", value: `${purchases.length}` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Purchase Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {purchases.map((purchase, index) => (
                                <div key={index} className="flex justify-between text-sm border-b pb-2">
                                    <span>Purchase {index + 1}:</span>
                                    <span>
                                        {formatNumber(purchase.shares)} shares @ {formatCurrency(purchase.price)} ={" "}
                                        {formatCurrency(purchase.shares * purchase.price)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between font-medium pt-2">
                                <span>Total:</span>
                                <span>
                                    {formatNumber(totalShares)} shares = {formatCurrency(totalCost)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dollar Cost Averaging</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>Average Cost:</strong> {formatCurrency(averagePrice)} per share
                            </p>
                            <p>Dollar cost averaging helps reduce the impact of volatility by spreading purchases over time.</p>
                            <p>
                                Your {formatNumber(totalShares)} shares have an average cost basis of {formatCurrency(averagePrice)} per
                                share.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
