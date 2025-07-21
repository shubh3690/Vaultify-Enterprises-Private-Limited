"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateLoan, type LoanParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function AmortizationCalculator() {
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
                    <CardTitle>Amortization Calculator</CardTitle>
                    <CardDescription>Calculate detailed loan amortization schedule</CardDescription>
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
                    title="Loan Summary"
                    results={[
                        { label: "Monthly Payment", value: formatCurrency(results.monthlyPayment) },
                        { label: "Total Payment", value: formatCurrency(results.totalPayment) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Number of Payments", value: `${params.term * 12}` },
                    ]}
                />

                <Tabs defaultValue="yearly" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="yearly">Yearly Summary</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly Schedule</TabsTrigger>
                    </TabsList>

                    <TabsContent value="yearly">
                        <Card>
                            <CardHeader>
                                <CardTitle>Yearly Amortization Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-2">
                                        <span>Year</span>
                                        <span>Principal</span>
                                        <span>Interest</span>
                                        <span>Balance</span>
                                    </div>
                                    {Array.from({ length: params.term }, (_, yearIndex) => {
                                        const yearStart = yearIndex * 12
                                        const yearEnd = Math.min((yearIndex + 1) * 12, results.amortizationSchedule.length)
                                        const yearPayments = results.amortizationSchedule.slice(yearStart, yearEnd)

                                        const yearPrincipal = yearPayments.reduce((sum, payment) => sum + payment.principal, 0)
                                        const yearInterest = yearPayments.reduce((sum, payment) => sum + payment.interest, 0)
                                        const endBalance = yearPayments[yearPayments.length - 1]?.balance || 0

                                        return (
                                            <div key={yearIndex} className="grid grid-cols-4 gap-2 text-sm">
                                                <span>{yearIndex + 1}</span>
                                                <span>{formatCurrency(yearPrincipal)}</span>
                                                <span>{formatCurrency(yearInterest)}</span>
                                                <span>{formatCurrency(endBalance)}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="monthly">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Amortization Schedule (First Year)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-80 overflow-y-auto">
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
