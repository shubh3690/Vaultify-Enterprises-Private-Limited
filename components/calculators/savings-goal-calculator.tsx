"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateSavingsGoal, type SavingsGoalParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SavingsGoalCalculator() {
    const [params, setParams] = useState<SavingsGoalParams>({
        targetAmount: 50000,
        currentSavings: 5000,
        depositAmount: 500,
        depositFrequency: 'monthly',
        interestRate: 4,
        compoundingFrequency: 12,
    })

    const [results, setResults] = useState(calculateSavingsGoal(params))

    const updateParam = (key: keyof SavingsGoalParams, value: number | string) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateSavingsGoal(newParams))
    }

    const getFrequencyLabel = (freq: string) => {
        const labels: Record<string, string> = {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'fortnightly': 'Fortnightly',
            'monthly': 'Monthly'
        }
        return labels[freq] || 'Monthly'
    }

    const getAnnualContribution = (amount: number, freq: string) => {
        switch (freq) {
            case 'daily': return amount * 365
            case 'weekly': return amount * 52
            case 'fortnightly': return amount * 26
            case 'monthly': return amount * 12
            default: return amount * 12
        }
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
                        <Label htmlFor="targetAmount">Savings Goal (₹)</Label>
                        <Input
                            id="targetAmount"
                            type="number"
                            value={params.targetAmount}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("targetAmount", Number(e.target.value))
                            }}
                            placeholder="50000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                        <Input
                            id="currentSavings"
                            type="number"
                            value={params.currentSavings}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("currentSavings", Number(e.target.value))
                            }}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="depositAmount">Deposit Amount (₹)</Label>
                            <Input
                                id="depositAmount"
                                type="number"
                                value={params.depositAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("depositAmount", Number(e.target.value))
                                }}
                                placeholder="500"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Deposit Frequency</Label>
                            <Select
                                value={params.depositFrequency}
                                onValueChange={(value) => updateParam("depositFrequency", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                        <Input
                            id="interestRate"
                            type="number"
                            step="0.1"
                            value={params.interestRate}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("interestRate", Number(e.target.value))
                            }}
                            placeholder="4"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Savings Goal Results"
                    results={[
                        { label: "Time to Goal", value: `${results.yearsToGoal.toFixed(1)} years (${results.monthsToGoal} months)` },
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
                                <span>{getFrequencyLabel(params.depositFrequency)} Deposit:</span>
                                <span className="font-medium">{formatCurrency(params.depositAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Annual Contribution:</span>
                                <span className="font-medium">{formatCurrency(getAnnualContribution(params.depositAmount, params.depositFrequency))}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{params.interestRate}% per annum</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount Needed:</span>
                                <span className="font-medium">{formatCurrency(params.targetAmount - params.currentSavings)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time to Goal:</span>
                                <span className={`font-medium ${Number(results.yearsToGoal.toFixed(1)) < 30 ? "text-green-600" : (Number(results.yearsToGoal.toFixed(1)) < 50 ? "text-yellow-600" : "text-red-600")}`}>
                                    {results.yearsToGoal.toFixed(1)} years
                                </span>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    <strong>Success Plan:</strong> Save {formatCurrency(params.depositAmount)} {params.depositFrequency} for{" "}
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
