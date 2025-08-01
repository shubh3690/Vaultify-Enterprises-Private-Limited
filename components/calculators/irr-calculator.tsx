"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { calculateCashFlowIRR, calculateGeneralIRR, calculateReturnMultipleIRR } from "@/lib/financial-calculations"
import { ResultsDisplay } from "@/components/ui/results-display"
import { formatPercentage } from "@/lib/utils"
import { Plus, Minus } from "lucide-react"

export function IRRCalculator() {
    const [tab, setTab] = useState<"general" | "cashflow" | "multiple">("cashflow")

    // General IRR
    const [initialInvestment, setInitialInvestment] = useState(10000)
    const [finalReturn, setFinalReturn] = useState(20000)
    const [years, setYears] = useState(5)
    const [months, setMonths] = useState(0)
    const [regularTransfer, setRegularTransfer] = useState(0)
    const [transferFrequency, setTransferFrequency] = useState<"weekly" | "monthly" | "quarterly" | "half-yearly" | "yearly">("monthly")
    const generalIRR = calculateGeneralIRR({ initialInvestment, finalReturn, years, months, regularTransfer, transferFrequency })

    // Cash Flow IRR
    const [cashFlows, setCashFlows] = useState([-10000, 3000, 4000, 5000])
    const cashFlowIRR = calculateCashFlowIRR({ cashFlows })

    // Return Multiple IRR
    const [returnMultiple, setReturnMultiple] = useState(2)
    const [multipleYears, setMultipleYears] = useState(2)
    const [multipleMonths, setMultipleMonths] = useState(0)
    const irrForMultiple = calculateReturnMultipleIRR(returnMultiple, multipleYears, multipleMonths)

    const updateCashFlow = (setFn: React.Dispatch<React.SetStateAction<number[]>>, flows: number[], index: number, value: number) => {
        const newFlows = [...flows]
        newFlows[index] = value
        setFn(newFlows)
    }

    const addCashFlow = (setFn: React.Dispatch<React.SetStateAction<number[]>>, flows: number[]) => {
        setFn([...flows, 0])
    }

    const removeCashFlow = (setFn: React.Dispatch<React.SetStateAction<number[]>>, flows: number[], index: number) => {
        if (flows.length > 2) {
            const newFlows = flows.filter((_, i) => i !== index)
            setFn(newFlows)
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>IRR Calculator</CardTitle>
                    <CardDescription>Select a calculation type to compute IRR</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-4">
                        <TabsList className="grid grid-cols-3">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="cashflow">Cash Flows</TabsTrigger>
                            <TabsTrigger value="multiple">Multiple</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <div className="grid gap-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Initial Investment (₹)</Label>
                                        <Input type="number" value={initialInvestment} onChange={(e) => {
                                            if (Number(e.target.value) < 0)
                                                return
                                            setInitialInvestment(Number(e.target.value))
                                        }} />
                                    </div>
                                    <div>
                                        <Label>Final Return (₹)</Label>
                                        <Input type="number" value={finalReturn} onChange={(e) => {
                                            if (Number(e.target.value) < 0)
                                                return
                                            setFinalReturn(Number(e.target.value))
                                        }} />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Years</Label>
                                        <Input type="number" value={years} onChange={(e) => {
                                            if (Number(e.target.value) < 0)
                                                return
                                            setYears(Number(e.target.value))
                                        }} />
                                    </div>
                                    <div>
                                        <Label>Months</Label>
                                        <Input type="number" value={months} onChange={(e) => {
                                            if (Number(e.target.value) < 0) {
                                                setMonths(0)
                                                return
                                            }
                                            if (Number(e.target.value) > 11) {
                                                setMonths(11)
                                                return
                                            }
                                            setMonths(Number(e.target.value))
                                        }} />
                                    </div>
                                </div>
                                <Card className="optional grid sm:grid-cols-2 gap-4 p-4">
                                    <div>
                                        <Label>Regular Transfers (₹)</Label>
                                        <Input type="number" value={regularTransfer} onChange={(e) => setRegularTransfer(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <Label>Transfers Frequency</Label>
                                        <Select
                                            value={transferFrequency}
                                            onValueChange={(val) => setTransferFrequency(val as typeof transferFrequency)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {Object.entries({
                                                    "weekly": "Weekly",
                                                    "monthly": "Monthly",
                                                    "quarterly": "Quarterly",
                                                    "half-yearly": "Half-Yearly",
                                                    "yearly": "Yearly"
                                                }).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="cashflow">
                            <div className="space-y-3">
                                <Label>Cash Flows (₹)</Label>
                                {cashFlows.map((flow, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Input
                                            type="number"
                                            value={flow}
                                            onChange={(e) => updateCashFlow(setCashFlows, cashFlows, index, Number(e.target.value))}
                                            placeholder={index === 0 ? "Initial Investment (negative)" : `Year ${index}`}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeCashFlow(setCashFlows, cashFlows, index)}
                                            disabled={cashFlows.length <= 2}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => addCashFlow(setCashFlows, cashFlows)}>
                                    <Plus className="h-4 w-4 mr-1" /> Add Cash Flow
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="multiple">
                            <div className="space-y-4">
                                <div>
                                    <Label>Return Multiple</Label>
                                    <Input type="number" value={returnMultiple} onChange={(e) => {
                                        if (Number(e.target.value) < 0)
                                            return
                                        setReturnMultiple(Number(e.target.value))
                                    }} min={0.1} step={0.1}></Input>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Label>Years</Label>
                                        <Input type="number" value={multipleYears} onChange={(e) => {
                                            if (Number(e.target.value) < 0)
                                                return
                                            setMultipleYears(Number(e.target.value))
                                        }} />
                                    </div>
                                    <div className="flex-1">
                                        <Label>Months</Label>
                                        <Input type="number" value={multipleMonths} onChange={(e) => {
                                            if (Number(e.target.value) < 0) {
                                                setMultipleMonths(0)
                                                return
                                            }
                                            if (Number(e.target.value) > 11) {
                                                setMultipleMonths(11)
                                                return
                                            }
                                            setMultipleMonths(Number(e.target.value))
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {tab === "general" && (
                    <ResultsDisplay
                        title="General IRR Result"
                        results={[
                            { label: "Internal Rate of Return (IRR)", value: formatPercentage(generalIRR) },
                            { label: "Initial Investment", value: `₹${initialInvestment.toLocaleString()}` },
                            { label: "Final Return", value: `₹${finalReturn.toLocaleString()}` },
                            { label: "Years", value: years.toString() },
                        ]}
                    />
                )}

                {tab === "cashflow" && (
                    <ResultsDisplay
                        title="Cash Flow IRR Result"
                        results={[
                            { label: "Internal Rate of Return (IRR)", value: formatPercentage(cashFlowIRR) },
                            { label: "Initial Investment", value: `₹${Math.abs(cashFlows[0]).toLocaleString()}` },
                            {
                                label: "Total Inflows",
                                value: `₹${cashFlows.slice(1).filter(f => f > 0).reduce((a, b) => a + b, 0).toLocaleString()}`
                            },
                            { label: "Periods", value: `${cashFlows.length - 1}` },
                        ]}
                    />
                )}

                {tab === "multiple" && (
                    <ResultsDisplay
                        title="Return Multiple IRR Result"
                        results={[
                            { label: "Return Multiple", value: `${returnMultiple}x` },
                            { label: "Period", value: `${multipleYears} years ${multipleMonths} months` },
                            { label: "Required IRR", value: formatPercentage(irrForMultiple) },
                        ]}
                    />
                )}
            </div>
        </div>
    )
}
