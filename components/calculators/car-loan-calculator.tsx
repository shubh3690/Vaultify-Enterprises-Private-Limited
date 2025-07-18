"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateLoan, type LoanParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function CarLoanCalculator() {
    const [params, setParams] = useState<LoanParams & { carPrice: number; downPayment: number; tradeInValue: number }>({
        carPrice: 25000,
        downPayment: 5000,
        tradeInValue: 0,
        principal: 20000,
        rate: 5.5,
        term: 5,
    })

    const [results, setResults] = useState(calculateLoan(params))

    const updateParam = (key: string, value: number) => {
        const newParams = { ...params, [key]: value }

        if (key === "carPrice" || key === "downPayment" || key === "tradeInValue") {
            newParams.principal = newParams.carPrice - newParams.downPayment - newParams.tradeInValue
        }

        setParams(newParams)
        setResults(calculateLoan(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Car Loan Calculator</CardTitle>
                    <CardDescription>Calculate your auto loan payments and total costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="carPrice">Car Price</Label>
                        <Input
                            id="carPrice"
                            type="number"
                            value={params.carPrice}
                            onChange={(e) => updateParam("carPrice", Number(e.target.value))}
                            placeholder="25000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="downPayment">Down Payment</Label>
                        <Input
                            id="downPayment"
                            type="number"
                            value={params.downPayment}
                            onChange={(e) => updateParam("downPayment", Number(e.target.value))}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tradeInValue">Trade-in Value</Label>
                        <Input
                            id="tradeInValue"
                            type="number"
                            value={params.tradeInValue}
                            onChange={(e) => updateParam("tradeInValue", Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Loan Amount</Label>
                        <div className="p-2 bg-muted rounded text-sm">
                            {formatCurrency(params.carPrice - params.downPayment - params.tradeInValue)}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate">Interest Rate (%)</Label>
                        <Input
                            id="rate"
                            type="number"
                            step="0.1"
                            value={params.rate}
                            onChange={(e) => updateParam("rate", Number(e.target.value))}
                            placeholder="5.5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="term">Loan Term (Years)</Label>
                        <Input
                            id="term"
                            type="number"
                            value={params.term}
                            onChange={(e) => updateParam("term", Number(e.target.value))}
                            placeholder="5"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Car Loan Results"
                    results={[
                        { label: "Monthly Payment", value: formatCurrency(results.monthlyPayment) },
                        { label: "Total Payment", value: formatCurrency(results.totalPayment) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Total Cost of Car", value: formatCurrency(results.totalPayment + params.downPayment) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Car Purchase Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Car Price:</span>
                                <span className="font-medium">{formatCurrency(params.carPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Down Payment:</span>
                                <span className="font-medium">{formatCurrency(params.downPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Trade-in Value:</span>
                                <span className="font-medium">{formatCurrency(params.tradeInValue)}</span>
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
