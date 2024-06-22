export class Period {
    public readonly years: number;
    public readonly months: number;
    public readonly days: number;

    constructor(years: number = 0, months: number = 0, days: number = 0) {
        this.years = years;
        this.months = months;
        this.days = days;
    }

    /**
     * A constant for a period of zero.
     */
    public static readonly ZERO: Period = new Period(0, 0, 0);

    /**
     * The pattern for parsing.
     */
    private static readonly PATTERN: RegExp = new RegExp("([-+]?)P(?:([-+]?[0-9]+)Y)?(?:([-+]?[0-9]+)M)?(?:([-+]?[0-9]+)W)?(?:([-+]?[0-9]+)D)?", "i");

    private static create(years: number, months: number, days: number): Period {
        if ((years | months | days) == 0) {
            return Period.ZERO;
        }
        return new Period(years, months, days);
    }

    /** 年数、月数、および日数を表すDateSpanを取得します。 */
    static of(years: number, months: number, days: number): Period {
        return Period.create(years, months, days);
    }
    /** 日数を表すDateSpanを取得します。 */
    static ofDays(days: number): Period {
        return Period.create(0, 0, days);
    }
    /** 月数を表すDateSpanを取得します。 */
    static ofMonths(months: number): Period {
        return Period.create(0, months, 0);
    }
    /** 週数を表すDateSpanを取得します。 */
    static ofWeeks(weeks: number): Period {
        return Period.create(0, 0, weeks * 7);
    }
    /** 年数を表すDateSpanを取得します。 */
    static ofYears(years: number): Period {
        return Period.create(years, 0, 0);
    }
    /** PnYnMnDなどのテキスト文字列からDateSpanを取得します。 */
    static parse(text: string): Period {
        const matcher = Period.PATTERN.exec(text);
        if (matcher != null) {
            const negate = ("-" == matcher[1] ? -1 : 1);
            const yearMatch = matcher[2] ?? null;
            const monthMatch = matcher[3] ?? null;
            const weekMatch = matcher[4] ?? null;
            const dayMatch = matcher[5] ?? null;
            if (yearMatch != null || monthMatch != null || dayMatch != null || weekMatch != null) {
                const years = Period.parseNumber(text, yearMatch, negate);
                const months = Period.parseNumber(text, monthMatch, negate);
                const weeks = Period.parseNumber(text, weekMatch, negate);
                let days = Period.parseNumber(text, dayMatch, negate);
                days = days + weeks * 7;
                return Period.create(years, months, days);
            }
        }
        throw new Error("Text cannot be parsed to a Period");
    }
    private static parseNumber(text: string, str: string, negate: number): number {
        if (str == null) {
            return 0;
        }
        return Number(str) * negate;
    }

    /** 指定された時間的オブジェクトにこの期間を加算します。*/
    addTo(date: Date): Date {
        const temporal = new Date(date);
        if (this.months == 0) {
            if (this.years != 0) {
                temporal.setFullYear(temporal.getFullYear() + this.years);
            }
        } else {
            let totalMonths = this.toTotalMonths();
            if (totalMonths != 0) {
                temporal.setMonth(temporal.getMonth() + totalMonths);
            }
        }
        if (this.days != 0) {
            temporal.setDate(temporal.getDate() + this.days);
        }
        return temporal;
    }

    /** この期間の日数を取得します。 */
    getDays(): number {
        return this.days;
    }
    /** この期間の月数を取得します。 */
    getMonths(): number {
        return this.months;
    }
    /** この期間の年数を取得します。 */
    getYears(): number {
        return this.years;
    }
    /** この期間の3つの単位のいずれかが負の値であるかどうかを確認します。 */
    isNegative(): boolean {
        return this.years < 0 || this.months < 0 || this.days < 0;
    }
    /** この期間の3つの単位すべてがゼロであるかどうかを確認します。 */
    isZero(): boolean {
        return (this == Period.ZERO);
    }
    /** 指定された日数を減算して、この期間のコピーを返します。 */
    minusDays(daysToSubtract: number): Period {
        if (daysToSubtract == 0) {
            return this;
        }
        return Period.create(this.years, this.months, this.days - daysToSubtract);
    }
    /** 指定された月数を減算して、この期間のコピーを返します。 */
    minusMonths(monthsToSubtract: number): Period {
        if (monthsToSubtract == 0) {
            return this;
        }
        return Period.create(this.years, this.months - monthsToSubtract, this.days);
    }
    /** 指定された年数を減算して、この期間のコピーを返します。 */
    minusYears(yearsToSubtract: number): Period {
        if (yearsToSubtract == 0) {
            return this;
        }
        return Period.create(this.years - yearsToSubtract, this.months, this.days);
    }
    /** 指定された日数を加算して、この期間のコピーを返します。*/
    plusDays(daysToAdd: number): Period {
        if (daysToAdd == 0) {
            return this;
        }
        return Period.create(this.years, this.months, this.days + daysToAdd);
    }
    /** 指定された月数を加算して、この期間のコピーを返します。*/
    plusMonths(monthsToAdd: number): Period {
        if (monthsToAdd == 0) {
            return this;
        }
        return Period.create(this.years, this.months + monthsToAdd, this.days);
    }
    /** 指定された年数を加算して、この期間のコピーを返します。 */
    plusYears(yearsToAdd: number): Period {
        if (yearsToAdd == 0) {
            return this;
        }
        return Period.create(this.years + yearsToAdd, this.months, this.days);
    }
    /** この期間の合計月数を取得します。 */
    toTotalMonths(): number {
        return this.years * 12 + this.months;
    }
    /** 指定された日数を使って、この期間のコピーを返します。 */
    withDays(days: number): Period {
        if (days == this.days) {
            return this;
        }
        return Period.create(this.years, this.months, days);
    }
    /** 指定された月数を使って、この期間のコピーを返します。*/
    withMonths(months: number): Period {
        if (months == this.months) {
            return this;
        }
        return Period.create(this.years, months, this.days);
    }
    /** 指定された年数を使って、この期間のコピーを返します。*/
    withYears(years: number): Period {
        if (years == this.years) {
            return this;
        }
        return Period.create(years, this.months, this.days);
    }
}
