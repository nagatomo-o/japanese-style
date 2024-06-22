import { Period } from "./Period";

export class Holiday {
    public readonly name: string;
    public readonly rule: CallableFunction;
    constructor(name: string, rule: CallableFunction) {
        this.name = name;
        this.rule = rule;
    }

    match(date: Date): boolean {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();
        const weekOfMonth = Math.floor((dayOfMonth - 1) / 7);
        return this.rule(year, month, dayOfMonth, dayOfWeek, weekOfMonth);
    }

    static list() {

    }

    static HOLIDAIS: Holiday[] = [
        new Holiday('元日', (year: number, month: number, dayOfMonth: number, dayOfWeek: number, weekOfMonth: number,) => year > 1948 && month == 1 && dayOfMonth == 1),
        new Holiday('成人の日', (year: number, month: number, dayOfMonth: number, dayOfWeek: number, weekOfMonth: number,) => year > 1948 && year < 2000 && month == 1 && dayOfMonth == 15
            // 2000年ハッピーマンデー制度により月曜日固定
            || year >= 2000 && month == 1 && weekOfMonth == 2 && dayOfWeek == 1),
        new Holiday('春分の日', (year: number, month: number, dayOfMonth: number, dayOfWeek: number, weekOfMonth: number,) => year > 1948 && month == 2 && dayOfMonth == Math.floor(20.69115 + 0.2421904 * (year - 2000) - Math.floor((year - 2000) / 4))),
        new Holiday('春分の日', (year: number, month: number, dayOfMonth: number, dayOfWeek: number, weekOfMonth: number,) => year > 1948 && month == 2 && dayOfMonth == Math.floor(20.69115 + 0.2421904 * (year - 2000) - Math.floor((year - 2000) / 4))),
    ];

    static getConst(date: Date): string | null {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();
        const weekOfMonth = Math.floor((dayOfMonth - 1) / 7);

        if (year > 1948 && month == 1 && dayOfMonth == 1) {
            return '元日';

        } else if (year > 1948 && year < 2000 && month == 1 && dayOfMonth == 15
            // 2000年ハッピーマンデー制度により月曜日固定
            || year >= 2000 && month == 1 && weekOfMonth == 2 && dayOfWeek == 1) {
            return '成人の日';

        } else if (year > 1948 && month == 2 && dayOfMonth == Math.floor(20.69115 + 0.2421904 * (year - 2000) - Math.floor((year - 2000) / 4))) {
            return '春分の日';

        } else if (year > 1948 && month == 4 && dayOfMonth == 29) {
            if (year <= 1988) {
                return "天皇誕生日";
            } else if (year >= 1989 && year < 2007) {
                return "みどりの日";
            } else if (year >= 2007) {
                return "昭和の日";
            }

        } else if (year > 1948 && month == 5 && dayOfMonth == 3) {
            return '憲法記念日';

        } else if (year > 1948 && month == 5 && dayOfMonth == 5) {
            return 'こどもの日';

        } else if (year >= 1948 && month == 8 && dayOfMonth == Math.floor(23.09 + 0.2421904 * (year - 2000) - Math.floor((year - 2000) / 4))) {
            return '秋分の日';

        } else if (year >= 1948 && month == 11 && dayOfMonth == 3) {
            return '文化の日';

        } else if (year >= 1948 && month == 11 && dayOfMonth == 23) {
            return '勤労感謝の日';

        } else if (year == 1959 && month == 4 && dayOfMonth == 10) {
            return '皇太子・明仁親王の結婚の儀';

        } else if (year > 1966 && month == 2 && dayOfMonth == 11) {
            return '建国記念の日';

        } else if (year >= 1966 && year < 2003 && month == 9 && dayOfMonth == 15
            // 2003年ハッピーマンデー制度により月曜日固定
            || year >= 2003 && month == 9 && weekOfMonth == 3 && dayOfWeek == 1) {
            return '敬老の日';

        } else if (year >= 1966 && year < 2000 && month == 10 && dayOfMonth == 10
            // 2000年ハッピーマンデー制度により月曜日固定
            || year >= 2000 && month == 10 && weekOfMonth == 2 && dayOfWeek == 1 && year != 2020 && year != 2021
            // 2020年東京オリンピックでこの年だけ7月24日に移動
            || year == 2020 && month == 7 && dayOfMonth == 24
            // 2021年東京オリンピックでこの年だけ7月23日に移動
            || year == 2021 && month == 7 && dayOfMonth == 23) {
            // 2020年に改称
            return year >= 2020 ? 'スポーツの日' : '体育の日';

        } else if (year == 1989 && month == 2 && dayOfMonth == 24) {
            return '昭和天皇の大喪の礼';

        } else if (year >= 1989 && year < 2019 && month == 12 && dayOfMonth == 23) {
            return '天皇誕生日';

        } else if (year == 1990 && month == 11 && dayOfMonth == 12) {
            return '即位礼正殿の儀';

        } else if (year == 1993 && month == 6 && dayOfMonth == 9) {
            return '皇太子・徳仁親王の結婚の儀';

        } else if (year >= 1996 && year < 2003 && month == 7 && dayOfMonth == 20
            // 2003年ハッピーマンデー制度により月曜日固定
            || year >= 2003 && month == 7 && weekOfMonth == 3 && dayOfWeek == 1 && year != 2020 && year != 2021
            // 2020年東京オリンピックでこの年だけ7月23日に移動
            || year == 2020 && month == 7 && dayOfMonth == 23
            // 2021年東京オリンピックでこの年だけ7月22日に移動
            || year == 2021 && month == 7 && dayOfMonth == 22) {
            return '海の日';

        } else if (year >= 2007 && month == 4 && dayOfMonth == 29) {
            return '昭和の日';

        } else if (year >= 2007 && month == 5 && dayOfMonth == 4) {
            return 'みどりの日';

        } else if (year >= 2016 && month == 8 && dayOfMonth == 11 && year != 2020 && year != 2021
            // 2020年東京オリンピックでこの年だけ8月10日に移動
            || year == 2020 && month == 8 && dayOfMonth == 10
            // 2021年東京オリンピックでこの年だけ8月8日に移動
            || year == 2021 && month == 8 && dayOfMonth == 8) {
            return '山の日';

        } else if (year == 2019 && month == 5 && dayOfMonth == 1) {
            return '天皇の即位の日';

        } else if (year == 2019 && month == 10 && dayOfMonth == 22) {
            return '即位礼正殿の儀';

        } else if (year >= 2020 && month == 2 && dayOfMonth == 23) {
            return '天皇誕生日';

        }
        return null;
    }

    static isConst(date: Date): boolean {
        return null != Holiday.getConst(date);
    }

    /**
     * 
     * @param date Date
     * @returns holyday name
     */
    static get(date: Date): string | null {
        const year = date.getFullYear();
        // 祝日
        const constHoliday = Holiday.getConst(date);
        if (null != constHoliday) {
            return constHoliday;
        }
        const yesterday = Period.ofDays(-1);
        const tomorrow = Period.ofDays(1);
        // 振替休日
        if (year >= 1973) {
            let testDate: Date = new Date(date);
            // 次の日
            testDate = yesterday.addTo(testDate);
            while (Holiday.isConst(testDate)) {
                // 日曜日の場合
                if (testDate.getDay() == 0) {
                    return "振替休日"
                }
                testDate = yesterday.addTo(testDate);
            }
        }
        // 国民の休日 : 前後が祝日である平日
        if (year >= 1986) {
            if (Holiday.isConst(yesterday.addTo(date)) &&
                Holiday.isConst(tomorrow.addTo(date)) &&
                date.getDay() != 0) {
                return "国民の休日";
            }
        }
        return null;
    }
}

