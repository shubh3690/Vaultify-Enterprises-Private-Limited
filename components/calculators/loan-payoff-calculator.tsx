"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateLoanPayoff, type LoanPayoffParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function LoanPayoffCalculator() {
    const [calculationType, setCalculationType] = useState<"amount" | "time">("amount")

    const [amountParams, setAmountParams] = useState<LoanPayoffParams>({
        currentBalance: 25000,
        interestRate: 6.5,
        paymentType: "amount",
        monthlyPayment: 400,
        nextPaymentDate: new Date().toISOString().split('T')[0],
        paymentIncrease: 0
    })

    const [timeParams, setTimeParams] = useState<LoanPayoffParams>({
        currentBalance: 25000,
        interestRate: 6.5,
        paymentType: "time",
        targetYears: 3,
        targetMonths: 0
    })

    const currentParams = calculationType === "amount" ? amountParams : timeParams
    const [results, setResults] = useState(calculateLoanPayoff(currentParams))

    const updateAmountParam = (key: keyof LoanPayoffParams, value: number | string) => {
        const newParams = { ...amountParams, [key]: value }
        setAmountParams(newParams)
        if (calculationType === "amount") {
            setResults(calculateLoanPayoff(newParams))
        }
    }

    const updateTimeParam = (key: keyof LoanPayoffParams, value: number | string) => {
        const newParams = { ...timeParams, [key]: value }
        setTimeParams(newParams)
        if (calculationType === "time") {
            setResults(calculateLoanPayoff(newParams))
        }
    }

    const handleCalculationTypeChange = (value: string) => {
        const type = value as "amount" | "time"
        setCalculationType(type)
        const newParams = type === "amount" ? amountParams : timeParams
        setResults(calculateLoanPayoff(newParams))
    }

    const getPaymentAfterIncrease = (years: number) => {
        const basePayment = amountParams.monthlyPayment || 0
        const annualIncreaseRate = (amountParams.paymentIncrease || 0) / 100
        return basePayment * Math.pow(1 + annualIncreaseRate, years)
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Loan Payoff Calculator</CardTitle>
                    <CardDescription>Calculate payoff time or required payment amount</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs value={calculationType} onValueChange={handleCalculationTypeChange} className="space-y-4">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="amount">By Payment Amount</TabsTrigger>
                            <TabsTrigger value="time">By Target Time</TabsTrigger>
                        </TabsList>

                        <TabsContent value="amount" className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="currentBalance">Current Loan Balance (₹)</Label>
                                <Input
                                    id="currentBalance"
                                    type="number"
                                    value={amountParams.currentBalance}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateAmountParam("currentBalance", Number(e.target.value))
                                    }}
                                    placeholder="25000"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                                <Input
                                    id="interestRate"
                                    type="number"
                                    step="0.1"
                                    value={amountParams.interestRate}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateAmountParam("interestRate", Number(e.target.value))
                                    }}
                                    placeholder="6.5"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="monthlyPayment">Monthly Payment (₹)</Label>
                                <Input
                                    id="monthlyPayment"
                                    type="number"
                                    value={amountParams.monthlyPayment || 0}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateAmountParam("monthlyPayment", Number(e.target.value))
                                    }}
                                    placeholder="400"
                                />
                            </div>

                            <Card className="optional gap-4 p-4 grid">
                                <div className="grid gap-2">
                                    <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
                                    <Input
                                        id="nextPaymentDate"
                                        type="date"
                                        value={amountParams.nextPaymentDate || ''}
                                        onChange={(e) => updateAmountParam("nextPaymentDate", e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="annualPaymentIncrease">Annual Payment Increase (%)</Label>
                                    <Input
                                        id="annualPaymentIncrease"
                                        type="number"
                                        step="0.1"
                                        value={amountParams.paymentIncrease || 0}
                                        onChange={(e) => {
                                            if (Number(e.target.value) < 0)
                                                return
                                            updateAmountParam("paymentIncrease", Number(e.target.value))
                                        }}
                                        placeholder="0"
                                        min="0"
                                        max="50"
                                    />
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="time" className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="currentBalanceTime">Current Loan Balance (₹)</Label>
                                <Input
                                    id="currentBalanceTime"
                                    type="number"
                                    value={timeParams.currentBalance}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateTimeParam("currentBalance", Number(e.target.value))
                                    }}
                                    placeholder="25000"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="interestRateTime">Annual Interest Rate (%)</Label>
                                <Input
                                    id="interestRateTime"
                                    type="number"
                                    step="0.1"
                                    value={timeParams.interestRate}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateTimeParam("interestRate", Number(e.target.value))
                                    }}
                                    placeholder="6.5"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="targetYears">Years</Label>
                                        <Input
                                            id="targetYears"
                                            type="number"
                                            value={timeParams.targetYears || 0}
                                            onChange={(e) => {
                                                if (Number(e.target.value) < 0)
                                                    return
                                                updateTimeParam("targetYears", Number(e.target.value))
                                            }}
                                            placeholder="3"
                                            min="0"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="targetMonths">Months</Label>
                                        <Input
                                            id="targetMonths"
                                            type="number"
                                            value={timeParams.targetMonths || 0}
                                            onChange={(e) => {
                                                if (Number(e.target.value) < 0) {
                                                    updateTimeParam("targetMonths", 0)
                                                    return
                                                }
                                                if (Number(e.target.value) > 11) {
                                                    updateTimeParam("targetMonths", 11)
                                                    return
                                                }
                                                updateTimeParam("targetMonths", Number(e.target.value))
                                            }}
                                            placeholder="0"
                                            min="0"
                                            max="11"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Loan Payoff Results"
                    results={[
                        {
                            label: calculationType === "amount" ? "Payoff Time" : "Target Time",
                            value: calculationType === "amount"
                                ? `${Math.floor(results.monthsToPayoff / 12)} years ${results.monthsToPayoff % 12} months`
                                : `${timeParams.targetYears || 0} years ${timeParams.targetMonths || 0} months`,
                        },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Total Amount Paid", value: formatCurrency(results.totalBalance) },
                        { label: "Payoff Date", value: results.loanPayoffDate },
                        ...(calculationType === "time" && results.calculatedMonthlyPayment ? [
                            { label: "Required Monthly Payment", value: formatCurrency(results.calculatedMonthlyPayment) }
                        ] : []),
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Amortization Schedule</CardTitle>
                        <CardDescription>Monthly payment breakdown showing principal and interest</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[14rem] overflow-auto">
                            <div className="grid grid-cols-6 gap-2 text-sm font-medium border-b pb-2 min-w-[200%] sm:min-w-0">
                                <span className="sticky left-0 bg-white z-10">Payment</span>
                                <span>Date</span>
                                <span>Payment</span>
                                <span>Principal</span>
                                <span>Interest</span>
                                <span>Balance</span>
                            </div>
                            {results.amortizationSchedule?.map((payment) => (
                                <div key={payment.paymentNumber} className="grid grid-cols-6 gap-2 text-sm min-w-[200%] sm:min-w-0">
                                    <span className="sticky left-0 bg-white z-10">{payment.paymentNumber}</span>
                                    <span>{payment.paymentDate}</span>
                                    <span className="text-red-600">{formatCurrency(payment.monthlyPayment)}</span>
                                    <span>{formatCurrency(payment.principalPayment)}</span>
                                    <span>{formatCurrency(payment.interestPayment)}</span>
                                    <span>{formatCurrency(payment.endingBalance)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
