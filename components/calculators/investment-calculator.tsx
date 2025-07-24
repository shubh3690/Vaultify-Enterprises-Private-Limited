"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateInvestment, type InvestmentParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function InvestmentCalculator() {
    const [params, setParams] = useState<InvestmentParams>({
        principal: 5000,
        annualRate: 5,
        compoundingFrequency: 12,
        years: 5,
        months: 0,
        regularDeposit: 0,
        depositInterval: "monthly",
        regularWithdrawal: 0,
        withdrawalType: "fixed-amount",
        withdrawalInterval: "monthly",
        annualDepositIncrease: 0,
        annualWithdrawalIncrease: 0
    })

    const result = calculateInvestment(params)

    const updateParam = <K extends keyof InvestmentParams>(key: K, value: InvestmentParams[K]) => {
        setParams({ ...params, [key]: value })
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Investment Calculator</CardTitle>
                    <CardDescription>
                        Calculate compound interest with regular deposits and withdrawals
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Initial Investment (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={params.principal}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam('principal', Number(e.target.value))
                            }}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="annualRate">Annual Interest Rate (%)</Label>
                            <Input
                                id="annualRate"
                                type="number"
                                step="0.01"
                                value={params.annualRate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam('annualRate', Number(e.target.value))
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
                                    <SelectItem value="365">Daily</SelectItem>
                                    <SelectItem value="52">Weekly</SelectItem>
                                    <SelectItem value="12">Monthly</SelectItem>
                                    <SelectItem value="4">Quarterly</SelectItem>
                                    <SelectItem value="2">Half-Yearly</SelectItem>
                                    <SelectItem value="1">Yearly</SelectItem>
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
                                placeholder="5"
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

                    <Card className="space-y-4 p-4 optional">
                        <div className="grid gap-4 sm:grid-cols-2">
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
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="depositInterval">Deposit Frequency</Label>
                                <Select
                                    value={params.depositInterval}
                                    onValueChange={(value) => updateParam('depositInterval', value as any)}
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
                        </div>
                    </Card>

                    <Card className="space-y-4 optional p-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="regularWithdrawal">Withdrawal Amount ({params.withdrawalType === "fixed-amount" ? "₹" : "%"})</Label>
                                <Input
                                    id="regularWithdrawal"
                                    type="number"
                                    value={params.regularWithdrawal || 0}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateParam('regularWithdrawal', Number(e.target.value))
                                    }}
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="withdrawalType">Withdrawal Type</Label>
                                <Select
                                    value={params.withdrawalType}
                                    onValueChange={(value) => updateParam('withdrawalType', value as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed-amount">Fixed Amount (₹)</SelectItem>
                                        <SelectItem value="percent-of-balance">% of Balance</SelectItem>
                                        <SelectItem value="percent-of-interest">% of Interest</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="withdrawalInterval">Withdrawal Frequency</Label>
                                <Select
                                    value={params.withdrawalInterval}
                                    onValueChange={(value) => updateParam('withdrawalInterval', value as any)}
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
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="annualDepositIncrease">Annual Deposit Increase (%)</Label>
                                <Input
                                    id="annualDepositIncrease"
                                    type="number"
                                    step="0.01"
                                    value={params.annualDepositIncrease || 0}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateParam('annualDepositIncrease', Number(e.target.value))
                                    }}
                                    placeholder="0"
                                />
                            </div>

                            {params.withdrawalType === "fixed-amount" && (
                                <div className="grid gap-2">
                                    <Label htmlFor="annualWithdrawalIncrease">Annual Withdrawal Increase (%)</Label>
                                    <Input
                                        id="annualWithdrawalIncrease"
                                        type="number"
                                        step="0.01"
                                        value={params.annualWithdrawalIncrease || 0}
                                        onChange={(e) => {
                                            if (Number(e.target.value) < 0)
                                                return
                                            updateParam('annualWithdrawalIncrease', Number(e.target.value))
                                        }}
                                        placeholder="0"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Investment Results"
                    results={[
                        { label: "Final Balance", value: formatCurrency(result.finalBalance) },
                        { label: "Initial Balance", value: formatCurrency(result.initialBalance) },
                        { label: "Total Interest Earned", value: formatCurrency(result.totalInterest) },
                        { label: "Additional Deposits", value: formatCurrency(result.additionalDeposits) },
                        { label: "Total Withdrawals", value: formatCurrency(result.totalWithdrawals) },
                        { label: "Net Growth", value: formatCurrency(result.finalBalance - result.initialBalance) },
                        { label: "Total Return", value: `${((result.finalBalance / result.initialBalance - 1) * 100).toFixed(2)}%` }
                    ]}
                />
            </div>
        </div>
    )
}
