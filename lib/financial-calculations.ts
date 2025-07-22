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

export interface MortgageParams {
    principal: number
    rate: number // annual rate in %
    term: number // in years
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
}

export interface CashFlowIRRParams {
    cashFlows: number[]
}

export interface MultipleIRRParams {
    cashFlows: number[]
}

export function calculateGeneralIRR(params: GeneralIRRParams): number {
    const { initialInvestment, finalReturn, years } = params
    if (initialInvestment <= 0 || finalReturn <= 0 || years <= 0) return 0
    const irr = Math.pow(finalReturn / initialInvestment, 1 / years) - 1
    return irr * 100
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
    effectiveDiscount: number // actual cashback as % of purchase
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
    const { principal, rate, years, compoundFrequency, depositAmount = 0, depositFrequency = 0 } = params

    const totalPeriods = compoundFrequency * years
    const periodRate = Math.pow(1 + rate / 100, 1 / compoundFrequency) - 1

    const depositEveryNPeriods = depositFrequency ? compoundFrequency / depositFrequency : 0
    const depositPerPeriod = depositAmount

    let balance = principal
    let totalInterest = 0
    let totalDeposits = principal

    for (let period = 1; period <= totalPeriods; period++) {
        // Interest first
        const interest = balance * periodRate
        balance += interest
        totalInterest += interest

        // Then deposit at end of period
        if (depositFrequency && period % depositEveryNPeriods === 0) {
            balance += depositPerPeriod
            totalDeposits += depositPerPeriod
        }
    }

    return {
        finalBalance: parseFloat(balance.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalDeposits: parseFloat(totalDeposits.toFixed(2)),
    }
}