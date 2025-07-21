"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateLoanPayoff, type LoanPayoffParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function LoanPayoffCalculator() {
    const [params, setParams] = useState<LoanPayoffParams>({
        currentBalance: 25000,
        interestRate: 6.5,
        currentPayment: 400,
        extraPayment: 100,
    })

    const [results, setResults] = useState(calculateLoanPayoff(params))

    const updateParam = (key: keyof LoanPayoffParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateLoanPayoff(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Loan Payoff Calculator</CardTitle>
                    <CardDescription>See how extra payments can help you pay off your loan faster</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="currentBalance">Current Loan Balance (₹)</Label>
                        <Input
                            id="currentBalance"
                            type="number"
                            value={params.currentBalance}
                            onChange={(e) => updateParam("currentBalance", Number(e.target.value))}
                            placeholder="25000"
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
                            placeholder="6.5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="currentPayment">Current Monthly Payment (₹)</Label>
                        <Input
                            id="currentPayment"
                            type="number"
                            value={params.currentPayment}
                            onChange={(e) => updateParam("currentPayment", Number(e.target.value))}
                            placeholder="400"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="extraPayment">Extra Monthly Payment (₹)</Label>
                        <Input
                            id="extraPayment"
                            type="number"
                            value={params.extraPayment}
                            onChange={(e) => updateParam("extraPayment", Number(e.target.value))}
                            placeholder="100"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Loan Payoff Results"
                    results={[
                        {
                            label: "Payoff Time",
                            value: `${(results.monthsToPayoff / 12).toFixed(1)} years (${results.monthsToPayoff} months)`,
                        },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Interest Saved", value: formatCurrency(results.interestSaved) },
                        {
                            label: "Time Saved",
                            value: `${(results.timeSaved / 12).toFixed(1)} years (${results.timeSaved} months)`,
                        },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Strategy Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Current Balance:</span>
                                <span className="font-medium">{formatCurrency(params.currentBalance)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Regular Payment:</span>
                                <span className="font-medium">{formatCurrency(params.currentPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Extra Payment:</span>
                                <span className="font-medium">{formatCurrency(params.extraPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Payment:</span>
                                <span className="font-medium">{formatCurrency(params.currentPayment + params.extraPayment)}</span>
                            </div>
                            {results.interestSaved > 0 && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="text-sm text-green-800">
                                        <strong>Great savings!</strong> By paying an extra {formatCurrency(params.extraPayment)} per month,
                                        you'll save {formatCurrency(results.interestSaved)} in interest and pay off your loan{" "}
                                        {(results.timeSaved / 12).toFixed(1)} years earlier.
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
