"use client"

import { useState } from "react"
import { CompoundInterestParams, calculateCompoundInterest } from "@/lib/financial-calculations"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ResultsDisplay } from "@/components/ui/results-display"
import { formatCurrency } from "@/lib/utils"

const COMPOUND_FREQUENCIES = [
    { label: "Yearly (1/yr)", value: "1" },
    { label: "Half-yearly (2/yr)", value: "2" },
    { label: "Quarterly (4/yr)", value: "4" },
    { label: "Bimonthly (6/yr)", value: "6" },
    { label: "Monthly (12/yr)", value: "12" },
    { label: "Semi-monthly (24/yr)", value: "24" },
    { label: "Biweekly (26/yr)", value: "26" },
    { label: "Weekly (52/yr)", value: "52" },
    { label: "Semi-weekly (104/yr)", value: "104" },
    { label: "Daily (365/yr)", value: "365" },
]

export function CompoundInterestCalculator() {
    const [params, setParams] = useState<CompoundInterestParams>({
        principal: 10000,
        rate: 5,
        ratePeriod: "yearly",
        compoundingFrequency: 12,
        years: 10,
        months: 0,
        depositAmount: 0,
        depositFrequency: "monthly",
        depositIncreaseRate: 0,
        depositTime: "ending",
        withdrawalAmount: 0,
        withdrawalFrequency: "monthly",
        withdrawalType: "fixed-amount",
        withdrawalIncreaseRate: 0,
    })

    const [results, setResults] = useState(() => calculateCompoundInterest(params))

    const updateParam = (key: keyof CompoundInterestParams, value: number | string) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateCompoundInterest(newParams))
    }

    return (
        <div className="grid gap-6 lg:sm:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Compound Interest Calculator</CardTitle>
                    <CardDescription>Calculate compound interest with regular deposits or withdrawals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Initial Investment (₹)</Label>
                        <Input
                            type="number"
                            value={params.principal}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                updateParam("principal", +e.target.value)
                            }}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Interest Rate (%)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={params.rate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("rate", +e.target.value)
                                }}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Rate Period</Label>
                            <Select
                                value={params.ratePeriod}
                                onValueChange={(val) => updateParam("ratePeriod", val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Compounding Frequency</Label>
                        <Select
                            value={params.compoundingFrequency.toString()}
                            onValueChange={(val) => updateParam("compoundingFrequency", +val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {COMPOUND_FREQUENCIES.map(({ label, value }) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Years</Label>
                            <Input
                                type="number"
                                value={params.years}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("years", +e.target.value)
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Months</Label>
                            <Input
                                type="number"
                                min="0"
                                max="11"
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
                                    updateParam("months", +e.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <Card className="grid sm:grid-cols-2 optional p-4 gap-4">

                        <div className="grid gap-2">
                            <Label>Deposit Amount (₹)</Label>
                            <Input
                                type="number"
                                value={params.depositAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("depositAmount", +e.target.value)
                                }}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Deposit Frequency</Label>
                            <Select
                                value={params.depositFrequency}
                                onValueChange={(val) => updateParam("depositFrequency", val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Deposit Timing</Label>
                            <Select
                                value={params.depositTime}
                                onValueChange={(val) => updateParam("depositTime", val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginning">Beginning of Period</SelectItem>
                                    <SelectItem value="ending">End of Period</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Annual Deposit Increase (%)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={params.depositIncreaseRate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("depositIncreaseRate", +e.target.value)
                                }}
                            />
                        </div>
                    </Card>

                    <Card className="grid sm:grid-cols-2 optional p-4 gap-4">
                        <div className="grid gap-2">
                            <Label>Withdrawal Amount ({params.withdrawalType === "fixed-amount" ? "₹" : "%"})</Label>
                            <Input
                                type="number"
                                value={params.withdrawalAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    updateParam("withdrawalAmount", +e.target.value)
                                }}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Withdrawal Frequency</Label>
                            <Select
                                value={params.withdrawalFrequency}
                                onValueChange={(val) => updateParam("withdrawalFrequency", val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    {params.withdrawalType === "fixed-amount" && (
                                        <>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                                        </>
                                    )}
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Withdrawal Type</Label>
                            <Select
                                value={params.withdrawalType}
                                onValueChange={(val) => updateParam("withdrawalType", val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed-amount">Fixed Amount</SelectItem>
                                    <SelectItem value="%-of-balance">% of Balance</SelectItem>
                                    <SelectItem value="%-of-interest">% of Interest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {params.withdrawalType === "fixed-amount" && (
                            <div className="grid gap-2">
                                <Label>Annual Withdrawal Increase (%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={params.withdrawalIncreaseRate}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        updateParam("withdrawalIncreaseRate", +e.target.value)
                                    }}
                                />
                            </div>
                        )}
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Results"
                    results={[
                        { label: "Final Amount", value: formatCurrency(results.finalAmount) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Total Deposits", value: formatCurrency(results.totalDeposits) },
                        { label: "Total Withdrawals", value: formatCurrency(results.totalWithdrawals) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-auto">
                            <div className="grid grid-cols-5 gap-2 text-sm font-medium border-b pb-2 min-w-[200%] sm:min-w-0">
                                <span className="sticky left-0 bg-white z-10">Month</span>
                                <span>Balance</span>
                                <span>Interest</span>
                                <span>Deposits</span>
                                <span>Withdrawals</span>
                            </div>
                            {results.monthlyBreakdown.map((month) => (
                                <div key={month.month} className="grid grid-cols-5 gap-2 text-sm min-w-[200%] sm:min-w-0">
                                    <span className="sticky left-0 bg-white z-10">{month.month}</span>
                                    <span>{formatCurrency(month.balance)}</span>
                                    <span className="text-green-600">{formatCurrency(month.interestEarned)}</span>
                                    <span className="text-blue-600">{formatCurrency(month.deposits)}</span>
                                    <span className="text-red-600">{formatCurrency(month.withdrawals)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
