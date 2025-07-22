"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateMortgageRefinance, type MortgageRefinanceParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MortgageRefinanceCalculator() {
    const [params, setParams] = useState<MortgageRefinanceParams>({
        currentBalance: 250000,
        currentMonthlyPayment: 1500,
        currentRate: 6.5,
        refinanceRate: 4.5,
        refinanceTerm: 30,
        closingCosts: 3000,
        financeClosingCosts: false
    })
    const [results, setResults] = useState(calculateMortgageRefinance(params))

    const updateParam = (key: keyof MortgageRefinanceParams, value: number | boolean) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateMortgageRefinance(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Mortgage Refinance Calculator</CardTitle>
                    <CardDescription>
                        Compare your current mortgage with refinancing options
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">Current Mortgage</h3>
                        <div className="space-y-1">
                            <Label htmlFor="currentBalance">Mortgage Balance (₹)</Label>
                            <Input
                                id="currentBalance"
                                value={params.currentBalance}
                                onChange={(e) => updateParam("currentBalance", Number(e.target.value))}
                                placeholder="250000"
                                min="1"
                                max="50000000"
                                type="number"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="currentMonthlyPayment">
                                Monthly Payment (₹)
                            </Label>
                            <Input
                                id="currentMonthlyPayment"
                                value={params.currentMonthlyPayment}
                                onChange={(e) => updateParam("currentMonthlyPayment", Number(e.target.value))}
                                placeholder="1500"
                                type="number"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="currentRate">Rate (%)</Label>
                            <Input
                                id="currentRate"
                                value={params.currentRate}
                                onChange={(e) => updateParam("currentRate", Number(e.target.value))}
                                placeholder="6.5"
                                type="number"
                                step={0.1}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-medium text-lg">Refinance Options</h3>
                        <div className="space-y-1">
                            <Label htmlFor="refinanceRate">Rate (%)</Label>
                            <Input
                                id="refinanceRate"
                                value={params.refinanceRate}
                                onChange={(e) => updateParam("refinanceRate", Number(e.target.value))}
                                placeholder="4.5"
                                type="number"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="refinanceTerm">Term (Years)</Label>
                            <Input
                                id="refinanceTerm"
                                value={params.refinanceTerm}
                                onChange={(e) => updateParam("refinanceTerm", Number(e.target.value))}
                                placeholder="30"
                                type="number"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="closingCosts">Closing Costs (₹)</Label>
                                <Input
                                    id="closingCosts"
                                    value={params.closingCosts}
                                    onChange={(e) =>
                                        updateParam("closingCosts", Number(e.target.value))
                                    }
                                    placeholder="3000"
                                    type="number"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Finance the closing costs?</Label>
                                <Select
                                    value={params.financeClosingCosts ? "yes" : "no"}
                                    onValueChange={(value) =>
                                        updateParam("financeClosingCosts", value === "yes")
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
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Refinance Analysis"
                    results={[
                        { label: "New Monthly Payment", value: formatCurrency(results.newMonthlyPayment) },
                        { label: "Monthly Payment Reduction", value: formatCurrency(results.monthlyPaymentReduction) },
                        { label: "Interest on Current Mortgage", value: formatCurrency(results.currentTotalInterest) },
                        { label: "Interest if You Refinance", value: formatCurrency(results.refinanceTotalInterest) },
                        { label: "Interest Saved", value: formatCurrency(results.interestSaved) },
                        { label: "Net Refinancing Savings", value: formatCurrency(results.netSavings) }
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Refinance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">
                                        Current Mortgage
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Balance:</span>
                                            <span>{formatCurrency(params.currentBalance)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rate:</span>
                                            <span>{params.currentRate}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment:</span>
                                            <span>
                                                {formatCurrency(params.currentMonthlyPayment)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">
                                        New Mortgage
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Balance:</span>
                                            <span>{formatCurrency(params.currentBalance)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rate:</span>
                                            <span>{params.refinanceRate}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment:</span>
                                            <span>{formatCurrency(results.newMonthlyPayment)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {results.netSavings > 0 ? (
                                <div className="p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="text-sm text-green-800">
                                        <strong>Refinancing Benefits:</strong> You could save{" "}
                                        {formatCurrency(results.netSavings)} over the life of the loan and
                                        reduce your monthly payment by{" "}
                                        {formatCurrency(results.monthlyPaymentReduction)}.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Consider Carefully:</strong> Based on these numbers,
                                        refinancing may not provide significant savings after closing costs.
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
