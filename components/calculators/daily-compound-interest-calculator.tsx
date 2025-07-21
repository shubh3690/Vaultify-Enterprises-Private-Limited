"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateDailyCompoundInterest } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function DailyCompoundInterestCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [rate, setRate] = useState(5)
    const [days, setDays] = useState(365)
    const [results, setResults] = useState(calculateDailyCompoundInterest(principal, rate, days))

    const updatePrincipal = (value: number) => {
        setPrincipal(value)
        setResults(calculateDailyCompoundInterest(value, rate, days))
    }

    const updateRate = (value: number) => {
        setRate(value)
        setResults(calculateDailyCompoundInterest(principal, value, days))
    }

    const updateDays = (value: number) => {
        setDays(value)
        setResults(calculateDailyCompoundInterest(principal, rate, value))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Daily Compound Interest</CardTitle>
                    <CardDescription>Calculate interest compounded daily for maximum growth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Initial Investment (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={principal}
                            onChange={(e) => updatePrincipal(Number(e.target.value))}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                        <Input
                            id="rate"
                            type="number"
                            step="0.1"
                            value={rate}
                            onChange={(e) => updateRate(Number(e.target.value))}
                            placeholder="5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="days">Number of Days</Label>
                        <Input
                            id="days"
                            type="number"
                            value={days}
                            onChange={(e) => updateDays(Number(e.target.value))}
                            placeholder="365"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Daily Compound Interest Results"
                    results={[
                        { label: "Final Amount", value: formatCurrency(results.finalAmount) },
                        { label: "Total Interest Earned", value: formatCurrency(results.totalInterest) },
                        { label: "Initial Investment", value: formatCurrency(principal) },
                        { label: "Daily Interest Rate", value: `${(rate / 365).toFixed(4)}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Daily Compounding Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>Daily compounding</strong> means your interest is calculated and added to your principal every
                                day, maximizing the compound effect.
                            </p>
                            <p>
                                With daily compounding at {rate}% annual rate, your money grows by approximately{" "}
                                {((rate / 365) * 100).toFixed(4)}% each day.
                            </p>
                            <p>
                                Over {days} days ({(days / 365).toFixed(1)} years), your {formatCurrency(principal)} grows to{" "}
                                {formatCurrency(results.finalAmount)}.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
