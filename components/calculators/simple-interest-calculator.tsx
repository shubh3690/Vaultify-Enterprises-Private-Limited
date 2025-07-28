"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateSimpleInterest, SimpleInterestParams } from "@/lib/financial-calculations"
import { formatCurrency } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

export function SimpleInterestCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [rate, setRate] = useState(5)
    const [rateInterval, setRateInterval] = useState<"yearly" | "monthly">("yearly")
    const [type, setType] = useState<"time" | "dates">("time")
    const [years, setYears] = useState(3)
    const [months, setMonths] = useState(0)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [regularContributions, setRegularContributions] = useState(0)
    const [contributionInterval, setContributionInterval] = useState<"monthly" | "quarterly" | "half-yearly" | "yearly">("monthly")
    const [contributionType, setContributionType] = useState<"-1" | "1">("1")

    const getCalculationParams = (): SimpleInterestParams => ({
        principal,
        rate,
        rateInterval,
        type,
        years: type === "time" ? years : undefined,
        months: type === "time" ? months : undefined,
        startDate: type === "dates" ? startDate : undefined,
        endDate: type === "dates" ? endDate : undefined,
        regularContributions: regularContributions * Number(contributionType),
        contributionInterval
    })

    const results = calculateSimpleInterest(getCalculationParams())

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Simple Interest Calculator</CardTitle>
                    <CardDescription>Calculate simple interest with advanced options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="principal">Principal Amount (₹)</Label>
                        <Input
                            id="principal"
                            type="number"
                            value={principal}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                setPrincipal(Number(e.target.value))
                            }}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="rate">Interest Rate (%)</Label>
                            <Input
                                id="rate"
                                type="number"
                                step="0.1"
                                value={rate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setRate(Number(e.target.value))
                                }}
                                placeholder="5"
                                className="flex-1"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Rate Period</Label>
                            <Select value={rateInterval} onValueChange={(value: "yearly" | "monthly") => setRateInterval(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Time Period</Label>
                        <Select value={type} onValueChange={(value: "time" | "dates") => setType(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="time">Years & Months</SelectItem>
                                <SelectItem value="dates">Start & End Dates</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {type === "time" ? (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="years">Years</Label>
                                <Input
                                    id="years"
                                    type="number"
                                    value={years}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        setYears(Number(e.target.value))
                                    }}
                                    placeholder="3"
                                />
                            </div>
                            <div>
                                <Label htmlFor="months">Months</Label>
                                <Input
                                    id="months"
                                    type="number"
                                    value={months}
                                    onChange={(e) => {
                                        if (Number(e.target.value) < 0) {
                                            setMonths(0)
                                            return
                                        }
                                        if (Number(e.target.value) > 11) {
                                            setMonths(11)
                                            return
                                        }
                                        setMonths(Number(e.target.value))
                                    }}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <Card className="grid gap-4 sm:grid-cols-2 p-4 optional">
                        <Tabs
                            value={contributionType}
                            onValueChange={(value) => setContributionType(value as "-1" | "1")}
                            className="col-span-2"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="1">Deposits</TabsTrigger>
                                <TabsTrigger value="-1">Withdrawals</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="grid gap-2">
                            <Label htmlFor="contributions">{contributionType === "1" ? "Deposit" : "Withdrawal"} Amount (₹)</Label>
                            <Input
                                id="contributions"
                                type="number"
                                value={regularContributions}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setRegularContributions(Number(e.target.value))
                                }}
                                placeholder="0"
                                className="flex-1"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>{contributionType === "1" ? "Deposit" : "Withdrawal"} Frequency</Label>
                            <Select value={contributionInterval} onValueChange={(value: "monthly" | "quarterly" | "half-yearly" | "yearly") => setContributionInterval(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half-yearly">Half-yearly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Simple Interest Results"
                    results={[
                        { label: "Final Balance", value: formatCurrency(results.finalBalance) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Initial Balance", value: formatCurrency(results.initialBalance) },
                        { label: "Additional Deposits", value: formatCurrency(results.additionalDeposits) },
                        { label: "Total Withdrawals", value: formatCurrency(results.totalWithdrawals) }
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <div className="grid grid-cols-5 gap-2 text-sm font-medium border-b pb-2">
                                <span>Month</span>
                                <span>Balance</span>
                                <span>Interest</span>
                                <span>Deposits</span>
                                <span>Withdrawals</span>
                            </div>
                            {results.monthlyBreakdown.map((month) => (
                                <div key={month.month} className="grid grid-cols-5 gap-2 text-sm">
                                    <span>{month.month}</span>
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
