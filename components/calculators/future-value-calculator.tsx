"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateFutureValue } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function FutureValueCalculator() {
    const [presentValue, setPresentValue] = useState(10000)
    const [rate, setRate] = useState(5)
    const [periods, setPeriods] = useState(10)
    const [paymentPerPeriod, setPaymentPerPeriod] = useState(0)
    const [futureValue, setFutureValue] = useState(calculateFutureValue(presentValue, rate, periods, paymentPerPeriod))

    const updatePresentValue = (value: number) => {
        setPresentValue(value)
        setFutureValue(calculateFutureValue(value, rate, periods, paymentPerPeriod))
    }

    const updateRate = (value: number) => {
        setRate(value)
        setFutureValue(calculateFutureValue(presentValue, value, periods, paymentPerPeriod))
    }

    const updatePeriods = (value: number) => {
        setPeriods(value)
        setFutureValue(calculateFutureValue(presentValue, rate, value, paymentPerPeriod))
    }

    const updatePayment = (value: number) => {
        setPaymentPerPeriod(value)
        setFutureValue(calculateFutureValue(presentValue, rate, periods, value))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Future Value Calculator</CardTitle>
                    <CardDescription>Calculate the future value of your investment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="presentValue">Present Value</Label>
                        <Input
                            id="presentValue"
                            type="number"
                            value={presentValue}
                            onChange={(e) => updatePresentValue(Number(e.target.value))}
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
                        <Label htmlFor="periods">Number of Years</Label>
                        <Input
                            id="periods"
                            type="number"
                            value={periods}
                            onChange={(e) => updatePeriods(Number(e.target.value))}
                            placeholder="10"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="payment">Annual Payment (Optional)</Label>
                        <Input
                            id="payment"
                            type="number"
                            value={paymentPerPeriod}
                            onChange={(e) => updatePayment(Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Future Value Results"
                    results={[
                        { label: "Future Value", value: formatCurrency(futureValue) },
                        { label: "Present Value", value: formatCurrency(presentValue) },
                        { label: "Total Growth", value: formatCurrency(futureValue - presentValue) },
                        {
                            label: "Growth Percentage",
                            value: `${(((futureValue - presentValue) / presentValue) * 100).toFixed(2)}%`,
                        },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Initial Investment:</span>
                                <span className="font-medium">{formatCurrency(presentValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Annual Interest Rate:</span>
                                <span className="font-medium">{rate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time Period:</span>
                                <span className="font-medium">{periods} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Annual Payment:</span>
                                <span className="font-medium">{formatCurrency(paymentPerPeriod)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
