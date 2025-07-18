"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateMoneyCount } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function MoneyCounterCalculator() {
    const [denominations, setDenominations] = useState({
        hundreds: 0,
        fifties: 0,
        twenties: 0,
        tens: 0,
        fives: 0,
        dollars: 0,
        quarters: 0,
        dimes: 0,
        nickels: 0,
        pennies: 0,
    })

    const [results, setResults] = useState(calculateMoneyCount(denominations))

    const updateDenomination = (key: string, value: number) => {
        const newDenominations = { ...denominations, [key]: value }
        setDenominations(newDenominations)
        setResults(calculateMoneyCount(newDenominations))
    }

    const denominationLabels = {
        hundreds: "$100 Bills",
        fifties: "$50 Bills",
        twenties: "$20 Bills",
        tens: "$10 Bills",
        fives: "$5 Bills",
        dollars: "$1 Bills",
        quarters: "Quarters",
        dimes: "Dimes",
        nickels: "Nickels",
        pennies: "Pennies",
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Money Counter</CardTitle>
                    <CardDescription>Count and calculate total value of cash and coins</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <h3 className="font-medium">Bills</h3>
                        {["hundreds", "fifties", "twenties", "tens", "fives", "dollars"].map((denom) => (
                            <div key={denom} className="grid grid-cols-2 gap-2 items-center">
                                <Label htmlFor={denom}>{denominationLabels[denom as keyof typeof denominationLabels]}</Label>
                                <Input
                                    id={denom}
                                    type="number"
                                    value={denominations[denom as keyof typeof denominations]}
                                    onChange={(e) => updateDenomination(denom, Number(e.target.value))}
                                    placeholder="0"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-medium">Coins</h3>
                        {["quarters", "dimes", "nickels", "pennies"].map((denom) => (
                            <div key={denom} className="grid grid-cols-2 gap-2 items-center">
                                <Label htmlFor={denom}>{denominationLabels[denom as keyof typeof denominationLabels]}</Label>
                                <Input
                                    id={denom}
                                    type="number"
                                    value={denominations[denom as keyof typeof denominations]}
                                    onChange={(e) => updateDenomination(denom, Number(e.target.value))}
                                    placeholder="0"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Money Count Results"
                    results={[
                        { label: "Total Value", value: formatCurrency(results.total) },
                        {
                            label: "Bills Total",
                            value: formatCurrency(
                                (results.breakdown.hundreds?.total || 0) +
                                (results.breakdown.fifties?.total || 0) +
                                (results.breakdown.twenties?.total || 0) +
                                (results.breakdown.tens?.total || 0) +
                                (results.breakdown.fives?.total || 0) +
                                (results.breakdown.dollars?.total || 0),
                            ),
                        },
                        {
                            label: "Coins Total",
                            value: formatCurrency(
                                (results.breakdown.quarters?.total || 0) +
                                (results.breakdown.dimes?.total || 0) +
                                (results.breakdown.nickels?.total || 0) +
                                (results.breakdown.pennies?.total || 0),
                            ),
                        },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(results.breakdown).map(
                                ([denom, data]) =>
                                    data.count > 0 && (
                                        <div key={denom} className="flex justify-between text-sm">
                                            <span>
                                                {data.count} × {denominationLabels[denom as keyof typeof denominationLabels]}:
                                            </span>
                                            <span>{formatCurrency(data.total)}</span>
                                        </div>
                                    ),
                            )}
                            <div className="border-t pt-2 flex justify-between font-medium">
                                <span>Total:</span>
                                <span>{formatCurrency(results.total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
