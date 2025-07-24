"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateCreditCardPayoff, type CreditCardParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function CreditCardRepaymentCalculator() {
    const [params, setParams] = useState<CreditCardParams>({
        balance: 5000,
        interestRate: 18,
        monthlyPayment: 200,
    })

    const [results, setResults] = useState(calculateCreditCardPayoff(params))

    const updateParam = (key: keyof CreditCardParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateCreditCardPayoff(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Credit Card Repayment</CardTitle>
                    <CardDescription>Calculate how long it will take to pay off your credit card debt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="balance">Current Balance (₹)</Label>
                        <Input
                            id="balance"
                            type="number"
                            value={params.balance}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("balance", Number(e.target.value))
                            }}
                            placeholder="5000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%) (APY)</Label>
                        <Input
                            id="interestRate"
                            type="number"
                            step="0.1"
                            value={params.interestRate}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("interestRate", Number(e.target.value))
                            }}
                            placeholder="18"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="monthlyPayment">Monthly Payment (₹)</Label>
                        <Input
                            id="monthlyPayment"
                            type="number"
                            value={params.monthlyPayment}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("monthlyPayment", Number(e.target.value))
                            }}
                            placeholder="200"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {results.payoffTime === -1 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-600">Payment Too Low</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Your monthly payment is too low to cover the interest charges. You need to increase your monthly payment
                                to pay off the debt.
                            </p>
                            <p className="text-sm mt-2">
                                Minimum payment needed: {formatCurrency((params.balance * params.interestRate) / 100 / 12 + 1)}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <ResultsDisplay
                        title="Credit Card Payoff Results"
                        results={[
                            {
                                label: "Payoff Time",
                                value: `${results.payoffTime} months (${(results.payoffTime / 12).toFixed(1)} years)`,
                            },
                            { label: "Total Interest Paid", value: formatCurrency(results.totalInterest) },
                            { label: "Total Amount Paid", value: formatCurrency(results.totalPayment) },
                            { label: "Current Balance", value: formatCurrency(params.balance) },
                        ]}
                    />
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Payoff Strategy Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>Pay more than the minimum:</strong> Even an extra ₹500/month can significantly reduce payoff time
                                and interest paid.
                            </p>
                            <p>
                                <strong>Stop using the card:</strong> Avoid adding new charges while paying off the balance.
                            </p>
                            <p>
                                <strong>Consider balance transfer:</strong> Look for cards with 0% introductory APR offers.
                            </p>
                            <p>
                                <strong>Pay bi-weekly:</strong> Making payments every two weeks can reduce interest charges.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
