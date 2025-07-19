import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { getAllCalculators } from "@/lib/calculator-data"
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest-calculator"
import { DailyCompoundInterestCalculator } from "@/components/calculators/daily-compound-interest-calculator"
import { LoanCalculator } from "@/components/calculators/loan-calculator"
import { MortgageCalculator } from "@/components/calculators/mortgage-calculator"
import { SavingsCalculator } from "@/components/calculators/savings-calculator"
import { APYCalculator } from "@/components/calculators/apy-calculator"
import { CAGRCalculator } from "@/components/calculators/cagr-calculator"
import { SimpleInterestCalculator } from "@/components/calculators/simple-interest-calculator"
import { SIPCalculator } from "@/components/calculators/sip-calculator"
import { CreditCardRepaymentCalculator } from "@/components/calculators/credit-card-repayment-calculator"
import { CurrencyConverter } from "@/components/calculators/currency-converter"
import { IRRCalculator } from "@/components/calculators/irr-calculator"
import { RetirementPlanningCalculator } from "@/components/calculators/retirement-planning-calculator"
import { CarLoanCalculator } from "@/components/calculators/car-loan-calculator"
import { AmortizationCalculator } from "@/components/calculators/amortization-calculator"
import { StockAverageCalculator } from "@/components/calculators/stock-average-calculator"
import { FutureValueCalculator } from "@/components/calculators/future-value-calculator"
import { HowLongMoneyLastsCalculator } from "@/components/calculators/how-long-money-lasts-calculator"
import { InterestRateCalculator } from "@/components/calculators/interest-rate-calculator"
import { LoanPayoffCalculator } from "@/components/calculators/loan-payoff-calculator"
import { MarginCalculator } from "@/components/calculators/margin-calculator"
import { ForexCompoundingCalculator } from "@/components/calculators/forex-compounding-calculator"
import { MillionToBillionConverter } from "@/components/calculators/million-to-billion-converter"
import { MoneyCounterCalculator } from "@/components/calculators/money-counter-calculator"
import { PricePerSquareFeetCalculator } from "@/components/calculators/price-per-square-feet-calculator"
import { MMACalculator } from "@/components/calculators/mma-calculator"
import { CashBackCalculator } from "@/components/calculators/cash-back-calculator"
import { SavingsGoalCalculator } from "@/components/calculators/savings-goal-calculator"

const calculatorComponents = {
    "compound-interest": CompoundInterestCalculator,
    "daily-compound-interest": DailyCompoundInterestCalculator,
    "loan-calculator": LoanCalculator,
    "mortgage-calculator": MortgageCalculator,
    "savings-calculator": SavingsCalculator,
    "apy-calculator": APYCalculator,
    "cagr-calculator": CAGRCalculator,
    "simple-interest": SimpleInterestCalculator,
    "sip-calculator": SIPCalculator,
    "credit-card-repayment": CreditCardRepaymentCalculator,
    "currency-converter": CurrencyConverter,
    "irr-calculator": IRRCalculator,
    "retirement-planning": RetirementPlanningCalculator,
    "car-loan-calculator": CarLoanCalculator,
    "amortization-calculator": AmortizationCalculator,
    "stock-average-calculator": StockAverageCalculator,
    "future-value-calculator": FutureValueCalculator,
    "how-long-will-money-last": HowLongMoneyLastsCalculator,
    "interest-rate-calculator": InterestRateCalculator,
    "loan-payoff-calculator": LoanPayoffCalculator,
    "margin-calculator": MarginCalculator,
    "forex-compounding": ForexCompoundingCalculator,
    "million-to-billion": MillionToBillionConverter,
    "money-counter": MoneyCounterCalculator,
    "price-per-square-feet": PricePerSquareFeetCalculator,
    "cash-back-calculator": CashBackCalculator,
    "mma-calculator": MMACalculator,
    "savings-goal": SavingsGoalCalculator,
}

export async function generateStaticParams() {
    const calculators = getAllCalculators()
    return calculators.map((calc) => ({
        slug: calc.slug,
    }))
}

export default async function CalculatorPage({
    params,
}: {
    params: { slug: string }
}) {
    const { slug } = await params
    const calculators = getAllCalculators()
    const calculator = calculators.find((calc) => calc.slug === slug)

    if (!calculator) {
        notFound()
    }

    const CalculatorComponent = calculatorComponents[slug as keyof typeof calculatorComponents]

    if (!CalculatorComponent) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{calculator.title}</h1>
                    <p className="text-muted-foreground">Calculator coming soon...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-md hover:shadow-lg mb-8 ml-4"
            >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back</span>
            </Link>

            <CalculatorComponent />
        </div>
    )
}
