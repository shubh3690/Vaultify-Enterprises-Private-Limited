"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateSimpleInterest } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SimpleInterestCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [rate, setRate] = useState(5)
    const [time, setTime] = useState(3)
    const [interest, setInterest] = useState(calculateSimpleInterest(principal, rate, time))

    const updatePrincipal = (value: number) => {
        setPrincipal(value)
        setInterest(calculateSimpleInterest(value, rate, time))
    }

    const updateRate = (value: number) => {
        setRate(value)
        setInterest(calculateSimpleInterest(principal, value, time))
    }

    const updateTime = (value: number) => {
        setTime(value)
        setInterest(calculateSimpleInterest(principal, rate, value))
    }

    const totalAmount = principal + interest

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Simple Interest Calculator</CardTitle>
                    <CardDescription>Calculate simple interest on your principal amount</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Principal Amount</Label>
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
                        <Label htmlFor="time">Time Period (Years)</Label>
                        <Input
                            id="time"
                            type="number"
                            step="0.1"
                            value={time}
                            onChange={(e) => updateTime(Number(e.target.value))}
                            placeholder="3"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Simple Interest Results"
                    results={[
                        { label: "Simple Interest", value: formatCurrency(interest) },
                        { label: "Total Amount", value: formatCurrency(totalAmount) },
                        { label: "Principal", value: formatCurrency(principal) },
                        { label: "Interest Rate", value: `${rate}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Simple Interest Formula</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>Simple Interest = Principal × Rate × Time</strong>
                            </p>
                            <p>
                                Simple Interest = {formatCurrency(principal)} × {rate}% × {time} years = {formatCurrency(interest)}
                            </p>
                            <p>
                                <strong>Total Amount = Principal + Simple Interest</strong>
                            </p>
                            <p>
                                Total Amount = {formatCurrency(principal)} + {formatCurrency(interest)} = {formatCurrency(totalAmount)}
                            </p>
                            <p className="text-muted-foreground">
                                Note: Simple interest doesn't compound, so the interest earned each year remains constant.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
