export interface CompoundInterestParams {
    principal: number
    rate: number
    compoundingFrequency: number
    time: number
    monthlyDeposit?: number
    monthlyWithdrawal?: number
}

export interface CompoundInterestResult {
    finalAmount: number
    totalInterest: number
    totalDeposits: number
    totalWithdrawals: number
    yearlyBreakdown: Array<{
        year: number
        balance: number
        interestEarned: number
        deposits: number
        withdrawals: number
    }>
}

export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
    const { principal, rate, time, compoundingFrequency = 1, monthlyDeposit = 0, monthlyWithdrawal = 0 } = params

    const totalMonths = time * 12
    const periodicRate = rate / 100 / compoundingFrequency
    const monthsPerPeriod = 12 / compoundingFrequency

    let balance = principal
    let totalInterest = 0
    let totalDeposits = principal
    let totalWithdrawals = 0

    const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = []

    for (let month = 1; month <= totalMonths; month++) {
        if (monthlyDeposit > 0) {
            balance += monthlyDeposit
            totalDeposits += monthlyDeposit
        }

        if (monthlyWithdrawal > 0) {
            balance -= monthlyWithdrawal
            totalWithdrawals += monthlyWithdrawal
        }

        if (month % monthsPerPeriod === 0) {
            const interest = balance * periodicRate
            balance += interest
            totalInterest += interest
        }

        if (month % 12 === 0) {
            yearlyBreakdown.push({
                year: month / 12,
                balance,
                interestEarned: totalInterest,
                deposits: totalDeposits,
                withdrawals: totalWithdrawals
            })
        }
    }

    return {
        finalAmount: balance,
        totalInterest,
        totalDeposits,
        totalWithdrawals,
        yearlyBreakdown
    }
}

export function calculateDailyCompoundInterest(principal: number, rate: number, days: number): CompoundInterestResult {
    const dailyRate = rate / 100 / 365
    let balance = principal
    let totalInterest = 0

    const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = []

    for (let day = 1; day <= days; day++) {
        const dailyInterest = balance * dailyRate
        balance += dailyInterest
        totalInterest += dailyInterest

        if (day % 365 === 0) {
            yearlyBreakdown.push({
                year: day / 365,
                balance,
                interestEarned: totalInterest,
                deposits: principal,
                withdrawals: 0
            })
        }
    }

    return {
        finalAmount: balance,
        totalInterest,
        totalDeposits: principal,
        totalWithdrawals: 0,
        yearlyBreakdown
    }
}

export interface InvestmentParams {
    principal: number
    annualRate: number
    compoundingFrequency: number
    years: number
    months: number
    regularDeposit?: number
    depositInterval: "monthly" | "quarterly" | "half-yearly" | "yearly"
    regularWithdrawal?: number
    withdrawalType: "fixed-amount" | "percent-of-balance" | "percent-of-interest"
    withdrawalInterval: "monthly" | "quarterly" | "half-yearly" | "yearly"
    annualDepositIncrease?: number
    annualWithdrawalIncrease?: number
}

export interface InvestmentResult {
    finalBalance: number
    totalInterest: number
    initialBalance: number
    additionalDeposits: number
    totalWithdrawals: number
}

export function calculateInvestment(params: InvestmentParams): InvestmentResult {
    const { principal, annualRate, compoundingFrequency, years, months, regularDeposit = 0, depositInterval, regularWithdrawal = 0, withdrawalType, withdrawalInterval, annualDepositIncrease = 0, annualWithdrawalIncrease = 0 } = params;

    const totalMonths = years * 12 + months;
    const periodsPerYear = compoundingFrequency;

    const fullPeriods = Math.floor((totalMonths / 12) * periodsPerYear);
    const remainingMonths = totalMonths - Math.floor(totalMonths / 12) * 12;
    const remainingPeriodsFromMonths = (remainingMonths / 12) * periodsPerYear;
    const additionalFullPeriods = Math.floor(remainingPeriodsFromMonths);
    const partialPeriodFraction = remainingPeriodsFromMonths - additionalFullPeriods;

    const totalFullPeriods = fullPeriods + additionalFullPeriods;
    const periodicRate = annualRate / (100 * periodsPerYear);

    const getDepositFrequency = (interval: string): number => {
        switch (interval) {
            case "weekly": return 52;
            case "monthly": return 12;
            case "quarterly": return 4;
            case "half-yearly": return 2;
            case "yearly": return 1;
            default: return 12;
        }
    };

    const getWithdrawalFrequency = (interval: string): number => {
        switch (interval) {
            case "monthly": return 12;
            case "quarterly": return 4;
            case "half-yearly": return 2;
            case "yearly": return 1;
            default: return 12;
        }
    };

    const depositFrequency = getDepositFrequency(depositInterval);
    const withdrawalFrequency = getWithdrawalFrequency(withdrawalInterval);

    const depositPeriodInterval = periodsPerYear / depositFrequency;
    const withdrawalPeriodInterval = periodsPerYear / withdrawalFrequency;

    let balance = principal;
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let currentDepositAmount = regularDeposit;
    let currentWithdrawalAmount = regularWithdrawal;
    let totalInterestEarned = 0;

    let accumulatedInterest = 0;
    let lastYearProcessed = 0;

    for (let period = 1; period <= totalFullPeriods; period++) {
        const currentYear = Math.floor((period - 1) / periodsPerYear) + 1;

        if (currentYear > lastYearProcessed && currentYear > 1) {
            currentDepositAmount *= (1 + annualDepositIncrease / 100);
            currentWithdrawalAmount *= (1 + annualWithdrawalIncrease / 100);
            lastYearProcessed = currentYear;
        }

        const interestEarned = balance * periodicRate;
        balance += interestEarned;
        totalInterestEarned += interestEarned;
        accumulatedInterest += interestEarned;

        if (depositPeriodInterval <= 1 || period % Math.round(depositPeriodInterval) === 0) {
            balance += currentDepositAmount;
            totalDeposits += currentDepositAmount;
        }

        let withdrawalAmount = 0;
        if (withdrawalPeriodInterval <= 1 || period % Math.round(withdrawalPeriodInterval) === 0) {
            if (withdrawalType === "percent-of-interest") {
                const interestForWithdrawal = withdrawalPeriodInterval <= 1 ? interestEarned : accumulatedInterest;
                withdrawalAmount = calculateWithdrawalAmount(
                    balance,
                    interestForWithdrawal,
                    currentWithdrawalAmount,
                    withdrawalType
                );
                accumulatedInterest = 0;
            } else {
                withdrawalAmount = calculateWithdrawalAmount(
                    balance,
                    interestEarned,
                    currentWithdrawalAmount,
                    withdrawalType
                );
            }
        }

        if (withdrawalAmount > 0) {
            balance -= withdrawalAmount;
            totalWithdrawals += withdrawalAmount;
        }

        if (balance < 0) balance = 0;
    }

    if (partialPeriodFraction > 0) {
        const partialInterest = balance * periodicRate * partialPeriodFraction;
        balance += partialInterest;
        totalInterestEarned += partialInterest;
        if (depositPeriodInterval <= 1) {
            const proratedDeposit = currentDepositAmount * partialPeriodFraction;
            balance += proratedDeposit;
            totalDeposits += proratedDeposit;
        }

        if (withdrawalPeriodInterval <= 1 && regularWithdrawal > 0) {
            let withdrawalAmount = 0;
            if (withdrawalType === "percent-of-interest") {
                withdrawalAmount = calculateWithdrawalAmount(
                    balance,
                    partialInterest,
                    currentWithdrawalAmount * partialPeriodFraction,
                    "fixed-amount"
                );
            } else if (withdrawalType === "percent-of-balance") {
                withdrawalAmount = calculateWithdrawalAmount(
                    balance,
                    0,
                    currentWithdrawalAmount,
                    withdrawalType
                );
            } else {
                withdrawalAmount = calculateWithdrawalAmount(
                    balance,
                    0,
                    currentWithdrawalAmount * partialPeriodFraction,
                    "fixed-amount"
                );
            }

            if (withdrawalAmount > 0) {
                balance -= withdrawalAmount;
                totalWithdrawals += withdrawalAmount;
            }
        }
    }

    return {
        finalBalance: Math.round(balance * 100) / 100,
        totalInterest: Math.round(totalInterestEarned * 100) / 100,
        initialBalance: principal,
        additionalDeposits: Math.round(totalDeposits * 100) / 100,
        totalWithdrawals: Math.round(totalWithdrawals * 100) / 100
    };
}

function calculateWithdrawalAmount(
    balance: number,
    interestForCalculation: number,
    withdrawalAmount: number,
    withdrawalType: string
): number {
    let calculatedWithdrawal = 0;

    switch (withdrawalType) {
        case "fixed-amount":
            calculatedWithdrawal = withdrawalAmount;
            break;
        case "percent-of-balance":
            calculatedWithdrawal = balance * (withdrawalAmount / 100);
            break;
        case "percent-of-interest":
            calculatedWithdrawal = interestForCalculation * (withdrawalAmount / 100);
            break;
        default:
            calculatedWithdrawal = withdrawalAmount;
    }

    return Math.min(calculatedWithdrawal, balance);
}

export interface LoanCalculatorParams {
    loanAmount: number
    interestRate: number
    loanTermYears: number
    loanTermMonths: number
    startDate?: string
    extraPayments?: number
    additionalPaymentFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly'
    extraFees?: number
    addExtraFeesToLoan?: boolean
    oneTimePayment?: {
        amount: number
        type: 'balloon' | 'at_date'
        date?: string
    }
}

export interface AmortizationEntry {
    paymentNumber: number
    paymentDate: string
    beginningBalance: number
    monthlyPayment: number
    principalPayment: number
    interestPayment: number
    extraPayment: number
    endingBalance: number
    cumulativeInterest: number
}

export interface LoanSummary {
    numberOfPayments: number
    totalOfPayments: number
    totalInterest: number
    totalPrincipal: number
    totalExtraPayments: number
}

export interface LoanCalculatorResult {
    monthlyPayment: number
    totalInterest: number
    totalAmount: number
    payoffDate: string
    interestSavedWithExtra?: number
    timeSavedWithExtra?: number
    amortizationSchedule: AmortizationEntry[]
    summary: LoanSummary
    effectiveLoanAmount: number
}

export function calculateLoan(params: LoanCalculatorParams): LoanCalculatorResult {
    const { loanAmount, loanTermYears, loanTermMonths, interestRate, startDate = new Date().toISOString().split('T')[0], extraPayments = 0, additionalPaymentFrequency = 'monthly', extraFees = 0, addExtraFeesToLoan = false, oneTimePayment } = params

    const effectiveLoanAmount = addExtraFeesToLoan ? loanAmount + extraFees : loanAmount
    const totalLoanMonths = (loanTermYears * 12) + loanTermMonths
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = totalLoanMonths
    let monthlyPayment: number

    if (oneTimePayment?.type === 'balloon' && oneTimePayment.amount > 0) {
        const balloonPresentValue = oneTimePayment.amount / Math.pow(1 + monthlyRate, numberOfPayments)
        const adjustedLoanAmount = effectiveLoanAmount - balloonPresentValue

        if (adjustedLoanAmount > 0) {
            monthlyPayment = adjustedLoanAmount *
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        } else {
            monthlyPayment = effectiveLoanAmount * monthlyRate
        }
    } else {
        monthlyPayment = effectiveLoanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    }

    const getExtraPaymentForMonth = (paymentNumber: number): number => {
        if (!extraPayments) return 0

        switch (additionalPaymentFrequency) {
            case 'weekly':
                return extraPayments * 4.33
            case 'monthly':
                return extraPayments
            case 'quarterly':
                return (paymentNumber % 3 === 0) ? extraPayments : 0
            case 'half-yearly':
                return (paymentNumber % 6 === 0) ? extraPayments : 0
            case 'yearly':
                return (paymentNumber % 12 === 0) ? extraPayments : 0
            default:
                return 0
        }
    }

    const formatDateString = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    const amortizationSchedule: AmortizationEntry[] = []
    let currentBalance = effectiveLoanAmount
    let cumulativeInterest = 0
    let paymentNumber = 1
    let currentDate = new Date(startDate)
    let balloonApplied = false

    const oneTimePaymentMonth = oneTimePayment?.type === 'at_date' && oneTimePayment.date ? Math.round((new Date(oneTimePayment.date).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : null

    while (currentBalance > 0.01 && paymentNumber <= numberOfPayments + 12) {
        const interestPayment = currentBalance * monthlyRate
        let principalPayment = Math.max(0, monthlyPayment - interestPayment)
        let actualExtraPayment = getExtraPaymentForMonth(paymentNumber)

        if (oneTimePaymentMonth === paymentNumber && oneTimePayment?.amount) {
            actualExtraPayment += oneTimePayment.amount
        }

        if (oneTimePayment?.type === 'balloon' && oneTimePayment.amount > 0 && !balloonApplied) {
            const balanceAfterRegularPayment = currentBalance - principalPayment - actualExtraPayment

            if (balanceAfterRegularPayment <= oneTimePayment.amount && balanceAfterRegularPayment > 0) {
                actualExtraPayment += balanceAfterRegularPayment
                balloonApplied = true
            }
            else if (paymentNumber === numberOfPayments && !balloonApplied) {
                actualExtraPayment += Math.min(oneTimePayment.amount, currentBalance - principalPayment)
                balloonApplied = true
            }
        }

        const totalPrincipal = Math.min(principalPayment + actualExtraPayment, currentBalance)
        if (totalPrincipal >= currentBalance) {
            principalPayment = currentBalance
            actualExtraPayment = Math.max(0, currentBalance - (monthlyPayment - interestPayment))
        }

        cumulativeInterest += interestPayment
        currentBalance -= totalPrincipal

        amortizationSchedule.push({
            paymentNumber,
            paymentDate: formatDateString(currentDate),
            beginningBalance: currentBalance + totalPrincipal,
            monthlyPayment: monthlyPayment,
            principalPayment: totalPrincipal,
            interestPayment,
            extraPayment: actualExtraPayment,
            endingBalance: Math.max(0, currentBalance),
            cumulativeInterest
        })

        currentDate.setMonth(currentDate.getMonth() + 1)
        paymentNumber++

        if (currentBalance <= 0.01) break
    }

    const standardMonthlyPayment = effectiveLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    const standardTotalInterest = (standardMonthlyPayment * numberOfPayments) - effectiveLoanAmount

    const actualTotalInterest = cumulativeInterest
    const interestSavedWithExtra = Math.max(0, standardTotalInterest - actualTotalInterest)

    const standardPayoffMonths = numberOfPayments
    const actualPayoffMonths = amortizationSchedule.length
    const timeSavedWithExtra = Math.max(0, standardPayoffMonths - actualPayoffMonths)

    const totalOfAllPayments = amortizationSchedule.reduce((sum, entry) => sum + entry.monthlyPayment + entry.extraPayment, 0)

    const summary: LoanSummary = {
        numberOfPayments: amortizationSchedule.length,
        totalOfPayments: totalOfAllPayments,
        totalInterest: actualTotalInterest,
        totalPrincipal: effectiveLoanAmount,
        totalExtraPayments: amortizationSchedule.reduce((sum, entry) => sum + entry.extraPayment, 0)
    }

    const payoffDate = amortizationSchedule[amortizationSchedule.length - 1]?.paymentDate || formatDateString(currentDate)

    return {
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        totalInterest: parseFloat(actualTotalInterest.toFixed(2)),
        totalAmount: parseFloat(totalOfAllPayments.toFixed(2)),
        payoffDate,
        interestSavedWithExtra: parseFloat(interestSavedWithExtra.toFixed(2)),
        timeSavedWithExtra,
        amortizationSchedule,
        summary,
        effectiveLoanAmount: parseFloat(effectiveLoanAmount.toFixed(2))
    }
}

export interface APYParams {
    principal: number;
    nominalRate: number;
    years: number;
    months: number;
    compoundingFrequency: number;
    regularDeposit?: number;
    depositRate?: "weekly" | "monthly" | "quarterly" | "half-yearly" | "yearly";
}

export interface APYResult {
    finalBalance: number;
    totalInterest: number;
    additionalDeposits: number;
    APYRate: number;
    initialBalance: number;
}

export function calculateAPY(params: APYParams): APYResult {
    const {
        principal, nominalRate, years, months,
        compoundingFrequency, regularDeposit = 0, depositRate
    } = params;

    const annualRate = nominalRate / 100;
    const totalYears = years + months / 12;

    const freqMap = {
        weekly: 52, monthly: 12, quarterly: 4,
        "half-yearly": 2, yearly: 1
    } as const;
    const depFreq = depositRate ? freqMap[depositRate] : 0;

    type Event = { time: number; type: "compound" | "deposit" };
    const events: Event[] = [];

    for (let i = 1; i <= compoundingFrequency * totalYears; i++) {
        events.push({ time: i / compoundingFrequency, type: "compound" });
    }
    if (regularDeposit && depFreq) {
        for (let j = 1; j <= depFreq * totalYears; j++) {
            events.push({ time: j / depFreq, type: "deposit" });
        }
    }

    events.sort((a, b) => a.time - b.time);
    let balance = principal;
    let lastTime = 0;
    let totalDeposits = 0;

    for (const e of events) {
        const delta = e.time - lastTime;
        balance *= Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency * delta);

        if (e.type === "deposit") {
            balance += regularDeposit;
            totalDeposits += regularDeposit;
        }
        lastTime = e.time;
    }

    const finalBalance = Math.round(balance * 100) / 100;
    const totalInterest = Math.round((finalBalance - principal - totalDeposits) * 100) / 100;
    const apyRate = Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency) - 1;

    return {
        initialBalance: Math.round(principal * 100) / 100,
        finalBalance,
        additionalDeposits: Math.round(totalDeposits * 100) / 100,
        totalInterest,
        APYRate: Math.round(apyRate * 10000) / 100
    };
}

export function calculateCAGR(beginningValue: number, endingValue: number, years: number): number {
    return (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100
}

export function calculateSimpleInterest(principal: number, rate: number, time: number): number {
    return principal * (rate / 100) * time
}

export interface SIPParams {
    monthlyInvestment: number
    expectedReturn: number
    timePeriod: number
}

export interface SIPResult {
    maturityAmount: number
    totalInvestment: number
    totalReturns: number
}

export function calculateSIP(params: SIPParams): SIPResult {
    const { monthlyInvestment, expectedReturn, timePeriod } = params
    const monthlyRate = expectedReturn / 100 / 12
    const totalMonths = timePeriod * 12

    const maturityAmount = monthlyInvestment * (((Math.pow(monthlyRate + 1, totalMonths) - 1) / monthlyRate) * (monthlyRate + 1))
    const totalInvestment = monthlyInvestment * totalMonths
    const totalReturns = maturityAmount - totalInvestment

    return {
        maturityAmount,
        totalInvestment,
        totalReturns
    }
}

export interface CreditCardParams {
    balance: number
    interestRate: number
    monthlyPayment: number
}

export interface CreditCardResult {
    payoffTime: number
    totalInterest: number
    totalPayment: number
}

export function calculateCreditCardPayoff(params: CreditCardParams): CreditCardResult {
    const { balance, interestRate, monthlyPayment } = params
    const monthlyRate = interestRate / 100 / 12

    let currentBalance = balance
    let totalInterest = 0
    let months = 0

    while (currentBalance > 0.01 && months < 600) {
        const interestCharge = currentBalance * monthlyRate
        const principalPayment = monthlyPayment - interestCharge

        if (principalPayment <= 0) {
            return { payoffTime: -1, totalInterest: -1, totalPayment: -1 }
        }

        totalInterest += interestCharge
        currentBalance -= principalPayment
        months++

        if (currentBalance < 0)
            currentBalance = 0
    }

    return {
        payoffTime: months,
        totalInterest,
        totalPayment: balance + totalInterest
    }
}

export interface RetirementParams {
    currentAge: number
    retirementAge: number
    currentSavings: number
    monthlyContribution: number
    expectedReturn: number
    inflationRate: number
    desiredMonthlyIncome: number
}

export interface RetirementResult {
    totalSavingsAtRetirement: number
    monthlyIncomeGenerated: number
    shortfall: number
    recommendedMonthlySavings: number
}

export function calculateRetirement(params: RetirementParams): RetirementResult {
    const { currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, inflationRate, desiredMonthlyIncome } = params

    const yearsToRetirement = retirementAge - currentAge
    const monthsToRetirement = yearsToRetirement * 12
    const monthlyReturn = expectedReturn / 100 / 12

    // Calculate total savings at retirement
    const futureValueCurrentSavings = currentSavings * Math.pow(monthlyReturn + 1, monthsToRetirement)
    const futureValueContributions = monthlyContribution * ((Math.pow(monthlyReturn + 1, monthsToRetirement) - 1) / monthlyReturn)
    const totalSavingsAtRetirement = futureValueCurrentSavings + futureValueContributions

    // Calculate monthly income that can be generated (4% rule)
    const monthlyIncomeGenerated = (totalSavingsAtRetirement * 0.04) / 12

    // Adjust desired income for inflation
    const inflationAdjustedIncome = desiredMonthlyIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement)
    const shortfall = Math.max(0, inflationAdjustedIncome - monthlyIncomeGenerated)

    // Calculate recommended monthly savings to meet goal
    const requiredSavings = (inflationAdjustedIncome * 12) / 0.04
    const additionalSavingsNeeded = Math.max(0, requiredSavings - futureValueCurrentSavings)
    const recommendedMonthlySavings = additionalSavingsNeeded / ((Math.pow(monthlyReturn + 1, monthsToRetirement) - 1) / monthlyReturn)

    return {
        totalSavingsAtRetirement,
        monthlyIncomeGenerated,
        shortfall,
        recommendedMonthlySavings
    }
}

export interface SavingsGoalParams {
    targetAmount: number
    currentSavings: number
    depositAmount: number
    depositFrequency: 'daily' | 'weekly' | 'fortnightly' | 'monthly'
    interestRate: number
    compoundingFrequency: number
}

export interface SavingsGoalResult {
    monthsToGoal: number
    yearsToGoal: number
    totalContributions: number
    interestEarned: number
}

export function calculateSavingsGoal(params: SavingsGoalParams): SavingsGoalResult {
    const { targetAmount, currentSavings, depositAmount, depositFrequency, interestRate, compoundingFrequency } = params

    const getMonthlyDepositAmount = (amount: number, frequency: string): number => {
        switch (frequency) {
            case 'daily': return amount * 365 / 12
            case 'weekly': return amount * 52 / 12
            case 'fortnightly': return amount * 26 / 12
            case 'monthly': return amount
            default: return amount
        }
    }

    const monthlyDeposit = getMonthlyDepositAmount(depositAmount, depositFrequency)
    const monthlyRate = interestRate / 100 / 12

    let balance = currentSavings
    let months = 0
    let totalContributions = 0

    while (balance < targetAmount && months < 1200) {
        balance += monthlyDeposit
        totalContributions += monthlyDeposit

        const monthlyInterest = balance * monthlyRate
        balance += monthlyInterest

        months++
    }

    const interestEarned = balance - currentSavings - totalContributions

    return {
        monthsToGoal: months,
        yearsToGoal: months / 12,
        totalContributions,
        interestEarned: Math.max(0, interestEarned)
    }
}

export function calculateFutureValue(presentValue: number, rate: number, periods: number, paymentPerPeriod = 0): number {
    const futureValueLumpSum = presentValue * Math.pow(1 + rate / 100, periods)
    const futureValueAnnuity = paymentPerPeriod * ((Math.pow(1 + rate / 100, periods) - 1) / (rate / 100))
    return futureValueLumpSum + futureValueAnnuity
}

export interface SavingsParams {
    currentBalance: number;
    annualInterestRate: number;
    isNominalRate: boolean;
    withdrawalType: 'fixed' | 'percentOfBalance' | 'percentOfInterest';
    withdrawalAmount: number;
    withdrawalFrequency: 'monthly' | 'quarterly' | 'half-yearly' | 'annually';
    withdrawalYears: number;
    withdrawalMonths: number;
    yearlyWithdrawalIncrease: number;
    compoundingFrequency: 'daily' | 'semi-weekly' | 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly' | 'bimonthly' | 'quarterly' | 'half-yearly' | 'yearly';
}

export interface SavingsResult {
    yearsUntilZero: number;
    monthsUntilZero: number;
    futureBalance: number;
    monthlyWithdrawalToLastTerm: number;
}

export function calculateSavingsWithdrawal(params: SavingsParams): SavingsResult {
    const freqToNum = (freq: string): number => {
        const frequencyMap: Record<string, number> = {
            'daily': 365,
            'semi-weekly': 104,
            'weekly': 52,
            'biweekly': 26,
            'semi-monthly': 24,
            'monthly': 12,
            'bimonthly': 6,
            'quarterly': 4,
            'half-yearly': 2,
            'yearly': 1,
            'annually': 1
        };
        return frequencyMap[freq] || 12;
    };

    const wFreq = freqToNum(params.withdrawalFrequency);
    const cFreq = freqToNum(params.compoundingFrequency);

    // convert APY→nominal if needed
    let r = params.annualInterestRate / 100;
    if (!params.isNominalRate) {
        r = cFreq * (Math.pow(1 + r, 1 / cFreq) - 1);
    }
    const rPerComp = r / cFreq;

    // total withdrawal‐periods requested
    const targetPeriods = params.withdrawalYears * wFreq + Math.floor(params.withdrawalMonths * (wFreq / 12));
    const compPerWithdraw = cFreq / wFreq;
    const yearlyGrowth = 1 + params.yearlyWithdrawalIncrease / 100;

    function withdrawalThisPeriod(balanceBeforeWithdrawal: number, interestEarned: number, base: number): number {
        switch (params.withdrawalType) {
            case 'fixed':
                return base;
            case 'percentOfBalance':
                return (balanceBeforeWithdrawal * base) / 100;
            case 'percentOfInterest':
                return Math.max(0, (interestEarned * base) / 100);
        }
    }

    // how many withdrawal‐periods until zero
    function durationPeriods(baseAmount: number): number {
        let bal = params.currentBalance;
        let base = baseAmount;
        let periods = 0;

        while (bal > 0.01 && periods < 10000) {
            const startBalance = bal;

            // Apply compound interest for this withdrawal period
            for (let i = 0; i < compPerWithdraw; i++) {
                bal *= (1 + rPerComp);
            }

            const interestEarned = bal - startBalance;
            let withdrawal = withdrawalThisPeriod(bal, interestEarned, base);
            withdrawal = Math.min(withdrawal, bal);
            bal -= withdrawal;
            periods++;

            // Increase base withdrawal yearly (only for fixed amounts)
            if (periods % wFreq === 0 && params.withdrawalType === 'fixed') {
                base *= yearlyGrowth;
            }
            if (bal <= 0.01)
                break;
        }
        return periods;
    }

    // future balance after exactly targetPeriods
    function futureBalanceAfter(baseAmount: number, periods: number): number {
        let bal = params.currentBalance;
        let base = baseAmount;

        for (let p = 0; p < periods; p++) {
            const startBalance = bal;
            for (let i = 0; i < compPerWithdraw; i++) {
                bal *= (1 + rPerComp);
            }

            const interestEarned = bal - startBalance;
            let withdrawal = withdrawalThisPeriod(bal, interestEarned, base);
            withdrawal = Math.min(withdrawal, bal);
            bal -= withdrawal;

            if ((p + 1) % wFreq === 0 && params.withdrawalType === 'fixed') {
                base *= yearlyGrowth;
            }

            if (bal <= 0.01) {
                bal = 0;
                break;
            }
        }
        return Math.max(0, bal);
    }

    // find base withdrawal to last exactly targetPeriods
    function findBaseForDuration(periods: number): number {
        if (periods === 0) return 0;

        let lo = 0;
        let hi = params.withdrawalType === 'fixed' ? params.currentBalance * 2 : 100;

        if (params.withdrawalType === 'percentOfBalance') {
            hi = Math.min(100, (params.currentBalance * wFreq * 12) / (periods * 12));
        }

        for (let i = 0; i < 100 && Math.abs(hi - lo) > 0.001; i++) {
            const mid = (lo + hi) / 2;
            const duration = durationPeriods(mid);

            if (duration > periods) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        return (lo + hi) / 2;
    }

    const dur = durationPeriods(params.withdrawalAmount);
    const yearsUntilZero = Math.floor(dur / wFreq);
    const monthsUntilZero = Math.round((dur % wFreq) * (12 / wFreq));

    const futureBal = futureBalanceAfter(params.withdrawalAmount, targetPeriods);
    const baseToLast = findBaseForDuration(targetPeriods);
    const monthlyToLast = params.withdrawalType === 'fixed' ? (baseToLast * wFreq) / 12 : baseToLast;

    return {
        yearsUntilZero,
        monthsUntilZero,
        futureBalance: Math.round(futureBal * 100) / 100,
        monthlyWithdrawalToLastTerm: Math.round(monthlyToLast * 100) / 100,
    };
}

export function calculateRequiredInterestRate(presentValue: number, futureValue: number, periods: number): number {
    return (Math.pow(futureValue / presentValue, 1 / periods) - 1) * 100
}

export interface CarLoanParams {
    principal: number
    rate: number
    term: number
    ballonPayment: number
}

export interface CarLoanResult {
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
    amortizationSchedule: Array<{
        month: number
        payment: number
        principal: number
        interest: number
        balance: number
    }>
}

export function calculateCarLoan(params: CarLoanParams): CarLoanResult {
    const { principal: P, rate, term, ballonPayment: B } = params;
    const r = rate / 100 / 12;
    const n = term * 12;

    // Monthly payment with balloon discount
    const annuityFactor = r / (1 - Math.pow(1 + r, -n));
    const balloonAdjustment = B * r / (Math.pow(1 + r, n) - 1);
    const monthlyPayment = P * annuityFactor - balloonAdjustment;

    let balance = P;
    const schedule = [];
    let totalInterest = 0;

    for (let month = 1; month <= n; month++) {
        const interest = balance * r;
        const principalPaid = monthlyPayment - interest;
        balance -= principalPaid;
        schedule.push({ month, payment: monthlyPayment, principal: principalPaid, interest, balance: balance });
        totalInterest += interest;
    }

    if (B > 0) {
        schedule.push({ month: n + 1, payment: B, principal: B, interest: 0, balance: 0 });
    }

    const totalPayment = monthlyPayment * n + B;

    return { monthlyPayment, totalPayment, totalInterest, amortizationSchedule: schedule };
}

export interface LoanPayoffParams {
    currentBalance: number
    interestRate: number
    paymentType: "amount" | "time"

    monthlyPayment?: number
    nextPaymentDate?: string
    paymentIncrease?: number

    targetYears?: number
    targetMonths?: number
}

export interface LoanPayoffResult {
    monthsToPayoff: number
    totalInterest: number
    totalBalance: number
    loanPayoffDate: string
    calculatedMonthlyPayment?: number
    amortizationSchedule?: AmortizationEntry[]
}

export function calculateLoanPayoff(params: LoanPayoffParams): LoanPayoffResult {
    const { currentBalance, interestRate, paymentType, monthlyPayment, nextPaymentDate, paymentIncrease = 0, targetYears = 0, targetMonths = 0 } = params

    const monthlyRate = interestRate / 100 / 12

    if (paymentType === "amount") {
        return calculatePayoffByAmount({
            currentBalance,
            monthlyRate,
            monthlyPayment: monthlyPayment!,
            paymentIncrease,
            nextPaymentDate: nextPaymentDate || new Date().toISOString().split('T')[0]
        })
    } else {
        return calculatePayoffByTime({
            currentBalance,
            monthlyRate,
            targetYears,
            targetMonths
        })
    }
}

function calculatePayoffByAmount(params: { currentBalance: number, monthlyRate: number, monthlyPayment: number, paymentIncrease: number, nextPaymentDate: string }): LoanPayoffResult {
    const { currentBalance, monthlyRate, monthlyPayment, paymentIncrease, nextPaymentDate } = params

    const formatDateString = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    let balance = currentBalance
    let totalInterest = 0
    let paymentNumber = 1
    let currentDate = new Date(nextPaymentDate)
    let currentMonthlyPayment = monthlyPayment

    const amortizationSchedule: AmortizationEntry[] = []

    while (balance > 0.01) {
        const interestPayment = balance * monthlyRate
        let principalPayment = currentMonthlyPayment - interestPayment

        if (principalPayment >= balance) {
            principalPayment = balance
            const finalTotalPayment = principalPayment + interestPayment

            amortizationSchedule.push({
                paymentNumber,
                paymentDate: formatDateString(currentDate),
                beginningBalance: balance,
                monthlyPayment: finalTotalPayment,
                principalPayment,
                interestPayment,
                extraPayment: 0,
                endingBalance: 0,
                cumulativeInterest: totalInterest + interestPayment
            })

            totalInterest += interestPayment
            balance = 0
            break
        }

        balance -= principalPayment
        totalInterest += interestPayment

        amortizationSchedule.push({
            paymentNumber,
            paymentDate: formatDateString(currentDate),
            beginningBalance: balance + principalPayment,
            monthlyPayment: currentMonthlyPayment,
            principalPayment,
            interestPayment,
            extraPayment: 0,
            endingBalance: balance,
            cumulativeInterest: totalInterest
        })

        if (paymentNumber % 12 === 0 && paymentIncrease > 0) {
            currentMonthlyPayment = currentMonthlyPayment * (1 + paymentIncrease / 100)
        }

        currentDate.setMonth(currentDate.getMonth() + 1)
        paymentNumber++
    }

    const monthsToPayoff = paymentNumber - 1
    const totalBalance = currentBalance + totalInterest
    const loanPayoffDate = formatDateString(currentDate)

    return {
        monthsToPayoff,
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalBalance: parseFloat(totalBalance.toFixed(2)),
        loanPayoffDate,
        amortizationSchedule
    }
}

function calculatePayoffByTime(params: { currentBalance: number, monthlyRate: number, targetYears: number, targetMonths: number }): LoanPayoffResult {
    const { currentBalance, monthlyRate, targetYears, targetMonths } = params

    const totalTargetMonths = Math.round((targetYears * 12) + targetMonths)

    if (totalTargetMonths <= 0) {
        throw new Error("Target time must be greater than 0")
    }

    let requiredPayment: number

    if (monthlyRate === 0) {
        requiredPayment = currentBalance / totalTargetMonths
    } else {
        requiredPayment = currentBalance *
            (monthlyRate * Math.pow(1 + monthlyRate, totalTargetMonths)) /
            (Math.pow(1 + monthlyRate, totalTargetMonths) - 1)
    }

    const formatDateString = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    let balance = currentBalance
    let totalInterest = 0
    let currentDate = new Date()
    const amortizationSchedule: AmortizationEntry[] = []

    for (let paymentNumber = 1; paymentNumber <= totalTargetMonths; paymentNumber++) {
        const interestPayment = balance * monthlyRate
        let principalPayment = requiredPayment - interestPayment

        if (paymentNumber === totalTargetMonths) {
            principalPayment = balance
            const finalTotalPayment = principalPayment + interestPayment

            amortizationSchedule.push({
                paymentNumber,
                paymentDate: formatDateString(currentDate),
                beginningBalance: balance,
                monthlyPayment: finalTotalPayment,
                principalPayment,
                interestPayment,
                extraPayment: 0,
                endingBalance: 0,
                cumulativeInterest: totalInterest + interestPayment
            })

            totalInterest += interestPayment
            balance = 0
        } else {
            balance -= principalPayment
            totalInterest += interestPayment

            amortizationSchedule.push({
                paymentNumber,
                paymentDate: formatDateString(currentDate),
                beginningBalance: balance + principalPayment,
                monthlyPayment: requiredPayment,
                principalPayment,
                interestPayment,
                extraPayment: 0,
                endingBalance: balance,
                cumulativeInterest: totalInterest
            })
        }

        currentDate.setMonth(currentDate.getMonth() + 1)
    }

    const totalBalance = currentBalance + totalInterest
    const loanPayoffDate = formatDateString(currentDate)

    return {
        monthsToPayoff: totalTargetMonths,
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalBalance: parseFloat(totalBalance.toFixed(2)),
        loanPayoffDate,
        calculatedMonthlyPayment: parseFloat(requiredPayment.toFixed(2)),
        amortizationSchedule
    }
}

export interface MortgageParams {
    principal: number
    rate: number
    term: number
    interestInterval: "monthly" | "yearly"
}

export interface MortgageSubResult {
    monthlyPayment: number
    yearlyPayment: number
    totalPayment: number
    totalInterest: number
}

export interface MortgageResult {
    capitalAndRepayment: MortgageSubResult
    interestOnly: MortgageSubResult
}

export function calculateMortgage(params: MortgageParams): MortgageResult {
    const { principal, rate, term, interestInterval } = params

    const n = interestInterval === "monthly" ? 12 : 1
    const totalPeriods = term * n
    const periodicRate = rate / 100 / n

    const monthlyPaymentRepayment = (principal * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / (Math.pow(1 + periodicRate, totalPeriods) - 1)
    const totalPaymentRepayment = monthlyPaymentRepayment * totalPeriods
    const totalInterestRepayment = totalPaymentRepayment - principal

    const monthlyPaymentInterestOnly = principal * periodicRate
    const totalPaymentInterestOnly = monthlyPaymentInterestOnly * totalPeriods
    const totalInterestInterestOnly = totalPaymentInterestOnly

    return {
        capitalAndRepayment: {
            monthlyPayment: parseFloat(monthlyPaymentRepayment.toFixed(2)),
            yearlyPayment: parseFloat((monthlyPaymentRepayment * 12).toFixed(2)),
            totalPayment: parseFloat(totalPaymentRepayment.toFixed(2)),
            totalInterest: parseFloat(totalInterestRepayment.toFixed(2)),
        },
        interestOnly: {
            monthlyPayment: parseFloat(monthlyPaymentInterestOnly.toFixed(2)),
            yearlyPayment: parseFloat((monthlyPaymentInterestOnly * 12).toFixed(2)),
            totalPayment: parseFloat(totalPaymentInterestOnly.toFixed(2)),
            totalInterest: parseFloat(totalInterestInterestOnly.toFixed(2)),
        },
    }
}

export interface MortgageRefinanceParams {
    currentBalance: number
    currentMonthlyPayment: number
    currentRate: number
    refinanceRate: number
    refinanceTerm: number
    closingCosts?: number
    financeClosingCosts?: boolean
}

export interface MortgageRefinanceResult {
    newMonthlyPayment: number
    monthlyPaymentReduction: number
    currentTotalInterest: number
    refinanceTotalInterest: number
    interestSaved: number
    netSavings: number
}

export function calculateMortgageRefinance(params: MortgageRefinanceParams): MortgageRefinanceResult {
    const { currentBalance, currentMonthlyPayment, currentRate, refinanceRate, refinanceTerm, closingCosts = 0, financeClosingCosts = false } = params

    const monthlyRateCurrent = currentRate / 100 / 12
    const monthlyRateRefinance = refinanceRate / 100 / 12

    const currentRemainingTerm = Math.log(currentMonthlyPayment / (currentMonthlyPayment - monthlyRateCurrent * currentBalance)) / Math.log(1 + monthlyRateCurrent)

    const currentTotalPaid = currentMonthlyPayment * currentRemainingTerm
    const currentTotalInterest = currentTotalPaid - currentBalance

    const refinancePrincipal = financeClosingCosts ? currentBalance + closingCosts : currentBalance
    const refinanceMonths = refinanceTerm * 12

    const newMonthlyPayment = (refinancePrincipal * monthlyRateRefinance * Math.pow(1 + monthlyRateRefinance, refinanceMonths)) / (Math.pow(1 + monthlyRateRefinance, refinanceMonths) - 1)
    const refinanceTotalPaid = newMonthlyPayment * refinanceMonths
    const refinanceTotalInterest = refinanceTotalPaid - refinancePrincipal

    const interestSaved = currentTotalInterest - refinanceTotalInterest
    const monthlyPaymentReduction = currentMonthlyPayment - newMonthlyPayment
    const netSavings = financeClosingCosts ? interestSaved : interestSaved - closingCosts

    return {
        newMonthlyPayment: parseFloat(newMonthlyPayment.toFixed(2)),
        monthlyPaymentReduction: parseFloat(
            monthlyPaymentReduction.toFixed(2)
        ),
        currentTotalInterest: parseFloat(currentTotalInterest.toFixed(2)),
        refinanceTotalInterest: parseFloat(refinanceTotalInterest.toFixed(2)),
        interestSaved: parseFloat(interestSaved.toFixed(2)),
        netSavings: parseFloat(netSavings.toFixed(2))
    }
}

export interface GeneralIRRParams {
    initialInvestment: number
    finalReturn: number
    years: number
    months: number
    regularTransfer: number
    transferFrequency: "weekly" | "monthly" | "quarterly" | "half-yearly" | "yearly"
}

export interface CashFlowIRRParams {
    cashFlows: number[]
}

export interface MultipleIRRParams {
    cashFlows: number[]
}

export function calculateGeneralIRR(params: GeneralIRRParams): number {
    const {
        initialInvestment,
        finalReturn,
        years,
        months,
        regularTransfer = 0,
    } = params

    if (initialInvestment <= 0 || finalReturn <= 0 || (years === 0 && months === 0)) return 0

    const totalTimeInYears = years + (months / 12)

    if (!regularTransfer || regularTransfer === 0) {
        const irr = Math.pow(finalReturn / initialInvestment, 1 / totalTimeInYears) - 1
        return parseFloat((irr * 100).toFixed(4))
    }

    return calculateIRRWithRegularTransfers(params, totalTimeInYears)
}

function calculateIRRWithRegularTransfers(params: GeneralIRRParams, totalTimeInYears: number): number {
    const { initialInvestment, finalReturn, regularTransfer, transferFrequency } = params

    const transfersPerYear = getTransfersPerYear(transferFrequency!)
    const totalTransfers = Math.floor(totalTimeInYears * transfersPerYear)
    const timeInterval = 1 / transfersPerYear

    let rate = 0.1
    let tolerance = 0.000001
    let maxIterations = 1000
    let iteration = 0

    while (iteration < maxIterations) {
        let npv = -initialInvestment
        let npvDerivative = 0

        for (let i = 1; i <= totalTransfers; i++) {
            const time = i * timeInterval
            const presentValue = -regularTransfer / Math.pow(1 + rate, time)
            const derivative = regularTransfer * time / Math.pow(1 + rate, time + 1)

            npv += presentValue
            npvDerivative += derivative
        }

        const finalPresentValue = finalReturn / Math.pow(1 + rate, totalTimeInYears)
        const finalDerivative = -finalReturn * totalTimeInYears / Math.pow(1 + rate, totalTimeInYears + 1)

        npv += finalPresentValue
        npvDerivative += finalDerivative

        if (Math.abs(npv) < tolerance) {
            return parseFloat((rate * 100).toFixed(4))
        }

        if (Math.abs(npvDerivative) < tolerance) {
            break
        }

        rate = rate - npv / npvDerivative
        iteration++
    }

    return calculateApproximateIRR(params, totalTimeInYears)
}

function getTransfersPerYear(frequency: string): number {
    switch (frequency) {
        case "weekly":
            return 52
        case "monthly":
            return 12
        case "quarterly":
            return 4
        case "half-yearly":
            return 2
        case "yearly":
            return 1
        default:
            return 12
    }
}

function calculateApproximateIRR(params: GeneralIRRParams, totalTimeInYears: number): number {
    const { initialInvestment, finalReturn, regularTransfer, transferFrequency } = params

    const transfersPerYear = getTransfersPerYear(transferFrequency!)
    const totalTransfers = Math.floor(totalTimeInYears * transfersPerYear)
    const totalInvested = initialInvestment + (regularTransfer! * totalTransfers)

    const effectiveTime = totalTimeInYears * 0.75
    const approximateIRR = Math.pow(finalReturn / totalInvested, 1 / effectiveTime) - 1

    return parseFloat((approximateIRR * 100).toFixed(4))
}

export function calculateCashFlowIRR(params: CashFlowIRRParams): number {
    const { cashFlows } = params
    let rate = 0.1
    const tolerance = 1e-6
    const maxIterations = 100

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0
        let dnpv = 0

        for (let j = 0; j < cashFlows.length; j++) {
            npv += cashFlows[j] / Math.pow(1 + rate, j)
            dnpv -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1)
        }

        const newRate = rate - npv / dnpv
        if (Math.abs(newRate - rate) < tolerance) {
            return newRate * 100
        }

        rate = newRate
    }

    return rate * 100
}

export function calculateReturnMultipleIRR(returnMultiple: number, years: number, months: number): number {
    const n = years + months / 12
    if (n <= 0) return 0
    return (Math.pow(returnMultiple, 1 / n) - 1) * 100
}

export interface MarginParams {
    stockPrice: number
    shares: number
    marginRate: number
    maintenanceMargin: number
}

export interface MarginResult {
    totalValue: number
    marginRequired: number
    buyingPower: number
    maintenanceRequired: number
    marginCallPrice: number
}

export function calculateMargin(params: MarginParams): MarginResult {
    const { stockPrice, shares, marginRate, maintenanceMargin } = params
    const totalValue = stockPrice * shares
    const marginRequired = totalValue * (marginRate / 100)
    const buyingPower = totalValue / (marginRate / 100)
    const maintenanceRequired = totalValue * (maintenanceMargin / 100)

    const loanAmount = totalValue - marginRequired
    const marginCallPrice = loanAmount / (shares * (1 - maintenanceMargin / 100))

    return {
        totalValue,
        marginRequired,
        buyingPower,
        maintenanceRequired,
        marginCallPrice
    }
}

export function calculateForexCompounding(initialDeposit: number, monthlyReturn: number, months: number, monthlyDeposit = 0): CompoundInterestResult {
    let balance = initialDeposit
    let totalInterest = 0
    let totalDeposits = initialDeposit
    const totalWithdrawals = 0

    const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = []

    for (let month = 1; month <= months; month++) {
        if (monthlyDeposit > 0) {
            balance += monthlyDeposit
            totalDeposits += monthlyDeposit
        }

        const monthlyGain = balance * (monthlyReturn / 100)
        balance += monthlyGain
        totalInterest += monthlyGain

        if (month % 12 === 0) {
            yearlyBreakdown.push({
                year: month / 12,
                balance,
                interestEarned: totalInterest,
                deposits: totalDeposits,
                withdrawals: totalWithdrawals
            })
        }
    }

    return {
        finalAmount: balance,
        totalInterest,
        totalDeposits,
        totalWithdrawals,
        yearlyBreakdown
    }
}

export interface InterestRateParams {
    principal: number;
    secondFigure: number;
    typeOfSecondFigure: "end-balance" | "interest" | "interest-rate";
    years: number;
    months: number;
}

export interface InterestRateResult {
    nominalRate: number;
    apyRate: number;
    totalInterest: number;
}

export function calculateInterestRate(params: InterestRateParams): InterestRateResult {
    const { principal, secondFigure, typeOfSecondFigure, years, months } = params;

    const totalMonths = years * 12 + months;
    if (principal <= 0 || totalMonths <= 0) {
        return { nominalRate: 0, apyRate: 0, totalInterest: 0 };
    }

    let endBalance: number;

    switch (typeOfSecondFigure) {
        case "end-balance":
            endBalance = secondFigure;
            break;
        case "interest":
            endBalance = principal + secondFigure;
            break;
        case "interest-rate":
            const monthlyRateFromRate = (secondFigure / 100) / 12;
            endBalance = principal * Math.pow(1 + monthlyRateFromRate, totalMonths);
            break;
        default:
            throw new Error("Invalid typeOfSecondFigure");
    }

    if (endBalance <= principal) {
        return { nominalRate: 0, apyRate: 0, totalInterest: 0 };
    }

    const monthlyRate = Math.pow(endBalance / principal, 1 / totalMonths) - 1;
    const nominalRate = monthlyRate * 12 * 100;
    const apyRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
    const totalInterest = endBalance - principal;

    return {
        nominalRate: parseFloat(nominalRate.toFixed(10)),
        apyRate: parseFloat(apyRate.toFixed(10)),
        totalInterest: parseFloat(totalInterest.toFixed(2))
    };
}

export function convertLargeNumbers(value: number, fromUnit: string, toUnit: string): number {
    const units = {
        ones: 1,
        thousands: 1000,
        lakhs: 100000,
        millions: 1000000,
        crores: 10000000,
        billions: 1000000000,
        trillions: 1000000000000,
    }

    const fromMultiplier = units[fromUnit as keyof typeof units] || 1
    const toMultiplier = units[toUnit as keyof typeof units] || 1

    return (value * fromMultiplier) / toMultiplier
}

export interface MoneyCountResult {
    total: number
    breakdown: { [key: string]: { count: number; value: number; total: number } }
    counter: number
}

export function calculateMoneyCount(denominations: { [key: string]: number }): MoneyCountResult {
    const denominationValues = {
        ones: 1.0,
        twos: 2.0,
        fives: 5.0,
        tens: 10.0,
        twenties: 20.0,
        fifties: 50.0,
        hundreds: 100.0,
        fiveHundreds: 500.0,
        twoThousands: 2000.0
    }

    let total = 0
    const breakdown: MoneyCountResult["breakdown"] = {}
    let counter = 0

    Object.entries(denominations).forEach(([denom, count]) => {
        const value = denominationValues[denom as keyof typeof denominationValues] || 0
        const subtotal = count * value
        total += subtotal
        counter += count

        breakdown[denom] = {
            count,
            value,
            total: subtotal,
        }
    })

    return {
        total,
        breakdown,
        counter
    }
}

export function calculatePricePerSquareFoot(totalPrice: number, squareFeet: number): number {
    return totalPrice / squareFeet
}

export function calculateSquareFeetFromPrice(totalPrice: number, pricePerSqFt: number): number {
    return totalPrice / pricePerSqFt
}

export function calculateTotalPriceFromSqFt(squareFeet: number, pricePerSqFt: number): number {
    return squareFeet * pricePerSqFt
}

export interface CashBackParams {
    purchaseAmount: number
    cashBackRate: number
    cashBackLimit?: number
}

export interface CashBackResult {
    cashBackEarned: number
    effectiveDiscount: number
}

export function calculateCashBack({ purchaseAmount, cashBackRate, cashBackLimit = 0 }: CashBackParams): CashBackResult {
    let cashBackEarned = purchaseAmount * (cashBackRate / 100)
    if (cashBackLimit !== 0 && cashBackLimit < cashBackEarned)
        cashBackEarned = cashBackLimit
    const effectiveDiscount = (cashBackEarned / purchaseAmount) * 100

    return {
        cashBackEarned,
        effectiveDiscount
    }
}

export interface MMAParams {
    principal: number
    rate: number
    years: number
    months: number
    compoundFrequency: number
    depositAmount?: number
    depositFrequency?: number
}

export interface MMAResult {
    finalBalance: number
    totalInterest: number
    totalDeposits: number
}

export function calculateMMA(params: MMAParams): MMAResult {
    const { principal, rate, years, months, compoundFrequency, depositAmount = 0, depositFrequency = 0 } = params

    const totalTimeInYears = years + (months / 12)
    const totalPeriods = compoundFrequency * totalTimeInYears
    const wholePeriods = Math.floor(totalPeriods)
    const partialPeriod = totalPeriods - wholePeriods

    const periodRate = Math.pow(1 + rate / 100, 1 / compoundFrequency) - 1
    const depositEveryNPeriods = depositFrequency ? compoundFrequency / depositFrequency : 0
    const depositPerPeriod = depositAmount

    let balance = principal
    let totalInterest = 0
    let totalDeposits = principal

    for (let period = 1; period <= wholePeriods; period++) {
        const interest = balance * periodRate
        balance += interest
        totalInterest += interest

        if (depositFrequency && period % depositEveryNPeriods === 0) {
            balance += depositPerPeriod
            totalDeposits += depositPerPeriod
        }
    }

    if (partialPeriod > 0) {
        const partialInterest = balance * periodRate * partialPeriod
        balance += partialInterest
        totalInterest += partialInterest
    }

    return {
        finalBalance: parseFloat(balance.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalDeposits: parseFloat(totalDeposits.toFixed(2)),
    }
}