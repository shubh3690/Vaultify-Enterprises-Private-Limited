"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateCompoundInterest, type CompoundInterestParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SavingsCalculator() {
    const [params, setParams] = useState<CompoundInterestParams>({
        principal: 10000,
        rate: 4,
        compoundingFrequency: 12,
        time: 5,
        monthlyDeposit: 200,
        monthlyWithdrawal: 0,
    })

    const [results, setResults] = useState(calculateCompoundInterest(params))

    const updateParam = (key: keyof CompoundInterestParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateCompoundInterest(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Savings Calculator</CardTitle>
                    <CardDescription>Calculate how much your savings will grow over time with regular deposits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Current Savings Balance</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={params.principal}
                            onChange={(e) => updateParam("principal", Number(e.target.value))}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                        <Input
                            id="rate"
                            type="number"
                            step="0.1"
                            value={params.rate}
                            onChange={(e) => updateParam("rate", Number(e.target.value))}
                            placeholder="4"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="time">Time Period (Years)</Label>
                        <Input
                            id="time"
                            type="number"
                            value={params.time}
                            onChange={(e) => updateParam("time", Number(e.target.value))}
                            placeholder="5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyDeposit">Monthly Deposit</Label>
                        <Input
                            id="monthlyDeposit"
                            type="number"
                            value={params.monthlyDeposit}
                            onChange={(e) => updateParam("monthlyDeposit", Number(e.target.value))}
                            placeholder="200"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Future Savings Results"
                    results={[
                        { label: "Future Savings Balance", value: formatCurrency(results.finalAmount) },
                        { label: "Total Interest Earned", value: formatCurrency(results.totalInterest) },
                        { label: "Total Deposits", value: formatCurrency(results.totalDeposits) },
                        {
                            label: "Growth from Interest",
                            value: `${((results.totalInterest / results.totalDeposits) * 100).toFixed(1)}%`,
                        },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Savings Growth Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Starting Balance:</span>
                                <span className="font-medium">{formatCurrency(params.principal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Deposits:</span>
                                <span className="font-medium">{formatCurrency(params.monthlyDeposit || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{params.rate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time Period:</span>
                                <span className="font-medium">{params.time} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Final Balance:</span>
                                <span className="font-medium text-green-600">{formatCurrency(results.finalAmount)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
