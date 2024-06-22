import { DateValueException } from "./DateValueException";

/**
 * 元号
 */
export class Gengo {
    /** 元号名 */
    public readonly name: string;
    /** 元号名略称 */
    public readonly abbrName: string;
    /** ローマ字名 */
    public readonly romanName: string;
    /** ローマ字名略称 */
    public readonly abbrRomanName: string;
    /** 開始日 */
    public readonly since: Date;

    /**
     * 元号
     * @param {string} name 元号名
     * @param {string} abbrName 元号名略称
     * @param {string} romanName ローマ字名
     * @param {string} abbrRomanName ローマ字名略称
     * @param {string} sinceString 開始日
     */
    constructor(name: string, abbrName: string, romanName: string, abbrRomanName: string, sinceString: string) {
        this.name = name;
        this.abbrName = abbrName;
        this.romanName = romanName;
        this.abbrRomanName = abbrRomanName;
        this.since = new Date(sinceString);
    }

    /**
     * toString
     * @returns {string}
     */
    toString(): string {
        return this.name;
    }

    /**
     * 同値の判定
     * @param {Gengo} other
     * @returns {boolean} 同値
     */
    equals(other: Gengo): boolean {
        return this === other || other && this.name == other.name && this.since == other.since;
    }

    /**
     * 最新の元号
     * @returns {Gengo}
     */
    static now(): Gengo {
        return Gengo.fromDate(new Date());
    }

    /**
     * 日付から元号を取得
     * @param {Date} date 日付
     * @returns {Gengo}
     * @throws DateValueException $date is out of range
     */
    static fromDate(date: Date): Gengo {
        const gengo = Gengo.list().reverse().find(gengo => gengo.since <= date);
        if (gengo) {
            return gengo;
        }
        throw new DateValueException(`out of value: ${date.toString()}`);
    }

    /**
     * 日付から元号を取得
     * @param {number} year Year
     * @param {number} month Month
     * @param {number} dayOfMonth Day
     * @returns {Gengo|null} 判定結果
     */
    static fromISODate(year: number, month: number, dayOfMonth: number): Gengo {
        return Gengo.fromDate(new Date(year, month - 1, dayOfMonth));
    }

    /**
     * 文字列から元号を取得
     * @param {string} nameOrCode
     * @returns {Gengo|null} 判定結果
     */
    static of(nameOrCode: string): Gengo | null {
        nameOrCode = nameOrCode.toLowerCase();
        return Gengo.list().reverse().find(gengo => {
            return gengo.name.toLowerCase() == nameOrCode ||
                gengo.abbrName.toLowerCase() == nameOrCode ||
                gengo.romanName.toLowerCase() == nameOrCode ||
                gengo.abbrRomanName.toLowerCase() == nameOrCode
        }) ?? null;
    }

    /**
     * 正しい元号か判定
     * @param {string} nameOrCode
     * @returns {boolean} 判定結果
     */
    static isValid(nameOrCode: string): boolean {
        return Gengo.isValidName(nameOrCode) ||
            Gengo.isValidAbbrName(nameOrCode) ||
            Gengo.isValidRomanName(nameOrCode) ||
            Gengo.isValidAbbrRomanName(nameOrCode);
    }

    /**
     * 正しい元号か判定
     * @param {string} name
     * @returns {boolean} 判定結果
     */
    static isValidName(name: string): boolean {
        return name != null && Gengo.list().reverse().some(gengo =>
            gengo.name.toLowerCase() == name.toLowerCase());
    }

    /**
     * 正しい元号略称か判定
     * @param {string} abbrName
     * @returns {boolean} 判定結果
     */
    static isValidAbbrName(abbrName: string): boolean {
        return abbrName != null && Gengo.list().reverse().some(gengo =>
            gengo.abbrName.toLowerCase() == abbrName.toLowerCase());
    }

    /**
     * 正しい元号(ローマ字)か判定
     * @param {string} romanName
     * @returns {boolean} 判定結果
     */
    static isValidRomanName(romanName: string): boolean {
        return romanName != null && Gengo.list().reverse().some(gengo =>
            gengo.romanName.toLowerCase() == romanName.toLowerCase());
    }

    /**
     * 正しい元号(ローマ字)略称か判定
     * @param {string} abbrRomanName
     * @returns {boolean} 判定結果
     */
    static isValidAbbrRomanName(abbrRomanName: string): boolean {
        return abbrRomanName != null && Gengo.list().reverse().some(gengo =>
            gengo.abbrRomanName.toLowerCase() == abbrRomanName.toLowerCase());
    }

    /**
     * 明治
     */
    static readonly MEIJI = new Gengo("明治", "明", "Meiji", "M", "1868-01-25T00:00:00.000+0900");

    /**
     * 大正
     */
    static readonly TAISHO = new Gengo("大正", "大", "Taisho", "T", "1912-07-30T00:00:00.000+0900");

    /**
     * 昭和
     */
    static readonly SHOWA = new Gengo("昭和", "昭", "Showa", "S", "1926-12-25T00:00:00.000+0900");

    /**
     * 平成
     */
    static readonly HEISEI = new Gengo("平成", "平", "Heisei", "H", "1989-01-08T00:00:00.000+0900");

    /**
     * 令和
     */
    static readonly REIWA = new Gengo("令和", "令", "Reiwa", "R", "2019-05-01T00:00:00.000+0900");

    /**
     * 元号一覧
     * @return Gengo[]
     */
    static list(): Gengo[] {
        return [
            Gengo.MEIJI,
            Gengo.TAISHO,
            Gengo.SHOWA,
            Gengo.HEISEI,
            Gengo.REIWA,
        ];
    }
}
