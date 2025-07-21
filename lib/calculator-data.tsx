import type React from "react"
import { TrendingUp, DollarSign, Home, BarChart3, Globe } from "lucide-react"

export interface CalculatorInfo {
    slug: string
    title: string
    description: string
    category: string
}

export interface CalculatorCategory {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    calculators: CalculatorInfo[]
}

export const calculatorCategories: CalculatorCategory[] = [
    {
        id: "savings-investments",
        title: "Savings & Investments",
        description: "Calculate compound interest, savings growth, and investment returns",
        icon: <TrendingUp className="h-5 w-5 text-white" />,
        calculators: [
            {
                slug: "compound-interest",
                title: "Compound Interest Calculator",
                description: "Calculate compound interest with regular deposits or withdrawals",
                category: "savings-investments",
            },
            {
                slug: "daily-compound-interest",
                title: "Daily Compound Interest",
                description: "Calculate daily compounding interest for investments",
                category: "savings-investments",
            },
            {
                slug: "apy-calculator",
                title: "APY Calculator",
                description: "Calculate Annual Percentage Yield on your investments",
                category: "savings-investments",
            },
            {
                slug: "cagr-calculator",
                title: "CAGR Calculator",
                description: "Calculate Compound Annual Growth Rate",
                category: "savings-investments",
            },
            {
                slug: "future-value-calculator",
                title: "Future Value Calculator",
                description: "Calculate future value of investments",
                category: "savings-investments",
            },
            {
                slug: "savings-goal",
                title: "Savings Goal Calculator",
                description: "Calculate time needed to reach your savings goal",
                category: "savings-investments",
            },
            {
                slug: "how-long-will-money-last",
                title: "How Long Will Money Last",
                description: "Calculate how long your money will last with withdrawals",
                category: "savings-investments",
            },
            {
                slug: "savings-calculator",
                title: "Savings Calculator",
                description: "Plan your savings goals and track progress",
                category: "savings-investments",
            },
            {
                slug: "simple-interest",
                title: "Simple Interest Calculator",
                description: "Calculate simple interest on investments",
                category: "savings-investments",
            },
            {
                slug: "sip-calculator",
                title: "SIP Calculator",
                description: "Calculate Systematic Investment Plan returns",
                category: "savings-investments",
            },
            {
                slug: "stock-average-calculator",
                title: "Stock Average Calculator",
                description: "Calculate average stock purchase price",
                category: "savings-investments",
            },
            {
                slug: "retirement-planning",
                title: "Retirement Planning",
                description: "Plan for your retirement savings needs",
                category: "savings-investments",
            },
        ],
    },
    {
        id: "loans-credit",
        title: "Loans & Credit",
        description: "Calculate loan payments, mortgage costs, and credit scenarios",
        icon: <Home className="h-5 w-5 text-white" />,
        calculators: [
            {
                slug: "amortization-calculator",
                title: "Amortization Calculator",
                description: "Calculate loan amortization schedule",
                category: "loans-credit",
            },
            {
                slug: "car-loan-calculator",
                title: "Car Loan Calculator",
                description: "Calculate auto loan payments and costs",
                category: "loans-credit",
            },
            {
                slug: "credit-card-repayment",
                title: "Credit Card Repayment",
                description: "Calculate credit card payoff time and interest",
                category: "loans-credit",
            },
            {
                slug: "loan-calculator",
                title: "Loan Calculator",
                description: "Calculate monthly loan payments and total interest",
                category: "loans-credit",
            },
            {
                slug: "loan-payoff-calculator",
                title: "Loan Payoff Calculator",
                description: "Calculate time to pay off existing loans",
                category: "loans-credit",
            },
            {
                slug: "mortgage-calculator",
                title: "Mortgage Calculator",
                description: "Calculate mortgage payments and amortization",
                category: "loans-credit",
            },
            {
                slug: "mortgage-refinance",
                title: "Mortgage Refinance Calculator",
                description: "Compare current mortgage with refinancing options",
                category: "loans-credit",
            },
        ],
    },
    {
        id: "investment-analysis",
        title: "Investment Analysis",
        description: "Advanced investment analysis and calculation tools",
        icon: <BarChart3 className="h-5 w-5 text-white" />,
        calculators: [
            {
                slug: "irr-calculator",
                title: "IRR Calculator",
                description: "Calculate Internal Rate of Return",
                category: "investment-analysis",
            },
            {
                slug: "margin-calculator",
                title: "Margin Calculator",
                description: "Calculate trading margin requirements",
                category: "investment-analysis",
            },
            {
                slug: "interest-rate-calculator",
                title: "Interest Rate Calculator",
                description: "Calculate required interest rate for goals",
                category: "investment-analysis",
            },
        ],
    },
    {
        id: "conversion-utility",
        title: "Conversion & Utility",
        description: "Currency conversion and utility calculators",
        icon: <Globe className="h-5 w-5 text-white" />,
        calculators: [
            {
                slug: "currency-converter",
                title: "Currency Converter",
                description: "Convert between different currencies with live rates",
                category: "conversion-utility",
            },
            {
                slug: "forex-compounding",
                title: "Forex Compounding",
                description: "Calculate forex trading compound returns",
                category: "conversion-utility",
            },
            {
                slug: "million-to-billion",
                title: "Million to Billion Converter",
                description: "Convert between millions, billions, and other large numbers",
                category: "conversion-utility",
            },
            {
                slug: "money-counter",
                title: "Money Counter",
                description: "Count and calculate total money amounts",
                category: "conversion-utility",
            },
            {
                slug: "price-per-square-feet",
                title: "Price per Square Feet",
                description: "Calculate real estate price per square foot",
                category: "conversion-utility",
            },
        ],
    },
    {
        id: "banking",
        title: "Banking",
        description: "Banking and account-related calculators",
        icon: <DollarSign className="h-5 w-5 text-white" />,
        calculators: [
            {
                slug: "cash-back-calculator",
                title: "Cash Back Calculator",
                description: "Calculate cash back rewards from credit cards",
                category: "banking",
            },
            {
                slug: "mma-calculator",
                title: "MMA Calculator",
                description: "Calculate Money Market Account returns and growth",
                category: "banking",
            },
        ],
    },
]

export function getAllCalculators(): CalculatorInfo[] {
    return calculatorCategories.flatMap((category) => category.calculators)
}

export function getCalculatorBySlug(slug: string): CalculatorInfo | undefined {
    return getAllCalculators().find((calc) => calc.slug === slug)
}
