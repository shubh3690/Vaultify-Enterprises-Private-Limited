"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    calculateFinancing,
    type FinancingParams,
    type FinancingResult,
} from "@/lib/financial-calculations";
import { formatCurrency } from "@/lib/utils";
import { ResultsDisplay } from "@/components/ui/results-display";

const LOAN_RATE_PERIODS = [
    { label: "Yearly", value: "yearly" },
    { label: "Monthly", value: "monthly" },
];

const COMPOUND_FREQUENCIES = [
    { label: "Monthly (12/yr)", value: 12 },
    { label: "Quarterly (4/yr)", value: 4 },
    { label: "Half-yearly (2/yr)", value: 2 },
    { label: "Yearly (1/yr)", value: 1 },
];

export function LoanFinancingCalculator() {
    const [params, setParams] = useState<FinancingParams>({
        totalPayment: 1200000,
        maxDownpayment: 600000,
        loanInterestRate: 8,
        loanRatePeriod: "yearly",
        investmentReturnsRate: 6.5,
        investmentCompounding: 12,
        loanYears: 5,
        loanMonths: 0,
        inflationRate: 5,
    });

    const [results, setResults] = useState<FinancingResult>(() =>
        calculateFinancing(params)
    );

    useEffect(() => {
        setResults(calculateFinancing(params));
    }, [params]);

    const updateParam = (key: keyof FinancingParams, value: number | string) => {
        setParams((prev) => ({
            ...prev,
            [key]: typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value,
        }));
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Loan Financing Calculator</CardTitle>
                    <CardDescription>
                        Compare financing vs outright purchase, find optimal downpayment and inflation-adjusted profits.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Total Cost */}
                    <div className="grid gap-2">
                        <Label htmlFor="totalPayment">Total Cost (₹)</Label>
                        <Input
                            id="totalPayment"
                            type="number"
                            min={0}
                            value={params.totalPayment}
                            onChange={(e) =>
                                updateParam("totalPayment", Math.max(0, Number(e.target.value)))
                            }
                            placeholder="1000000"
                        />
                    </div>

                    {/* Max Downpayment */}
                    <div className="grid gap-2">
                        <Label htmlFor="maxDownpayment">Max Downpayment Possible (₹)</Label>
                        <Input
                            id="maxDownpayment"
                            type="number"
                            min={0}
                            value={params.maxDownpayment}
                            onChange={(e) => {
                                let val = Math.max(0, Number(e.target.value));
                                if (val > params.totalPayment) val = params.totalPayment;
                                updateParam("maxDownpayment", val);
                            }}
                            max={params.totalPayment}
                        />
                    </div>

                    {/* Loan Interest Rate and Rate Period */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="loanInterestRate">Loan Interest Rate (%)</Label>
                            <Input
                                id="loanInterestRate"
                                type="number"
                                step="0.1"
                                min={0}
                                value={params.loanInterestRate}
                                onChange={(e) =>
                                    updateParam("loanInterestRate", Math.max(0, Number(e.target.value)))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Loan Rate Period</Label>
                            <Select
                                value={params.loanRatePeriod}
                                onValueChange={(val) => updateParam("loanRatePeriod", val)}
                            >
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

                    {/* Investment Return Rate and Compounding */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="investmentReturnsRate">Investment Return Rate (%)</Label>
                            <Input
                                id="investmentReturnsRate"
                                type="number"
                                step="0.1"
                                min={0}
                                value={params.investmentReturnsRate}
                                onChange={(e) =>
                                    updateParam("investmentReturnsRate", Math.max(0, Number(e.target.value)))
                                }
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

                    {/* Loan Term */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="loanYears">Loan Years</Label>
                            <Input
                                id="loanYears"
                                type="number"
                                min={0}
                                value={params.loanYears}
                                onChange={(e) =>
                                    updateParam("loanYears", Math.max(0, Number(e.target.value)))
                                }
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

                    {/* Inflation Rate */}
                    <div className="grid gap-2">
                        <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                        <Input
                            id="inflationRate"
                            type="number"
                            step="0.1"
                            min={0}
                            value={params.inflationRate}
                            onChange={(e) =>
                                updateParam("inflationRate", Math.max(0, Number(e.target.value)))
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay title="Summary" results={[
                    { label: "Optimal Downpayment", value: formatCurrency(results.optimalDownpayment), classes: "text-green-600" },
                    { label: "Maximum Nominal Profit", value: formatCurrency(results.maxProfit) },
                    { label: "Maximum Profit (Inflation Adjusted)", value: formatCurrency(results.maxRealProfit) },
                ]} />

                <Card>
                    <CardHeader>
                        <CardTitle>Profit Analysis by Downpayment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-72 overflow-auto">
                            <div className="grid grid-cols-7 gap-2 text-sm font-medium border-b pb-2 min-w-[300%] sm:min-w-[200%]">
                                <span className="sticky left-0 bg-white z-10">Downpayment</span>
                                <span>Loan Amount</span>
                                <span>Total Loan Payment</span>
                                <span>Invested Amount</span>
                                <span>Investment Final Value</span>
                                <span>Nominal Profit</span>
                                <span>Real Profit</span>
                            </div>
                            {results.details.map((downpayment) => (
                                <div key={downpayment.downpayment} className="grid grid-cols-7 gap-2 text-sm min-w-[300%] sm:min-w-[200%]">
                                    <span className="sticky left-0 bg-white z-10">{formatCurrency(downpayment.downpayment)}</span>
                                    <span>{formatCurrency(downpayment.loanAmount)}</span>
                                    <span>{formatCurrency(downpayment.investmentPrincipal)}</span>
                                    <span>{formatCurrency(downpayment.totalLoanPayment)}</span>
                                    <span>{formatCurrency(downpayment.investmentFinalValue)}</span>
                                    <span className={`${downpayment.netProfit > 0 ? "text-green-600" : (downpayment.netProfit < 0 ? "text-red-600" : "text-yellow-600")}`}>{formatCurrency(downpayment.netProfit)}</span>
                                    <span className={`${downpayment.realNetProfit > 0 ? "text-green-600" : (downpayment.realNetProfit < 0 ? "text-red-600" : "text-yellow-600")}`}>{formatCurrency(downpayment.realNetProfit)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
