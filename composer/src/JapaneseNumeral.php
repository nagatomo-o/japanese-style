<?php declare(strict_types=1);
namespace NagatomoO\JapaneseStyle;

use ValueError;
use NagatomoO\JapaneseStyle\JapaneseNumeralException;

/**
 * 漢数字
 */
class JapaneseNumeral {
    /** 数 */
    private const NUMERALS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    /** 十進法 */
    private const DECIMAL_NUMERALS = ["", "十", "百", "千"];
    /** 万進法 */
    private const MYRIAD_NUMERALS = ["", "万", "億", "兆", "京"];

    /**
     * Converts a number into a string of Japanese numerals.
     * The number must be greater than or equal to 0.
     *
     * @param int $number The number
     * @return string Japanese numerals
     * @throws JapaneseNumeralException
     */
    static function format(int $number): string {
        // Negative values ​​are not supported
        if ($number < 0) {
            throw new ValueError("number({$number}) must be positive.");
        }
        // Zero is returned "〇"
        if ($number == 0) {
            return static::NUMERALS[0];
        }
        $numString = strval($number);
        $result = "";
        $myriad = false;
        // 上位の位から
        for ($i = 0; $i < strlen($numString); $i++) {
            $c = substr($numString, $i, 1);
            if (strstr("0123456789", $c) === false) {
                throw new ValueError("invalid character: {$c}");
            }
            $digit = strlen($numString) - $i - 1;
            $num = intval($c);
            $decimalNumeral = $digit % 4;
            $myriadNumeral = $decimalNumeral == 0 ? $digit / 4 : 0;
            // 一～九（十、百、千の位の一はつけない）
            if ($num != 0 && !($num == 1 && $decimalNumeral > 0)) {
                $result .= static::NUMERALS[$num];
                $myriad = true;
            }
            // 十,百,千,
            if ($num != 0 && $decimalNumeral != 0) {
                $result .= static::DECIMAL_NUMERALS[$decimalNumeral];
                $myriad = true;
            }
            // 万,億,兆
            if ($myriad && $myriadNumeral > 0) {
                $result .= static::MYRIAD_NUMERALS[$myriadNumeral];
                $myriad = false;
            }
        }
        return $result;
    }

    /**
     * 漢数字を数値に変換します 0は〇で返します
     *
     * @param string $str 漢数字
     * @return int 0以上の数
     * @throws JapaneseNumeralException sss
     */
    static function parse(string $str): int {
        if ($str == null || $str == "") {
            throw new ValueError("string is empty.");
        }
        if ($str == static::NUMERALS[0]) {
            return 0;
        }
        $degits = [0];
        $myriadNumeral = 0;
        $decimalNumeral = 0;
        // 漢数字一桁から順に数字配列に変換
        // "千二百五" -> [5,undefined,2,1]
        for ($i = strlen($str) - 1; $i >= 0; $i--) {
            $c = substr($str, $i, 1);
            $n2 = array_search($c, static::MYRIAD_NUMERALS);
            $n1 = array_search($c, static::DECIMAL_NUMERALS);
            $n0 = array_search($c, static::NUMERALS);
            if ($n2 !== false) {
                $myriadNumeral = $n2;
                $decimalNumeral = 0;
            } else if ($n1 !== false) {
                $decimalNumeral = $n1;
                $degits[$myriadNumeral * 4 + $decimalNumeral] = 1;
            } else if ($n0 !== false) {
                $degits[$myriadNumeral * 4 + $decimalNumeral] = $n0;
            } else {
                throw new JapaneseNumeralException("invalid character: {$c}");
            }
        }
        // 数字配列を文字列へ変換
        // [5,undefined,2,1] -> "1205"
        $numString = "";
        for ($degit = count($degits); $degit >= 0; $degit--) {
            $num = $degits[$degit];
            $numString .= $num ? strval($num) : "0";
        }
        return intval($numString);
    }
}
