"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateLoan, type LoanParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function MortgageCalculator() {
    const [params, setParams] = useState<LoanParams & { downPayment: number; homePrice: number }>({
        homePrice: 400000,
        downPayment: 80000,
        principal: 320000,
        rate: 6.5,
        term: 30,
    })

    const [results, setResults] = useState(calculateLoan(params))

    const updateParam = (key: string, value: number) => {
        const newParams = { ...params, [key]: value }

        if (key === "homePrice" || key === "downPayment") {
            newParams.principal = newParams.homePrice - newParams.downPayment
        }

        setParams(newParams)
        setResults(calculateLoan(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Mortgage Details</CardTitle>
                    <CardDescription>Enter your home purchase information to calculate mortgage payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="homePrice">Home Price (₹)</Label>
                        <Input
                            id="homePrice"
                            type="number"
                            value={params.homePrice}
                            onChange={(e) => updateParam("homePrice", Number(e.target.value))}
                            placeholder="400000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="downPayment">Down Payment (₹)</Label>
                        <Input
                            id="downPayment"
                            type="number"
                            value={params.downPayment}
                            onChange={(e) => updateParam("downPayment", Number(e.target.value))}
                            placeholder="80000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Loan Amount</Label>
                        <div className="p-2 bg-muted rounded text-sm">{formatCurrency(params.homePrice - params.downPayment)}</div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate">Interest Rate (%)</Label>
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
                        <Label htmlFor="term">Loan Term (Years)</Label>
                        <Input
                            id="term"
                            type="number"
                            value={params.term}
                            onChange={(e) => updateParam("term", Number(e.target.value))}
                            placeholder="30"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Mortgage Payment Results"
                    results={[
                        { label: "Monthly Payment", value: formatCurrency(results.monthlyPayment) },
                        { label: "Total Payment", value: formatCurrency(results.totalPayment) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Down Payment", value: formatCurrency(params.downPayment) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Mortgage Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Home Price:</span>
                                <span className="font-medium">{formatCurrency(params.homePrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Down Payment:</span>
                                <span className="font-medium">
                                    {formatCurrency(params.downPayment)} ({((params.downPayment / params.homePrice) * 100).toFixed(1)}%)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Loan Amount:</span>
                                <span className="font-medium">{formatCurrency(params.principal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{params.rate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Loan Term:</span>
                                <span className="font-medium">{params.term} years</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
