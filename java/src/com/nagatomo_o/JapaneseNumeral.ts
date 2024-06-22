/**
 * 漢数字
 */
export class JapaneseNumeral {
    /** 数 */
    private static readonly NUMERALS: string[] = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    /** 十進法 */
    private static readonly DECIMAL_NUMERALS: string[] = ["", "十", "百", "千"];
    /** 万進法 */
    private static readonly MYRIAD_NUMERALS: string[] = ["", "万", "億", "兆", "京"];

    /**
     * Converts a number into a string of Japanese numerals.
     * The number must be greater than or equal to 0.
     *
     * @param {number} number The number
     * @returns {string} Japanese numerals
     * @throws JapaneseNumeralException
     */
    static format(number: number): string {
        // Negative values ​​are not supported
        if (number < 0) {
            throw Error(`number(${number}) must be positive.`);
        }
        // Zero is returned "〇"
        if (number == 0) {
            return JapaneseNumeral.NUMERALS[0];
        }
        const numString: string = number.toString(10);
        let result: string = "";
        let myriad: boolean = false;
        // 上位の位から
        for (let i = 0; i < numString.length; i++) {
            const cp: number | undefined = numString.codePointAt(i);
            if (cp == undefined) {
                throw Error(`invalid character: ${numString.charAt(i)}`);
            }
            const digit: number = numString.length - i - 1;
            const num: number = cp - 0x30;
            const decimalNumeral: number = digit % 4;
            const myriadNumeral: number = decimalNumeral == 0 ? digit / 4 : 0;
            // 一～九（十、百、千の位の一はつけない）
            if (num != 0 && !(num == 1 && decimalNumeral > 0)) {
                result += JapaneseNumeral.NUMERALS[num];
                myriad = true;
            }
            // 十,百,千,
            if (num != 0 && decimalNumeral != 0) {
                result += JapaneseNumeral.DECIMAL_NUMERALS[decimalNumeral];
                myriad = true;
            }
            // 万,億,兆
            if (myriad && myriadNumeral > 0) {
                result += JapaneseNumeral.MYRIAD_NUMERALS[myriadNumeral];
                myriad = false;
            }
        }
        return result;
    }

    /**
     * 漢数字を数値に変換します 0は〇で返します
     *
     * @param {string} str 漢数字
     * @returns {number} value 0以上の数
     */
    static parse(str: string): number {
        if (str == null || str.length == 0) {
            throw Error(`string is empty.`);
        }
        if (str == JapaneseNumeral.NUMERALS[0]) {
            return 0;
        }
        let degits: number[] = [0];
        let myriadNumeral: number = 0;
        let decimalNumeral: number = 0;
        // 漢数字一桁から順に数字配列に変換
        // "千二百五" -> [5,undefined,2,1]
        for (let i: number = str.length - 1; i >= 0; i--) {
            const c: string = str.charAt(i);
            const n2: number = JapaneseNumeral.MYRIAD_NUMERALS.indexOf(c);
            const n1: number = JapaneseNumeral.DECIMAL_NUMERALS.indexOf(c);
            const n0: number = JapaneseNumeral.NUMERALS.indexOf(c);
            if (n2 > 0) {
                myriadNumeral = n2;
                decimalNumeral = 0;
            } else if (n1 > 0) {
                decimalNumeral = n1;
                degits[myriadNumeral * 4 + decimalNumeral] = 1;
            } else if (n0 > 0) {
                degits[myriadNumeral * 4 + decimalNumeral] = n0;
            } else {
                throw Error(`invalid character: ${c}`);
            }
        }
        // 数字配列を文字列へ変換
        // [5,undefined,2,1] -> "1205"
        let numString: string = "";
        for (let degit: number = degits.length; degit >= 0; degit--) {
            const num: number = degits[degit];
            numString += num ? num.toFixed() : "0";
        }
        return Number(numString);
    }
}
