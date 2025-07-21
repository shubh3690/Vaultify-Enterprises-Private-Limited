"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateCompoundInterest, type CompoundInterestParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function MMACalculator() {
    const [params, setParams] = useState<CompoundInterestParams>({
        principal: 25000,
        rate: 6.5,
        compoundingFrequency: 12,
        time: 3,
        monthlyDeposit: 500,
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
                    <CardTitle>Money Market Account Calculator</CardTitle>
                    <CardDescription>Calculate returns from your Money Market Account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Initial Deposit (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={params.principal}
                            onChange={(e) => updateParam("principal", Number(e.target.value))}
                            placeholder="25000"
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
                            placeholder="6.5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="time">Time Period (Years)</Label>
                        <Input
                            id="time"
                            type="number"
                            value={params.time}
                            onChange={(e) => updateParam("time", Number(e.target.value))}
                            placeholder="3"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyDeposit">Monthly Deposit (₹)</Label>
                        <Input
                            id="monthlyDeposit"
                            type="number"
                            value={params.monthlyDeposit}
                            onChange={(e) => updateParam("monthlyDeposit", Number(e.target.value))}
                            placeholder="500"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Money Market Account Results"
                    results={[
                        { label: "Final Balance", value: formatCurrency(results.finalAmount) },
                        { label: "Total Interest Earned", value: formatCurrency(results.totalInterest) },
                        { label: "Total Deposits", value: formatCurrency(results.totalDeposits) },
                        { label: "Effective Yield", value: `${params.rate}% APY` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>MMA Account Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Opening Balance:</span>
                                <span className="font-medium">{formatCurrency(params.principal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Contributions:</span>
                                <span className="font-medium">{formatCurrency(params.monthlyDeposit || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{params.rate}% APY</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Account Term:</span>
                                <span className="font-medium">{params.time} years</span>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    <strong>MMA Benefits:</strong> Money Market Accounts typically offer higher interest rates than
                                    regular savings accounts while maintaining liquidity and FDIC insurance protection.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
