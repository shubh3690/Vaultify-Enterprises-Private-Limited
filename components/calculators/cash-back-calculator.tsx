"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateCashBack, type CashBackParams } from "@/lib/financial-calculations"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function CashBackCalculator() {
    const [params, setParams] = useState<CashBackParams>({
        purchaseAmount: 1000,
        cashBackRate: 2,
        annualSpending: 12000,
        timeframe: 1,
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
                    <Tabs defaultValue="single" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="single">Single Purchase</TabsTrigger>
                            <TabsTrigger value="annual">Annual Rewards</TabsTrigger>
                        </TabsList>

                        <TabsContent value="single" className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="purchaseAmount">Purchase Amount</Label>
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
                        </TabsContent>

                        <TabsContent value="annual" className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="annualSpending">Annual Spending</Label>
                                <Input
                                    id="annualSpending"
                                    type="number"
                                    value={params.annualSpending}
                                    onChange={(e) => updateParam("annualSpending", Number(e.target.value))}
                                    placeholder="12000"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cashBackRate2">Cash Back Rate (%)</Label>
                                <Input
                                    id="cashBackRate2"
                                    type="number"
                                    step="0.1"
                                    value={params.cashBackRate}
                                    onChange={(e) => updateParam("cashBackRate", Number(e.target.value))}
                                    placeholder="2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="timeframe">Timeframe (Years)</Label>
                                <Input
                                    id="timeframe"
                                    type="number"
                                    value={params.timeframe}
                                    onChange={(e) => updateParam("timeframe", Number(e.target.value))}
                                    placeholder="1"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Tabs defaultValue="single" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">Single Purchase</TabsTrigger>
                        <TabsTrigger value="annual">Annual Rewards</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single">
                        <ResultsDisplay
                            title="Single Purchase Cash Back"
                            results={[
                                { label: "Cash Back Earned", value: formatCurrency(results.cashBackEarned) },
                                { label: "Purchase Amount", value: formatCurrency(params.purchaseAmount) },
                                { label: "Cash Back Rate", value: formatPercentage(params.cashBackRate) },
                                { label: "Effective Savings", value: formatCurrency(results.cashBackEarned) },
                            ]}
                        />
                    </TabsContent>

                    <TabsContent value="annual">
                        <ResultsDisplay
                            title="Annual Cash Back Rewards"
                            results={[
                                { label: "Annual Cash Back", value: formatCurrency(results.annualCashBack) },
                                { label: "Total Cash Back", value: formatCurrency(results.annualCashBack * params.timeframe) },
                                { label: "Total Spending", value: formatCurrency(results.totalSpending) },
                                { label: "Effective Discount", value: formatPercentage(results.effectiveDiscount) },
                            ]}
                        />
                    </TabsContent>
                </Tabs>

                <Card>
                    <CardHeader>
                        <CardTitle>Cash Back Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Cash Back Rate:</span>
                                <span className="font-medium">{formatPercentage(params.cashBackRate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Annual Spending:</span>
                                <span className="font-medium">{formatCurrency(params.annualSpending)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Annual Rewards:</span>
                                <span className="font-medium">{formatCurrency(results.annualCashBack)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Rewards:</span>
                                <span className="font-medium">{formatCurrency(results.annualCashBack / 12)}</span>
                            </div>
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                                <p className="text-sm text-green-800">
                                    <strong>Tip:</strong> Maximize your cash back by using the right card for each category and paying off
                                    your balance monthly to avoid interest charges.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
