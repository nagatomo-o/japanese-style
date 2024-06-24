<?php declare(strict_types=1);

namespace NagatomoO\JapaneseStyle;

use DateTime;
use DateTimeImmutable;
use DateTimeZone;
use PHPUnit\Framework\TestCase;
use NagatomoO\JapaneseStyle\Wareki;
use NagatomoO\JapaneseStyle\Gengo;
use NagatomoO\JapaneseStyle\DateValueException;

class WarekiTest extends TestCase {

    public function testInvalidConstruct() {
        $invalidDataSet = [
            [Gengo::HEISEI(), 0],
            [Gengo::HEISEI(), 40]
        ];
        foreach ($invalidDataSet as $invalidData) {
            $gengo = $invalidData[0];
            $nen = $invalidData[1];
            $this->expectException(DateValueException::class);
            $this->expectExceptionMessage("invalid value gengo:{$gengo} nen:{$nen}");
            new Wareki($gengo, $nen);
        }
    }

    public function testProperties() {
        $gengo = Gengo::HEISEI();
        $nen = 30;
        $year = intval($gengo->since->format('Y')) + $nen - 1;

        $wareki = new Wareki($gengo, $nen);
        $this->assertEquals($gengo, $wareki->gengo);
        $this->assertEquals($nen, $wareki->nen);
        $this->assertEquals($year, $wareki->year);
    }

    public function testToString() {
        $this->assertEquals("明治1", strval(new Wareki(Gengo::MEIJI(), 1)));
        $this->assertEquals("大正2", strval(new Wareki(Gengo::TAISHO(), 2)));
        $this->assertEquals("昭和3", strval(new Wareki(Gengo::SHOWA(), 3)));
        $this->assertEquals("平成4", strval(new Wareki(Gengo::HEISEI(), 4)));
        $this->assertEquals("令和10", strval(new Wareki(Gengo::REIWA(), 10)));
    }

    public function testToYear() {
        $this->assertEquals(1868, Wareki::toYear(Gengo::MEIJI(), 1));
        $this->assertEquals(1913, Wareki::toYear(Gengo::TAISHO(), 2));
        $this->assertEquals(1928, Wareki::toYear(Gengo::SHOWA(), 3));
        $this->assertEquals(1992, Wareki::toYear(Gengo::HEISEI(), 4));
        $this->assertEquals(2028, Wareki::toYear(Gengo::REIWA(), 10));
    }


    public function testEquals() {
        $a = new Wareki(Gengo::REIWA(), 12);
        $b = new Wareki(Gengo::REIWA(), 12);
        $this->assertTrue($a->equals($b));

        $a = new Wareki(Gengo::REIWA(), 12);
        $b = new Wareki(Gengo::REIWA(), 11);
        $this->assertFalse($a->equals($b));

        $a = new Wareki(Gengo::HEISEI(), 12);
        $b = new Wareki(Gengo::REIWA(), 12);
        $this->assertFalse($a->equals($b));

        $a = new Wareki(Gengo::HEISEI(), 12);
        $this->assertFalse($a->equals(null));
    }

    public function testNow() {
        $now_wareki = Wareki::now();
        $now_year = intval((new DateTime())->format('Y'));
        $now_gengo = Gengo::now();
        $now_gengo_since_year = intval($now_gengo->since->format('Y'));
        $now_nen = $now_year - $now_gengo_since_year + 1;
        $this->assertEquals($now_gengo, $now_wareki->gengo);
        $this->assertEquals($now_nen, $now_wareki->nen);
        $this->assertEquals($now_year, $now_wareki->year);
    }

    public function testfromDateTimeImmutable() {
        $a = Wareki::fromDate(new DateTimeImmutable('2019-05-01 00:00:00.000', new DateTimeZone('Asia/Tokyo')));
        $this->assertEquals(Gengo::REIWA(), $a->gengo);
        $this->assertEquals(1, $a->nen);
        $this->assertEquals(2019, $a->year);

        $a = Wareki::fromDate(new DateTimeImmutable('2019-04-30 00:00:00.000', new DateTimeZone('Asia/Tokyo')));
        $this->assertEquals(Gengo::HEISEI(), $a->gengo);
        $this->assertEquals(31, $a->nen);
        $this->assertEquals(2019, $a->year);
    }

    public function testfromDateTime() {
        $a = Wareki::fromDate(new DateTime('2019-05-01 00:00:00.000', new DateTimeZone('Asia/Tokyo')));
        $this->assertEquals(Gengo::REIWA(), $a->gengo);
        $this->assertEquals(1, $a->nen);
        $this->assertEquals(2019, $a->year);

        $a = Wareki::fromDate(new DateTime('2019-04-30 00:00:00.000', new DateTimeZone('Asia/Tokyo')));
        $this->assertEquals(Gengo::HEISEI(), $a->gengo);
        $this->assertEquals(31, $a->nen);
        $this->assertEquals(2019, $a->year);
    }

    public function testisValid() {
        $this->assertFalse(Wareki::isValid(Gengo::HEISEI(), -1));
        $this->assertFalse(Wareki::isValid(Gengo::HEISEI(), 0));
        $this->assertTrue(Wareki::isValid(Gengo::HEISEI(), 31));
        $this->assertFalse(Wareki::isValid(Gengo::HEISEI(), 32));
        $this->assertFalse(Wareki::isValid(Gengo::HEISEI(), 33));

        $this->assertFalse(Wareki::isValid(Gengo::REIWA(), -1));
        $this->assertFalse(Wareki::isValid(Gengo::REIWA(), 0));
        $this->assertTrue(Wareki::isValid(Gengo::REIWA(), 1));
        $this->assertTrue(Wareki::isValid(Gengo::REIWA(), 2));
    }

}
