"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateAPY, type APYParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function APYCalculator() {
    const [params, setParams] = useState<APYParams>({
        principal: 10000,
        nominalRate: 5,
        years: 1,
        months: 0,
        compoundingFrequency: 12,
        regularDeposit: 0,
        depositRate: "monthly"
    })

    const result = calculateAPY(params)
    const updateParam = <K extends keyof APYParams>(key: K, value: APYParams[K]) => {
        setParams({ ...params, [key]: value })
    }

    const getCompoundingLabel = (frequency: number): string => {
        switch (frequency) {
            case 1: return "Annually"
            case 2: return "Semi-annually"
            case 4: return "Quarterly"
            case 12: return "Monthly"
            case 52: return "Weekly"
            case 365: return "Daily"
            default: return `${frequency} times per year`
        }
    }

    const getDepositRateLabel = (rate?: string): string => {
        switch (rate) {
            case "weekly": return "Weekly"
            case "monthly": return "Monthly"
            case "quarterly": return "Quarterly"
            case "half-yearly": return "Half-yearly"
            case "yearly": return "Yearly"
            default: return "Monthly"
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>APY Calculator</CardTitle>
                    <CardDescription>
                        Calculate the Annual Percentage Yield (APY) and future value with compound interest
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Principal Amount (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={params.principal}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam('principal', Number(e.target.value))
                            }}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nominalRate">Nominal Interest Rate (%)</Label>
                            <Input
                                id="nominalRate"
                                type="number"
                                step="0.01"
                                value={params.nominalRate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam('nominalRate', Number(e.target.value))
                                }}
                                placeholder="5"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="compounding">Compounding Frequency</Label>
                            <Select
                                value={params.compoundingFrequency.toString()}
                                onValueChange={(value) => updateParam('compoundingFrequency', Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="365">Daily (365/yr)</SelectItem>
                                    <SelectItem value="52">Weekly (52/yr)</SelectItem>
                                    <SelectItem value="12">Monthly (12/yr)</SelectItem>
                                    <SelectItem value="4">Quarterly (4/yr)</SelectItem>
                                    <SelectItem value="2">Half-Yearly (2/yr)</SelectItem>
                                    <SelectItem value="1">Yearly (1/yr)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="years">Years</Label>
                            <Input
                                id="years"
                                type="number"
                                min="0"
                                value={params.years}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam('years', Number(e.target.value))
                                }}
                                placeholder="1"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="months">Months</Label>
                            <Input
                                id="months"
                                type="number"
                                min="0"
                                max="11"
                                value={params.months}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                        updateParam('months', 0)
                                        return
                                    }
                                    if (Number(e.target.value) > 11) {
                                        updateParam('months', 11)
                                        return
                                    }
                                    updateParam('months', Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <Card className="grid gap-4 sm:grid-cols-2 p-4 optional">
                        <div className="grid gap-2">
                            <Label htmlFor="regularDeposit">Deposit Amount (₹)</Label>
                            <Input
                                id="regularDeposit"
                                type="number"
                                value={params.regularDeposit || 0}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam('regularDeposit', Number(e.target.value))
                                }}
                                placeholder="100"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="optional" htmlFor="depositRate">Deposit Frequency</Label>
                            <Select
                                value={params.depositRate || "monthly"}
                                onValueChange={(value) => updateParam('depositRate', value as "weekly" | "monthly" | "quarterly" | "half-yearly" | "yearly")}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half-yearly">Half-yearly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="APY & Investment Results"
                    results={[
                        { label: "Annual Percentage Yield (APY)", value: `${result.APYRate}%` },
                        { label: "Final Balance", value: formatCurrency(result.finalBalance) },
                        { label: "Initial Balance", value: formatCurrency(result.initialBalance) },
                        { label: "Total Interest Earned", value: formatCurrency(result.totalInterest) },
                        { label: "Additional Deposits", value: formatCurrency(result.additionalDeposits) },
                        { label: "Total Growth", value: formatCurrency(result.finalBalance - result.initialBalance) },
                        { label: "Growth Percentage", value: `${((result.finalBalance - result.initialBalance) / result.initialBalance * 100).toFixed(2)}%` }
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
                                In this example, a {params.nominalRate}% nominal rate compounded{" "}
                                {getCompoundingLabel(params.compoundingFrequency).toLowerCase()}{" "}
                                yields an APY of {result.APYRate}%.
                            </p>
                            <p>
                                With regular {getDepositRateLabel(params.depositRate).toLowerCase()} deposits of{" "}
                                {formatCurrency(params.regularDeposit || 0)}, your investment grows to{" "}
                                {formatCurrency(result.finalBalance)} over the specified period.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                The additional yield of {(result.APYRate - params.nominalRate).toFixed(4)}% comes entirely from the compounding effect.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
