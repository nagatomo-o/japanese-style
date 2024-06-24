import { Period } from "./Period";

export class Calendar {
    // 振替休日の施行日
    static ImplementationDateOfSubstituteHoliday = new Date("1973-04-12 00:00:00.000000+09:00");
    // 国民の休日の施行日
    static ImplementationDateOfAdditionalHoliday = new Date("1985-12-27 00:00:00.000000+09:00");

    /**
     * 春分の日
     * @param int $year 年
     * @return int 日
     */
    static getVernalEquinoxDay(year: number): number {
        return Math.floor((0.242385544201545 * year) - (Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)) + 20.9150411785049);
    }

    /**
     * 秋分の日
     * @param int $year 年
     * @return int 日
     */
    static getAutumnalEquinoxDay(year: number): number {
        return Math.floor((0.242035499172366 * year) - (Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)) + 24.0227494548387);
    }

    static getConstHoliday(date: Date): string | null {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();
        const weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1;

        if (year > 1948 && month == 1 && dayOfMonth == 1) {
            return '元日';

        } else if (year > 1948 && year < 2000 && month == 1 && dayOfMonth == 15
            // 2000年ハッピーマンデー制度により月曜日固定
            || year >= 2000 && month == 1 && weekOfMonth == 2 && dayOfWeek == 1) {
            return '成人の日';

        } else if (year > 1948 && month == 3 && dayOfMonth == Calendar.getVernalEquinoxDay(year)) {
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

        } else if (year >= 1948 && month == 9 && dayOfMonth == Calendar.getAutumnalEquinoxDay(year)) {
            return '秋分の日';

        } else if (year >= 1948 && month == 11 && dayOfMonth == 3) {
            return '文化の日';

        } else if (year >= 1948 && month == 11 && dayOfMonth == 23) {
            return '勤労感謝の日';

        } else if (year == 1959 && month == 4 && dayOfMonth == 10) {
            // 皇太子・明仁親王の結婚の儀
            return '結婚の儀';

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
            // 昭和天皇の大喪の礼
            return '大喪の礼';

        } else if (year >= 1989 && year < 2019 && month == 12 && dayOfMonth == 23) {
            return '天皇誕生日';

        } else if (year == 1990 && month == 11 && dayOfMonth == 12) {
            return '即位礼正殿の儀';

        } else if (year == 1993 && month == 6 && dayOfMonth == 9) {
            // 皇太子・徳仁親王の結婚の儀
            return '結婚の儀';

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

    static isConstHoliday(date: Date): boolean {
        return null != Calendar.getConstHoliday(date);
    }

    /**
     * 
     * @param Date date
     * @returns string holyday name
     */
    static getHoliday(date: Date): string | null {
        // 通常の祝日
        const constHoliday = Calendar.getConstHoliday(date);
        if (null != constHoliday) {
            return constHoliday;
        }
        const yesterday = Period.ofDays(-1);
        const tomorrow = Period.ofDays(1);
        // 振替休日
        if (date >= Calendar.ImplementationDateOfSubstituteHoliday) {
            let testDate: Date = new Date(date);
            // 次の日
            testDate = yesterday.addTo(testDate);
            while (Calendar.isConstHoliday(testDate)) {
                // 日曜日の場合
                if (testDate.getDay() == 0) {
                    return "振替休日";
                }
                testDate = yesterday.addTo(testDate);
            }
        }
        // 国民の休日 : 前後が祝日である平日
        if (date >= Calendar.ImplementationDateOfAdditionalHoliday) {
            if (Calendar.isConstHoliday(yesterday.addTo(date)) &&
                Calendar.isConstHoliday(tomorrow.addTo(date)) &&
                date.getDay() != 0) {

                return "国民の休日";
            }
        }
        return null;
    }
}

