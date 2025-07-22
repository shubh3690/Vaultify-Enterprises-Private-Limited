"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { convertLargeNumbers } from "@/lib/financial-calculations"
import { formatNumber } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function MillionToBillionConverter() {
    const [value, setValue] = useState(1000)
    const [fromUnit, setFromUnit] = useState("millions")
    const [toUnit, setToUnit] = useState("billions")
    const [result, setResult] = useState(convertLargeNumbers(value, fromUnit, toUnit))

    const updateValue = (newValue: number) => {
        setValue(newValue)
        setResult(convertLargeNumbers(newValue, fromUnit, toUnit))
    }

    const updateFromUnit = (newUnit: string) => {
        setFromUnit(newUnit)
        setResult(convertLargeNumbers(value, newUnit, toUnit))
    }

    const updateToUnit = (newUnit: string) => {
        setToUnit(newUnit)
        setResult(convertLargeNumbers(value, fromUnit, newUnit))
    }

    const units = [
        { value: "ones", label: "Ones" },
        { value: "thousands", label: "Thousands" },
        { value: "lakhs", label: "Lakhs" },
        { value: "millions", label: "Millions" },
        { value: "crores", label: "Crores" },
        { value: "billions", label: "Billions" },
        { value: "trillions", label: "Trillions" },
    ]

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Large Number Converter</CardTitle>
                    <CardDescription>Convert between large number units</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="value">Value</Label>
                        <Input
                            id="value"
                            type="number"
                            step="1"
                            value={value}
                            onChange={(e) => updateValue(Number(e.target.value))}
                            placeholder="1000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fromUnit">From</Label>
                        <Select value={fromUnit} onValueChange={updateFromUnit}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="toUnit">To</Label>
                        <Select value={toUnit} onValueChange={updateToUnit}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Conversion Results"
                    results={[
                        { label: `${formatNumber(value)} ${fromUnit}`, value: `${formatNumber(result, 2)} ${toUnit}` },
                        { label: "Scientific Notation", value: result.toExponential(3) },
                        { label: "Full Number", value: formatNumber(result * getMultiplier(toUnit)) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Reference</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>1 Thousand:</span>
                                <span>1,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>1 Lakh:</span>
                                <span>100,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>1 Million:</span>
                                <span>1,000,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>1 Crore:</span>
                                <span>10,000,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>1 Billion:</span>
                                <span>1,000,000,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>1 Trillion:</span>
                                <span>1,000,000,000,000</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function getMultiplier(unit: string): number {
    const multipliers = {
        ones: 1,
        thousands: 1_000,
        lakhs: 100_000,
        millions: 1_000_000,
        crores: 10_000_000,
        billions: 1_000_000_000,
        trillions: 1_000_000_000_000,
    }
    return multipliers[unit as keyof typeof multipliers] || 1
}
