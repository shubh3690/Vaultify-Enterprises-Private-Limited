"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateSIP, type SIPParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SIPCalculator() {
    const [params, setParams] = useState<SIPParams>({
        regularInvestment: 5000,
        investmentFrequency: "monthly",
        expectedReturn: 12,
        years: 5,
        months: 0,
        initialBalance: 0,
        investmentIncreaseRate: 0
    })

    const [results, setResults] = useState(calculateSIP(params))

    const updateParam = <K extends keyof SIPParams>(key: K, value: SIPParams[K]) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateSIP(newParams))
    }

    const getTotalPeriods = () => {
        const periodsPerYear = {
            "monthly": 12,
            "quarterly": 4,
            "half-yearly": 2,
            "yearly": 1
        }[params.investmentFrequency]

        return (params.years * periodsPerYear) + Math.floor(params.months / (12 / periodsPerYear))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>SIP Calculator</CardTitle>
                    <CardDescription>Calculate returns from Systematic Investment Plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="regularInvestment">Regular Investment Amount (₹)</Label>
                        <Input
                            id="regularInvestment"
                            type="number"
                            value={params.regularInvestment}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("regularInvestment", Number(e.target.value))
                            }}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="investmentFrequency">Investment Frequency</Label>
                        <Select
                            value={params.investmentFrequency}
                            onValueChange={(value: "monthly" | "quarterly" | "half-yearly" | "yearly") =>
                                updateParam("investmentFrequency", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                        <Input
                            id="expectedReturn"
                            type="number"
                            step="0.1"
                            value={params.expectedReturn}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("expectedReturn", Number(e.target.value))
                            }}
                            placeholder="12"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="years">Years</Label>
                            <Input
                                id="years"
                                type="number"
                                value={params.years}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("years", Number(e.target.value))
                                }}
                                placeholder="10"
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
                                        updateParam("months", 0)
                                        return
                                    }
                                    if (Number(e.target.value) > 11) {
                                        updateParam("months", 11)
                                        return
                                    }
                                    updateParam("months", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <Card className="p-4 optional gap-4 grid">
                        <div className="grid gap-2">
                            <Label htmlFor="initialBalance">Initial Investment (₹)</Label>
                            <Input
                                id="initialBalance"
                                type="number"
                                value={params.initialBalance}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("initialBalance", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="investmentIncreaseRate">Annual Step-Up Rate (%)</Label>
                            <Input
                                id="investmentIncreaseRate"
                                type="number"
                                step="0.1"
                                value={params.investmentIncreaseRate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("investmentIncreaseRate", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="SIP Investment Results"
                    results={[
                        { label: "Maturity Amount", value: formatCurrency(results.maturityAmount) },
                        { label: "Total Investment", value: formatCurrency(results.totalInvestment) },
                        { label: "Total Returns", value: formatCurrency(results.totalReturns) },
                        { label: "Additional Deposits (Step-up)", value: formatCurrency(results.additionalDeposits) },
                        { label: "Return Multiplier", value: `${(results.maturityAmount / (results.totalInvestment + params.initialBalance)).toFixed(2)}x` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>SIP Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Investment Amount:</span>
                                <span className="font-medium">
                                    {formatCurrency(params.regularInvestment)} ({params.investmentFrequency})
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Investment Period:</span>
                                <span className="font-medium">
                                    {params.years} years {params.months > 0 && `${params.months} months`}
                                    ({getTotalPeriods()} {params.investmentFrequency === "monthly" ? "installments" : "payments"})
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expected Return:</span>
                                <span className="font-medium">{params.expectedReturn}% per annum</span>
                            </div>
                            {params.initialBalance > 0 && (
                                <div className="flex justify-between">
                                    <span>Initial Investment:</span>
                                    <span className="font-medium">{formatCurrency(params.initialBalance)}</span>
                                </div>
                            )}
                            {params.investmentIncreaseRate > 0 && (
                                <div className="flex justify-between">
                                    <span>Annual Step-up:</span>
                                    <span className="font-medium">{params.investmentIncreaseRate}%</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-4">
                                <span className="font-semibold">Wealth Gained:</span>
                                <span className="font-semibold text-green-600">{formatCurrency(results.totalReturns)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
