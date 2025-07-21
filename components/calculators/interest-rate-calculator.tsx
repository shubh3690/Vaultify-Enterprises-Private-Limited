"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateRequiredInterestRate } from "@/lib/financial-calculations"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function InterestRateCalculator() {
    const [presentValue, setPresentValue] = useState(10000)
    const [futureValue, setFutureValue] = useState(15000)
    const [periods, setPeriods] = useState(5)
    const [requiredRate, setRequiredRate] = useState(calculateRequiredInterestRate(presentValue, futureValue, periods))

    const updatePresentValue = (value: number) => {
        setPresentValue(value)
        setRequiredRate(calculateRequiredInterestRate(value, futureValue, periods))
    }

    const updateFutureValue = (value: number) => {
        setFutureValue(value)
        setRequiredRate(calculateRequiredInterestRate(presentValue, value, periods))
    }

    const updatePeriods = (value: number) => {
        setPeriods(value)
        setRequiredRate(calculateRequiredInterestRate(presentValue, futureValue, value))
    }

    const totalReturn = ((futureValue - presentValue) / presentValue) * 100

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Interest Rate Calculator</CardTitle>
                    <CardDescription>Calculate the required interest rate to reach your financial goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="presentValue">Present Value (₹)</Label>
                        <Input
                            id="presentValue"
                            type="number"
                            value={presentValue}
                            onChange={(e) => updatePresentValue(Number(e.target.value))}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="futureValue">Future Value Goal (₹)</Label>
                        <Input
                            id="futureValue"
                            type="number"
                            value={futureValue}
                            onChange={(e) => updateFutureValue(Number(e.target.value))}
                            placeholder="15000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="periods">Time Period (Years)</Label>
                        <Input
                            id="periods"
                            type="number"
                            step="0.1"
                            value={periods}
                            onChange={(e) => updatePeriods(Number(e.target.value))}
                            placeholder="5"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Required Interest Rate"
                    results={[
                        { label: "Required Annual Rate", value: formatPercentage(requiredRate) },
                        { label: "Total Return", value: formatPercentage(totalReturn) },
                        { label: "Present Value", value: formatCurrency(presentValue) },
                        { label: "Future Value", value: formatCurrency(futureValue) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Investment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Starting Amount:</span>
                                <span className="font-medium">{formatCurrency(presentValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Target Amount:</span>
                                <span className="font-medium">{formatCurrency(futureValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time Frame:</span>
                                <span className="font-medium">{periods} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Growth Needed:</span>
                                <span className="font-medium">{formatCurrency(futureValue - presentValue)}</span>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    To grow {formatCurrency(presentValue)} to {formatCurrency(futureValue)} in {periods} years, you need
                                    an annual return of {formatPercentage(requiredRate)}.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
