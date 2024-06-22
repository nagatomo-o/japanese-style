<?php declare(strict_types=1);
namespace JapaneseStyle;

include "Gengo.php";
include "Wareki.php";
include "JapaneseNumeral.php";

use JapaneseStyle\Gengo;
use JapaneseStyle\Wareki;
use JapaneseStyle\JapaneseNumeral;
use DateTimeInterface;
use DateTime;

/**
 * 日付項目
 */
class DateFields {
    /** 元号 */
    public ?Gengo $gengo;
    /** 年 */
    public int $nen;
    /** 年 */
    public int $year;
    /** 月 */
    public int $month;
    /** 日 */
    public int $dayOfMonth;
    /** 年 */
    public int $hours;
    public int $minutes;
    public int $seconds;
    public int $milliseconds;

    /**
     * 初期化
     */
    function __construct() {
        $this->gengo = null;
        $this->nen = 0;
        $this->year = 0;
        $this->month = 1;
        $this->dayOfMonth = 1;
        $this->hours = 0;
        $this->minutes = 0;
        $this->seconds = 0;
        $this->milliseconds = 0;
    }

    /**
     * 今の日付からクラスインスタンスを作成
     * @return static インスタンス
     */
    static function now(): static {
        return static::fromDate(new DateTime());
    }

    /**
     * 指定した日付からクラスインスタンスを作成
     * @return static インスタンス
     */
    static function fromDate(DateTimeInterface $date): static {
        $d = new static();
        $wareki = Wareki::fromDate($date);
        $d->gengo = $wareki->gengo;
        $d->nen = $wareki->nen;
        $d->year = intval($date->format('Y'));
        $d->month = intval($date->format('n'));
        $d->dayOfMonth = intval($date->format('j'));
        $d->hours = intval($date->format('H'));
        $d->minutes = intval($date->format('i'));
        $d->seconds = intval($date->format('s'));
        $d->milliseconds = intval($date->format('v'));
        return $d;
    }

    /**
     * 日付に変換
     * @return DateTime DateTimeインスタンス
     */
    function toDate(): DateTime {
        $d = new DateTime();
        if ($this->gengo != null && $this->nen > 0) {
            $this->year = (new Wareki($this->gengo, $this->nen))->year;
        }
        $d->setDate($this->year, $this->month, $this->dayOfMonth);
        $d->setTime($this->hours, $this->minutes, $this->seconds, $this->milliseconds);
        return $d;
    }
}
/**
 * プロパティ
 */
class Property {
    /** 日時パターン */
    public readonly string $dateTimePattern;
    /** 正規表現 */
    public readonly string $regularPattern;
    /** 最低長さ */
    private readonly int $minLength;
    /** 値の取得処理 */
    private $fieldValueGetter;
    /** 値の設定処理 */
    private $fieldValueSetter;

    /**
     * 初期化
     * @param string $dateTimePattern 日時パターン
     * @param string $regularPattern 正規表現
     * @param int $minLength 最低長さ
     * @param callable $fieldValueGetter 値の取得処理
     * @param callable $fieldValueSetter 値の設定処理
     */
    function __construct(string $dateTimePattern, string $regularPattern, int $minLength, callable $fieldValueGetter, callable $fieldValueSetter) {
        $this->dateTimePattern = $dateTimePattern;
        $this->regularPattern = $regularPattern;
        $this->minLength = $minLength;
        $this->fieldValueGetter = $fieldValueGetter;
        $this->fieldValueSetter = $fieldValueSetter;
    }

    public function getFieldValue(DateFields $date): string {
        $f = $this->fieldValueGetter;
        $num = $f($date);
        $str = gettype($num) == 'integer' ? strval($num) : $num;
        if (strlen($str) < $this->minLength) {
            return str_repeat('0', $this->minLength - strlen($str)) . $str;
        }
        return $str;
    }

    public function setFieldValue(DateFields $date, string $value): void {
        $f = $this->fieldValueSetter;
        $f($date, $value);
    }
}

class StringProperty extends Property {
    function __construct(string $text) {
        parent::__construct('\'' . $text . '\'', $text, strlen($text), fn($d) => $text, fn($d, $v) => null);
    }
}

class DateTimeFormatter {
    /** @var string */
    private readonly string $dateTimePattern;
    /** @var Property[] */
    private array $properties;
    /** @var string */
    private readonly string $regularExpression;

    /**
     *  Symbol  Meaning                     Presentation      Examples
     *  ------  -------                     ------------      -------
     *   G       era                         text              AD; Anno Domini; A
     *   y       year-of-era                 year              2004; 04
     *   D       day-of-year                 number            189
     *   M       month-of-year               number/text       7; 07; Jul; July; J
     *   d       day-of-month                number            10
     * 
     *   H       hour-of-day (0-23)          number            0
     *   m       minute-of-hour              number            30
     *   s       second-of-minute            number            55
     *   S       milli-of-second             number            978
     * 
     * @param {string} dateTimePattern
     */
    function __construct(string $dateTimePattern) {
        // Set DateTime Pattern
        $this->dateTimePattern = $dateTimePattern;
        // Build Properties
        $this->properties = [];
        $p = $dateTimePattern;
        while (strlen($p) > 0) {
            $find = false;
            foreach (DateTimeFormatter::PROPERTIES() as $pattern) {
                if (str_starts_with($p, $pattern->dateTimePattern)) {
                    array_push($this->properties, $pattern);
                    $p = substr($p, strlen($pattern->dateTimePattern));
                    $find = true;
                }
            }
            if (!$find) {
                array_push($this->properties, new StringProperty(substr($p, 0, 1)));
                $p = substr($p, 1);
            }
        }
        // Build Eegular Expression
        $expression = "";
        foreach ($this->properties as $property) {
            $expression .= '(' . $property->regularPattern . ')';
        }
        $this->regularExpression = '/^' . $expression . '/';
    }

    /**
     * パース
     * 
     * @param {string} text
     * @return {Date} date
     */
    function parse(string $text): DateTime {
        if ($text == "") {
            throw new \Exception('parse exception empty');
        }
        $match = preg_match($this->regularExpression, $text, $matches, PREG_UNMATCHED_AS_NULL);
        if (!$match) {
            throw new \Exception('parse exception pattern:' . $this->dateTimePattern . ' text:' . $text);
        }
        $dateField = new DateFields();
        $i = 0;
        foreach ($this->properties as $property) {
            $fieldValue = $matches[++$i];
            if (!($property instanceof StringProperty)) {
                $property->setFieldValue($dateField, $fieldValue);
            }
        }

        return $dateField->toDate();
    }

    /**
     * 
     * @param {Date|JapaneseDate} date
     * @return {string} text
     */
    function format(DateTimeInterface $date): string {
        $text = "";
        $dateField = DateFields::fromDate($date);
        foreach ($this->properties as $property) {
            if ($property instanceof StringProperty) {
                $text .= $property->regularPattern;
            } else {
                $text .= $property->getFieldValue($dateField);
            }
        }
        return $text;
    }

    /**
     * ToString
     */
    function toString(): string {
        return $this->dateTimePattern;
    }

    /**
     * 和暦のパターン
     */
    static function PROPERTIES() {
        static $property_values;
        return $property_values ?? $property_values = [
            // GGGG : 平成, 令和
            new Property('GGGG', implode('|', array_map(fn(Gengo $gengo): string => $gengo->name, Gengo::list())), 0, fn(DateFields $d) => $d->gengo->name, fn(DateFields $d, string $v) => $d->gengo = Gengo::of($v)),
            // GGG : Heisei, Reiwa
            new Property('GGG', implode('|', array_map(fn(Gengo $gengo): string => $gengo->romanName, Gengo::list())), 0, fn(DateFields $d) => $d->gengo->romanName, fn(DateFields $d, string $v) => $d->gengo = Gengo::of($v)),
            // GG : 平,令
            new Property('GG', implode('|', array_map(fn(Gengo $gengo): string => $gengo->abbrName, Gengo::list())), 0, fn(DateFields $d) => $d->gengo->abbrName, fn(DateFields $d, string $v) => $d->gengo = Gengo::of($v)),
            // G : H,R
            new Property('G', implode('|', array_map(fn(Gengo $gengo): string => $gengo->abbrRomanName, Gengo::list())), 0, fn(DateFields $d) => $d->gengo->abbrRomanName, fn(DateFields $d, string $v) => $d->gengo = Gengo::of($v)),
            // yyyy : 元, 二, 三, ,, 九十九
            new Property('yyyy', '元|[一-九十]{1,3}', 0, fn(DateFields $d) => $d->nen == 1 ? '元' : JapaneseNumeral::format($d->nen), fn(DateFields $d, string $v) => $d->nen = $v == '元' ? 1 : JapaneseNumeral::parse($v)),
            // yyy : 元, 02, 03, ,, 99
            new Property('yyy', '元|[2-9]|[1-9][0-9]', 0, fn(DateFields $d) => $d->nen == 1 ? '元' : $d->nen, fn(DateFields $d, string $v) => $d->nen = $v == '元' ? 1 : intval($v)),
            // yy : 01, 02, 03, ,, 99
            new Property('yy', '[0-9]{2}', 0, fn(DateFields $d) => $d->nen % 100, fn(DateFields $d, string $v) => $d->nen = intval($v)),
            // y : 1, 2, 3, ,, 99
            new Property('y', '[0-9]{1,2}', 0, fn(DateFields $d) => $d->nen, fn(DateFields $d, string $v) => $d->nen = intval($v)),
            // uuuu : 0001, ,, 2025,2026,
            new Property('uuuu', '[0-9]{4}', 4, fn(DateFields $d) => $d->year, fn(DateFields $d, string $v) => $d->year = intval($v)),
            // uuu : 001, ,, 2025,2026,
            new Property('uuu', '[0-9]{3,4}', 3, fn(DateFields $d) => $d->year, fn(DateFields $d, string $v) => $d->year = intval($v)),
            // uu : 01, ,, 25,26,
            new Property('uu', '[0-9]{2}', 2, fn(DateFields $d) => $d->year % 100, fn(DateFields $d, string $v) => $d->year = 2000 + intval($v)),
            // u : 1, ,, 2025,2026,
            new Property('u', '[0-9]{1,4}', 1, fn(DateFields $d) => $d->year, fn(DateFields $d, string $v) => $d->year = intval($v)),
            new Property('MM', '0[1-9]|1[012]', 2, fn(DateFields $d) => $d->month, fn(DateFields $d, string $v) => $d->month = intval($v)),
            new Property('M', '[1-9]|1[012]', 1, fn(DateFields $d) => $d->month, fn(DateFields $d, string $v) => $d->month = intval($v)),
            new Property('dd', '0[1-9]|[1-2][0-9]|30|31', 2, fn(DateFields $d) => $d->dayOfMonth, fn(DateFields $d, string $v) => $d->dayOfMonth = intval($v)),
            new Property('d', '[1-9]|[1-2][0-9]|30|31', 1, fn(DateFields $d) => $d->dayOfMonth, fn(DateFields $d, string $v) => $d->dayOfMonth = intval($v)),
            new Property('HH', '[01][0-9]|2[0123]', 2, fn(DateFields $d) => $d->hours, fn(DateFields $d, string $v) => $d->hours = intval($v)),
            new Property('H', '1?[0-9]|2[0123]', 1, fn(DateFields $d) => $d->hours, fn(DateFields $d, string $v) => $d->hours = intval($v)),
            new Property('mm', '[0-5][0-9]', 2, fn(DateFields $d) => $d->minutes, fn(DateFields $d, string $v) => $d->minutes = intval($v)),
            new Property('m', '[1-5]?[0-9]', 1, fn(DateFields $d) => $d->minutes, fn(DateFields $d, string $v) => $d->minutes = intval($v)),
            new Property('ss', '[0-5][0-9]', 2, fn(DateFields $d) => $d->seconds, fn(DateFields $d, string $v) => $d->seconds = intval($v)),
            new Property('s', '[1-5]?[0-9]', 1, fn(DateFields $d) => $d->seconds, fn(DateFields $d, string $v) => $d->seconds = intval($v)),
            new Property('SSS', '[0-9]{3}', 3, fn(DateFields $d) => $d->milliseconds, fn(DateFields $d, string $v) => $d->milliseconds = intval($v)),
            new Property('SS', '[0-9]{2,3}', 2, fn(DateFields $d) => $d->milliseconds, fn(DateFields $d, string $v) => $d->milliseconds = intval($v)),
            new Property('S', '[0-9]{1,3}', 1, fn(DateFields $d) => $d->milliseconds, fn(DateFields $d, string $v) => $d->milliseconds = intval($v)),
        ];
    }
}

$a = new DateTimeFormatter('GGGG年yy/uuuu/MM/dd');
echo $a->format(new DateTime());