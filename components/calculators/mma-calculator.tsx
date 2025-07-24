"use client"

import { useState } from "react"
import { calculateMMA, type MMAParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { ResultsDisplay } from "@/components/ui/results-display"

const COMPOUND_FREQUENCIES = [
    { label: "Yearly (1/yr)", value: "1" },
    { label: "Half-yearly (2/yr)", value: "2" },
    { label: "Quarterly (4/yr)", value: "4" },
    { label: "Monthly (12/yr)", value: "12" },
    { label: "Weekly (52/yr)", value: "52" },
    { label: "Daily (365/yr)", value: "365" },
]

const DEPOSIT_FREQUENCIES = [
    { label: "None", value: "0" },
    { label: "Yearly (1/yr)", value: "1" },
    { label: "Half-yearly (2/yr)", value: "2" },
    { label: "Quarterly (4/yr)", value: "4" },
    { label: "Monthly (12/yr)", value: "12" },
]

export function MMACalculator() {
    const [params, setParams] = useState<MMAParams>({
        principal: 25000,
        rate: 6.5,
        compoundFrequency: 12,
        years: 3,
        months: 0,
        depositAmount: 0,
        depositFrequency: 0,
    })

    const [results, setResults] = useState(calculateMMA(params))

    const updateParam = (key: keyof MMAParams, value: number) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateMMA(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Money Market Account Calculator</CardTitle>
                    <CardDescription>Calculate returns from your Money Market Account</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Initial Deposit (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={params.principal}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("principal", Number(e.target.value))
                            }}
                            placeholder="25000"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rate">Annual Interest Rate (%) (APY)</Label>
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
                                placeholder="6.5"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Interest Frequency</Label>
                            <Select
                                value={params.compoundFrequency ? params.compoundFrequency.toString() : ""}
                                onValueChange={(val) => updateParam("compoundFrequency", Number(val))}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {COMPOUND_FREQUENCIES.map(({ label, value }) => (
                                        <SelectItem key={value} value={value.toString()}>{label}</SelectItem>
                                    ))}
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
                                value={params.years}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("years", Number(e.target.value))
                                }}
                                placeholder="3"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="months">Months</Label>
                            <Input
                                id="months"
                                type="number"
                                value={params.months}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                        updateParam("months", 0)
                                        return
                                    }
                                    if (Number(e.target.value) > 11) {
                                        updateParam("months", 11)
                                        return
                                    }
                                    updateParam("months", Number(e.target.value))
                                }}
                                placeholder="3"
                            />
                        </div>
                    </div>

                    <Card className="grid sm:grid-cols-2 p-4 gap-4 optional">
                        <div className="grid gap-2">
                            <Label htmlFor="depositAmount">Regular Deposit (₹)</Label>
                            <Input
                                id="depositAmount"
                                type="number"
                                value={params.depositAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("depositAmount", Number(e.target.value))
                                }}
                                placeholder="500"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Deposit Frequency</Label>
                            <Select
                                value={params.depositFrequency ? params.depositFrequency.toString() : ""}
                                onValueChange={(val) => updateParam("depositFrequency", Number(val))}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {DEPOSIT_FREQUENCIES.map(({ label, value }) => (
                                        <SelectItem key={value} value={value.toString()}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Money Market Account Results"
                    results={[
                        { label: "Final Balance", value: formatCurrency(results.finalBalance) },
                        { label: "Total Interest Earned", value: formatCurrency(results.totalInterest) },
                        { label: "Total Deposits", value: formatCurrency(results.totalDeposits) },
                        { label: "Effective Yield", value: `${params.rate}% APY` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>MMA Account Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Opening Balance:</span>
                                <span className="font-medium">{formatCurrency(params.principal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{params.rate}% APY</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Account Term:</span>
                                <span className="font-medium">{params.years} years</span>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    <strong>MMA Benefits:</strong> Money Market Accounts typically offer higher interest rates than
                                    regular savings accounts while maintaining liquidity and FDIC insurance protection.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
