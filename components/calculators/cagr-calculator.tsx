"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateCAGR } from "@/lib/financial-calculations"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function CAGRCalculator() {
    const [beginningValue, setBeginningValue] = useState(10000)
    const [endingValue, setEndingValue] = useState(15000)
    const [years, setYears] = useState(3)
    const [cagr, setCAGR] = useState(calculateCAGR(beginningValue, endingValue, years))

    const updateBeginningValue = (value: number) => {
        setBeginningValue(value)
        setCAGR(calculateCAGR(value, endingValue, years))
    }

    const updateEndingValue = (value: number) => {
        setEndingValue(value)
        setCAGR(calculateCAGR(beginningValue, value, years))
    }

    const updateYears = (value: number) => {
        setYears(value)
        setCAGR(calculateCAGR(beginningValue, endingValue, value))
    }

    const totalReturn = ((endingValue - beginningValue) / beginningValue) * 100

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>CAGR Calculator</CardTitle>
                    <CardDescription>Calculate Compound Annual Growth Rate for your investments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="beginningValue">Beginning Value (₹)</Label>
                        <Input
                            id="beginningValue"
                            type="number"
                            value={beginningValue}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateBeginningValue(Number(e.target.value))
                            }}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="endingValue">Ending Value (₹)</Label>
                        <Input
                            id="endingValue"
                            type="number"
                            value={endingValue}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateEndingValue(Number(e.target.value))
                            }}
                            placeholder="15000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="years">Number of Years</Label>
                        <Input
                            id="years"
                            type="number"
                            step="0.1"
                            value={years}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateYears(Number(e.target.value))
                            }}
                            placeholder="3"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="CAGR Results"
                    results={[
                        { label: "CAGR", value: formatPercentage(cagr) },
                        { label: "Total Return", value: formatPercentage(totalReturn) },
                        { label: "Beginning Value", value: formatCurrency(beginningValue) },
                        { label: "Ending Value", value: formatCurrency(endingValue) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Understanding CAGR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>CAGR (Compound Annual Growth Rate)</strong> represents the mean annual growth rate of an
                                investment over a specified time period longer than one year.
                            </p>
                            <p>
                                Your investment grew from {formatCurrency(beginningValue)} to {formatCurrency(endingValue)} over {years}{" "}
                                years, representing a CAGR of {formatPercentage(cagr)}.
                            </p>
                            <p>
                                This means your investment grew at an average rate of {formatPercentage(cagr)} per year, compounded
                                annually.
                            </p>
                            <p>
                                <strong>Total Return:</strong> {formatPercentage(totalReturn)} over {years} years.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
