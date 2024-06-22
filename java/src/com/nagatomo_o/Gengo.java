package com.nagatomo_o;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.chrono.ChronoLocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * 元号
 */
class Gengo {
    /** 元号名 */
    public final String name;
    /** 元号名略称 */
    public final String abbrName;
    /** ローマ字名 */
    public final String romanName;
    /** ローマ字名略称 */
    public final String abbrRomanName;
    /** 開始日 */
    public final ZonedDateTime since;

    /**
     * 元号
     * 
     * @param {string} name 元号名
     * @param {string} abbrName 元号名略称
     * @param {string} romanName ローマ字名
     * @param {string} abbrRomanName ローマ字名略称
     * @param {string} sinceString 開始日
     */
    private Gengo(String name, String abbrName, String romanName, String abbrRomanName, String sinceString) {
        this.name = name;
        this.abbrName = abbrName;
        this.romanName = romanName;
        this.abbrRomanName = abbrRomanName;
        this.since = ZonedDateTime.parse(sinceString, DateTimeFormatter.ISO_DATE_TIME);
    }

    /**
     * toString
     * 
     * @returns {string}
     */
    @Override
    public String toString() {
        return this.name;
    }

    /**
     * 同値の判定
     * 
     * @param Gengo other
     * @returns {boolean} 同値
     */
    @Override
    public boolean equals(Object other) {
        return this == other
                || null != other && other instanceof Gengo && this.name == other.name && this.since == other.since;
    }

    /**
     * 最新の元号
     * 
     * @returns {Gengo}
     */
    public static Gengo now() {
        return fromDate(LocalDateTime.now());
    }

    /**
     * 日付から元号を取得
     * 
     * @param {Date} date 日付
     * @returns {Gengo}
     * @throws DateValueException $date is out of range
     */
    public static Gengo fromDate(ChronoLocalDate date) {

        Optional<Gengo> gengo = Gengo.list().stream().filter(g -> g.since.compareTo(date) <= 0).findFirst();
        if (gengo.isPresent()) {
            return gengo.get();
        }
        throw new DateValueException("out of value: ${date.toString()}");
    }

    /**
     * 日付から元号を取得
     * 
     * @param {Date} date 日付
     * @returns {Gengo}
     * @throws DateValueException $date is out of range
     */
    public static Gengo fromDate(ChronoLocalDateToime date) {
        Optional<Gengo> gengo = Gengo.list().stream().filter(g -> g.since.compareTo(date) <= 0).findFirst();
        if (gengo.isPresent()) {
            return gengo.get();
        }
        throw new DateValueException("out of value: ${date.toString()}");
    }

    /**
     * 日付から元号を取得
     * 
     * @param {number} year Year
     * @param {number} month Month
     * @param {number} dayOfMonth Day
     * @returns {Gengo|null} 判定結果
     */
    public static Gengo fromISODate(int year, int month, int dayOfMonth) {
        return Gengo.fromDate(LocalDate.of(year, month, dayOfMonth));
    }

    /**
     * 文字列から元号を取得
     * 
     * @param {string} nameOrCode
     * @returns {Gengo|null} 判定結果
     */
    public static Optional<Gengo> of(String nameOrCode) {
        nameOrCode = nameOrCode.toLowerCase();
        return Gengo.list().stream().filter(gengo -> gengo.name.toLowerCase() == nameOrCode ||
                gengo.abbrName.toLowerCase() == nameOrCode ||
                gengo.romanName.toLowerCase() == nameOrCode ||
                gengo.abbrRomanName.toLowerCase() == nameOrCode).findFirst();
    }

    /**
     * 正しい元号か判定
     * 
     * @param {string} nameOrCode
     * @returns {boolean} 判定結果
     */
    public static boolean isValid(String nameOrCode) {
        return Gengo.isValidName(nameOrCode) ||
                Gengo.isValidAbbrName(nameOrCode) ||
                Gengo.isValidRomanName(nameOrCode) ||
                Gengo.isValidAbbrRomanName(nameOrCode);
    }

    /**
     * 正しい元号か判定
     * 
     * @param {string} name
     * @returns {boolean} 判定結果
     */
    public static boolean isValidName(String name) {
        return name != null && Gengo.list().stream()
                .anyMatch(gengo -> gengo.name.toLowerCase() == name.toLowerCase());
    }

    /**
     * 正しい元号略称か判定
     * 
     * @param {string} abbrName
     * @returns {boolean} 判定結果
     */
    public static boolean isValidAbbrName(String abbrName) {
        return abbrName != null && Gengo.list().stream()
                .anyMatch(gengo -> gengo.abbrName.toLowerCase() == abbrName.toLowerCase());
    }

    /**
     * 正しい元号(ローマ字)か判定
     * 
     * @param {string} romanName
     * @returns {boolean} 判定結果
     */
    public static boolean isValidRomanName(String romanName) {
        return romanName != null && Gengo.list().stream()
                .anyMatch(gengo -> gengo.romanName.toLowerCase() == romanName.toLowerCase());
    }

    /**
     * 正しい元号(ローマ字)略称か判定
     * 
     * @param {string} abbrRomanName
     * @returns {boolean} 判定結果
     */
    public static boolean isValidAbbrRomanName(String abbrRomanName) {
        return abbrRomanName != null && Gengo.list().stream()
                .anyMatch(gengo -> gengo.abbrRomanName.toLowerCase() == abbrRomanName.toLowerCase());
    }

    /**
     * 明治
     */
    public static final Gengo MEIJI = new Gengo("明治", "明", "Meiji", "M", "1868-01-25T00:00:00.000+0900");

    /**
     * 大正
     */
    public static final Gengo TAISHO = new Gengo("大正", "大", "Taisho", "T", "1912-07-30T00:00:00.000+0900");

    /**
     * 昭和
     */
    public static final Gengo SHOWA = new Gengo("昭和", "昭", "Showa", "S", "1926-12-25T00:00:00.000+0900");

    /**
     * 平成
     */
    public static final Gengo HEISEI = new Gengo("平成", "平", "Heisei", "H", "1989-01-08T00:00:00.000+0900");

    /**
     * 令和
     */
    public static final Gengo REIWA = new Gengo("令和", "令", "Reiwa", "R", "2019-05-01T00:00:00.000+0900");

    /**
     * 元号一覧
     * 
     * @return Gengo[]
     */
    public static List<Gengo> list() {
        return List.of(
                Gengo.MEIJI,
                Gengo.TAISHO,
                Gengo.SHOWA,
                Gengo.HEISEI,
                Gengo.REIWA);
    }
}
