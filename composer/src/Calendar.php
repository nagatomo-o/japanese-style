<?php declare(strict_types=1);
namespace NagatomoO\JapaneseStyle;

use DateTimeZone;
use DateTimeInterface;
use DateInterval;
use DateTimeImmutable;

class Calendar {
    static function TimeZone(): DateTimeZone {
        static $TZ;
        return $TZ ?? $TZ = new DateTimeZone('Asia/Tokyo');
    }

    // 振替休日の施行日
    static function ImplementationDateOfSubstituteHoliday(): DateTimeImmutable {
        static $d;
        return $d ?? $d = new DateTimeImmutable("1973-04-12 00:00:00.000000", self::TimeZone());
    }
    // 国民の休日の施行日
    static function ImplementationDateOfAdditionalHoliday(): DateTimeImmutable {
        static $d;
        return $d ?? $d = new DateTimeImmutable("1985-12-27 00:00:00.000000", self::TimeZone());
    }

	/**
	 * 春分の日
	 * @param int $year 年
	 * @return int 日
	 */
    static function getVernalEquinoxDay(int $year): int {
        return (int) floor((0.242385544201545 * $year) - (floor($year / 4) - floor($year / 100) + floor($year / 400)) + 20.9150411785049);
    }

	/**
	 * 秋分の日
	 * @param int $year 年
	 * @return int 日
	 */
    static function getAutumnalEquinoxDay(int $year): int {
        return (int) floor((0.242035499172366 * $year) - (floor($year / 4) - floor($year / 100) + floor($year / 400)) + 24.0227494548387);
    }

    static function getConstHoliday(DateTimeInterface $date): ?string {
        $year = intval($date->format('Y'));
        $month = intval($date->format('n'));
        $dayOfMonth = intval($date->format('j'));
        $dayOfWeek = intval($date->format('w'));
        $weekOfMonth = (int) floor(($dayOfMonth - 1) / 7) + 1;

        if ($year > 1948 && $month == 1 && $dayOfMonth == 1) {
            return '元日';

        } else if ($year > 1948 && $year < 2000 && $month == 1 && $dayOfMonth == 15
            // 2000年ハッピーマンデー制度により月曜日固定
            || $year >= 2000 && $month == 1 && $weekOfMonth == 2 && $dayOfWeek == 1) {
            return '成人の日';

        } else if ($year > 1948 && $month == 3 && $dayOfMonth == self::getVernalEquinoxDay($year)) {
            return '春分の日';

        } else if ($year > 1948 && $month == 4 && $dayOfMonth == 29) {
            if ($year <= 1988) {
                return "天皇誕生日";
            } else if ($year >= 1989 && $year < 2007) {
                return "みどりの日";
            } else if ($year >= 2007) {
                return "昭和の日";
            }

        } else if ($year > 1948 && $month == 5 && $dayOfMonth == 3) {
            return '憲法記念日';

        } else if ($year > 1948 && $month == 5 && $dayOfMonth == 5) {
            return 'こどもの日';

        } else if ($year >= 1948 && $month == 9 && $dayOfMonth == self::getAutumnalEquinoxDay($year)) {
            return '秋分の日';

        } else if ($year >= 1948 && $month == 11 && $dayOfMonth == 3) {
            return '文化の日';

        } else if ($year >= 1948 && $month == 11 && $dayOfMonth == 23) {
            return '勤労感謝の日';

        } else if ($year == 1959 && $month == 4 && $dayOfMonth == 10) {
            // 皇太子・明仁親王の結婚の儀
            return '結婚の儀';

        } else if ($year > 1966 && $month == 2 && $dayOfMonth == 11) {
            return '建国記念の日';

        } else if ($year >= 1966 && $year < 2003 && $month == 9 && $dayOfMonth == 15
            // 2003年ハッピーマンデー制度により月曜日固定
            || $year >= 2003 && $month == 9 && $weekOfMonth == 3 && $dayOfWeek == 1) {
            return '敬老の日';

        } else if ($year >= 1966 && $year < 2000 && $month == 10 && $dayOfMonth == 10
            // 2000年ハッピーマンデー制度により月曜日固定
            || $year >= 2000 && $month == 10 && $weekOfMonth == 2 && $dayOfWeek == 1 && $year != 2020 && $year != 2021
            // 2020年東京オリンピックでこの年だけ7月24日に移動
            || $year == 2020 && $month == 7 && $dayOfMonth == 24
            // 2021年東京オリンピックでこの年だけ7月23日に移動
            || $year == 2021 && $month == 7 && $dayOfMonth == 23) {
            // 2020年に改称
            return $year >= 2020 ? 'スポーツの日' : '体育の日';

        } else if ($year == 1989 && $month == 2 && $dayOfMonth == 24) {
            // 昭和天皇の大喪の礼
            return '大喪の礼';

        } else if ($year >= 1989 && $year < 2019 && $month == 12 && $dayOfMonth == 23) {
            return '天皇誕生日';

        } else if ($year == 1990 && $month == 11 && $dayOfMonth == 12) {
            return '即位礼正殿の儀';

        } else if ($year == 1993 && $month == 6 && $dayOfMonth == 9) {
            // 皇太子・徳仁親王の結婚の儀
            return '結婚の儀';

        } else if ($year >= 1996 && $year < 2003 && $month == 7 && $dayOfMonth == 20
            // 2003年ハッピーマンデー制度により月曜日固定
            || $year >= 2003 && $month == 7 && $weekOfMonth == 3 && $dayOfWeek == 1 && $year != 2020 && $year != 2021
            // 2020年東京オリンピックでこの年だけ7月23日に移動
            || $year == 2020 && $month == 7 && $dayOfMonth == 23
            // 2021年東京オリンピックでこの年だけ7月22日に移動
            || $year == 2021 && $month == 7 && $dayOfMonth == 22) {
            return '海の日';

        } else if ($year >= 2007 && $month == 4 && $dayOfMonth == 29) {
            return '昭和の日';

        } else if ($year >= 2007 && $month == 5 && $dayOfMonth == 4) {
            return 'みどりの日';

        } else if ($year >= 2016 && $month == 8 && $dayOfMonth == 11 && $year != 2020 && $year != 2021
            // 2020年東京オリンピックでこの年だけ8月10日に移動
            || $year == 2020 && $month == 8 && $dayOfMonth == 10
            // 2021年東京オリンピックでこの年だけ8月8日に移動
            || $year == 2021 && $month == 8 && $dayOfMonth == 8) {
            return '山の日';

        } else if ($year == 2019 && $month == 5 && $dayOfMonth == 1) {
            return '天皇の即位の日';

        } else if ($year == 2019 && $month == 10 && $dayOfMonth == 22) {
            return '即位礼正殿の儀';

        } else if ($year >= 2020 && $month == 2 && $dayOfMonth == 23) {
            return '天皇誕生日';

        }
        return null;
    }

    static function isConstHoliday(DateTimeInterface $date): bool {
        return !is_null(self::getConstHoliday($date));
    }

    /**
     * 
     * @param DateTimeInterface $date Date
     * @return string holyday name
     */
    static function getHoliday(DateTimeInterface $date): ?string {
        if (!($date instanceof DateTimeImmutable)) {
            $date = DateTimeImmutable::createFromInterface($date);
        }
        // 通常の祝日
        $constHoliday = self::getConstHoliday($date);
        if (!is_null($constHoliday)) {
            return $constHoliday;
        }
        $aday = new DateInterval('P1D');
        // 振替休日
        if ($date >= self::ImplementationDateOfSubstituteHoliday()) {
            $testDate = DateTimeImmutable::createFromInterface($date);
            // 前の日が祝日で日曜であれば振替休日
            $testDate = $testDate->sub($aday);
            while (self::isConstHoliday($testDate)) {
                // 日曜日の場合
                if (intval($testDate->format('w')) == 0) {
                    return '振替休日';
                }
                $testDate = $testDate->sub($aday);
            }
        }
        // 国民の休日 : 前後が祝日である平日
        if ($date >= self::ImplementationDateOfAdditionalHoliday()) {
            if (self::isConstHoliday($date->sub($aday)) &&
                self::isConstHoliday($date->add($aday)) &&
                intval($date->format('w')) != 0) {
                return '国民の休日';
            }
        }
        return null;
    }
}

