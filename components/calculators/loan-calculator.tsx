"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateLoan, type LoanParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function LoanCalculator() {
    const [params, setParams] = useState<LoanParams>({
        principal: 200000,
        rate: 4.5,
        term: 30,
    })

    const [results, setResults] = useState(calculateLoan(params))

    const updateParam = (key: keyof LoanParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateLoan(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                    <CardDescription>Enter your loan information to calculate monthly payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Loan Amount (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={params.principal}
                            onChange={(e) => updateParam("principal", Number(e.target.value))}
                            placeholder="200000"
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
                            placeholder="4.5"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="term">Loan Term (Years)</Label>
                        <Input
                            id="term"
                            type="number"
                            value={params.term}
                            onChange={(e) => updateParam("term", Number(e.target.value))}
                            placeholder="30"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Loan Payment Results"
                    results={[
                        { label: "Monthly Payment", value: formatCurrency(results.monthlyPayment) },
                        { label: "Total Payment", value: formatCurrency(results.totalPayment) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                    ]}
                />

                <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="summary">Payment Summary</TabsTrigger>
                        <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Principal Amount:</span>
                                        <span className="font-medium">{formatCurrency(params.principal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Interest Rate:</span>
                                        <span className="font-medium">{params.rate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Loan Term:</span>
                                        <span className="font-medium">{params.term} years</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Payments:</span>
                                        <span className="font-medium">{params.term * 12}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="schedule">
                        <Card>
                            <CardHeader>
                                <CardTitle>Amortization Schedule (First 12 Months)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-36 overflow-y-auto">
                                    <div className="grid grid-cols-5 gap-2 text-sm font-medium border-b pb-2">
                                        <span>Month</span>
                                        <span>Payment</span>
                                        <span>Principal</span>
                                        <span>Interest</span>
                                        <span>Balance</span>
                                    </div>
                                    {results.amortizationSchedule.slice(0, 12).map((payment) => (
                                        <div key={payment.month} className="grid grid-cols-5 gap-2 text-sm">
                                            <span>{payment.month}</span>
                                            <span>{formatCurrency(payment.payment)}</span>
                                            <span>{formatCurrency(payment.principal)}</span>
                                            <span>{formatCurrency(payment.interest)}</span>
                                            <span>{formatCurrency(payment.balance)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
