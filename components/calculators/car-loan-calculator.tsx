"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateCarLoan, type CarLoanParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function CarLoanCalculator() {
    const [params, setParams] = useState<CarLoanParams & {
        carPrice: number
        downPayment: number
    }>({
        carPrice: 25000,
        downPayment: 5000,
        principal: 20000,
        rate: 5.5,
        term: 5,
        ballonPayment: 0
    })

    const [results, setResults] = useState(calculateCarLoan(params))

    const updateParam = (key: string, value: number) => {
        const newParams = { ...params, [key]: value }

        if (["carPrice", "downPayment"].includes(key)) {
            newParams.principal = Math.max(0, newParams.carPrice - newParams.downPayment)
        }

        setParams(newParams)
        setResults(calculateCarLoan(newParams))
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
                        <Label htmlFor="carPrice">Car Price (₹)</Label>
                        <Input
                            id="carPrice"
                            type="number"
                            value={params.carPrice}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("carPrice", Number(e.target.value))
                            }}
                            placeholder="25000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="optional" htmlFor="downPayment">Down Payment (₹)</Label>
                        <Input
                            id="downPayment"
                            type="number"
                            value={params.downPayment}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("downPayment", Number(e.target.value))
                            }}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Loan Amount</Label>
                        <div className="p-2 bg-muted rounded text-sm">
                            {formatCurrency(params.principal)}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate">Interest Rate (%)</Label>
                        <Input
                            id="rate"
                            type="number"
                            step="0.1"
                            value={params.rate}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("rate", Number(e.target.value))
                            }}
                            placeholder="5.5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="term">Loan Term (Years)</Label>
                        <Input
                            id="term"
                            type="number"
                            value={params.term}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("term", Number(e.target.value))
                            }}
                            placeholder="5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ballonPayment">Balloon Payment at End (₹)</Label>
                        <Input
                            id="ballonPayment"
                            type="number"
                            value={params.ballonPayment}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("ballonPayment", Number(e.target.value))
                            }}
                            placeholder="0"
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
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-2">
                                <span>Month</span>
                                <span>Balance</span>
                                <span>Interest</span>
                                <span>Payment</span>
                            </div>
                            {results.amortizationSchedule.map((month) => (
                                <div key={month.month} className="grid grid-cols-4 gap-2 text-sm">
                                    <span>{month.month}</span>
                                    <span>{formatCurrency(month.balance)}</span>
                                    <span>{formatCurrency(month.interest)}</span>
                                    <span className="text-red-600">{formatCurrency(month.payment)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
