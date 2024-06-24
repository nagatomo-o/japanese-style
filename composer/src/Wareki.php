<?php declare(strict_types=1);
namespace NagatomoO\JapaneseStyle;

use DateTime;
use Error;
use DateTimeInterface;
use NagatomoO\JapaneseStyle\Gengo;

/**
 * 和暦
 */
class Wareki {
    /** 元号 */
    public readonly Gengo $gengo;
    /** 年 */
    public readonly int $nen;
    /** 西暦年 */
    public readonly int $year;

    /**
     * コンストラクタ
     * @param Gengo $gengo
     * @param int $nen
     */
    function __construct(Gengo $gengo, int $nen) {
        if (!self::isValid($gengo, $nen)) {
            throw new DateValueException("invalid value gengo:{$gengo} nen:{$nen}");
        }
        $this->gengo = $gengo;
        $this->nen = $nen;
        $this->year = self::toYear($gengo, $nen);
    }

    /**
     * @return string
     */
    function __toString(): string {
        return strval($this->gengo) . strval($this->nen);
    }

    /**
     * 西暦年を取得
     */
    static function toYear(Gengo $gengo, int $nen): int {
        return intval($gengo->since->format('Y')) + $nen - 1;
    }

    /**
     * 同値の比較
     * @param Wareki $other
     * @return bool 判定結果
     */
    function equals(?Wareki $other): bool {
        return $this === $other || !is_null($other) && $this->gengo->equals($other->gengo) && $this->nen == $other->nen;
    }

    /**
     * 今の和暦を取得
     * @return Wareki 和暦
     */
    static function now(): Wareki {
        return self::fromDate(new DateTime());
    }

    /**
     * 日付から和暦を取得
     * @param {Date} date 日付
     * @return {Wareki} 和暦
     */
    static function fromDate(DateTimeInterface $date): Wareki {
        // 元号と開始年取得
        $gengo = Gengo::fromDate($date);
        // 引数の年取得
        $year = intval($date->format('Y'));
        // 開始年からの年によって和暦年を取得
        $nen = $year - intval($gengo->since->format('Y')) + 1;
        return new static($gengo, $nen);
    }

    /**
     * 元号と元号年の組み合わせが正しいか判定
     * @param Gengo $gengo
     * @param int $nen
     * @return bool 判定結果
     */
    static function isValid(Gengo $gengo, int $nen): bool {
        if ($nen < 1) {
            return false;
        }
        $gengoList = Gengo::list();
        foreach ($gengoList as $idx => $g) {
            if (!$g->equals($gengo)) {
                continue;
            }
            // 次の元号
            $nextGengo = ($idx + 1 < count($gengoList)) ? $gengoList[$idx + 1] : null;
            // 現在の元号の最後の年
            $lastNen = is_null($nextGengo) ? 99 : intval($nextGengo->since->format('Y')) - intval($gengo->since->format('Y')) + 1;
            // 最後の年を超えていないか
            return $nen <= $lastNen;
        }
        throw new Error("gengo out of range : {$gengo}");
    }
}
