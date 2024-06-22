import { Gengo } from '../src/Gengo.js';

describe('equals test', () => {
    test('MEIJI', () => { expect(Gengo.MEIJI == new Gengo("明治", "明", "Meiji", "M", "Sat Jan 25 1868 00:00:00 GMT+0900")).toBeTruthy(); });
    test('TAISHO', () => { expect(Gengo.TAISHO == new Gengo("大正", "大", "Taisho", "T", "Tue Jul 30 1912 00:00:00 GMT+0900")).toBeTruthy(); });
    test('SHOWA', () => { expect(Gengo.SHOWA == new Gengo("昭和", "昭", "Showa", "S", "Sat Dec 25 1926 00:00:00 GMT+0900")).toBeTruthy(); });
    test('HEISEI', () => { expect(Gengo.HEISEI == new Gengo("平成", "平", "Heisei", "H", "Sun Jan 08 1989 00:00:00 GMT+0900")).toBeTruthy(); });
    test('REIWA', () => { expect(Gengo.REIWA == new Gengo("令和", "令", "Reiwa", "R", "Wed May 01 2019 00:00:00 GMT+0900")).toBeTruthy(); });
});

describe('toString test', () => {
    test("明治", () => { expect(Gengo.MEIJI === Gengo.MEIJI).toBe("明治"); });
    test("大正", () => { expect(Gengo.TAISHO.toString()).toBe("大正"); });
    test("昭和", () => { expect(Gengo.SHOWA.toString()).toBe("昭和"); });
    test("平成", () => { expect(Gengo.HEISEI.toString()).toBe("平成"); });
    test("令和", () => { expect(Gengo.REIWA.toString()).toBe("令和"); });
});

describe('properties test', () => {
    test("name", () => { expect(Gengo.MEIJI.name).toBe("明治"); });
    test("abbrName", () => { expect(Gengo.TAISHO.abbrName).toBe("大"); });
    test("romanName", () => { expect(Gengo.SHOWA.romanName).toBe("Showa"); });
    test("abbrRomanName", () => { expect(Gengo.HEISEI.abbrRomanName).toBe("H"); });
    test("since", () => { expect(Gengo.REIWA.since).toBe(new Date(2019, 5, 1)); });

});

describe('of method test', () => {
    test("of('')", () => { expect(Gengo.of("")).toBeNull(); });
    test("of('h')", () => { expect(Gengo.of("h")).toBe(Gengo.HEISEI); });
    test("of('s')", () => { expect(Gengo.of("s")).toBe(Gengo.SHOWA); });
    test("of('H')", () => { expect(Gengo.of("H")).toBe(Gengo.HEISEI); });
    test("of('S')", () => { expect(Gengo.of("S")).toBe(Gengo.SHOWA); });
    test("of('Heisei')", () => { expect(Gengo.of("Heisei")).toBe(Gengo.HEISEI); });
    test("of('Showa')", () => { expect(Gengo.of("Showa")).toBe(Gengo.SHOWA); });
    test("of('HEISEI')", () => { expect(Gengo.of("HEISEI")).toBe(Gengo.HEISEI); });
    test("of('SHOWA')", () => { expect(Gengo.of("SHOWA")).toBe(Gengo.SHOWA); });
    test("of('平成')", () => { expect(Gengo.of("平成")).toBe(Gengo.HEISEI); });
    test("of('昭和')", () => { expect(Gengo.of("昭和")).toBe(Gengo.SHOWA); });
    test("of('平')", () => { expect(Gengo.of("平")).toBe(Gengo.HEISEI); });
    test("of('昭')", () => { expect(Gengo.of("昭")).toBe(Gengo.SHOWA); });
});


describe('isValid method test', () => {
    test("isValid('')", () => { expect(Gengo.isValid('')).toBeFalsy(); });
    test("isValid('平成')", () => { expect(Gengo.isValid('平成')).toBeTruthy(); });
    test("isValid('昭和')", () => { expect(Gengo.isValid('昭和')).toBeTruthy(); });
    test("isValid('平')", () => { expect(Gengo.isValid('平')).toBeTruthy(); });
    test("isValid('昭')", () => { expect(Gengo.isValid('昭')).toBeTruthy(); });
    test("isValid('Heisei')", () => { expect(Gengo.isValid('Heisei')).toBeTruthy(); });
    test("isValid('Showa')", () => { expect(Gengo.isValid('Showa')).toBeTruthy(); });
    test("isValid('HEISEI')", () => { expect(Gengo.isValid('HEISEI')).toBeTruthy(); });
    test("isValid('SHOWA')", () => { expect(Gengo.isValid('SHOWA')).toBeTruthy(); });
    test("isValid('h')", () => { expect(Gengo.isValid('h')).toBeTruthy(); });
    test("isValid('s')", () => { expect(Gengo.isValid('s')).toBeTruthy(); });
    test("isValid('H')", () => { expect(Gengo.isValid('H')).toBeTruthy(); });
    test("isValid('S')", () => { expect(Gengo.isValid('S')).toBeTruthy(); });
});

describe('isValidName method test', () => {
    test("isValidName('')", () => { expect(Gengo.isValidName("")).toBeFalsy(); });
    test("isValidName('平成')", () => { expect(Gengo.isValidName("平成")).toBeTruthy(); });
    test("isValidName('昭和')", () => { expect(Gengo.isValidName("昭和")).toBeTruthy(); });
    test("isValidName('平')", () => { expect(Gengo.isValidName("平")).toBeFalsy(); });
    test("isValidName('昭')", () => { expect(Gengo.isValidName("昭")).toBeFalsy(); });
    test("isValidName('Heisei')", () => { expect(Gengo.isValidName("Heisei")).toBeFalsy(); });
    test("isValidName('Showa')", () => { expect(Gengo.isValidName("Showa")).toBeFalsy(); });
    test("isValidName('HEISEI')", () => { expect(Gengo.isValidName("HEISEI")).toBeFalsy(); });
    test("isValidName('SHOWA')", () => { expect(Gengo.isValidName("SHOWA")).toBeFalsy(); });
    test("isValidName('h')", () => { expect(Gengo.isValidName("h")).toBeFalsy(); });
    test("isValidName('s')", () => { expect(Gengo.isValidName("s")).toBeFalsy(); });
    test("isValidName('H')", () => { expect(Gengo.isValidName("H")).toBeFalsy(); });
    test("isValidName('S')", () => { expect(Gengo.isValidName("S")).toBeFalsy(); });
});

describe('isValidAbbrName method test', () => {
    test("isValidAbbrName('')", () => { expect(Gengo.isValidAbbrName("")).toBeFalsy(); });
    test("isValidAbbrName('平成')", () => { expect(Gengo.isValidAbbrName("平成")).toBeFalsy(); });
    test("isValidAbbrName('昭和')", () => { expect(Gengo.isValidAbbrName("昭和")).toBeFalsy(); });
    test("isValidAbbrName('平')", () => { expect(Gengo.isValidAbbrName("平")).toBeTruthy(); });
    test("isValidAbbrName('昭')", () => { expect(Gengo.isValidAbbrName("昭")).toBeTruthy(); });
    test("isValidAbbrName('Heisei')", () => { expect(Gengo.isValidAbbrName("Heisei")).toBeFalsy(); });
    test("isValidAbbrName('Showa')", () => { expect(Gengo.isValidAbbrName("Showa")).toBeFalsy(); });
    test("isValidAbbrName('HEISEI')", () => { expect(Gengo.isValidAbbrName("HEISEI")).toBeFalsy(); });
    test("isValidAbbrName('SHOWA')", () => { expect(Gengo.isValidAbbrName("SHOWA")).toBeFalsy(); });
    test("isValidAbbrName('h')", () => { expect(Gengo.isValidAbbrName("h")).toBeFalsy(); });
    test("isValidAbbrName('s')", () => { expect(Gengo.isValidAbbrName("s")).toBeFalsy(); });
    test("isValidAbbrName('H')", () => { expect(Gengo.isValidAbbrName("H")).toBeFalsy(); });
    test("isValidAbbrName('S')", () => { expect(Gengo.isValidAbbrName("S")).toBeFalsy(); });
});

describe('isValidAbbrRomanName method test', () => {
    test('isValidAbbrRomanName("")', () => { expect(Gengo.isValidAbbrRomanName("")).toBeFalsy(); });
    test('isValidAbbrRomanName("平成")', () => { expect(Gengo.isValidAbbrRomanName("平成")).toBeFalsy(); });
    test('isValidAbbrRomanName("昭和")', () => { expect(Gengo.isValidAbbrRomanName("昭和")).toBeFalsy(); });
    test('isValidAbbrRomanName("平")', () => { expect(Gengo.isValidAbbrRomanName("平")).toBeFalsy(); });
    test('isValidAbbrRomanName("昭")', () => { expect(Gengo.isValidAbbrRomanName("昭")).toBeFalsy(); });
    test('isValidAbbrRomanName("Heisei")', () => { expect(Gengo.isValidAbbrRomanName("Heisei")).toBeFalsy(); });
    test('isValidAbbrRomanName("Showa")', () => { expect(Gengo.isValidAbbrRomanName("Showa")).toBeFalsy(); });
    test('isValidAbbrRomanName("HEISEI")', () => { expect(Gengo.isValidAbbrRomanName("HEISEI")).toBeFalsy(); });
    test('isValidAbbrRomanName("SHOWA")', () => { expect(Gengo.isValidAbbrRomanName("SHOWA")).toBeFalsy(); });
    test('isValidAbbrRomanName("h")', () => { expect(Gengo.isValidAbbrRomanName("h")).toBeTruthy(); });
    test('isValidAbbrRomanName("s")', () => { expect(Gengo.isValidAbbrRomanName("s")).toBeTruthy(); });
    test('isValidAbbrRomanName("H")', () => { expect(Gengo.isValidAbbrRomanName("H")).toBeTruthy(); });
    test('isValidAbbrRomanName("S")', () => { expect(Gengo.isValidAbbrRomanName("S")).toBeTruthy(); });
});
