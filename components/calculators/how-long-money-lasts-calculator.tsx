"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateHowLongMoneyLasts } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function HowLongMoneyLastsCalculator() {
    const [currentAmount, setCurrentAmount] = useState(100000)
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(2000)
    const [interestRate, setInterestRate] = useState(4)
    const [months, setMonths] = useState(calculateHowLongMoneyLasts(currentAmount, monthlyWithdrawal, interestRate))

    const updateCurrentAmount = (value: number) => {
        setCurrentAmount(value)
        setMonths(calculateHowLongMoneyLasts(value, monthlyWithdrawal, interestRate))
    }

    const updateMonthlyWithdrawal = (value: number) => {
        setMonthlyWithdrawal(value)
        setMonths(calculateHowLongMoneyLasts(currentAmount, value, interestRate))
    }

    const updateInterestRate = (value: number) => {
        setInterestRate(value)
        setMonths(calculateHowLongMoneyLasts(currentAmount, monthlyWithdrawal, value))
    }

    const years = months / 12
    const totalWithdrawals = monthlyWithdrawal * months

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>How Long Will Money Last</CardTitle>
                    <CardDescription>Calculate how long your money will last with regular withdrawals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                        <Input
                            id="currentAmount"
                            type="number"
                            value={currentAmount}
                            onChange={(e) => updateCurrentAmount(Number(e.target.value))}
                            placeholder="100000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyWithdrawal">Monthly Withdrawal (₹)</Label>
                        <Input
                            id="monthlyWithdrawal"
                            type="number"
                            value={monthlyWithdrawal}
                            onChange={(e) => updateMonthlyWithdrawal(Number(e.target.value))}
                            placeholder="2000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                        <Input
                            id="interestRate"
                            type="number"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => updateInterestRate(Number(e.target.value))}
                            placeholder="4"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Money Duration Results"
                    results={[
                        { label: "Money Will Last", value: `${years.toFixed(1)} years (${months} months)` },
                        { label: "Total Withdrawals", value: formatCurrency(totalWithdrawals) },
                        { label: "Starting Amount", value: formatCurrency(currentAmount) },
                        { label: "Monthly Withdrawal", value: formatCurrency(monthlyWithdrawal) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Withdrawal Plan Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Starting Balance:</span>
                                <span className="font-medium">{formatCurrency(currentAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Withdrawal:</span>
                                <span className="font-medium">{formatCurrency(monthlyWithdrawal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{interestRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duration:</span>
                                <span className="font-medium">{years.toFixed(1)} years</span>
                            </div>
                            {months >= 1200 && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="text-sm text-green-800">
                                        <strong>Great news!</strong> At this withdrawal rate, your money should last indefinitely with the
                                        interest earned.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
