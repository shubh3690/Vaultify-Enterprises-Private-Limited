"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { calculateMortgage, type MortgageParams, type MortgageResult } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function MortgageCalculator() {
    const [params, setParams] = useState<MortgageParams & { downPayment: number; homePrice: number }>({
        homePrice: 400000,
        downPayment: 80000,
        principal: 320000,
        rate: 6.5,
        term: 30,
        interestInterval: "monthly",
    })

    const [results, setResults] = useState<MortgageResult>(
        calculateMortgage(params)
    )

    const updateParam = (key: string, value: number | string) => {
        const newParams = { ...params, [key]: value }

        if (key === "homePrice" || key === "downPayment") {
            newParams.principal = newParams.homePrice - newParams.downPayment
        }

        setParams(newParams)
        setResults(calculateMortgage(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Mortgage Details</CardTitle>
                    <CardDescription>
                        Enter your home purchase information to calculate mortgage payments
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="homePrice">Home Price (₹)</Label>
                        <Input
                            id="homePrice"
                            type="number"
                            value={params.homePrice}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("homePrice", Number(e.target.value))
                            }}
                            placeholder="400000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Loan Amount</Label>
                        <div className="p-2 bg-muted rounded text-sm">
                            {formatCurrency(params.homePrice - params.downPayment)}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
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
                                placeholder="6.5"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="interestInterval">Rate Period</Label>
                            <Select
                                value={params.interestInterval}
                                onValueChange={(value) =>
                                    updateParam("interestInterval", value as "monthly" | "yearly")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                            placeholder="30"
                        />
                    </div>

                    <Card className="grid gap-2 optional p-4">
                        <Label htmlFor="downPayment">Down Payment (₹)</Label>
                        <Input
                            id="downPayment"
                            type="number"
                            value={params.downPayment}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("downPayment", Number(e.target.value))
                            }}
                            placeholder="80000"
                        />
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Capital & Repayment Mortgage"
                    results={[
                        { label: "Monthly Payment", value: params.interestInterval === "monthly" ? formatCurrency(results.capitalAndRepayment.monthlyPayment) : formatCurrency(results.capitalAndRepayment.monthlyPayment / 12) },
                        { label: "Yearly Payment", value: params.interestInterval === "monthly" ? formatCurrency(results.capitalAndRepayment.yearlyPayment) : formatCurrency(results.capitalAndRepayment.monthlyPayment) },
                        { label: "Total Payment", value: formatCurrency(results.capitalAndRepayment.totalPayment) },
                        { label: "Total Interest", value: formatCurrency(results.capitalAndRepayment.totalInterest) },
                    ]}
                />

                <ResultsDisplay
                    title="Interest-Only Mortgage"
                    results={[
                        { label: "Monthly Payment", value: params.interestInterval === "monthly" ? formatCurrency(results.interestOnly.monthlyPayment) : formatCurrency(results.interestOnly.monthlyPayment / 12) },
                        { label: "Yearly Payment", value: params.interestInterval === "monthly" ? formatCurrency(results.interestOnly.yearlyPayment) : formatCurrency(results.interestOnly.monthlyPayment) },
                        { label: "Total Payment", value: formatCurrency(results.interestOnly.totalPayment) },
                        { label: "Total Interest", value: formatCurrency(results.interestOnly.totalInterest) },
                    ]}
                />
            </div>
        </div>
    )
}
