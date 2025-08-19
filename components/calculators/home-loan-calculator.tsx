"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { calculateHomeLoan, type HomeLoanParams, type HomeLoanResult } from "@/lib/financial-calculations";
import { formatCurrency } from "@/lib/utils";
import { ResultsDisplay } from "@/components/ui/results-display";

const LOAN_RATE_PERIODS = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
];

const COMPOUND_FREQUENCIES = [
    { label: "Monthly (12/yr)", value: 12 },
    { label: "Quarterly (4/yr)", value: 4 },
    { label: "Half-yearly (2/yr)", value: 2 },
    { label: "Yearly (1/yr)", value: 1 },
];

export function HomeLoanCalculator() {
    const [params, setParams] = useState<HomeLoanParams>({
        homeValue: 5000000,
        maxDownpayment: 2000000,
        loanInterestRate: 7.5,
        loanRatePeriod: "yearly",
        loanYears: 20,
        loanMonths: 0,
        inflationRate: 5,
        homeAppreciationRate: 8,
        rentalYieldPercent: 2,
        applicableTaxRate: 30,
        maxLoanPeriodYears: 30,
        investmentReturnsRate: 6.5,
        investmentCompounding: 12,
    });

    const [results, setResults] = useState<HomeLoanResult>(() => calculateHomeLoan(params));

    useEffect(() => {
        setResults(calculateHomeLoan(params));
    }, [params]);

    const updateParam = (key: keyof HomeLoanParams, value: number | string) => {
        setParams((prev) => ({
            ...prev,
            [key]: typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value,
        }));
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Home Loan Financing</CardTitle>
                    <CardDescription>
                        Analyze home loan vs downpayment strategies, considering appreciation, rental income, inflation,
                        investment returns, and Indian tax benefits.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="homeValue">Home Value (₹)</Label>
                        <Input
                            id="homeValue"
                            type="number"
                            min={0}
                            value={params.homeValue}
                            onChange={(e) => updateParam("homeValue", Math.max(0, Number(e.target.value)))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="maxDownpayment">Max Downpayment Possible (₹)</Label>
                        <Input
                            id="maxDownpayment"
                            type="number"
                            min={0}
                            max={params.homeValue}
                            value={params.maxDownpayment}
                            onChange={(e) => {
                                let val = Math.max(0, Number(e.target.value));
                                val = Math.min(val, params.homeValue);
                                updateParam("maxDownpayment", val);
                            }}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="loanInterestRate">Loan Interest Rate (%)</Label>
                            <Input
                                id="loanInterestRate"
                                type="number"
                                step={0.1}
                                min={0}
                                value={params.loanInterestRate}
                                onChange={(e) => updateParam("loanInterestRate", Math.max(0, Number(e.target.value)))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Loan Rate Period</Label>
                            <Select value={params.loanRatePeriod} onValueChange={(val) => updateParam("loanRatePeriod", val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOAN_RATE_PERIODS.map(({ label, value }) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="loanYears">Loan Years</Label>
                            <Input
                                id="loanYears"
                                type="number"
                                min={0}
                                max={params.maxLoanPeriodYears}
                                value={params.loanYears}
                                onChange={(e) => {
                                    let val = Math.max(0, Number(e.target.value));
                                    val = Math.min(val, params.maxLoanPeriodYears);
                                    updateParam("loanYears", val);
                                }}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="loanMonths">Loan Months</Label>
                            <Input
                                id="loanMonths"
                                type="number"
                                min={0}
                                max={11}
                                value={params.loanMonths}
                                onChange={(e) => {
                                    let val = Math.max(0, Number(e.target.value));
                                    if (val > 11) val = 11;
                                    updateParam("loanMonths", val);
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                        <Input
                            id="inflationRate"
                            type="number"
                            step={0.1}
                            min={0}
                            value={params.inflationRate}
                            onChange={(e) => updateParam("inflationRate", Math.max(0, Number(e.target.value)))}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="homeAppreciationRate">Home Appreciation Rate (%)</Label>
                            <Input
                                id="homeAppreciationRate"
                                type="number"
                                step={0.1}
                                min={0}
                                value={params.homeAppreciationRate}
                                onChange={(e) => updateParam("homeAppreciationRate", Math.max(0, Number(e.target.value)))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rentalYieldPercent">Annual Rental Yield (%)</Label>
                            <Input
                                id="rentalYieldPercent"
                                type="number"
                                step={0.1}
                                min={0}
                                max={100}
                                value={params.rentalYieldPercent}
                                onChange={(e) => updateParam("rentalYieldPercent", Math.min(100, Math.max(0, Number(e.target.value))))}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="applicableTaxRate">Applicable Income Tax Rate (%)</Label>
                        <Input
                            id="applicableTaxRate"
                            type="number"
                            step={0.1}
                            min={0}
                            max={100}
                            value={params.applicableTaxRate}
                            onChange={(e) => updateParam("applicableTaxRate", Math.min(100, Math.max(0, Number(e.target.value))))}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="investmentReturnsRate">Annual Investment Return Rate (%)</Label>
                            <Input
                                id="investmentReturnsRate"
                                type="number"
                                step={0.1}
                                min={0}
                                value={params.investmentReturnsRate}
                                onChange={(e) => updateParam("investmentReturnsRate", Math.max(0, Number(e.target.value)))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Investment Compound Frequency</Label>
                            <Select
                                value={params.investmentCompounding.toString()}
                                onValueChange={(val) => updateParam("investmentCompounding", Number(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPOUND_FREQUENCIES.map(({ label, value }) => (
                                        <SelectItem key={value} value={value.toString()}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Summary"
                    results={[
                        { label: "Optimal Downpayment", value: formatCurrency(results.optimalDownpayment) },
                        { label: "Maximum Net Benefit", value: formatCurrency(results.maxNetBenefit) },
                        { label: "Maximum Real Net Benefit", value: formatCurrency(results.maxRealNetBenefit) },
                        { label: "Total Tax Benefit", value: formatCurrency(results.taxBenefitTotal) },
                        { label: "Home Value at Loan End", value: formatCurrency(results.homeValueEnd) },
                        { label: "Total Rental Income", value: formatCurrency(results.rentalIncomeTotal) },
                        { label: "Investment Final Value", value: formatCurrency(results.details.find(d => d.downpayment === results.optimalDownpayment)?.investmentFinalValue || 0) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Benefit Analysis by Downpayment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-80 overflow-auto">
                            <div className="grid grid-cols-8 gap-2 text-sm font-medium border-b pb-2 min-w-[350%] sm:min-w-[250%]">
                                <span className="sticky left-0 bg-white z-10">Downpayment</span>
                                <span>Loan Amount</span>
                                <span>Total Loan Payment</span>
                                <span>Interest Paid</span>
                                <span>Tax Benefit</span>
                                <span>Investment Final Value</span>
                                <span>Net Benefit</span>
                                <span>Real Net Benefit</span>
                            </div>
                            {results.details.map((item) => {
                                const isOptimal = item.downpayment === results.optimalDownpayment;
                                return (
                                    <div
                                        key={item.downpayment}
                                        className={`grid grid-cols-8 gap-2 text-sm min-w-[350%] sm:min-w-[250%] ${isOptimal ? "bg-green-100 font-semibold" : ""}`}
                                    >
                                        <span className={`sticky left-0 ${!isOptimal ? "bg-white" : "bg-green-100"} z-10`}>{formatCurrency(item.downpayment)}</span>
                                        <span>{formatCurrency(item.loanAmount)}</span>
                                        <span>{formatCurrency(item.totalLoanPayment)}</span>
                                        <span>{formatCurrency(item.interestPaid)}</span>
                                        <span>{formatCurrency(item.taxBenefit)}</span>
                                        <span>{formatCurrency(item.investmentFinalValue)}</span>
                                        <span className={`${item.netBenefit > 0 ? "text-green-600" : item.netBenefit < 0 ? "text-red-600" : "text-yellow-600"}`}>{formatCurrency(item.netBenefit)}</span>
                                        <span className={`${item.realNetBenefit > 0 ? "text-green-600" : item.realNetBenefit < 0 ? "text-red-600" : "text-yellow-600"}`}>{formatCurrency(item.realNetBenefit)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
