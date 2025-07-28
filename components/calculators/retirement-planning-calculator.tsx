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
        currentIncome: 600000,
        desiredIncomePercent: 80,
        inflationRate: 3,
        SpendingAnnualDecrease65To74: 2.5,
        SpendingAnnualDecrease75: 2.8,
        currentAge: 55,
        retirementAge: 65,
        lifeExpectancy: 85,
        annualPension: 120000,
        annualPensionIncrease: 3,
        investmentReturns: 7,
        currentSavings: 0,
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
                    <div className="grid sm:grid-cols-3 gap-4">
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

                        <div className="grid gap-2">
                            <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
                            <Input
                                id="lifeExpectancy"
                                type="number"
                                value={params.lifeExpectancy}
                                onChange={(e) => updateParam("lifeExpectancy", Number(e.target.value))}
                                placeholder="85"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="currentIncome">Current Annual Income (₹)</Label>
                            <Input
                                id="currentIncome"
                                type="number"
                                value={params.currentIncome}
                                onChange={(e) => updateParam("currentIncome", Number(e.target.value))}
                                placeholder="600000"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="desiredIncomePercent">Desired Income Percentage (%)</Label>
                            <Input
                                id="desiredIncomePercent"
                                type="number"
                                value={params.desiredIncomePercent}
                                onChange={(e) => updateParam("desiredIncomePercent", Number(e.target.value))}
                                placeholder="80"
                            />
                        </div>
                    </div>

                    <Card className="grid gap-2 optional p-4">
                        <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                        <Input
                            id="currentSavings"
                            type="number"
                            value={params.currentSavings}
                            onChange={(e) => updateParam("currentSavings", Number(e.target.value))}
                            placeholder="50000"
                        />
                    </Card>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="annualPension">Expected Annual Pension (₹)</Label>
                            <Input
                                id="annualPension"
                                type="number"
                                value={params.annualPension}
                                onChange={(e) => updateParam("annualPension", Number(e.target.value))}
                                placeholder="120000"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="annualPensionIncrease">Pension Increase Rate (%)</Label>
                            <Input
                                id="annualPensionIncrease"
                                type="number"
                                step="0.1"
                                value={params.annualPensionIncrease}
                                onChange={(e) => updateParam("annualPensionIncrease", Number(e.target.value))}
                                placeholder="3"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="investmentReturns">Investment Returns (%)</Label>
                            <Input
                                id="investmentReturns"
                                type="number"
                                step="0.1"
                                value={params.investmentReturns}
                                onChange={(e) => updateParam("investmentReturns", Number(e.target.value))}
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
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="SpendingAnnualDecrease65To74">Spending Decrease 65-74 (%)</Label>
                            <Input
                                id="SpendingAnnualDecrease65To74"
                                type="number"
                                step="0.1"
                                value={params.SpendingAnnualDecrease65To74}
                                onChange={(e) => updateParam("SpendingAnnualDecrease65To74", Number(e.target.value))}
                                placeholder="2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="SpendingAnnualDecrease75">Spending Decrease 75+ (%)</Label>
                            <Input
                                id="SpendingAnnualDecrease75"
                                type="number"
                                step="0.1"
                                value={params.SpendingAnnualDecrease75}
                                onChange={(e) => updateParam("SpendingAnnualDecrease75", Number(e.target.value))}
                                placeholder="3"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Retirement Planning Results"
                    results={[
                        { label: "Total Savings Needed", value: formatCurrency(results.totalSavingsNeeded) },
                        { label: "Total Savings at Retirement", value: formatCurrency(results.totalSavingsAtRetirement) },
                        { label: "Monthly Income Generated", value: formatCurrency(results.monthlyIncomeGenerated) },
                        { label: "Projected Annual Income", value: formatCurrency(results.projectedAnnualIncome) },
                        { label: "Annual Shortfall", value: formatCurrency(results.shortfall) },
                        { label: "Recommended Monthly Savings", value: formatCurrency(results.recommendedMonthlySavings) },
                    ]}
                />

                {results.yearlyBreakdown && results.yearlyBreakdown.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Yearly Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-60 overflow-auto">
                                <div className="grid grid-cols-5 gap-2 text-sm font-medium border-b pb-2 min-w-[200%] sm:min-w-0">
                                    <span className="sticky left-0 bg-white z-10">Year</span>
                                    <span>Balance</span>
                                    <span>Pension Income</span>
                                    <span>Shortfall</span>
                                    <span>Required Income</span>
                                </div>
                                {results.yearlyBreakdown.map((year) => (
                                    <div key={year.age} className="grid grid-cols-5 gap-2 text-sm min-w-[200%] sm:min-w-0">
                                        <span className="sticky left-0 bg-white z-10">{year.age}</span>
                                        <span>{formatCurrency(year.savingsBalance)}</span>
                                        <span className="text-green-600">{formatCurrency(year.pensionIncome)}</span>
                                        <span className="text-red-600">{formatCurrency(year.shortfallAmount)}</span>
                                        <span className="text-blue-600">{formatCurrency(year.requiredIncome)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
