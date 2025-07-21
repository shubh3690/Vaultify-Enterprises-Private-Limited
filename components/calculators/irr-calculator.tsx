"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { calculateIRR } from "@/lib/financial-calculations"
import { formatPercentage } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"
import { Plus, Minus } from "lucide-react"

export function IRRCalculator() {
    const [cashFlows, setCashFlows] = useState([-10000, 3000, 4000, 5000, 2000])
    const [irr, setIRR] = useState(calculateIRR(cashFlows))

    const updateCashFlow = (index: number, value: number) => {
        const newCashFlows = [...cashFlows]
        newCashFlows[index] = value
        setCashFlows(newCashFlows)
        setIRR(calculateIRR(newCashFlows))
    }

    const addCashFlow = () => {
        const newCashFlows = [...cashFlows, 0]
        setCashFlows(newCashFlows)
    }

    const removeCashFlow = (index: number) => {
        if (cashFlows.length > 2) {
            const newCashFlows = cashFlows.filter((_, i) => i !== index)
            setCashFlows(newCashFlows)
            setIRR(calculateIRR(newCashFlows))
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>IRR Calculator</CardTitle>
                    <CardDescription>Calculate Internal Rate of Return for your investment cash flows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label>Cash Flows (₹) (Negative for outflows, Positive for inflows)</Label>
                        {cashFlows.map((flow, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        value={flow}
                                        onChange={(e) => updateCashFlow(index, Number(e.target.value))}
                                        placeholder={index === 0 ? "Initial Investment (negative)" : `Year ${index} Cash Flow`}
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeCashFlow(index)}
                                    disabled={cashFlows.length <= 2}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addCashFlow} className="w-full bg-transparent">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Cash Flow
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="IRR Results"
                    results={[
                        { label: "Internal Rate of Return (IRR)", value: formatPercentage(irr) },
                        { label: "Initial Investment", value: `₹${Math.abs(cashFlows[0]).toLocaleString()}` },
                        {
                            label: "Total Inflows",
                            value: `₹${cashFlows
                                .slice(1)
                                .filter((flow) => flow > 0)
                                .reduce((sum, flow) => sum + flow, 0)
                                .toLocaleString()}`,
                        },
                        { label: "Number of Periods", value: `${cashFlows.length - 1}` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Cash Flow Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {cashFlows.map((flow, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span>{index === 0 ? "Initial Investment" : `Year ${index}`}:</span>
                                    <span className={flow < 0 ? "text-red-600" : "text-green-600"}>₹{flow.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Understanding IRR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>IRR (Internal Rate of Return)</strong> is the discount rate that makes the net present value
                                (NPV) of all cash flows equal to zero.
                            </p>
                            <p>
                                An IRR of {formatPercentage(irr)} means this investment would be equivalent to earning{" "}
                                {formatPercentage(irr)} annually on your money.
                            </p>
                            <p>
                                <strong>Decision Rule:</strong> If IRR &gt; required rate of return, the investment is attractive.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
