"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateForexCompounding } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function ForexCompoundingCalculator() {
    const [initialDeposit, setInitialDeposit] = useState(10000)
    const [monthlyReturn, setMonthlyReturn] = useState(5)
    const [months, setMonths] = useState(12)
    const [monthlyDeposit, setMonthlyDeposit] = useState(0)
    const [results, setResults] = useState(
        calculateForexCompounding(initialDeposit, monthlyReturn, months, monthlyDeposit),
    )

    const updateInitialDeposit = (value: number) => {
        setInitialDeposit(value)
        setResults(calculateForexCompounding(value, monthlyReturn, months, monthlyDeposit))
    }

    const updateMonthlyReturn = (value: number) => {
        setMonthlyReturn(value)
        setResults(calculateForexCompounding(initialDeposit, value, months, monthlyDeposit))
    }

    const updateMonths = (value: number) => {
        setMonths(value)
        setResults(calculateForexCompounding(initialDeposit, monthlyReturn, value, monthlyDeposit))
    }

    const updateMonthlyDeposit = (value: number) => {
        setMonthlyDeposit(value)
        setResults(calculateForexCompounding(initialDeposit, monthlyReturn, months, value))
    }

    const annualReturn = (Math.pow(1 + monthlyReturn / 100, 12) - 1) * 100

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Forex Compounding Calculator</CardTitle>
                    <CardDescription>Calculate compound returns from forex trading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="initialDeposit">Initial Deposit</Label>
                        <Input
                            id="initialDeposit"
                            type="number"
                            value={initialDeposit}
                            onChange={(e) => updateInitialDeposit(Number(e.target.value))}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyReturn">Monthly Return (%)</Label>
                        <Input
                            id="monthlyReturn"
                            type="number"
                            step="0.1"
                            value={monthlyReturn}
                            onChange={(e) => updateMonthlyReturn(Number(e.target.value))}
                            placeholder="5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="months">Number of Months</Label>
                        <Input
                            id="months"
                            type="number"
                            value={months}
                            onChange={(e) => updateMonths(Number(e.target.value))}
                            placeholder="12"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyDeposit">Monthly Deposit (Optional)</Label>
                        <Input
                            id="monthlyDeposit"
                            type="number"
                            value={monthlyDeposit}
                            onChange={(e) => updateMonthlyDeposit(Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Forex Compounding Results"
                    results={[
                        { label: "Final Balance", value: formatCurrency(results.finalAmount) },
                        { label: "Total Profit", value: formatCurrency(results.totalInterest) },
                        { label: "Total Deposits", value: formatCurrency(results.totalDeposits) },
                        { label: "Equivalent Annual Return", value: `${annualReturn.toFixed(2)}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Trading Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Initial Deposit:</span>
                                <span className="font-medium">{formatCurrency(initialDeposit)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Return:</span>
                                <span className="font-medium">{monthlyReturn}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Trading Period:</span>
                                <span className="font-medium">
                                    {months} months ({(months / 12).toFixed(1)} years)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Return Multiple:</span>
                                <span className="font-medium">{(results.finalAmount / initialDeposit).toFixed(2)}x</span>
                            </div>
                            <div className="p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm text-red-800">
                                    <strong>High Risk Warning:</strong> Forex trading involves substantial risk. Past performance doesn't
                                    guarantee future results. Only trade with money you can afford to lose.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
