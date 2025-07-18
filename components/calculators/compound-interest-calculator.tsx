"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateCompoundInterest, type CompoundInterestParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function CompoundInterestCalculator() {
    const [params, setParams] = useState<CompoundInterestParams>({
        principal: 10000,
        rate: 5,
        compoundingFrequency: 12,
        time: 10,
        monthlyDeposit: 0,
        monthlyWithdrawal: 0,
    })

    const [results, setResults] = useState(calculateCompoundInterest(params))

    const updateParam = (key: keyof CompoundInterestParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateCompoundInterest(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Calculator Settings</CardTitle>
                    <CardDescription>Enter your investment details to calculate compound interest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Initial Investment</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={params.principal}
                            onChange={(e) => updateParam("principal", Number(e.target.value))}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                        <Input
                            id="rate"
                            type="number"
                            step="0.1"
                            value={params.rate}
                            onChange={(e) => updateParam("rate", Number(e.target.value))}
                            placeholder="5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="time">Investment Period (Years)</Label>
                        <Input
                            id="time"
                            type="number"
                            value={params.time}
                            onChange={(e) => updateParam("time", Number(e.target.value))}
                            placeholder="10"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="compounding">Compounding Frequency</Label>
                        <Select
                            value={params.compoundingFrequency.toString()}
                            onValueChange={(value) => updateParam("compoundingFrequency", Number(value))}
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

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyDeposit">Monthly Deposit (Optional)</Label>
                        <Input
                            id="monthlyDeposit"
                            type="number"
                            value={params.monthlyDeposit}
                            onChange={(e) => updateParam("monthlyDeposit", Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyWithdrawal">Monthly Withdrawal (Optional)</Label>
                        <Input
                            id="monthlyWithdrawal"
                            type="number"
                            value={params.monthlyWithdrawal}
                            onChange={(e) => updateParam("monthlyWithdrawal", Number(e.target.value))}
                            placeholder="0"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Compound Interest Results"
                    results={[
                        { label: "Final Amount", value: formatCurrency(results.finalAmount) },
                        { label: "Total Interest Earned", value: formatCurrency(results.totalInterest) },
                        { label: "Total Deposits", value: formatCurrency(results.totalDeposits) },
                        { label: "Total Withdrawals", value: formatCurrency(results.totalWithdrawals) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Yearly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-2">
                                <span>Year</span>
                                <span>Balance</span>
                                <span>Interest</span>
                                <span>Deposits</span>
                            </div>
                            {results.yearlyBreakdown.map((year) => (
                                <div key={year.year} className="grid grid-cols-4 gap-2 text-sm">
                                    <span>{year.year}</span>
                                    <span>{formatCurrency(year.balance)}</span>
                                    <span className="text-green-600">{formatCurrency(year.interestEarned)}</span>
                                    <span className="text-blue-600">{formatCurrency(year.deposits)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
