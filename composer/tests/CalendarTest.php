<?php declare(strict_types=1);

namespace NagatomoO\JapaneseStyle;

use DateTimeImmutable;
use DateInterval;
use DateTimeZone;
use PHPUnit\Framework\TestCase;
use NagatomoO\JapaneseStyle\Calendar;
use PHPUnit\Framework\Attributes\DataProvider;
use Exception;
use Iterator;
use DateTimeInterface;

class Holidays {
    private array $holidays;
    // 内閣府 「国民の祝日」について
    // https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html
    const GOV_CSV = "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv";

    /**
     * 初期化
     */
    public function __construct() {
        $this->holidays = [];
        if (($handle = fopen(self::GOV_CSV, "r")) !== false) {
            while (($data = fgetcsv($handle)) !== false) {
                if (preg_match("/\d+\/\d+\/\d+/", $data[0]) === 0) {
                    continue;
                }
                $data = mb_convert_encoding($data, "UTF-8", "Shift-JIS");
                $date = DateTimeImmutable::createFromFormat("Y/n/j", $data[0], new DateTimeZone("Asia/Tokyo"));
                $date = $date->setTime(0, 0, 0, 0);
                if ($date === false) {
                    throw new Exception($data[0]);
                }
                $name = $data[1];
                // 括弧は削除
                $name = preg_replace('/（.+?）/', '', $name);
                $this->holidays[] = [$date, $name];
            }
            fclose($handle);
        } else {
            throw new Exception(self::GOV_CSV);
        }
    }

    /**
     * @param DateTimeInterface
     */
    public function getName(DateTimeInterface $date): ?string {
        foreach ($this->holidays as list($holiday_date, $holiday_name)) {
            if ($holiday_date->format('Ymd') == $date->format('Ymd')) {
                return $holiday_name;
            }
        }
        return null;
    }
}

class DateIterator implements Iterator {
    private DateInterval $next;
    private DateTimeImmutable $currentDate;
    private DateTimeImmutable $endDate;
    private int $num;
    private Holidays $holidays;
    public function __construct() {
        $this->next = new DateInterval('P1D');
        // 開始日 = 1955年
        $this->currentDate = new DateTimeImmutable("1955-01-01 00:00:00.000000", Calendar::TimeZone());
        // 終了日 = 一年後
        $this->endDate = new DateTimeImmutable('+1 year', Calendar::TimeZone());
        $this->num = 0;
        $this->holidays = new Holidays();
    }

    public function current(): array {
        $name = $this->holidays->getName($this->currentDate);
        return [$this->currentDate, $name];
    }

    public function key(): mixed {
        return $this->num;
    }

    public function next(): void {
        $this->num++;
        $this->currentDate = $this->currentDate->add($this->next);
    }

    public function rewind(): void {
        $this->num = 0;
        $this->currentDate = new DateTimeImmutable("1955-01-01 00:00:00.000000", Calendar::TimeZone());
    }

    public function valid(): bool {
        return $this->currentDate <= $this->endDate;
    }
}

class CalendarTest extends TestCase {

    /**
     * @return array
     */
    public static function date_provider(): DateIterator {
        return new DateIterator();
    }

    #[DataProvider('date_provider')]
    public function test_holidays(DateTimeImmutable $date, ?string $expected_holiday) {
        $actual_holiday = Calendar::getHoliday($date);
        if (is_null($expected_holiday)) {
            $this->assertNull($actual_holiday, $date->format('Y-m-d'));
        } elseif (!is_null($expected_holiday)) {
            // 合わせるため補正
            if (in_array($actual_holiday, ['振替休日', '国民の休日', '天皇の即位の日', '即位礼正殿の儀'])) {
                $this->assertNotNull($actual_holiday, $date->format('Y-m-d'));
            } else {
                $this->assertEquals($expected_holiday, $actual_holiday, $date->format('Y-m-d'));
            }
        }
    }
}
