"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateSIP, type SIPParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SIPCalculator() {
    const [params, setParams] = useState<SIPParams>({
        monthlyInvestment: 5000,
        expectedReturn: 12,
        timePeriod: 10,
    })

    const [results, setResults] = useState(calculateSIP(params))

    const updateParam = (key: keyof SIPParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateSIP(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>SIP Calculator</CardTitle>
                    <CardDescription>Calculate returns from Systematic Investment Plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
                        <Input
                            id="monthlyInvestment"
                            type="number"
                            value={params.monthlyInvestment}
                            onChange={(e) => updateParam("monthlyInvestment", Number(e.target.value))}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                        <Input
                            id="expectedReturn"
                            type="number"
                            step="0.1"
                            value={params.expectedReturn}
                            onChange={(e) => updateParam("expectedReturn", Number(e.target.value))}
                            placeholder="12"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="timePeriod">Investment Period (Years)</Label>
                        <Input
                            id="timePeriod"
                            type="number"
                            value={params.timePeriod}
                            onChange={(e) => updateParam("timePeriod", Number(e.target.value))}
                            placeholder="10"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="SIP Investment Results"
                    results={[
                        { label: "Maturity Amount", value: formatCurrency(results.maturityAmount) },
                        { label: "Total Investment", value: formatCurrency(results.totalInvestment) },
                        { label: "Total Returns", value: formatCurrency(results.totalReturns) },
                        { label: "Return Multiplier", value: `${(results.maturityAmount / results.totalInvestment).toFixed(2)}x` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>SIP Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Monthly Investment:</span>
                                <span className="font-medium">{formatCurrency(params.monthlyInvestment)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Investment Period:</span>
                                <span className="font-medium">
                                    {params.timePeriod} years ({Math.round(params.timePeriod * 12)} months)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expected Return:</span>
                                <span className="font-medium">{params.expectedReturn}% per annum</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Wealth Gained:</span>
                                <span className="font-medium text-green-600">{formatCurrency(results.totalReturns)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
