"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateRetirement, type RetirementParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function RetirementPlanningCalculator() {
    const [params, setParams] = useState<RetirementParams>({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 50000,
        monthlyContribution: 1000,
        expectedReturn: 7,
        inflationRate: 3,
        desiredMonthlyIncome: 5000,
    })

    const [results, setResults] = useState(calculateRetirement(params))

    const updateParam = (key: keyof RetirementParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateRetirement(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Retirement Planning</CardTitle>
                    <CardDescription>Plan your retirement savings and income needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="currentAge">Current Age</Label>
                            <Input
                                id="currentAge"
                                type="number"
                                value={params.currentAge}
                                onChange={(e) => updateParam("currentAge", Number(e.target.value))}
                                placeholder="30"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="retirementAge">Retirement Age</Label>
                            <Input
                                id="retirementAge"
                                type="number"
                                value={params.retirementAge}
                                onChange={(e) => updateParam("retirementAge", Number(e.target.value))}
                                placeholder="65"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="currentSavings">Current Savings</Label>
                        <Input
                            id="currentSavings"
                            type="number"
                            value={params.currentSavings}
                            onChange={(e) => updateParam("currentSavings", Number(e.target.value))}
                            placeholder="50000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                        <Input
                            id="monthlyContribution"
                            type="number"
                            value={params.monthlyContribution}
                            onChange={(e) => updateParam("monthlyContribution", Number(e.target.value))}
                            placeholder="1000"
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
                            placeholder="7"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                        <Input
                            id="inflationRate"
                            type="number"
                            step="0.1"
                            value={params.inflationRate}
                            onChange={(e) => updateParam("inflationRate", Number(e.target.value))}
                            placeholder="3"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="desiredMonthlyIncome">Desired Monthly Income</Label>
                        <Input
                            id="desiredMonthlyIncome"
                            type="number"
                            value={params.desiredMonthlyIncome}
                            onChange={(e) => updateParam("desiredMonthlyIncome", Number(e.target.value))}
                            placeholder="5000"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Retirement Planning Results"
                    results={[
                        { label: "Total Savings at Retirement", value: formatCurrency(results.totalSavingsAtRetirement) },
                        { label: "Monthly Income Generated", value: formatCurrency(results.monthlyIncomeGenerated) },
                        { label: "Monthly Shortfall", value: formatCurrency(results.shortfall) },
                        { label: "Recommended Monthly Savings", value: formatCurrency(results.recommendedMonthlySavings) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Retirement Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Years to Retirement:</span>
                                <span className="font-medium">{params.retirementAge - params.currentAge} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Current Savings:</span>
                                <span className="font-medium">{formatCurrency(params.currentSavings)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Contribution:</span>
                                <span className="font-medium">{formatCurrency(params.monthlyContribution)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expected Return:</span>
                                <span className="font-medium">{params.expectedReturn}%</span>
                            </div>
                            {results.shortfall > 0 && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Action Required:</strong> You have a monthly shortfall of{" "}
                                        {formatCurrency(results.shortfall)}. Consider increasing your monthly savings to{" "}
                                        {formatCurrency(results.recommendedMonthlySavings)}.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
