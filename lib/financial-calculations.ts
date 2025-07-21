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

export interface LoanParams {
    principal: number
    rate: number
    term: number
}

export interface LoanResult {
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

export function calculateLoan(params: LoanParams): LoanResult {
    const { principal, rate, term } = params
    const monthlyRate = rate / 100 / 12
    const totalMonths = term * 12

    const monthlyPayment = (principal * (monthlyRate * Math.pow(monthlyRate + 1, totalMonths))) / (Math.pow(monthlyRate + 1, totalMonths) - 1)

    let balance = principal
    const amortizationSchedule: LoanResult["amortizationSchedule"] = []

    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = balance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment
        balance -= principalPayment

        amortizationSchedule.push({
            month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(0, balance)
        })
    }

    const totalPayment = monthlyPayment * totalMonths
    const totalInterest = totalPayment - principal

    return {
        monthlyPayment,
        totalPayment,
        totalInterest,
        amortizationSchedule
    }
}

export interface MortgageRefinanceParams {
    currentBalance: number
    currentMonthlyPayment: number
    currentRate: number
    refinanceRate: number
    refinanceTerm: number
    closingCosts?: number
}

export interface MortgageRefinanceResult {
    newMonthlyPayment: number
    monthlyPaymentReduction: number
    currentTotalInterest: number
    refinanceTotalInterest: number
    interestSaved: number
    netSavings: number
    breakEvenMonths: number
    currentRemainingTerm: number
}

export function calculateMortgageRefinance(params: MortgageRefinanceParams): MortgageRefinanceResult {
    const { currentBalance, currentMonthlyPayment, currentRate, refinanceRate, refinanceTerm, closingCosts = 0 } = params

    // Calculate new loan details
    const refinanceMonthlyRate = refinanceRate / 100 / 12
    const refinanceMonths = refinanceTerm * 12

    const newMonthlyPayment = refinanceMonthlyRate > 0 ? (currentBalance * (refinanceMonthlyRate * Math.pow(1 + refinanceMonthlyRate, refinanceMonths))) / (Math.pow(1 + refinanceMonthlyRate, refinanceMonths) - 1) : currentBalance / refinanceMonths
    const monthlyPaymentReduction = currentMonthlyPayment - newMonthlyPayment

    // Calculate remaining term on current mortgage
    const currentMonthlyRate = currentRate / 100 / 12
    let remainingBalance = currentBalance
    let currentRemainingMonths = 0

    // Estimate remaining months on current mortgage
    while (remainingBalance > 0.01 && currentRemainingMonths < 600) {
        const interestPayment = remainingBalance * currentMonthlyRate
        const principalPayment = currentMonthlyPayment - interestPayment
        remainingBalance -= principalPayment
        currentRemainingMonths++
    }

    // Calculate total interest for current mortgage (remaining term)
    const currentTotalInterest = currentMonthlyPayment * currentRemainingMonths - currentBalance

    // Calculate total interest for refinanced mortgage
    const refinanceTotalPayment = newMonthlyPayment * refinanceMonths
    const refinanceTotalInterest = refinanceTotalPayment - currentBalance

    const interestSaved = currentTotalInterest - refinanceTotalInterest
    const netSavings = interestSaved - closingCosts

    // Calculate break-even point
    const breakEvenMonths = monthlyPaymentReduction > 0 ? closingCosts / monthlyPaymentReduction : 0

    return {
        newMonthlyPayment,
        monthlyPaymentReduction,
        currentTotalInterest,
        refinanceTotalInterest,
        interestSaved,
        netSavings,
        breakEvenMonths,
        currentRemainingTerm: currentRemainingMonths / 12,
    }
}

export function calculateAPY(nominalRate: number, compoundingFrequency: number): number {
    return (Math.pow(1 + nominalRate / 100 / compoundingFrequency, compoundingFrequency) - 1) * 100
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

export function calculateIRR(cashFlows: number[]): number {
    // Newton-Raphson method for IRR calculation
    let rate = 0.1          // Initial guess
    const tolerance = 0.000001
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
    monthlyContribution: number
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
    const { targetAmount, currentSavings, monthlyContribution, interestRate } = params

    const monthlyRate = interestRate / 100 / 12
    let balance = currentSavings
    let months = 0
    let totalContributions = 0

    while (balance < targetAmount && months < 1200) {
        balance += monthlyContribution
        totalContributions += monthlyContribution

        const monthlyInterest = balance * monthlyRate
        balance += monthlyInterest

        months++
    }

    const interestEarned = balance - currentSavings - totalContributions

    return {
        monthsToGoal: months,
        yearsToGoal: months / 12,
        totalContributions,
        interestEarned
    }
}

export function calculateFutureValue(presentValue: number, rate: number, periods: number, paymentPerPeriod = 0): number {
    const futureValueLumpSum = presentValue * Math.pow(1 + rate / 100, periods)
    const futureValueAnnuity = paymentPerPeriod * ((Math.pow(1 + rate / 100, periods) - 1) / (rate / 100))
    return futureValueLumpSum + futureValueAnnuity
}

export function calculateHowLongMoneyLasts(currentAmount: number, monthlyWithdrawal: number, interestRate: number): number {
    const monthlyRate = interestRate / 100 / 12
    let balance = currentAmount
    let months = 0

    while (balance > 0 && months < 1200) {
        const interestEarned = balance * monthlyRate
        balance = balance + interestEarned - monthlyWithdrawal
        months++

        if (balance <= 0)
            break
    }

    return months
}

export function calculateRequiredInterestRate(presentValue: number, futureValue: number, periods: number): number {
    return (Math.pow(futureValue / presentValue, 1 / periods) - 1) * 100
}

export interface LoanPayoffParams {
    currentBalance: number
    interestRate: number
    currentPayment: number
    extraPayment: number
}

export interface LoanPayoffResult {
    monthsToPayoff: number
    totalInterest: number
    interestSaved: number
    timeSaved: number
}

export function calculateLoanPayoff(params: LoanPayoffParams): LoanPayoffResult {
    const { currentBalance, interestRate, currentPayment, extraPayment } = params
    const monthlyRate = interestRate / 100 / 12

    // Calculate original payoff
    let originalBalance = currentBalance
    let originalMonths = 0
    let originalInterest = 0

    while (originalBalance > 0.01 && originalMonths < 600) {
        const interestCharge = originalBalance * monthlyRate
        const principalPayment = currentPayment - interestCharge
        originalBalance -= principalPayment
        originalInterest += interestCharge
        originalMonths++
    }

    // Calculate with extra payment
    let newBalance = currentBalance
    let newMonths = 0
    let newInterest = 0
    const totalPayment = currentPayment + extraPayment

    while (newBalance > 0.01 && newMonths < 600) {
        const interestCharge = newBalance * monthlyRate
        const principalPayment = totalPayment - interestCharge
        newBalance -= principalPayment
        newInterest += interestCharge
        newMonths++
    }

    return {
        monthsToPayoff: newMonths,
        totalInterest: newInterest,
        interestSaved: originalInterest - newInterest,
        timeSaved: originalMonths - newMonths,
    }
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

    Object.entries(denominations).forEach(([denom, count]) => {
        const value = denominationValues[denom as keyof typeof denominationValues] || 0
        const subtotal = count * value
        total += subtotal

        breakdown[denom] = {
            count,
            value,
            total: subtotal,
        }
    })

    return { total, breakdown }
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
    annualSpending: number
    timeframe: number
}

export interface CashBackResult {
    cashBackEarned: number
    totalSpending: number
    effectiveDiscount: number
    annualCashBack: number
}

export function calculateCashBack(params: CashBackParams): CashBackResult {
    const { purchaseAmount, cashBackRate, annualSpending, timeframe } = params

    const cashBackEarned = (purchaseAmount * cashBackRate) / 100
    const totalSpending = annualSpending * timeframe
    const totalCashBack = (totalSpending * cashBackRate) / 100
    const effectiveDiscount = (totalCashBack / totalSpending) * 100
    const annualCashBack = (annualSpending * cashBackRate) / 100

    return {
        cashBackEarned,
        totalSpending,
        effectiveDiscount,
        annualCashBack: annualCashBack,
    }
}
