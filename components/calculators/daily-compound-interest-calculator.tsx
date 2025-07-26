"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { calculateDailyCompoundInterest, DailyCompoundParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

const CONTRIBUTION_FREQUENCIES = [
    { label: "None", value: "0" },
    { label: "Daily (365/yr)", value: "365" },
    { label: "Weekly (52/yr)", value: "52" },
    { label: "Monthly (12/yr)", value: "12" }
]

export function DailyCompoundInterestCalculator() {
    const [params, setParams] = useState<DailyCompoundParams>({
        principal: 10000,
        rate: 5,
        rateInterval: "yearly",
        years: 1,
        months: 0,
        days: 0,
        dailyReinvestmentRate: 100,
        includedDays: ["M", "TU", "W", "TH", "F", "SA", "SU"],
        additionalContributions: 0,
        contributionFrequency: 0,
        startDate: new Date().toISOString().split("T")[0],
    })

    const [results, setResults] = useState(() =>
        calculateDailyCompoundInterest(params)
    )

    const updateParam = (key: keyof DailyCompoundParams, value: any) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateDailyCompoundInterest(newParams))
    }

    const toggleDay = (day: string, checked: boolean) => {
        const nextDays = checked
            ? [...params.includedDays, day]
            : params.includedDays.filter(d => d !== day)
        updateParam("includedDays", nextDays)
    }

    const dayOptions = [
        { value: "SU", label: "Sunday" },
        { value: "M", label: "Monday" },
        { value: "TU", label: "Tuesday" },
        { value: "W", label: "Wednesday" },
        { value: "TH", label: "Thursday" },
        { value: "F", label: "Friday" },
        { value: "SA", label: "Saturday" },
    ]

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Daily Compound Interest Calculator</CardTitle>
                    <CardDescription>Calculate interest compounded daily with regular deposits or withdrawals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Initial Investment (₹)</Label>
                            <Input
                                type="number"
                                value={params.principal}
                                onChange={e => {
                                    if (Number(e.target.value) < 0) return
                                    updateParam("principal", Number(e.target.value))
                                }}
                            />
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Interest Rate (%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={params.rate}
                                    onChange={e => {
                                        if (Number(e.target.value) < 0) return
                                        updateParam("rate", Number(e.target.value))
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Rate Interval</Label>
                                <Select
                                    value={params.rateInterval}
                                    onValueChange={v => updateParam("rateInterval", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Daily Reinvest Rate (%)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={params.dailyReinvestmentRate}
                                    onChange={e => {
                                        if (Number(e.target.value) < 0) {
                                            updateParam("dailyReinvestmentRate", 0)
                                            return
                                        }
                                        if (Number(e.target.value) > 100) {
                                            updateParam("dailyReinvestmentRate", 100)
                                            return
                                        }
                                        updateParam("dailyReinvestmentRate", Number(e.target.value))
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={params.startDate}
                                onChange={e => updateParam("startDate", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label>Years</Label>
                            <Input
                                type="number"
                                value={params.years}
                                onChange={e => {
                                    if (Number(e.target.value) < 0) return
                                    updateParam("years", Number(e.target.value))
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
                                onChange={e => {
                                    const val = Number(e.target.value)
                                    if (val < 0) {
                                        updateParam("months", 0)
                                        return
                                    }
                                    if (val > 11) {
                                        updateParam("months", 11)
                                        return
                                    }
                                    updateParam("months", val)
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Days</Label>
                            <Input
                                type="number"
                                value={params.days}
                                onChange={e => {
                                    if (Number(e.target.value) < 0) return
                                    updateParam("days", Number(e.target.value))
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Calculate Interest On:</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {dayOptions.map(d => (
                                <div key={d.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={d.value}
                                        checked={params.includedDays.includes(d.value)}
                                        onCheckedChange={checked =>
                                            toggleDay(d.value, Boolean(checked))
                                        }
                                    />
                                    <Label htmlFor={d.value} className="text-sm">{d.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="p-4 grid sm:grid-cols-2 gap-4 optional">
                        <div className="grid gap-2">
                            <Label>Contribution Amount (₹)</Label>
                            <Input
                                type="number"
                                value={params.additionalContributions}
                                onChange={e =>
                                    updateParam("additionalContributions", Number(e.target.value))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Contribution Frequency</Label>
                            <Select
                                value={String(params.contributionFrequency)}
                                onValueChange={v =>
                                    updateParam("contributionFrequency", Number(v))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONTRIBUTION_FREQUENCIES.map(({ label, value }) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
                <ResultsDisplay
                    title="Daily Compound Interest Results"
                    results={[
                        { label: "Final Amount", value: formatCurrency(results.finalAmount) },
                        { label: "Initial Principal", value: formatCurrency(params.principal) },
                        { label: "Additional Deposits", value: formatCurrency(results.totalDeposits) },
                        { label: "Total Interest Earned", value: formatCurrency(results.totalInterest) },
                        { label: "Total Withdrawals", value: formatCurrency(results.totalWithdrawals) },
                        { label: "Total Days", value: results.totalDays.toString() },
                        { label: "Business Days", value: results.businessDays.toString() },
                        { label: "Total/Business Days Ratio", value: (results.totalDays / results.businessDays).toFixed(2) },
                        { label: "Reinvestment Rate", value: `${params.dailyReinvestmentRate}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                        <CardDescription>Investment growth month by month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <div className="grid grid-cols-5 gap-8 text-sm font-medium border-b pb-2">
                                <span>Month</span>
                                <span>Balance</span>
                                <span>Interest</span>
                                <span>Deposits</span>
                                <span>Withdrawals</span>
                            </div>
                            {results.monthlyBreakdown.map((month, index) => (
                                <div key={index} className="grid grid-cols-5 gap-8 text-sm">
                                    <span>{month.month + 1}</span>
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
