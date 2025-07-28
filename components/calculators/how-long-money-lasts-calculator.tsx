"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { calculateSavingsWithdrawal, SavingsParams, SavingsResult } from "@/lib/financial-calculations";
import { formatCurrency } from "@/lib/utils";
import { ResultsDisplay } from "@/components/ui/results-display";

export function HowLongMoneyLastsCalculator() {
    const [params, setParams] = useState<SavingsParams>({
        currentBalance: 100000,
        annualInterestRate: 4,
        isNominalRate: true,
        withdrawalType: "fixed",
        withdrawalAmount: 2000,
        withdrawalFrequency: "monthly",
        withdrawalYears: 15,
        withdrawalMonths: 0,
        yearlyWithdrawalIncrease: 0,
        compoundingFrequency: "monthly",
    });

    const [results, setResults] = useState<SavingsResult>({
        yearsUntilZero: 0,
        monthsUntilZero: 0,
        futureBalance: 0,
        monthlyWithdrawalToLastTerm: 0,
    });

    const handleParamChange = (field: keyof SavingsParams, value: any) =>
        setParams((p) => ({ ...p, [field]: value }));

    useEffect(() => {
        if (params.currentBalance > 0 && params.withdrawalAmount > 0) {
            setResults(calculateSavingsWithdrawal(params));
        }
    }, [params]);

    const getFrequencyLabel = (freq: string) => {
        const labels: Record<string, string> = {
            'daily': 'Daily',
            'semi-weekly': 'Semi-Weekly',
            'weekly': 'Weekly',
            'biweekly': 'Biweekly',
            'semi-monthly': 'Semi-Monthly',
            'monthly': 'Monthly',
            'bimonthly': 'Bimonthly',
            'quarterly': 'Quarterly',
            'half-yearly': 'Half-Yearly',
            'yearly': 'Yearly',
            'annually': 'Annually'
        };
        return labels[freq] || 'Monthly';
    };

    const typeLabel = (t: SavingsParams["withdrawalType"]) => t === "fixed" ? "Fixed Amount" : (t === "percentOfBalance" ? "% of Balance" : "% of Interest");
    const suffix = params.withdrawalType === "fixed" ? "₹" : "%";

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>How Long Will Money Last</CardTitle>
                    <CardDescription>
                        Calculate how long your money will last with withdrawals
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="currentBalance">Current Balance (₹)</Label>
                        <Input
                            id="currentBalance"
                            type="number"
                            value={params.currentBalance}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                handleParamChange("currentBalance", Number(e.target.value) || 0)
                            }}
                        />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                            <Input
                                id="interestRate"
                                type="number"
                                step="0.01"
                                value={params.annualInterestRate}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    handleParamChange(
                                        "annualInterestRate",
                                        Number(e.target.value) || 0
                                    )
                                }}
                                className="flex-1"
                            />
                        </div>
                        <div>
                            <div className="grid gap-2">
                                <Label>Rate Type</Label>
                                <Select
                                    value={params.isNominalRate ? "Nominal" : "APY"}
                                    onValueChange={(v) =>
                                        handleParamChange("isNominalRate", v === "Nominal")
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nominal">Nominal</SelectItem>
                                        <SelectItem value="APY">APY</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div className="grid gap-2">
                                <Label>Compounded Frequency</Label>
                                <Select
                                    value={params.compoundingFrequency}
                                    onValueChange={(v) =>
                                        handleParamChange("compoundingFrequency", v as any)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily (365/yr)</SelectItem>
                                        <SelectItem value="semi-weekly">Semi-Weekly (104/yr)</SelectItem>
                                        <SelectItem value="weekly">Weekly (52/yr)</SelectItem>
                                        <SelectItem value="biweekly">Biweekly (26/yr)</SelectItem>
                                        <SelectItem value="semi-monthly">Semi-Monthly (24/yr)</SelectItem>
                                        <SelectItem value="monthly">Monthly (12/yr)</SelectItem>
                                        <SelectItem value="bimonthly">Bimonthly (6/yr)</SelectItem>
                                        <SelectItem value="quarterly">Quarterly (4/yr)</SelectItem>
                                        <SelectItem value="half-yearly">Half-Yearly (2/yr)</SelectItem>
                                        <SelectItem value="yearly">Yearly (1/yr)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <Label>
                                Withdrawal Amount ({suffix})
                            </Label>
                            <Input
                                type="number"
                                step={params.withdrawalType === "fixed" ? "1" : "0.1"}
                                value={params.withdrawalAmount}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    handleParamChange(
                                        "withdrawalAmount",
                                        Number(e.target.value) || 0
                                    )
                                }}
                                className="flex-1"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Withdrawal Frequency</Label>
                            <Select
                                value={params.withdrawalFrequency}
                                onValueChange={(v) =>
                                    handleParamChange("withdrawalFrequency", v as any)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                                    <SelectItem value="annually">Annually</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Withdrawal Type</Label>
                            <Select
                                value={params.withdrawalType}
                                onValueChange={(v) =>
                                    handleParamChange("withdrawalType", v as any)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    <SelectItem value="percentOfBalance">
                                        % of Balance
                                    </SelectItem>
                                    <SelectItem value="percentOfInterest">
                                        % of Interest
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Years</Label>
                            <Input
                                type="number"
                                value={params.withdrawalYears}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    handleParamChange("withdrawalYears", Number(e.target.value) || 0)
                                }}
                                placeholder="Years"
                            />
                        </div>
                        <div>
                            <Label>Months</Label>
                            <Input
                                type="number"
                                value={params.withdrawalMonths}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                        handleParamChange("withdrawalMonths", 0)
                                        return
                                    }
                                    if (Number(e.target.value) > 11) {
                                        handleParamChange("withdrawalMonths", 11)
                                        return
                                    }
                                    handleParamChange("withdrawalMonths", Number(e.target.value) || 0)
                                }}
                                placeholder="Months"
                            />
                        </div>
                    </div>

                    {params.withdrawalType === "fixed" && (
                        <Card className="grid gap-4 optional p-4">
                            {params.withdrawalType === "fixed" && (
                                <div className="grid gap-2">
                                    <Label htmlFor="yearlyIncrease">
                                        Annual Withdrawal Increase (%)
                                    </Label>
                                    <Input
                                        id="yearlyIncrease"
                                        type="number"
                                        step="0.1"
                                        value={params.yearlyWithdrawalIncrease}
                                        onChange={(e) => {
                                            if (Number(e.target.value) < 0)
                                                return
                                            if (Number(e.target.value) > 100) {
                                                handleParamChange(
                                                    "yearlyWithdrawalIncrease",
                                                    100
                                                )
                                                return
                                            }
                                            handleParamChange(
                                                "yearlyWithdrawalIncrease",
                                                Number(e.target.value) || 0
                                            )
                                        }}
                                    />
                                </div>
                            )}
                        </Card>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Money Duration Results"
                    results={[
                        { label: "Money Will Last", value: results.yearsUntilZero > 0 || results.monthsUntilZero > 0 ? `${results.yearsUntilZero} years, ${results.monthsUntilZero} months` : "Not sustainable", classes: `${(results.yearsUntilZero > params.withdrawalYears) ? "text-green-600" : ((results.yearsUntilZero < params.withdrawalYears) ? "text-red-600" : (results.yearsUntilZero === params.withdrawalYears && results.monthsUntilZero < params.withdrawalMonths) ? "text-red-600" : "text-green-600")}` },
                        { label: "Future Savings Balance", value: formatCurrency(results.futureBalance) },
                        { label: "Monthly Withdrawal to Last Term", value: formatCurrency(results.monthlyWithdrawalToLastTerm) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Withdrawal Plan Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Starting Balance:</span>
                                <span className="font-medium">{formatCurrency(params.currentBalance)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Withdrawal Type:</span>
                                <span className="font-medium">{typeLabel(params.withdrawalType)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{getFrequencyLabel(params.withdrawalFrequency)} Withdrawal:</span>
                                <span className="font-medium">
                                    {params.withdrawalType === 'fixed'
                                        ? formatCurrency(params.withdrawalAmount)
                                        : `${params.withdrawalAmount}%`
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Interest Rate:</span>
                                <span className="font-medium">{params.annualInterestRate}% ({params.isNominalRate ? 'Nominal' : 'APY'})</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Compounding:</span>
                                <span className="font-medium">{getFrequencyLabel(params.compoundingFrequency)}</span>
                            </div>
                            {params.yearlyWithdrawalIncrease > 0 && params.withdrawalType === 'fixed' && (
                                <div className="flex justify-between">
                                    <span>Yearly Increase:</span>
                                    <span className="font-medium">{params.yearlyWithdrawalIncrease}%</span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold border-t pt-2">
                                <span>Duration:</span>
                                <span>{results.yearsUntilZero} years, {results.monthsUntilZero} months</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
