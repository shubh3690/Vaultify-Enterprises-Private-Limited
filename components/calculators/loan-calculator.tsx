"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateLoan, type LoanCalculatorParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function LoanCalculator() {
    const [params, setParams] = useState<LoanCalculatorParams>({
        loanAmount: 200000,
        interestRate: 4.5,
        loanTermYears: 30,
        loanTermMonths: 0,
        startDate: new Date().toISOString().split('T')[0],
        extraPayments: 0,
        additionalPaymentFrequency: 'monthly',
        extraFees: 0,
        addExtraFeesToLoan: false,
        oneTimePayment: {
            amount: 0,
            type: 'balloon',
            date: new Date().toISOString().split('T')[0]
        }
    })

    const [results, setResults] = useState(calculateLoan(params))

    const updateParam = (key: keyof LoanCalculatorParams, value: any) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateLoan(newParams))
    }

    const updateOneTimePayment = (key: string, value: any) => {
        const newOneTimePayment = { ...params.oneTimePayment!, [key]: value }
        updateParam('oneTimePayment', newOneTimePayment)
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
                        <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                        <Input
                            id="loanAmount"
                            type="number"
                            value={params.loanAmount}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("loanAmount", Number(e.target.value))
                            }}
                            placeholder="200000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
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
                            placeholder="4.5"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="loanTermYears">Years</Label>
                                <Input
                                    id="loanTermYears"
                                    type="number"
                                    value={params.loanTermYears}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateParam("loanTermYears", Number(e.target.value))
                                    }}
                                    placeholder="30"
                                    min="0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="loanTermMonths">Months</Label>
                                <Input
                                    id="loanTermMonths"
                                    type="number"
                                    value={params.loanTermMonths}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0) {
                                            updateParam("loanTermMonths", 0)
                                            return
                                        }
                                        if (Number(e.target.value) > 11) {
                                            updateParam("loanTermMonths", 11)
                                            return
                                        }
                                        updateParam("loanTermMonths", Number(e.target.value))
                                    }}
                                    placeholder="0"
                                    min="0"
                                    max="11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={params.startDate}
                            onChange={(e) => updateParam("startDate", e.target.value)}
                        />
                    </div>

                    <Card className="grid sm:grid-cols-2 gap-4 p-4 optional">
                        <div className="grid gap-2">
                            <Label htmlFor="extraFees">Extra Fees (₹)</Label>
                            <Input
                                id="extraFees"
                                type="number"
                                value={params.extraFees || 0}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("extraFees", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Finance the closing costs?</Label>
                            <Select
                                value={params.addExtraFeesToLoan ? "yes" : "no"}
                                onValueChange={(value) =>
                                    updateParam("addExtraFeesToLoan", value === "yes")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    <Card className="grid sm:grid-cols-2 gap-4 p-4 optional">
                        <div className="grid gap-2">
                            <Label htmlFor="extraPayments">Additional Payment Amount (₹)</Label>
                            <Input
                                id="extraPayments"
                                type="number"
                                value={params.extraPayments || 0}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("extraPayments", Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="additionalPaymentFrequency">Additional Payment Frequency</Label>
                            <Select
                                value={params.additionalPaymentFrequency}
                                onValueChange={(value) => updateParam("additionalPaymentFrequency", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half-yearly">Half-yearly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    <Card className="space-y-3 p-4 optional">
                        <Label>One-time Payment</Label>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="oneTimeAmount">Amount (₹)</Label>
                                <Input
                                    id="oneTimeAmount"
                                    type="number"
                                    value={params.oneTimePayment?.amount || 0}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateOneTimePayment("amount", Number(e.target.value))
                                    }}
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="oneTimeType">Payment Type</Label>
                                <Select
                                    value={params.oneTimePayment?.type}
                                    onValueChange={(value) => updateOneTimePayment("type", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="balloon">Balloon Payment (at end)</SelectItem>
                                        <SelectItem value="at_date">Payment at Specific Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {params.oneTimePayment?.type === 'at_date' && (
                            <div className="grid gap-2">
                                <Label htmlFor="oneTimeDate">Payment Date</Label>
                                <Input
                                    id="oneTimeDate"
                                    type="date"
                                    value={params.oneTimePayment?.date || ''}
                                    onChange={(e) => updateOneTimePayment("date", e.target.value)}
                                />
                            </div>
                        )}
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Loan Payment Results"
                    results={[
                        { label: "Effective Loan Amount", value: formatCurrency(results.effectiveLoanAmount) },
                        { label: "Monthly Payment", value: formatCurrency(results.monthlyPayment) },
                        { label: "Total Amount", value: formatCurrency(results.totalAmount) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Payoff Date", value: results.payoffDate },
                    ]}
                />

                {(params.extraPayments || 0) > 0 && (
                    <ResultsDisplay
                        title="Additional Payment Benefits"
                        results={[
                            { label: "Interest Saved", value: formatCurrency(results.interestSavedWithExtra || 0) },
                            { label: "Time Saved", value: `${results.timeSavedWithExtra || 0} months` },
                        ]}
                    />
                )}

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
                                        <span>Base Loan Amount:</span>
                                        <span className="font-medium">{formatCurrency(params.loanAmount)}</span>
                                    </div>
                                    {(params.extraFees || 0) > 0 && (
                                        <div className="flex justify-between">
                                            <span>Extra Fees:</span>
                                            <span className="font-medium">{formatCurrency(params.extraFees || 0)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Effective Loan Amount:</span>
                                        <span className="font-medium">{formatCurrency(results.effectiveLoanAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Interest Rate:</span>
                                        <span className="font-medium">{params.interestRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Loan Term:</span>
                                        <span className="font-medium">
                                            {params.loanTermYears}y {params.loanTermMonths}m
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Payments:</span>
                                        <span className="font-medium">{results.summary.numberOfPayments}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Monthly Payment:</span>
                                        <span className="font-medium">{formatCurrency(results.monthlyPayment)}</span>
                                    </div>
                                    {(params.extraPayments || 0) > 0 && (
                                        <>
                                            <div className="flex justify-between">
                                                <span>Additional Payment:</span>
                                                <span className="font-medium">{formatCurrency(params.extraPayments || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Payment Frequency:</span>
                                                <span className="font-medium capitalize">{params.additionalPaymentFrequency}</span>
                                            </div>
                                        </>
                                    )}
                                    {(params.oneTimePayment?.amount || 0) > 0 && (
                                        <>
                                            <div className="flex justify-between">
                                                <span>One-time Payment:</span>
                                                <span className="font-medium">{formatCurrency(params.oneTimePayment?.amount || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Payment Type:</span>
                                                <span className="font-medium">
                                                    {params.oneTimePayment?.type === 'balloon' ? 'Balloon Payment' : 'Specific Date'}
                                                </span>
                                            </div>
                                            {params.oneTimePayment?.type === 'at_date' && (
                                                <div className="flex justify-between">
                                                    <span>Payment Date:</span>
                                                    <span className="font-medium">{params.oneTimePayment?.date}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="schedule">
                        <Card>
                            <CardHeader>
                                <CardTitle>Amortization Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-[22rem] overflow-auto">
                                    <div className="grid grid-cols-7 gap-2 text-sm font-medium border-b pb-2 min-w-[200%] sm:min-w-0">
                                        <span>Payment</span>
                                        <span>Date</span>
                                        <span>Payment</span>
                                        <span>Principal</span>
                                        <span>Interest</span>
                                        <span>Extra</span>
                                        <span>Balance</span>
                                    </div>
                                    {results.amortizationSchedule.map((payment) => (
                                        <div key={payment.paymentNumber} className="grid grid-cols-7 gap-2 text-sm min-w-[200%] sm:min-w-0">
                                            <span>{payment.paymentNumber}</span>
                                            <span>{payment.paymentDate}</span>
                                            <span className="text-red-600">{formatCurrency(payment.monthlyPayment)}</span>
                                            <span>{formatCurrency(payment.principalPayment)}</span>
                                            <span>{formatCurrency(payment.interestPayment)}</span>
                                            <span>{formatCurrency(payment.extraPayment)}</span>
                                            <span>{formatCurrency(payment.endingBalance)}</span>
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
