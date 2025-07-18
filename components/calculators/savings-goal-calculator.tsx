"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateSavingsGoal, type SavingsGoalParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SavingsGoalCalculator() {
    const [params, setParams] = useState<SavingsGoalParams>({
        targetAmount: 50000,
        currentSavings: 5000,
        monthlyContribution: 500,
        interestRate: 4,
        compoundingFrequency: 12,
    })

    const [results, setResults] = useState(calculateSavingsGoal(params))

    const updateParam = (key: keyof SavingsGoalParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateSavingsGoal(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Savings Goal Calculator</CardTitle>
                    <CardDescription>Calculate how long it will take to reach your savings goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="targetAmount">Savings Goal</Label>
                        <Input
                            id="targetAmount"
                            type="number"
                            value={params.targetAmount}
                            onChange={(e) => updateParam("targetAmount", Number(e.target.value))}
                            placeholder="50000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="currentSavings">Current Savings</Label>
                        <Input
                            id="currentSavings"
                            type="number"
                            value={params.currentSavings}
                            onChange={(e) => updateParam("currentSavings", Number(e.target.value))}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                        <Input
                            id="monthlyContribution"
                            type="number"
                            value={params.monthlyContribution}
                            onChange={(e) => updateParam("monthlyContribution", Number(e.target.value))}
                            placeholder="500"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                        <Input
                            id="interestRate"
                            type="number"
                            step="0.1"
                            value={params.interestRate}
                            onChange={(e) => updateParam("interestRate", Number(e.target.value))}
                            placeholder="4"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Savings Goal Results"
                    results={[
                        {
                            label: "Time to Goal",
                            value: `${results.yearsToGoal.toFixed(1)} years (${results.monthsToGoal} months)`,
                        },
                        { label: "Total Contributions", value: formatCurrency(results.totalContributions) },
                        { label: "Interest Earned", value: formatCurrency(results.interestEarned) },
                        { label: "Final Amount", value: formatCurrency(params.targetAmount) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Goal Achievement Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Starting Amount:</span>
                                <span className="font-medium">{formatCurrency(params.currentSavings)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Savings:</span>
                                <span className="font-medium">{formatCurrency(params.monthlyContribution)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{params.interestRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount Needed:</span>
                                <span className="font-medium">{formatCurrency(params.targetAmount - params.currentSavings)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time to Goal:</span>
                                <span className="font-medium text-green-600">{results.yearsToGoal.toFixed(1)} years</span>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    <strong>Success Plan:</strong> Save {formatCurrency(params.monthlyContribution)} monthly for{" "}
                                    {results.yearsToGoal.toFixed(1)} years to reach your {formatCurrency(params.targetAmount)} goal.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
