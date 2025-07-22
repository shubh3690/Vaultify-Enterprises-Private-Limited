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
]

export function CompoundInterestCalculator() {
    const [params, setParams] = useState<CompoundInterestParams>({
        principal: 10000,
        rate: 5,
        years: 10,
        compoundFrequency: 12,
        depositAmount: 0,
        depositFrequency: 12,
        depositTiming: "end",
        depositAnnualIncreasePercent: 0,
        withdrawalAmount: 0,
        withdrawalType: "fixed",
        withdrawalFrequency: 12,
        withdrawalAnnualIncreasePercent: 0,
    })

    const [results, setResults] = useState(() => calculateCompoundInterest(params))

    const updateParam = (key: keyof CompoundInterestParams, value: any) => {
        const newParams = { ...params, [key]: value }
        setParams(newParams)
        setResults(calculateCompoundInterest(newParams))
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Compound Interest Calculator</CardTitle>
                    <CardDescription>Calculate compound interest with regular deposits or Withdrawals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2" key={"principal"}>
                        <Label>Initial Investment (₹)</Label>
                        <Input
                            type="number"
                            value={params["principal" as keyof CompoundInterestParams] as number}
                            onChange={(e) => updateParam("principal" as keyof CompoundInterestParams, +e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2" key={"rate"}>
                        <Label>Annual Interest Rate (%)</Label>
                        <Input
                            type="number"
                            value={params["rate" as keyof CompoundInterestParams] as number}
                            onChange={(e) => updateParam("rate" as keyof CompoundInterestParams, +e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2" key={"years"}>
                        <Label>Investment Term (Years)</Label>
                        <Input
                            type="number"
                            value={params["years" as keyof CompoundInterestParams] as number}
                            onChange={(e) => updateParam("years" as keyof CompoundInterestParams, +e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Compounding Frequency</Label>
                        <Select
                            value={params.compoundFrequency.toString()}
                            onValueChange={(val) => updateParam("compoundFrequency", +val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {COMPOUND_FREQUENCIES.map(({ label, value }) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2" key={"depositAmount"}>
                        <Label className="optional">Deposit Amount (₹)</Label>
                        <Input
                            type="number"
                            value={params["depositAmount" as keyof CompoundInterestParams] as number}
                            onChange={(e) => updateParam("depositAmount" as keyof CompoundInterestParams, +e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="optional">Deposit Frequency</Label>
                        <Select
                            value={params.depositFrequency ? params.depositFrequency.toString() : ""}
                            onValueChange={(val) => updateParam("depositFrequency", val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.entries({ "Weekly": 52, "Monthly": 12, "Quarterly": 4, "Half-Yearly": 2, "Yearly": 1 }).map(([label, value]) => (
                                    <SelectItem key={value} value={value.toString()}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label className="optional">Deposit Timing</Label>
                        <Select
                            value={params.depositTiming}
                            onValueChange={(val) => updateParam("depositTiming", val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginning">Beginning</SelectItem>
                                <SelectItem value="end">End</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2" key={"withdrawalAmount"}>
                        <Label className="optional">Withdrawal Amount</Label>
                        <Input
                            type="number"
                            value={params["withdrawalAmount" as keyof CompoundInterestParams] as number}
                            onChange={(e) => updateParam("withdrawalAmount" as keyof CompoundInterestParams, +e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="optional">Withdrawal Type</Label>
                        <Select
                            value={params.withdrawalType}
                            onValueChange={(val) => updateParam("withdrawalType", val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">Fixed</SelectItem>
                                <SelectItem value="percentage-of-balance">% of Balance</SelectItem>
                                <SelectItem value="percentage-of-earnings">% of Earnings</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label className="optional">Withdrawal Interval</Label>
                        <Select
                            value={params.withdrawalFrequency ? params.withdrawalFrequency.toString() : ""}
                            onValueChange={(val) => updateParam("withdrawalFrequency", val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.entries({ "Monthly": 12, "Quarterly": 4, "Half-Yearly": 2, "Yearly": 1 }).map(([label, value]) => (
                                    <SelectItem key={value} value={value.toString()}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2" key={"depositAnnualIncreasePercent"}>
                        <Label className="optional">Annual Deposit Increase (%)</Label>
                        <Input
                            type="number"
                            value={params["depositAnnualIncreasePercent" as keyof CompoundInterestParams] as number}
                            onChange={(e) => updateParam("depositAnnualIncreasePercent" as keyof CompoundInterestParams, +e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2" key={"withdrawalAnnualIncreasePercent"}>
                        <Label className="optional">Annual Withdrawal Increase (%)</Label>
                        <Input
                            type="number"
                            value={params["withdrawalAnnualIncreasePercent" as keyof CompoundInterestParams] as number}
                            onChange={(e) => updateParam("withdrawalAnnualIncreasePercent" as keyof CompoundInterestParams, +e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Results"
                    results={[
                        { label: "Final Amount", value: formatCurrency(results.finalBalance) },
                        { label: "Total Interest", value: formatCurrency(results.totalInterest) },
                        { label: "Total Deposits", value: formatCurrency(results.totalDeposits) },
                        { label: "Total Withdrawals", value: formatCurrency(results.totalWithdrawals) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Yearly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-2">
                                <span>Year</span>
                                <span>Balance</span>
                                <span>Interest</span>
                                <span>Deposits</span>
                            </div>
                            {results.yearlyBreakdown.map((year) => (
                                <div key={year.year} className="grid grid-cols-4 gap-2 text-sm">
                                    <span>{year.year}</span>
                                    <span>{formatCurrency(year.balance)}</span>
                                    <span className="text-green-600">{formatCurrency(year.interestEarned)}</span>
                                    <span className="text-blue-600">{formatCurrency(year.deposits)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
