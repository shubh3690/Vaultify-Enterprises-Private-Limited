"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatNumber } from "@/lib/utils"
import { ResultsDisplay } from "@/components/ui/results-display"

interface ExchangeRates {
    [key: string]: number
}

interface CurrencyMap {
    [code: string]: string
}

export function CurrencyConverter() {
    const [amount, setAmount] = useState(100)
    const [fromCurrency, setFromCurrency] = useState("USD")
    const [toCurrency, setToCurrency] = useState("EUR")
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({})
    const [convertedAmount, setConvertedAmount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [lastUpdated, setLastUpdated] = useState("")
    const [currencies, setCurrencies] = useState<CurrencyMap>({})

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const res = await fetch("https://api.frankfurter.app/currencies")
                const data = await res.json()
                setCurrencies(data)
            } catch (error) {
                console.error("Failed to fetch currencies:", error)
            }
        }

        fetchCurrencies()
    }, [])

    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true)
            try {
                const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}`)
                const data = await response.json()
                setExchangeRates(data.rates)
                setLastUpdated(data.date)
            } catch (error) {
                console.error("Failed to fetch exchange rates:", error)
            } finally {
                setLoading(false)
            }
        }

        if (fromCurrency) fetchRates()
    }, [fromCurrency])

    useEffect(() => {
        if (exchangeRates[toCurrency]) {
            const converted = amount * exchangeRates[toCurrency]
            setConvertedAmount(converted)
        }
    }, [amount, toCurrency, exchangeRates])

    const exchangeRate = exchangeRates[toCurrency] || 0

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Currency Converter</CardTitle>
                    <CardDescription>Convert between all currencies using live rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => {
                                if (Number(e.target.value) < 0)
                                    return
                                setAmount(Number(e.target.value))
                            }}
                            placeholder="100"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fromCurrency">From Currency</Label>
                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(currencies).map(([code, name]) => (
                                    <SelectItem key={code} value={code}>
                                        {code} - {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="toCurrency">To Currency</Label>
                        <Select value={toCurrency} onValueChange={setToCurrency}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(currencies).map(([code, name]) => (
                                    <SelectItem key={code} value={code}>
                                        {code} - {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <ResultsDisplay
                    title="Conversion Results"
                    results={[
                        { label: `${amount} ${fromCurrency}`, value: `${formatNumber(convertedAmount, 2)} ${toCurrency}` },
                        { label: "Exchange Rate", value: `1 ${fromCurrency} = ${formatNumber(exchangeRate, 4)} ${toCurrency}` },
                        { label: "Inverse Rate", value: `1 ${toCurrency} = ${formatNumber(1 / exchangeRate, 4)} ${fromCurrency}` },
                        { label: "Last Updated", value: lastUpdated },
                    ]}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Exchange Rate Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>Current Rate:</strong> 1 {fromCurrency} = {formatNumber(exchangeRate, 4)} {toCurrency}
                            </p>
                            <p>
                                <strong>Amount Converting:</strong> {formatNumber(amount, 2)} {fromCurrency}
                            </p>
                            <p>
                                <strong>Converted Amount:</strong> {formatNumber(convertedAmount, 2)} {toCurrency}
                            </p>
                            <p className="text-muted-foreground">
                                Rates are based on the European Central Bank. (Frankfurter.app)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
