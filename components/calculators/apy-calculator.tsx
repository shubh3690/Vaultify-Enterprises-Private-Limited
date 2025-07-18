"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateAPY } from "@/lib/financial-calculations"
import { ResultsDisplay } from "@/components/ui/results-display"

export function APYCalculator() {
    const [nominalRate, setNominalRate] = useState(5)
    const [compoundingFrequency, setCompoundingFrequency] = useState(12)
    const [apy, setAPY] = useState(calculateAPY(nominalRate, compoundingFrequency))

    const updateNominalRate = (value: number) => {
        setNominalRate(value)
        setAPY(calculateAPY(value, compoundingFrequency))
    }

    const updateCompoundingFrequency = (value: number) => {
        setCompoundingFrequency(value)
        setAPY(calculateAPY(nominalRate, value))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>APY Calculator</CardTitle>
                    <CardDescription>
                        Calculate the Annual Percentage Yield (APY) based on nominal interest rate and compounding frequency
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nominalRate">Nominal Interest Rate (%)</Label>
                        <Input
                            id="nominalRate"
                            type="number"
                            step="0.1"
                            value={nominalRate}
                            onChange={(e) => updateNominalRate(Number(e.target.value))}
                            placeholder="5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="compounding">Compounding Frequency</Label>
                        <Select
                            value={compoundingFrequency.toString()}
                            onValueChange={(value) => updateCompoundingFrequency(Number(value))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Annually</SelectItem>
                                <SelectItem value="2">Semi-annually</SelectItem>
                                <SelectItem value="4">Quarterly</SelectItem>
                                <SelectItem value="12">Monthly</SelectItem>
                                <SelectItem value="365">Daily</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="APY Results"
                    results={[
                        { label: "Nominal Rate", value: `${nominalRate}%` },
                        { label: "Annual Percentage Yield (APY)", value: `${apy.toFixed(3)}%` },
                        {
                            label: "Compounding",
                            value:
                                compoundingFrequency === 1
                                    ? "Annually"
                                    : compoundingFrequency === 2
                                        ? "Semi-annually"
                                        : compoundingFrequency === 4
                                            ? "Quarterly"
                                            : compoundingFrequency === 12
                                                ? "Monthly"
                                                : "Daily",
                        },
                        { label: "Additional Yield", value: `${(apy - nominalRate).toFixed(3)}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Understanding APY</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>APY (Annual Percentage Yield)</strong> represents the real rate of return earned on an
                                investment, taking into account the effect of compounding interest.
                            </p>
                            <p>The more frequently interest compounds, the higher the APY will be compared to the nominal rate.</p>
                            <p>
                                In this example, a {nominalRate}% nominal rate compounded{" "}
                                {compoundingFrequency === 1
                                    ? "annually"
                                    : compoundingFrequency === 2
                                        ? "semi-annually"
                                        : compoundingFrequency === 4
                                            ? "quarterly"
                                            : compoundingFrequency === 12
                                                ? "monthly"
                                                : "daily"}{" "}
                                yields an APY of {apy.toFixed(3)}%.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
