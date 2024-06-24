<?php declare(strict_types=1);
namespace NagatomoO\JapaneseStyle;

use DateTime;
use DateTimeImmutable;
use DateTimeInterface;
use DateTimeZone;
use NagatomoO\JapaneseStyle\DateValueException;

/**
 * 元号
 */
class Gengo {
    /** 元号名 */
    public readonly string $name;
    /** 元号名略称 */
    public readonly string $abbrName;
    /** ローマ字名 */
    public readonly string $romanName;
    /** ローマ字名略称 */
    public readonly string $abbrRomanName;
    /** 開始日 */
    public readonly DateTimeImmutable $since;

    /**
     * 元号
     * @param string $name 元号名
     * @param string $abbrName 元号名略称
     * @param string $romanName ローマ字名
     * @param string $abbrRomanName ローマ字名略称
     * @param string $sinceString 開始日
     */
    private function __construct(string $name, string $abbrName, string $romanName, string $abbrRomanName, string $sinceString) {
        $this->name = $name;
        $this->abbrName = $abbrName;
        $this->romanName = $romanName;
        $this->abbrRomanName = $abbrRomanName;
        $this->since = DateTimeImmutable::createFromFormat(DateTimeInterface::RFC3339_EXTENDED, $sinceString, new DateTimeZone('Asia/Tokyo'));
    }

    /**
     * toString
     * @return string
     */
    function __toString(): string {
        return $this->name;
    }

    /**
     * 同値の判定
     * @param ?Gengo other
     * @return bool 同値
     */
    function equals(?Gengo $other): bool {
        return $this === $other || !is_null($other) && $this->name == $other->name && $this->since == $other->since;
    }

    /**
     * 最新の元号
     * @return static
     */
    static function now(): self {
        return self::fromDate(new DateTime('now', new DateTimeZone('Asia/Tokyo')));
    }

    /**
     * 日付から元号を取得
     * @param DateTimeInterface $date 日付
     * @return Gengo
     * @throws DateValueException $date is out of range
     */
    static function fromDate(DateTimeInterface $date): Gengo {
        foreach (array_reverse(static::list()) as $gengo) {
            if ($gengo->since <= $date) {
                return $gengo;
            }
        }
        throw new DateValueException("out of value: {$date->format('c')}");
    }

    /**
     * 日付から元号を取得
     * @param int $year Year
     * @param int $month Month
     * @param int $dayOfMonth Day
     * @return Gengo 判定結果
     */
    static function fromISODate(int $year, int $month, int $dayOfMonth): Gengo {
        $dt = new DateTime('now', new DateTimeZone('Asia/Tokyo'));
        $dt->setDate($year, $month, $dayOfMonth);
        $dt->setTime(0, 0, 0, 0);
        return static::fromDate($dt);
    }

    /**
     * 文字列から元号を取得
     * @param string $nameOrCode
     * @return Gengo 判定結果
     */
    static function of(string $nameOrCode): Gengo {
        $nameOrCode = strtolower($nameOrCode);
        foreach (array_reverse(static::list()) as $gengo) {
            if (strtolower($gengo->name) == $nameOrCode ||
                strtolower($gengo->abbrName) == $nameOrCode ||
                strtolower($gengo->romanName) == $nameOrCode ||
                strtolower($gengo->abbrRomanName) == $nameOrCode) {
                return $gengo;
            }
        }
        throw new DateValueException("out of value: {$nameOrCode}");
    }

    /**
     * 正しい元号か判定
     * @param string $nameOrCode
     * @return bool 判定結果
     */
    static function isValid(string $nameOrCode): bool {
        return static::isValidName($nameOrCode) ||
            static::isValidAbbrName($nameOrCode) ||
            static::isValidRomanName($nameOrCode) ||
            static::isValidAbbrRomanName($nameOrCode);
    }

    /**
     * 正しい元号か判定
     * @param string $name
     * @return bool 判定結果
     */
    static function isValidName(string $name): bool {
        foreach (array_reverse(static::list()) as $gengo) {
            if (strtolower($gengo->name) == strtolower($name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 正しい元号略称か判定
     * @param string $abbrName
     * @return bool 判定結果
     */
    static function isValidAbbrName(string $abbrName): bool {
        foreach (array_reverse(static::list()) as $gengo) {
            if (strtolower($gengo->abbrName) == strtolower($abbrName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 正しい元号(ローマ字)か判定
     * @param string $romanName
     * @return bool 判定結果
     */
    static function isValidRomanName(string $romanName): bool {
        foreach (array_reverse(static::list()) as $gengo) {
            if (strtolower($gengo->romanName) == strtolower($romanName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 正しい元号(ローマ字)略称か判定
     * @param string $abbrRomanName
     * @return bool 判定結果
     */
    static function isValidAbbrRomanName(string $abbrRomanName): bool {
        foreach (array_reverse(static::list()) as $gengo) {
            if (strtolower($gengo->abbrRomanName) == strtolower($abbrRomanName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 明治
     */
    static function MEIJI(): self {
        static $meiji;
        return $meiji ?? $meiji = new self('明治', '明', 'Meiji', 'M', '1868-01-25T00:00:00.000+0900');
    }
    /**
     * 大正
     */
    static function TAISHO(): self {
        static $taisho;
        return $taisho ?? $taisho = new self('大正', '大', 'Taisho', 'T', '1912-07-30T00:00:00.000+0900');
    }
    /**
     * 昭和
     */
    static function SHOWA(): self {
        static $showa;
        return $showa ?? $showa = new self('昭和', '昭', 'Showa', 'S', '1926-12-25T00:00:00.000+0900');
    }
    /**
     * 平成
     */
    static function HEISEI(): self {
        static $heisei;
        return $heisei ?? $heisei = new self('平成', '平', 'Heisei', 'H', '1989-01-08T00:00:00.000+0900');
    }
    /**
     * 令和
     */
    static function REIWA(): self {
        static $reiwa;
        return $reiwa ?? $reiwa = new self('令和', '令', 'Reiwa', 'R', '2019-05-01T00:00:00.000+0900');
    }

    /**
     * 元号一覧
     * @return array[self]
     */
    static function list(): array {
        return [
            self::MEIJI(),
            self::TAISHO(),
            self::SHOWA(),
            self::HEISEI(),
            self::REIWA(),
        ];
    }
}
