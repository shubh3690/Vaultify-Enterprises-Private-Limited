"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateForexCompounding, ForexParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function ForexCompoundingCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [rate, setRate] = useState(5)
    const [rateInterval, setRateInterval] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")
    const [compoundingFrequency, setCompoundingFrequency] = useState(12)
    const [years, setYears] = useState(1)
    const [months, setMonths] = useState(0)
    const [additionalDeposits, setAdditionalDeposits] = useState(0)
    const [additionalDepositFrequency, setAdditionalDepositFrequency] = useState<"monthly" | "quarterly" | "half-yearly" | "yearly">("monthly")

    const calculateResults = () => {
        const params: ForexParams = {
            principal,
            rate,
            rateInterval,
            compoundingFrequency,
            years,
            months,
            additionalDeposits,
            additionalDepositFrequency
        }
        return calculateForexCompounding(params)
    }

    const results = calculateResults()

    const totalTimeInYears = years + (months / 12)
    const totalInvested = principal + results.additionalDeposits
    const annualReturn = totalTimeInYears > 0 && totalInvested > 0 ? (Math.pow(results.finalBalance / totalInvested, 1 / totalTimeInYears) - 1) * 100 : 0

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Forex Compounding Calculator</CardTitle>
                    <CardDescription>Calculate compound returns from forex trading with flexible parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Initial Deposit (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={principal}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                setPrincipal(Number(e.target.value))
                            }}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rate">Return Rate (%)</Label>
                            <Input
                                id="rate"
                                type="number"
                                step="0.1"
                                value={rate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setRate(Number(e.target.value))
                                }}
                                placeholder="5"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rateInterval">Rate Interval</Label>
                            <Select value={rateInterval} onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") => setRateInterval(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rate interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                        <Select value={compoundingFrequency.toString()} onValueChange={(value) => setCompoundingFrequency(Number(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select compounding frequency" />
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

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="years">Years</Label>
                            <Input
                                id="years"
                                type="number"
                                value={years}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setYears(Number(e.target.value))
                                }}
                                placeholder="1"
                                min="0"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="months">Months</Label>
                            <Input
                                id="months"
                                type="number"
                                value={months}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                        setMonths(0)
                                        return
                                    }
                                    if (Number(e.target.value) > 11) {
                                        setMonths(11)
                                        return
                                    }
                                    setMonths(Number(e.target.value))
                                }}
                                placeholder="0"
                                min="0"
                                max="11"
                            />
                        </div>
                    </div>

                    <Card className="optional gap-4 grid p-4">
                        <div className="grid gap-2">
                            <Label htmlFor="additionalDeposits">Additional Deposits (₹) (Optional)</Label>
                            <Input
                                id="additionalDeposits"
                                type="number"
                                value={additionalDeposits}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setAdditionalDeposits(Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="additionalDepositFrequency">Additional Deposit Frequency</Label>
                            <Select value={additionalDepositFrequency} onValueChange={(value: "monthly" | "quarterly" | "half-yearly" | "yearly") => setAdditionalDepositFrequency(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select deposit frequency" />
                                </SelectTrigger>
                                <SelectContent>
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
                    title="Forex Compounding Results"
                    results={[
                        { label: "Final Balance", value: formatCurrency(results.finalBalance) },
                        { label: "Total Profit", value: formatCurrency(results.totalEarning) },
                        { label: "Initial Deposit", value: formatCurrency(results.initialBalance) },
                        { label: "Total Additional Deposits", value: formatCurrency(results.additionalDeposits) },
                        { label: "Equivalent Annual Return", value: `${annualReturn.toFixed(2)}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Trading Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Initial Deposit:</span>
                                <span className="font-medium">{formatCurrency(principal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Return Rate:</span>
                                <span className="font-medium">{rate}% {rateInterval}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Compounding:</span>
                                <span className="font-medium">{compoundingFrequency} times per year</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Trading Period:</span>
                                <span className="font-medium">
                                    {years} years {months > 0 && `${months} months`} ({(years + months / 12).toFixed(1)} years total)
                                </span>
                            </div>
                            {additionalDeposits > 0 && (
                                <div className="flex justify-between">
                                    <span>Additional Deposits:</span>
                                    <span className="font-medium">{formatCurrency(additionalDeposits)} {additionalDepositFrequency}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
