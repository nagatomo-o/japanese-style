import { Wareki } from '../src/Wareki';
import { Gengo } from '../src/Gengo';

var wareki = new Wareki(Gengo.HEISEI, 1);

describe('toString test', () => {
    test("明治", () => { expect(new Wareki(Gengo.MEIJI, 1)).toBe("明治1"); });
    test("大正", () => { expect(new Wareki(Gengo.TAISHO, 2)).toBe("大正2"); });
    test("昭和", () => { expect(new Wareki(Gengo.SHOWA, 3)).toBe("昭和2"); });
    test("平成", () => { expect(new Wareki(Gengo.HEISEI, 4)).toBe("平成4"); });
    test("令和", () => { expect(new Wareki(Gengo.REIWA, 10)).toBe("令和10"); });
});

describe('toYear test', () => {
    test("明治", () => { expect(Wareki.toYear(Gengo.MEIJI, 1)).toBe(1868); });
    test("大正", () => { expect(Wareki.toYear(Gengo.TAISHO, 2)).toBe(1913); });
    test("昭和", () => { expect(Wareki.toYear(Gengo.SHOWA, 3)).toBe(1928); });
    test("平成", () => { expect(Wareki.toYear(Gengo.HEISEI, 4)).toBe(1992); });
    test("令和", () => { expect(Wareki.toYear(Gengo.REIWA, 10)).toBe(2028); });
});

describe('now test', () => {
    const n = Wareki.now();
    const year = (new Date()).getFullYear();
    const reiwaNen = year - 2019 + 1;
    test("now.gengo", () => { expect(n.gengo).toBe(Gengo.REIWA); });
    test("now.nen", () => { expect(n.nen).toBe(reiwaNen); });
    test("now.year", () => { expect(n.year).toBe(year); });
});

describe('fromDate test', () => {
    const n = Wareki.now();
    const year = (new Date()).getFullYear();
    const reiwaNen = year - 2019 + 1;
    test("now.gengo", () => { expect(Wareki.fromDate(new Date(2019,6,1))).toBe(Gengo.REIWA); });
    test("now.nen", () => { expect(n.nen).toBe(reiwaNen); });
    test("now.year", () => { expect(n.year).toBe(year); });
});


describe('sampleClassのテスト', () => {
    test('gengo is Heisei', () => {
        expect(wareki.gengo).toBe(Gengo.HEISEI);
    });

    test('nen is 1', () => {
        expect(wareki.nen).toBe(1);
    });

    test('toString', () => {
        expect(wareki.toString()).toBe("元");
    });

    test('toString', () => {
        expect(wareki.toString()).toBe("元");
    });
});
console.log("-------- Wareki --------");
var wareki = new Wareki(Gengo.HEISEI, 1);
assertEquals(Gengo.HEISEI, wareki.gengo, "Wareki.getEra()");
assertEquals(1, wareki.getValue(), "Wareki.getValue()");
assertEquals("元", wareki.getValueString(), "Wareki.getValueString()");
assertEquals("平成1", wareki.toString(), "Wareki.toString()");
assertFalse(Wareki.isValid(null, null), "Wareki.isValid(null, null)");
assertFalse(Wareki.isValid(null, 0), "Wareki.isValid(null, 0)");
assertTrue(Wareki.isValid(Gengo.SHOWA, 64), "Wareki.isValid(SHOWA, 64)");
assertFalse(Wareki.isValid(Gengo.SHOWA, 65), "Wareki.isValid(SHOWA, 65)");
assertFalse(Wareki.isValid(Gengo.HEISEI, 0), "Wareki.isValid(HEISEI, 0)");
assertTrue(Wareki.isValid(Gengo.HEISEI, 1), "Wareki.isValid(HEISEI, 1)");
assertTrue(Wareki.isValid(Gengo.HEISEI, 2), "Wareki.isValid(HEISEI, 2)");
