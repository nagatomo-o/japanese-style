import { Gengo } from "./Gengo";
import { Wareki } from "./Wareki";
import { JapaneseNumeral } from "./JapaneseNumeral";

/**
 * 日付項目
 */
class DateFields {
    /** 元号 */
    public gengo: Gengo | null;
    /** 年 */
    public nen: number;
    /** 年 */
    public year: number;
    /** 月 */
    public month: number;
    /** 日 */
    public dayOfMonth: number;
    /** 年 */
    public hours: number;
    public minutes: number;
    public seconds: number;
    public milliseconds: number;

    /**
     * 初期化
     */
    constructor() {
        this.gengo = null;
        this.nen = 0;
        this.year = 0;
        this.month = 1;
        this.dayOfMonth = 1;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.milliseconds = 0;
    }

    /**
     * 今の日付からクラスインスタンスを作成
     * @returns {DateFields} インスタンス
     */
    static now(): DateFields {
        return DateFields.fromDate(new Date());
    }

    /**
     * 指定した日付からクラスインスタンスを作成
     * @returns {DateFields} インスタンス
     */
    static fromDate(date: Date): DateFields {
        const d = new DateFields();
        const wareki = Wareki.fromDate(date);
        d.gengo = wareki.gengo;
        d.nen = wareki.nen;
        d.year = date.getFullYear();
        d.month = date.getMonth() + 1;
        d.dayOfMonth = date.getDate();
        d.hours = date.getHours();
        d.minutes = date.getMinutes();
        d.seconds = date.getSeconds();
        d.milliseconds = date.getMilliseconds();
        return d;
    }

    /**
     * 日付に変換
     * @returns {DateFields} Dateインスタンス
     */
    toDate(): Date {

        if (this.gengo != null && this.nen > 0) {
            this.year = (new Wareki(this.gengo, this.nen)).year;
        }


        return new Date(this.year, this.month - 1, this.dayOfMonth, this.hours, this.minutes, this.seconds, this.milliseconds);
    }
}
/**
 * プロパティ
 */
class Property {
    /** 日付パターン */
    public readonly dateTimePattern: string;
    /** 正規表現 */
    public readonly regularPattern: string;
    /** 最低長さ */
    private readonly minLength: number;
    /** 項目値の取得処理 */
    private readonly fieldValueGetter: CallableFunction;
    /** 項目値の設定処理 */
    private readonly fieldValueSetter: CallableFunction;

    /**
     * 初期化
     * @param {string} dateTimePattern 日時パターン
     * @param {string} regularPattern 正規表現
     * @param {number} minLength 最低長さ
     * @param {CallableFunction} fieldValueGetter 項目値の取得処理
     * @param {CallableFunction} fieldValueSetter 項目値の設定処理
     */
    constructor(dateTimePattern: string, regularPattern: string, minLength: number, fieldValueGetter: CallableFunction, fieldValueSetter: CallableFunction) {
        this.dateTimePattern = dateTimePattern;
        this.regularPattern = regularPattern;
        this.minLength = minLength;
        this.fieldValueGetter = fieldValueGetter;
        this.fieldValueSetter = fieldValueSetter;
    }

    /**
     * 項目値の取得
     * @param {DateFields} date 日付項目
     * @reurns string 項目値
     */
    public getFieldValue(date: DateFields): string {
        const num = this.fieldValueGetter(date);
        let str = (typeof num == 'number') ? num.toString() : num;
        if (str.length < this.minLength) {
            return "0".repeat(this.minLength - str.length) + str;
        }
        return str;
    }

    /**
     * 項目値の設定
     * @param {DateFields} date 日付項目
     * @param string 項目値
     */
    public setFieldValue(date: DateFields, value: string): void {
        return this.fieldValueSetter(date, value);
    }
}
/**
 * 文字のみの項目値
 */
class StringProperty extends Property {
    /**
     * 初期値
     * @param {string} text 文字
     */
    constructor(text: string) {
        super("'" + text + "'", text, text.length, (d: Date) => text, (d: Date, v: string) => { });
    }
}
/**
 * 日時フォーマッター
 * 
 *  Symbol  Meaning                     Presentation      Examples
 *  ------  -------                     ------------      -------
 *   GG       era                         text              AD; Anno Domini; A
 *   y       year-of-era                 year              2004; 04
 *   D       day-of-year                 number            189
 *   M       month-of-year               number/text       7; 07; Jul; July; J
 *   d       day-of-month                number            10
 * 
 *   H       hour-of-day (0-23)          number            0
 *   m       minute-of-hour              number            30
 *   s       second-of-minute            number            55
 *   S       milli-of-second             number            978
 */
export class DateTimeFormatter {
    /** 日時パターン */
    private readonly dateTimePattern: string;
    /** プロパティリスト */
    private readonly properties: Property[];
    /** 正規表現 */
    private readonly regularExpression: RegExp;

    /**
     * 初期化
     * @param {string} dateTimePattern 日時パターン
     */
    constructor(dateTimePattern: string) {
        // Set DateTime Pattern
        this.dateTimePattern = dateTimePattern;
        // Build Properties
        this.properties = [];
        let p = dateTimePattern;
        while (p.length > 0) {
            let find = false;
            for (const pattern of DateTimeFormatter.PROPERTIES) {
                if (p.startsWith(pattern.dateTimePattern)) {
                    this.properties.push(pattern);
                    p = p.substring(pattern.dateTimePattern.length);
                    find = true;
                }
            }
            if (!find) {
                this.properties.push(new StringProperty(p.substring(0, 1)));
                p = p.substring(1);
            }
        }
        // Build Eegular Expression
        let expression = "";
        for (let p = 0; p < this.properties.length; p++) {
            let property = this.properties[p];
            expression += "(" + property.regularPattern + ")";
        }
        this.regularExpression = new RegExp("^" + expression);
    }

    /**
     * パース
     * 
     * @param {string} text
     * @returns {Date} date
     */
    parse(text: string): Date {
        if (text == "") {
            throw Error("parse exception empty");
        }
        const matches = this.regularExpression.exec(text);
        if (matches == null) {
            throw Error("parse exception pattern:" + this.dateTimePattern + " text:" + text);
        }
        const dateField = new DateFields();
        let i = 0;
        for (const property of this.properties) {
            let fieldValue = matches[++i];
            if (!(property instanceof StringProperty)) {
                property.setFieldValue(dateField, fieldValue);
            }
        }

        return dateField.toDate();
    }

    /**
     * 
     * @param {Date} date 日時
     * @returns {string} text フォーマット済み
     */
    format(date: Date): string {
        let text = "";
        const dateField = DateFields.fromDate(date);
        for (const property of this.properties) {
            if (property instanceof StringProperty) {
                text += property.regularPattern;
            } else {
                text += property.getFieldValue(dateField);
            }
        }
        return text;
    }

    /**
     * ToString
     */
    toString(): string {
        return this.dateTimePattern;

    }

    /**
     * 和暦のパターン
     */
    static readonly PROPERTIES: Property[] = [
        // GGGG : 平成, 令和
        new Property("GGGG", Gengo.list().map((gengo: Gengo) => gengo.name).join('|'), 0, (d: DateFields) => d.gengo?.name, (d: DateFields, v: string) => d.gengo = Gengo.of(v)),
        // GGG : Heisei, Reiwa
        new Property("GGG", Gengo.list().map((gengo: Gengo) => gengo.romanName).join('|'), 0, (d: DateFields) => d.gengo?.romanName, (d: DateFields, v: string) => d.gengo = Gengo.of(v)),
        // GG : 平,令
        new Property("GG", Gengo.list().map((gengo: Gengo) => gengo.abbrName).join('|'), 0, (d: DateFields) => d.gengo?.abbrName, (d: DateFields, v: string) => d.gengo = Gengo.of(v)),
        // G : H,R
        new Property("G", Gengo.list().map((gengo: Gengo) => gengo.abbrRomanName).join('|'), 0, (d: DateFields) => d.gengo?.abbrRomanName, (d: DateFields, v: string) => d.gengo = Gengo.of(v)),
        // yyyy : 元, 二, 三, ,, 九十九
        new Property("yyyy", "元|[一-九十]{1,3}", 0, (d: DateFields) => d.nen == 1 ? "元" : JapaneseNumeral.format(d.nen), (d: DateFields, v: string) => d.nen = v == "元" ? 1 : JapaneseNumeral.parse(v)),
        // yyy : 元, 02, 03, ,, 99
        new Property("yyy", "元|[2-9]|[1-9][0-9]", 0, (d: DateFields) => d.nen == 1 ? "元" : d.nen, (d: DateFields, v: string) => d.nen = v == "元" ? 1 : Number(v)),
        // yy : 01, 02, 03, ,, 99
        new Property("yy", "[0-9]{2}", 0, (d: DateFields) => d.nen % 100, (d: DateFields, v: string) => d.nen = Number(v)),
        // y : 1, 2, 3, ,, 99
        new Property("y", "[0-9]{1,2}", 0, (d: DateFields) => d.nen, (d: DateFields, v: string) => d.nen = Number(v)),
        // uuuu : 0001, ,, 2025,2026,
        new Property("uuuu", "[0-9]{4}", 4, (d: DateFields) => d.year, (d: DateFields, v: string) => d.year = Number(v)),
        // uuu : 001, ,, 2025,2026,
        new Property("uuu", "[0-9]{3,4}", 3, (d: DateFields) => d.year, (d: DateFields, v: String) => d.year = Number(v)),
        // uu : 01, ,, 25,26,
        new Property("uu", "[0-9]{2}", 2, (d: DateFields) => d.year % 100, (d: DateFields, v: string) => d.year = 2000 + Number(v)),
        // u : 1, ,, 2025,2026,
        new Property("u", "[0-9]{1,4}", 1, (d: DateFields) => d.year, (d: DateFields, v: string) => d.year = Number(v)),
        new Property("MM", "0[1-9]|1[012]", 2, (d: DateFields) => d.month, (d: DateFields, v: string) => d.month = Number(v)),
        new Property("M", "[1-9]|1[012]", 1, (d: DateFields) => d.month, (d: DateFields, v: string) => d.month = Number(v)),
        new Property("dd", "0[1-9]|[1-2][0-9]|30|31", 2, (d: DateFields) => d.dayOfMonth, (d: DateFields, v: string) => d.dayOfMonth = Number(v)),
        new Property("d", "[1-9]|[1-2][0-9]|30|31", 1, (d: DateFields) => d.dayOfMonth, (d: DateFields, v: string) => d.dayOfMonth = Number(v)),
        new Property("HH", "[01][0-9]|2[0123]", 2, (d: DateFields) => d.hours, (d: DateFields, v: string) => d.hours = Number(v)),
        new Property("H", "1?[0-9]|2[0123]", 1, (d: DateFields) => d.hours, (d: DateFields, v: string) => d.hours = Number(v)),
        new Property("mm", "[0-5][0-9]", 2, (d: DateFields) => d.minutes, (d: DateFields, v: string) => d.minutes = Number(v)),
        new Property("m", "[1-5]?[0-9]", 1, (d: DateFields) => d.minutes, (d: DateFields, v: string) => d.minutes = Number(v)),
        new Property("ss", "[0-5][0-9]", 2, (d: DateFields) => d.seconds, (d: DateFields, v: string) => d.seconds = Number(v)),
        new Property("s", "[1-5]?[0-9]", 1, (d: DateFields) => d.seconds, (d: DateFields, v: string) => d.seconds = Number(v)),
        new Property("SSS", "[0-9]{3}", 3, (d: DateFields) => d.milliseconds, (d: DateFields, v: string) => d.milliseconds = Number(v)),
        new Property("SS", "[0-9]{2,3}", 2, (d: DateFields) => d.milliseconds, (d: DateFields, v: string) => d.milliseconds = Number(v)),
        new Property("S", "[0-9]{1,3}", 1, (d: DateFields) => d.milliseconds, (d: DateFields, v: string) => d.milliseconds = Number(v)),
    ];
}
