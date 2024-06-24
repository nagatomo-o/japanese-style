import { Gengo } from "./Gengo";
import { DateValueException } from "./DateValueException";

/**
 * 和暦
 */
export class Wareki {
    /** 元号 */
    public readonly gengo: Gengo;
    /** 年 */
    public readonly nen: number;
    /** 西暦年 */
    public readonly year: number;

    /**
     * コンストラクタ
     */
    constructor(gengo: Gengo, nen: number) {
        if (!Wareki.isValid(gengo, nen)) {
            throw new DateValueException(`invalid value gengo:${gengo} nen:${nen}`);
        }
        this.gengo = gengo;
        this.nen = nen;
        this.year = Wareki.toYear(gengo, nen);
    }

    /**
     * @returns {string}
     */
    toString(): string {
        return this.gengo.toString() + this.nen.toString();
    }

    /**
     * 西暦年を取得
     */
    static toYear(gengo: Gengo, nen: number): number {
        return gengo.since.getFullYear() + nen - 1;
    }

    /**
     * 同値の判定
     * @param {Wareki} other
     * @returns {boolean}
     */
    equals(other: Wareki): boolean {
        return this === other || other && this.gengo.equals(other.gengo) && this.nen == other.nen;
    }

    /**
     * 今の和暦を取得
     * @returns {Wareki} 和暦
     */
    static now(): Wareki {
        return Wareki.fromDate(new Date());
    }

    /**
     * 日付から和暦を取得
     * @param {Date} date 日付
     * @returns {Wareki} 和暦
     */
    static fromDate(date: Date): Wareki {
        // 元号と開始年取得
        const gengo: Gengo = Gengo.fromDate(date);
        // 引数の年取得
        const year: number = date.getFullYear();
        // 開始年からの年によって和暦年を取得
        const nen: number = year - gengo.since.getFullYear() + 1;
        return new Wareki(gengo, nen);
    }

    /**
     * 元号と元号年の組み合わせが正しいか判定
     * @param {Gengo} gengo
     * @param {number} nen
     * @returns {boolean} 判定結果
     */
    static isValid(gengo: Gengo, nen: number): boolean {
        if (nen < 1) {
            return false;
        }
        const gengoList: Gengo[] = Gengo.list();
        for (let idx: number = 0; idx < gengoList.length; idx++) {
            if (!gengoList[idx].equals(gengo)) {
                continue;
            }
            // 次の元号
            const nextGengo = (idx + 1 < gengoList.length) ? gengoList[idx + 1] : null;
            // 現在の元号の最後の年
            const lastNen = nextGengo ? nextGengo.since.getFullYear() - gengo.since.getFullYear() + 1 : 99;
            // 最後の年を超えていないか
            return nen <= lastNen;
        }
        throw new DateValueException(`gengo out of range : ${gengo}`);
    }
}
