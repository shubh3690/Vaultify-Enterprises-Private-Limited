export interface CompoundInterestParams {
    principal: number
    rate: number
    ratePeriod: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
    compoundingFrequency: number
    years: number
    months: number
    depositAmount: number
    depositFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly"
    depositIncreaseRate: number
    depositTime: "beginning" | "ending"
    withdrawalAmount: number
    withdrawalFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly"
    withdrawalType: "fixed-amount" | "%-of-balance" | "%-of-interest"
    withdrawalIncreaseRate: number
}

export interface CompoundInterestResult {
    finalAmount: number
    totalInterest: number
    totalDeposits: number
    totalWithdrawals: number
    monthlyBreakdown: Array<{
        month: number
        balance: number
        interestEarned: number
        deposits: number
        withdrawals: number
    }>
}

export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
    const { principal, rate, ratePeriod, compoundingFrequency, years, months, depositAmount, depositFrequency, depositIncreaseRate, depositTime, withdrawalAmount, withdrawalFrequency, withdrawalType } = params;
    let { withdrawalIncreaseRate } = params

    if (withdrawalType !== "fixed-amount")
        withdrawalIncreaseRate = 0

    let annualRate: number;
    switch (ratePeriod) {
        case "daily":
            annualRate = rate * 365;
            break;
        case "weekly":
            annualRate = rate * 52;
            break;
        case "monthly":
            annualRate = rate * 12;
            break;
        case "quarterly":
            annualRate = rate * 4;
            break;
        case "yearly":
            annualRate = rate;
            break;
    }

    annualRate = annualRate / 100;
    const depositIncreaseRateDecimal = depositIncreaseRate / 100;
    const withdrawalIncreaseRateDecimal = withdrawalIncreaseRate / 100;
    const totalMonths = years * 12 + months;

    let balance = principal;
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalInterest = 0;
    let currentDepositAmount = depositAmount;
    let currentWithdrawalAmount = withdrawalAmount;
    let periodicInterestAccumulator = 0;

    const monthlyBreakdown: Array<{
        month: number;
        balance: number;
        interestEarned: number;
        deposits: number;
        withdrawals: number;
    }> = [];

    for (let month = 1; month <= totalMonths; month++) {
        let monthlyInterest = 0;
        let monthlyDeposits = 0;
        let monthlyWithdrawals = 0;

        if (depositIncreaseRate > 0 && month > 1) {
            if (depositTime === "beginning") {
                if (month % 12 === 1) {
                    currentDepositAmount *= (1 + depositIncreaseRateDecimal);
                }
            }
        }

        let isDepositMonth = false;
        if (depositAmount > 0) {
            if (depositTime === "beginning") {
                switch (depositFrequency) {
                    case "monthly":
                        isDepositMonth = true;
                        break;
                    case "quarterly":
                        isDepositMonth = month % 3 === 1;
                        break;
                    case "half-yearly":
                        isDepositMonth = month % 6 === 1;
                        break;
                    case "yearly":
                        isDepositMonth = month % 12 === 1;
                        break;
                }
            } else {
                switch (depositFrequency) {
                    case "monthly":
                        isDepositMonth = true;
                        break;
                    case "quarterly":
                        isDepositMonth = month % 3 === 0;
                        break;
                    case "half-yearly":
                        isDepositMonth = month % 6 === 0;
                        break;
                    case "yearly":
                        isDepositMonth = month % 12 === 0;
                        break;
                }
            }
        }

        if (isDepositMonth && depositTime === "beginning") {
            balance += currentDepositAmount;
            monthlyDeposits = currentDepositAmount;
            totalDeposits += currentDepositAmount;
        }

        const periodRate = annualRate / compoundingFrequency;
        if (compoundingFrequency >= 12) {
            const periodsThisMonth = compoundingFrequency / 12;
            const wholePeriodsThisMonth = Math.floor(periodsThisMonth);
            const fractionalPeriod = periodsThisMonth - wholePeriodsThisMonth;

            for (let i = 0; i < wholePeriodsThisMonth; i++) {
                const interest = balance * periodRate;
                balance += interest;
                monthlyInterest += interest;
            }

            if (fractionalPeriod > 0) {
                const interest = balance * periodRate * fractionalPeriod;
                balance += interest;
                monthlyInterest += interest;
            }
        } else {
            const monthlyEquivalentRate = Math.pow(1 + annualRate, 1 / 12) - 1;
            const interest = balance * monthlyEquivalentRate;
            balance += interest;
            monthlyInterest += interest;
        }

        totalInterest += monthlyInterest;
        periodicInterestAccumulator += monthlyInterest;

        if (isDepositMonth && depositTime === "ending") {
            balance += currentDepositAmount;
            monthlyDeposits = currentDepositAmount;
            totalDeposits += currentDepositAmount;
        }

        if (depositIncreaseRate > 0 && depositTime === "ending") {
            if (month % 12 === 0 && isDepositMonth) {
                currentDepositAmount *= (1 + depositIncreaseRateDecimal);
            }
        }

        const isWithdrawalMonth = withdrawalAmount > 0 && (
            (withdrawalFrequency === "monthly") ||
            (withdrawalFrequency === "quarterly" && month % 3 === 0) ||
            (withdrawalFrequency === "half-yearly" && month % 6 === 0) ||
            (withdrawalFrequency === "yearly" && month % 12 === 0)
        );

        if (isWithdrawalMonth) {
            let withdrawalThisMonth = 0;

            switch (withdrawalType) {
                case "fixed-amount":
                    withdrawalThisMonth = Math.min(currentWithdrawalAmount, balance);
                    break;
                case "%-of-balance":
                    const percentageAmount = balance * (currentWithdrawalAmount / 100);
                    withdrawalThisMonth = Math.round(percentageAmount * 10000) / 10000;
                    withdrawalThisMonth = Math.round(withdrawalThisMonth * 100) / 100;
                    break;
                case "%-of-interest":
                    const interestPercentage = periodicInterestAccumulator * (currentWithdrawalAmount / 100);
                    withdrawalThisMonth = Math.round(interestPercentage * 10000) / 10000;
                    withdrawalThisMonth = Math.round(withdrawalThisMonth * 100) / 100;
                    break;
            }

            withdrawalThisMonth = Math.min(withdrawalThisMonth, balance);
            balance -= withdrawalThisMonth;
            monthlyWithdrawals = withdrawalThisMonth;
            totalWithdrawals += withdrawalThisMonth;

            if (withdrawalType === "%-of-interest") {
                periodicInterestAccumulator = 0;
            }

            if (month % 12 === 0 && withdrawalType === "fixed-amount" && withdrawalIncreaseRate > 0) {
                currentWithdrawalAmount *= (1 + withdrawalIncreaseRateDecimal);
            }
        }

        monthlyBreakdown.push({
            month,
            balance: Math.round(balance * 100) / 100,
            interestEarned: Math.round(monthlyInterest * 100) / 100,
            deposits: Math.round(monthlyDeposits * 100) / 100,
            withdrawals: Math.round(monthlyWithdrawals * 100) / 100
        });
    }

    return {
        finalAmount: Math.round(balance * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalDeposits: Math.round(totalDeposits * 100) / 100,
        totalWithdrawals: Math.round(totalWithdrawals * 100) / 100,
        monthlyBreakdown
    };
}

export interface DailyCompoundParams {
    principal: number
    rate: number
    rateInterval: "daily" | "weekly" | "yearly"
    years: number
    months: number
    days: number
    dailyReinvestmentRate: number
    includedDays: Array<string>
    additionalContributions: number
    contributionFrequency: number
    startDate: string
}

export interface DailyCompoundInterestResult {
    finalAmount: number
    totalInterest: number
    totalDeposits: number
    totalWithdrawals: number
    totalDays: number
    businessDays: number
    monthlyBreakdown: Array<{
        month: number
        balance: number
        interestEarned: number
        deposits: number
        withdrawals: number
    }>
}

export function calculateDailyCompoundInterest(params: DailyCompoundParams): DailyCompoundInterestResult {
    const { principal, rate, rateInterval, years, months, days, dailyReinvestmentRate, includedDays, additionalContributions, contributionFrequency, startDate } = params;

    const getDailyRate = (rate: number, interval: string): number => {
        switch (interval) {
            case "daily": return rate / 100;
            case "weekly": return rate / (100 * 7);
            case "yearly": return rate / (100 * 365);
            default: return rate / (100 * 365);
        }
    };

    const getDayAbbreviation = (date: Date): string => {
        const days = ["SU", "M", "TU", "W", "TH", "F", "SA"];
        return days[date.getDay()];
    };

    const shouldReceiveInterest = (date: Date): boolean => {
        const dayAbbrev = getDayAbbreviation(date);
        return includedDays.includes(dayAbbrev);
    };

    const startDateObj = new Date(startDate);
    const endDate = new Date(startDateObj);

    endDate.setFullYear(endDate.getFullYear() + years);
    endDate.setMonth(endDate.getMonth() + months);
    endDate.setDate(endDate.getDate() + days);

    const totalDays = Math.floor((endDate.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    const daysBetweenContributions = contributionFrequency > 0 ? Math.floor(365 / contributionFrequency) : 0;
    const dailyRate = getDailyRate(rate, rateInterval);

    let currentBalance = principal;
    let totalInterest = 0;
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    const monthlyBreakdown: Array<{
        month: number;
        balance: number;
        interestEarned: number;
        deposits: number;
        withdrawals: number;
    }> = [];

    let currentDate = new Date(startDateObj);
    let daysSinceLastContribution = 0;
    let currentMonth = 0;
    let monthlyInterest = 0;
    let monthlyDeposits = 0;
    let monthlyWithdrawals = 0;
    let lastMonthYear = currentDate.getFullYear();
    let lastMonth = currentDate.getMonth();
    let businessDays = 0;

    for (let day = 0; day < totalDays; day++) {
        const isNewMonth = currentDate.getMonth() !== lastMonth || currentDate.getFullYear() !== lastMonthYear;

        if (isNewMonth && day > 0) {
            monthlyBreakdown.push({
                month: currentMonth,
                balance: currentBalance,
                interestEarned: monthlyInterest,
                deposits: monthlyDeposits,
                withdrawals: monthlyWithdrawals
            });

            currentMonth++;
            monthlyInterest = 0;
            monthlyDeposits = 0;
            monthlyWithdrawals = 0;
            lastMonth = currentDate.getMonth();
            lastMonthYear = currentDate.getFullYear();
        }

        daysSinceLastContribution++;
        if (contributionFrequency > 0 && daysSinceLastContribution >= daysBetweenContributions) {
            if (additionalContributions !== 0) {
                currentBalance += additionalContributions;
                if (additionalContributions > 0) {
                    totalDeposits += additionalContributions;
                    monthlyDeposits += additionalContributions;
                } else {
                    totalWithdrawals += Math.abs(additionalContributions);
                    monthlyWithdrawals += Math.abs(additionalContributions);
                }
            }
            daysSinceLastContribution = 0;
        }

        if (shouldReceiveInterest(currentDate)) {
            const dailyInterest = currentBalance * dailyRate;

            const reinvestedAmount = dailyInterest * (dailyReinvestmentRate / 100);
            const withdrawnAmount = dailyInterest * (1 - dailyReinvestmentRate / 100);

            currentBalance += reinvestedAmount;
            totalInterest += dailyInterest;
            monthlyInterest += dailyInterest;
            businessDays++;

            if (withdrawnAmount > 0) {
                totalWithdrawals += withdrawnAmount;
                monthlyWithdrawals += withdrawnAmount;
            }
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    monthlyBreakdown.push({
        month: currentMonth,
        balance: currentBalance,
        interestEarned: monthlyInterest,
        deposits: monthlyDeposits,
        withdrawals: monthlyWithdrawals
    });

    return {
        finalAmount: Math.round(currentBalance * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalDeposits: Math.round(totalDeposits * 100) / 100,
        totalWithdrawals: Math.round(totalWithdrawals * 100) / 100,
        totalDays,
        businessDays,
        monthlyBreakdown
    };
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

function calculateWithdrawalAmount(balance: number, interestForCalculation: number, withdrawalAmount: number, withdrawalType: string): number {
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
    const { principal, nominalRate, years, months, compoundingFrequency, regularDeposit = 0, depositRate } = params;

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
    regularInvestment: number
    investmentFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly"
    expectedReturn: number
    years: number
    months: number
    initialBalance: number
    investmentIncreaseRate: number
}

export interface SIPResult {
    maturityAmount: number
    totalInvestment: number
    totalReturns: number
    additionalDeposits: number
}

export function calculateSIP(params: SIPParams): SIPResult {
    const { regularInvestment, investmentFrequency, expectedReturn, years, months, initialBalance, investmentIncreaseRate } = params;

    const interval: number = {
        monthly: 1,
        quarterly: 3,
        "half-yearly": 6,
        yearly: 12
    }[investmentFrequency];

    const totalMonths = years * 12 + months;
    const monthlyRate = expectedReturn / 12 / 100;

    let balance = initialBalance;
    let totalInvestment = 0;
    let baseInvestment = 0;

    for (let m = 1; m <= totalMonths; m++) {
        balance *= 1 + monthlyRate;
        const isDepositMonth = m % interval === 0;

        if (isDepositMonth) {
            const yearsElapsed = Math.floor((m - 1) / 12);
            const deposit = regularInvestment * Math.pow(1 + investmentIncreaseRate / 100, yearsElapsed);

            balance += deposit;
            totalInvestment += deposit;
            baseInvestment += regularInvestment;
        }
    }

    const maturityAmount = Math.round(balance * 100) / 100;
    const additionalDeposits = Math.round((totalInvestment - baseInvestment) * 100) / 100;
    const totalReturns = Math.round((maturityAmount - initialBalance - totalInvestment) * 100) / 100;

    return {
        maturityAmount,
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        totalReturns,
        additionalDeposits
    };
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

export interface SavingsCalculatorParams {
    initialBalance: number
    rate: number
    rateInterval: "monthly" | "yearly"
    rateType: "nominal" | "apy"
    compoundingFrequency: number // number / year
    years: number
    months: number
    depositAmount: number
    depositFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly"
    depositIncreaseRate: number
    withdrawalAmount: number
    withdrawalFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly"
    withdrawalType: "fixed-amount" | "%-of-balance" | "%-of-interest"
    withdrawalIncreaseRate: number
}

export interface SavingsCalculatorResult {
    finalBalance: number
    totalInterest: number
    additionalDeposits: number
    totalWithdrawals: number
    amortizationSchedule: Array<{
        month: number
        payment: number
        principal: number
        interest: number
        balance: number
    }>
}

// export function calculateSavings(params: SavingsCalculatorParams): SavingsCalculatorResult {

// }

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
    const { initialInvestment, finalReturn, years, months, regularTransfer = 0 } = params

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
    value1: number;
    value2: number;
    input1Type: "cost" | "selling-price" | "margin" | "markup";
    input2Type: "cost" | "selling-price" | "margin" | "markup";
}

export interface MarginResult {
    cost: number;
    sellingPrice: number;
    profit: number;
    marginPercentage: number;
    markupPercentage: number;
}

export function calculateMargin(params: MarginParams): MarginResult {
    let cost = 0;
    let sellingPrice = 0;
    let marginPercentage = 0;
    let markupPercentage = 0;

    if (params.input1Type === "cost") cost = params.value1;
    else if (params.input1Type === "selling-price") sellingPrice = params.value1;
    else if (params.input1Type === "margin") marginPercentage = params.value1;
    else if (params.input1Type === "markup") markupPercentage = params.value1;

    if (params.input2Type === "cost") cost = params.value2;
    else if (params.input2Type === "selling-price") sellingPrice = params.value2;
    else if (params.input2Type === "margin") marginPercentage = params.value2;
    else if (params.input2Type === "markup") markupPercentage = params.value2;

    if (cost > 0 && sellingPrice > 0) {
        const profit = sellingPrice - cost;
        marginPercentage = (profit / sellingPrice) * 100;
        markupPercentage = (profit / cost) * 100;
    } else if (cost > 0 && marginPercentage > 0) {
        sellingPrice = cost / (1 - marginPercentage / 100);
    } else if (sellingPrice > 0 && marginPercentage > 0) {
        cost = sellingPrice * (1 - marginPercentage / 100);
    } else if (cost > 0 && markupPercentage > 0) {
        sellingPrice = cost * (1 + markupPercentage / 100);
    } else if (sellingPrice > 0 && markupPercentage > 0) {
        cost = sellingPrice / (1 + markupPercentage / 100);
    }

    const profit = sellingPrice - cost;
    const finalMarginPercentage = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const finalMarkupPercentage = cost > 0 ? (profit / cost) * 100 : 0;

    return {
        cost: Math.round(cost * 100) / 100,
        sellingPrice: Math.round(sellingPrice * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        marginPercentage: Math.round(finalMarginPercentage * 100) / 100,
        markupPercentage: Math.round(finalMarkupPercentage * 100) / 100,
    };
}

export interface ForexParams {
    principal: number
    rate: number
    rateInterval: "daily" | "weekly" | "monthly" | "yearly"
    compoundingFrequency: number
    years: number
    months: number
    additionalDeposits: number
    additionalDepositFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly"
}

export interface ForexResult {
    finalBalance: number
    totalEarning: number
    initialBalance: number
    additionalDeposits: number
}

export function calculateForexCompounding(params: ForexParams): ForexResult {
    const { principal, rate, rateInterval, compoundingFrequency, years, months, additionalDeposits, additionalDepositFrequency } = params;

    const totalTimeInYears = years + (months / 12);

    let annualRate: number;
    switch (rateInterval) {
        case "daily":
            annualRate = rate * 365;
            break;
        case "weekly":
            annualRate = rate * 52;
            break;
        case "monthly":
            annualRate = rate * 12;
            break;
        case "yearly":
            annualRate = rate;
            break;
    }

    annualRate = annualRate / 100;
    const ratePerCompoundingPeriod = annualRate / compoundingFrequency;
    const totalCompoundingPeriods = Math.floor(compoundingFrequency * totalTimeInYears);

    let depositsPerYear: number;
    switch (additionalDepositFrequency) {
        case "monthly":
            depositsPerYear = 12;
            break;
        case "quarterly":
            depositsPerYear = 4;
            break;
        case "half-yearly":
            depositsPerYear = 2;
            break;
        case "yearly":
            depositsPerYear = 1;
            break;
    }

    const totalExpectedDeposits = Math.floor(depositsPerYear * totalTimeInYears);
    const periodsPerDeposit = compoundingFrequency / depositsPerYear;

    let currentBalance = principal;
    let totalInterestEarned = 0;
    let totalAdditionalDeposits = 0;
    let cumulativeInterest = 0;

    const startDate = new Date();
    const yearsPerCompoundingPeriod = 1 / compoundingFrequency;
    const daysPerCompoundingPeriod = Math.round((365 * yearsPerCompoundingPeriod));

    const depositPeriods = new Set<number>();
    for (let i = 1; i <= totalExpectedDeposits; i++) {
        const depositPeriod = Math.round(i * periodsPerDeposit);
        if (depositPeriod <= totalCompoundingPeriods) {
            depositPeriods.add(depositPeriod);
        }
    }

    for (let period = 1; period <= totalCompoundingPeriods; period++) {
        const interestPayment = currentBalance * ratePerCompoundingPeriod;
        currentBalance += interestPayment;
        totalInterestEarned += interestPayment;
        cumulativeInterest += interestPayment;

        let extraPayment = 0;
        let principalPayment = 0;

        if (additionalDeposits > 0 && depositPeriods.has(period)) {
            extraPayment = additionalDeposits;
            currentBalance += additionalDeposits;
            totalAdditionalDeposits += additionalDeposits;
            principalPayment = additionalDeposits;
        }

        const paymentDate = new Date(startDate);
        paymentDate.setDate(startDate.getDate() + (period - 1) * daysPerCompoundingPeriod);
    }

    // Handle fractional remaining time
    const remainingTime = (totalTimeInYears * compoundingFrequency) - totalCompoundingPeriods;
    if (remainingTime > 0.01) {
        const fractionalInterest = currentBalance * ratePerCompoundingPeriod * remainingTime;
        currentBalance += fractionalInterest;
        totalInterestEarned += fractionalInterest;
        cumulativeInterest += fractionalInterest;

        const paymentDate = new Date(startDate);
        paymentDate.setDate(startDate.getDate() + totalCompoundingPeriods * daysPerCompoundingPeriod);
    }

    const result: ForexResult = {
        finalBalance: Math.round(currentBalance * 100) / 100,
        totalEarning: Math.round(totalInterestEarned * 100) / 100,
        initialBalance: principal,
        additionalDeposits: Math.round(totalAdditionalDeposits * 100) / 100
    };

    return result;
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