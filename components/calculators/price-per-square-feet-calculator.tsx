"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function PricePerSquareFeetCalculator() {
    const [totalPrice, setTotalPrice] = useState(300000)
    const [area, setArea] = useState(2000)
    const [areaUnit, setAreaUnit] = useState("sqft")

    // Convert area to different units
    const areaInSqFt = areaUnit === "sqft" ? area : areaUnit === "sqm" ? area * 10.764 : area * 9   // sq yards to sq ft
    const areaInSqM = areaUnit === "sqm" ? area : areaUnit === "sqft" ? area / 10.764 : area / 9    // sq yards to sq m
    const areaInSqYd = areaUnit === "sqyd" ? area : areaUnit === "sqft" ? area / 9 : area / 9       // sq m to sq yards

    // Calculate price per unit
    const pricePerSqFt = totalPrice / areaInSqFt
    const pricePerSqM = totalPrice / areaInSqM
    const pricePerSqYd = totalPrice / areaInSqYd

    const areaUnits = [
        { value: "sqft", label: "Square Feet (sq ft)" },
        { value: "sqm", label: "Square Meters (sq m)" },
        { value: "sqyd", label: "Square Yards (sq yd)" },
    ]

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Price per Square Feet Calculator</CardTitle>
                    <CardDescription>Calculate real estate price per square foot, meter, and yard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="totalPrice">Total Price (₹)</Label>
                        <Input
                            id="totalPrice"
                            type="number"
                            value={totalPrice}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                setTotalPrice(Number(e.target.value))
                            }}
                            placeholder="300000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="area">Area (sq unit)</Label>
                        <Input
                            id="area"
                            type="number"
                            step="0.01"
                            value={area}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                setArea(Number(e.target.value))
                            }}
                            placeholder="2000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="areaUnit">Area Unit</Label>
                        <Select value={areaUnit} onValueChange={setAreaUnit}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {areaUnits.map((unit) => (
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
                    title="Price per Unit Area"
                    results={[
                        { label: "Price per Square Foot", value: formatCurrency(pricePerSqFt) },
                        { label: "Price per Square Meter", value: formatCurrency(pricePerSqM) },
                        { label: "Price per Square Yard", value: formatCurrency(pricePerSqYd) },
                        { label: "Total Property Area", value: `${formatNumber(area)} ${areaUnit}` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Property Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Area in sq ft:</span>
                                <span>{formatNumber(areaInSqFt)} sq ft</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Area in sq m:</span>
                                <span>{formatNumber(areaInSqM)} sq m</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Area in sq yd:</span>
                                <span>{formatNumber(areaInSqYd)} sq yd</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
