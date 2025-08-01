"use client"

import { useEffect, useState, useCallback } from "react"
import { calculateInterestRate, type InterestRateParams, type InterestRateResult } from "@/lib/financial-calculations"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResultsDisplay } from "@/components/ui/results-display"

export function InterestRateCalculator() {
    const [presentValue, setPresentValue] = useState(10000)
    const [secondFigure, setSecondFigure] = useState(15000)
    const [secondFigureType, setSecondFigureType] = useState<"end-balance" | "interest" | "interest-rate">("end-balance")
    const [years, setYears] = useState(5)
    const [months, setMonths] = useState(0)
    const [result, setResult] = useState<InterestRateResult>(() =>
        calculateInterestRate({
            principal: 10000,
            secondFigure: 15000,
            typeOfSecondFigure: "end-balance",
            years: 5,
            months: 0
        })
    )

    const recalculate = useCallback((
        newPrincipal = presentValue,
        newSecondFigure = secondFigure,
        newSecondFigureType = secondFigureType,
        newYears = years,
        newMonths = months
    ) => {
        const params: InterestRateParams = {
            principal: newPrincipal,
            secondFigure: newSecondFigure,
            typeOfSecondFigure: newSecondFigureType,
            years: newYears,
            months: newMonths
        }
        setResult(calculateInterestRate(params))
    }, [presentValue, secondFigure, secondFigureType, years, months]);

    useEffect(() => {
        recalculate()
    }, [presentValue, secondFigure, secondFigureType, years, months, recalculate])

    const totalReturn = ((result.totalInterest ?? 0) / presentValue) * 100

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Interest Rate Calculator</CardTitle>
                    <CardDescription>
                        Calculate the required interest rate to reach your financial goal
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="presentValue">Present Value (₹)</Label>
                        <Input
                            id="presentValue"
                            type="number"
                            value={presentValue}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                setPresentValue(Number(e.target.value))
                            }}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="secondFigure">
                                {secondFigureType === "end-balance"
                                    ? "Future Value (₹)"
                                    : secondFigureType === "interest"
                                        ? "Interest Earned (₹)"
                                        : "Interest Rate (%)"}
                            </Label>
                            <Input
                                id="secondFigure"
                                type="number"
                                value={secondFigure}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setSecondFigure(Number(e.target.value))
                                }}
                                placeholder={
                                    secondFigureType === "interest-rate"
                                        ? "5"
                                        : secondFigureType === "interest"
                                            ? "5000"
                                            : "15000"
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="figureType">Secondary Figure Type</Label>
                            <Select
                                value={secondFigureType}
                                onValueChange={(val) =>
                                    setSecondFigureType(val as "end-balance" | "interest" | "interest-rate")
                                }
                            >
                                <SelectTrigger id="figureType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="end-balance">End Balance</SelectItem>
                                    <SelectItem value="interest">Interest Earned</SelectItem>
                                    <SelectItem value="interest-rate">Interest Rate %</SelectItem>
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
                                value={years}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setYears(Number(e.target.value))
                                }}
                                placeholder="5"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="months">Months</Label>
                            <Input
                                id="months"
                                type="number"
                                value={months}
                                onChange={(e) => {
                                    if (Number(e.target.value) < 0)
                                        return
                                    setMonths(Number(e.target.value))
                                }}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Required Interest Rate"
                    results={[
                        { label: "Nominal Annual Rate", value: formatPercentage(result.nominalRate) },
                        { label: "Effective Annual Rate (APY)", value: formatPercentage(result.apyRate) },
                        { label: "Total Interest Earned", value: formatCurrency(result.totalInterest) },
                        { label: "Total Return", value: formatPercentage(totalReturn) },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Starting Amount:</span>
                                <span className="font-medium">{formatCurrency(presentValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time Frame:</span>
                                <span className="font-medium">
                                    {years} year{years !== 1 ? "s" : ""}{" "}
                                    {months > 0 && `${months} month${months !== 1 ? "s" : ""}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Target Figure:</span>
                                <span className="font-medium">
                                    {secondFigureType === "interest-rate"
                                        ? `${secondFigure}%`
                                        : formatCurrency(secondFigure)}
                                </span>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    Based on your selected input type, to reach your goal in{" "}
                                    {years} year{years !== 1 ? "s" : ""}{" "}
                                    {months > 0 && `${months} month${months !== 1 ? "s" : ""}`}, your investment will need to grow
                                    at a nominal annual rate of {formatPercentage(result.nominalRate)} and an
                                    effective APY of {formatPercentage(result.apyRate)}.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
