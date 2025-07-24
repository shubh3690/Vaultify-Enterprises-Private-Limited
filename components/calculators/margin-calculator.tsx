"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateMargin, type MarginParams, type MarginResult } from "@/lib/financial-calculations";
import { formatCurrency } from "@/lib/utils";
import { ResultsDisplay } from "@/components/ui/results-display";

export function MarginCalculator() {
    const [params, setParams] = useState<MarginParams>({
        value1: 100,
        value2: 150,
        input1Type: "cost",
        input2Type: "selling-price",
    });

    const [results, setResults] = useState<MarginResult>({
        cost: 0,
        sellingPrice: 0,
        profit: 0,
        marginPercentage: 0,
        markupPercentage: 0,
    });

    const handleParamChange = (field: keyof MarginParams, value: any) => {
        setParams(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        setResults(calculateMargin(params));
    }, [params]);

    const getInputLabel = (type: string) => {
        const labels: Record<string, { label: string; symbol: string }> = {
            "cost": { label: "Cost", symbol: "₹" },
            "selling-price": { label: "Selling Price", symbol: "₹" },
            "margin": { label: "Margin", symbol: "%" },
            "markup": { label: "Markup", symbol: "%" },
        };
        return labels[type] || { label: "Value", symbol: "" };
    };

    const input1Info = getInputLabel(params.input1Type);
    const input2Info = getInputLabel(params.input2Type);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Margin Calculator</CardTitle>
                    <CardDescription>Calculate margin requirements for stock trading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>First Value</Label>
                        <Tabs
                            value={params.input1Type}
                            onValueChange={(value) => handleParamChange("input1Type", value)}
                        >
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="cost">Costs</TabsTrigger>
                                <TabsTrigger value="selling-price">Revenue</TabsTrigger>
                                <TabsTrigger value="margin">Margin</TabsTrigger>
                                <TabsTrigger value="markup">Markup</TabsTrigger>
                            </TabsList>
                            <TabsContent value={params.input1Type} className="mt-3">
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step={params.input1Type === "cost" || params.input1Type === "selling-price" ? "0.01" : "0.1"}
                                        value={params.value1}
                                        onChange={(e) => {
                                            if (Number(e.target.value) >= 0)
                                                handleParamChange("value1", Number(e.target.value))
                                        }}
                                        placeholder={`Enter ${input1Info.label.toLowerCase()}`}
                                        className="pr-10"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        {input1Info.symbol}
                                    </span>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-3">
                        <Label>Second Value</Label>
                        <Tabs
                            value={params.input2Type}
                            onValueChange={(value) => handleParamChange("input2Type", value)}
                        >
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="cost">Costs</TabsTrigger>
                                <TabsTrigger value="selling-price">Revenue</TabsTrigger>
                                <TabsTrigger value="margin">Margin</TabsTrigger>
                                <TabsTrigger value="markup">Markup</TabsTrigger>
                            </TabsList>
                            <TabsContent value={params.input2Type} className="mt-3">
                                <div className="relative">
                                    <Input
                                        type="number"
                                        step={params.input2Type === "cost" || params.input2Type === "selling-price" ? "0.01" : "0.1"}
                                        value={params.value2}
                                        onChange={(e) => {
                                            if (Number(e.target.value) >= 0)
                                                handleParamChange("value2", Number(e.target.value))
                                        }}
                                        placeholder={`Enter ${input2Info.label.toLowerCase()}`}
                                        className="pr-10"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        {input2Info.symbol}
                                    </span>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {((params.input1Type === "margin" && params.input2Type === "markup") || (params.input1Type === "markup" && params.input2Type === "margin")) && (
                        <Card className="p-4 optional">
                            Margin and Markup can't be selected together
                        </Card>
                    )}
                    {(params.input1Type === params.input2Type) && (
                        <Card className="p-4 optional">
                            Both inputs can't be of same type
                        </Card>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Calculation Results"
                    results={[
                        { label: "Cost", value: formatCurrency(results.cost) },
                        { label: "Selling Price", value: formatCurrency(results.sellingPrice) },
                        { label: "Profit", value: formatCurrency(results.profit), classes: results.profit >= 0 ? "text-green-600" : "text-red-600" },
                        { label: "Margin %", value: `${results.marginPercentage.toFixed(2)}%` },
                        { label: "Markup %", value: `${results.markupPercentage.toFixed(2)}%` },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Understanding the Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="font-medium text-blue-600">Margin:</span>
                                <span className="ml-2">Profit as a percentage of selling price</span>
                            </div>
                            <div>
                                <span className="font-medium text-green-600">Markup:</span>
                                <span className="ml-2">Profit as a percentage of cost</span>
                            </div>
                            <div>
                                <span className="font-medium text-purple-600">Profit:</span>
                                <span className="ml-2">Selling price minus cost</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
