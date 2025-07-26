"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateSavings, type SavingsCalculatorParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SavingsCalculator() {
    const [params, setParams] = useState<SavingsCalculatorParams>({
        initialBalance: 10000,
        rate: 4,
        rateInterval: "yearly",
        rateType: "nominal",
        compoundingFrequency: 12,
        years: 5,
        months: 0,
        depositAmount: 0,
        depositFrequency: "monthly",
        depositIncreaseRate: 0,
        withdrawalAmount: 0,
        withdrawalFrequency: "monthly",
        withdrawalType: "fixed-amount",
        withdrawalIncreaseRate: 0,
    })

    const [results, setResults] = useState(calculateSavings(params))

    const updateParam = <K extends keyof SavingsCalculatorParams>(
        key: K,
        value: SavingsCalculatorParams[K]
    ) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateSavings(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Savings Calculator</CardTitle>
                    <CardDescription>
                        Calculate how much your savings will grow over time with regular deposits
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Basic Parameters */}
                    <div className="grid gap-2">
                        <Label htmlFor="initialBalance">Initial Balance (₹)</Label>
                        <Input
                            id="initialBalance"
                            type="number"
                            value={params.initialBalance}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("initialBalance", Number(e.target.value))
                            }}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="rate">Interest Rate (%)</Label>
                            <Input
                                id="rate"
                                type="number"
                                step="0.1"
                                value={params.rate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("rate", Number(e.target.value))
                                }}
                                placeholder="4"
                            />
                        </div>
                        <div>
                            <Label htmlFor="rateInterval">Rate Interval</Label>
                            <Select
                                value={params.rateInterval}
                                onValueChange={(value: "monthly" | "yearly") => updateParam("rateInterval", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {params.rateInterval === "yearly" && (
                            <div>
                                <Label htmlFor="rateType">Rate Type</Label>
                                <Select
                                    value={params.rateType}
                                    onValueChange={(value: "nominal" | "apy") => updateParam("rateType", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nominal">Nominal</SelectItem>
                                        <SelectItem value="apy">APY</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                        <Select
                            value={params.compoundingFrequency.toString()}
                            onValueChange={(value) => updateParam("compoundingFrequency", Number(value))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Yearly (1/yr)</SelectItem>
                                <SelectItem value="2">Half-Yearly (2/yr)</SelectItem>
                                <SelectItem value="4">Quarterly (4/yr)</SelectItem>
                                <SelectItem value="12">Monthly (12/yr)</SelectItem>
                                <SelectItem value="52">Weekly (52/yr)</SelectItem>
                                <SelectItem value="365">Daily (365/yr)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
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
                                placeholder="5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="months">Months</Label>
                            <Input
                                id="months"
                                type="number"
                                min="0"
                                max="11"
                                value={params.months}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                        updateParam("withdrawalIncreaseRate", 0)
                                        return
                                    }
                                    if (Number(e.target.value) > 11) {
                                        updateParam("withdrawalIncreaseRate", 11)
                                        return
                                    }
                                    updateParam("months", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <Card className="grid sm:grid-cols-2 optional gap-4 p-4">
                        <div className="grid gap-2">
                            <Label htmlFor="depositAmount">Deposit Amount (₹)</Label>
                            <Input
                                id="depositAmount"
                                type="number"
                                value={params.depositAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("depositAmount", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="depositFrequency">Deposit Frequency</Label>
                            <Select
                                value={params.depositFrequency}
                                onValueChange={(value: "monthly" | "quarterly" | "half-yearly" | "yearly") =>
                                    updateParam("depositFrequency", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half-yearly">Half-yearly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="depositIncreaseRate">Annual Increase Rate (%)</Label>
                            <Input
                                id="depositIncreaseRate"
                                type="number"
                                step="0.1"
                                value={params.depositIncreaseRate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                        updateParam("withdrawalIncreaseRate", 0)
                                        return
                                    }
                                    if (Number(e.target.value) > 100) {
                                        updateParam("withdrawalIncreaseRate", 100)
                                        return
                                    }
                                    updateParam("depositIncreaseRate", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                    </Card>

                    <Card className="optional grid sm:grid-cols-2 gap-4 p-4">
                        <div className="grid gap-2">
                            <Label htmlFor="withdrawalAmount">Withdrawal Amount ({params.withdrawalType === "fixed-amount" ? "₹" : "%"})</Label>
                            <Input
                                id="withdrawalAmount"
                                type="number"
                                value={params.withdrawalAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("withdrawalAmount", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="withdrawalFrequency">Frequency</Label>
                            <Select
                                value={params.withdrawalFrequency}
                                onValueChange={(value: "monthly" | "quarterly" | "half-yearly" | "yearly") =>
                                    updateParam("withdrawalFrequency", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    {params.withdrawalType === "fixed-amount" && (
                                        <>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="half-yearly">Half-yearly</SelectItem>
                                        </>
                                    )}
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="withdrawalType">Withdrawal Type</Label>
                            <Select
                                value={params.withdrawalType}
                                onValueChange={(value: "fixed-amount" | "%-of-balance" | "%-of-interest") =>
                                    updateParam("withdrawalType", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed-amount">Fixed Amount</SelectItem>
                                    <SelectItem value="%-of-balance">% of Balance</SelectItem>
                                    <SelectItem value="%-of-interest">% of Interest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {params.withdrawalType === "fixed-amount" && (
                            <div className="grid gap-2">
                                <Label htmlFor="withdrawalIncreaseRate">Annual Increase Rate (%)</Label>
                                <Input
                                    id="withdrawalIncreaseRate"
                                    type="number"
                                    step="0.1"
                                    value={params.withdrawalIncreaseRate}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0) {
                                            updateParam("withdrawalIncreaseRate", 0)
                                            return
                                        }
                                        if (Number(e.target.value) > 100) {
                                            updateParam("withdrawalIncreaseRate", 100)
                                            return
                                        }
                                        updateParam("withdrawalIncreaseRate", Number(e.target.value))
                                    }}
                                    placeholder="0"
                                />
                            </div>
                        )}
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Savings Results"
                    results={[
                        { label: "Final Balance", value: formatCurrency(results.finalBalance) },
                        { label: "Total Interest Earned", value: formatCurrency(results.totalInterest) },
                        { label: "Total Additional Deposits", value: formatCurrency(results.additionalDeposits) },
                        { label: "Total Withdrawals", value: formatCurrency(results.totalWithdrawals) },
                        { label: "Growth from Interest", value: `${results.additionalDeposits > 0 ? ((results.totalInterest / (params.initialBalance + results.additionalDeposits)) * 100).toFixed(1) : ((results.totalInterest / params.initialBalance) * 100).toFixed(1)}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                        <CardDescription>Investment growth month by month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <div className="grid grid-cols-5 gap-8 text-sm font-medium border-b pb-2">
                                <span>Month</span>
                                <span>Balance</span>
                                <span>Interest</span>
                                <span>Deposits</span>
                                <span>Withdrawals</span>
                            </div>
                            {results.monthlyBreakdown.map((month, index) => (
                                <div key={index} className="grid grid-cols-5 gap-8 text-sm">
                                    <span>{month.month}</span>
                                    <span>{formatCurrency(month.balance)}</span>
                                    <span className="text-green-600">{formatCurrency(month.interestEarned)}</span>
                                    <span className="text-blue-600">{formatCurrency(month.deposits)}</span>
                                    <span className="text-red-600">{formatCurrency(month.withdrawals)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
