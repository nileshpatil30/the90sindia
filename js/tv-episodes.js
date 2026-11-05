/* ==========================================================================
   OFFICIAL EPISODE LISTS, IN EPISODE ORDER (numbers come from the video titles)
   Each list was read from YouTube on 5 Nov 2026 and every video was checked to
   be public and embeddable. The number next to each name is the episode number
   of the FIRST list item: lists are strictly ascending, so week 1 = first item.

   RAMAYAN_TILAK   Ramanand Sagar's Ramayan, Tilak channel. Episodes 1-78, no gaps.
   HUM_PAANCH_ZEE  Zee TV official channel. Episodes 1-183 with 6 missing (not
                   public/embeddable on YouTube): 9, 19, 21, 22, 52, 57.
   ========================================================================== */

// Ramayan EP 1..78 (Tilak)
const RAMAYAN_TILAK = [
  'RG3Hqth0Eus', 'UdLXlTC-bFY', 'kHi1S_W4RQw', 'sXgjMisiaiQ', 'oMA6zgnk13c', '8YXPOOMccD4',
  'bqRGuT8kxs0', '1Szvvq4H-uI', 'g9Gg1mT6FLA', '_TChAsBRmlA', 'wrB8x8vRZfY', 'g9fiHHF0m3s',
  '0Pbd4hrqjq8', 'SM6IFkuLpl4', 'TRqsWkdDgT8', 'ocZozmGgy94', '3nYKp-qLxPE', 'fOSwvgpPYK0',
  'LnKofsPV7Oc', 'QEWKgoGyeys', 'ybdxljHkMVI', 'UdL-_CnORqY', 'fmtFpjG-T8o', '5_tq3mfdqXk',
  'omdgVdaFnqg', 'GPktJ9TYpUo', 'xqBdaeTf4oU', 'kV9TG1s1HpQ', 'CcZQ3lKh4EQ', '2SeaeAFFogk',
  'ABw55m1Qmcg', 'i072UW9sDXw', 'YPIIbGC-oCg', 'epunImCG-Ak', 'HKMOQinG-vI', 'dUczbarqQKo',
  'jjBTKT3MbGM', '4OARfIimR24', 'miUtXmOnXW4', 'enBbOHAASSc', 'lMsvfeOCLuI', 'm83ewDoR03M',
  'p6gPJifQ5uY', 'Y7NjtX71Ou4', 'jygnR-01eeY', '7jk98-Hz6zs', 'ANSHy4p1mF0', 'geyuWNf9EQI',
  'EWnixU4SW6A', 'O33o0-wEgaQ', 'cLuKDMF5des', 'UouNXrqQTP0', 'zdoMDCk7MT0', 'WpGC5__G8XQ',
  'Y7VOrV9KZ_w', 'jta7d1CRCzs', 'nUFTsMHS7Ls', 'kHcrxmYoH6E', 'xlWm_CTO84U', '-fo5EarKRi4',
  'jEFkgqPrK0E', 'dyLHBvjyCzw', 'OpyTOOK6BNQ', 'b0sssqkrZnU', 'PH5Be0_oYm8', 'XMURe9btrt8',
  'nMrIaB384pU', 'fKK9CabMZFk', 'g19oJP-JWto', '9Qv9x6mD6nY', 'wdShXAOftjI', '0dPBnbRBoe8',
  '-yVob6pX88Q', 'LzEbeeUlzCw', 'll6oLEzN7gA', 'GPIhlh9gdm8', 'BviW3jdwz4s', 'VrhhVrk-P80'
];

// Hum Paanch Ep.1..183 minus 9,19,21,22,52,57 (Zee TV)
const HUM_PAANCH_ZEE = [
  'xWIAaARfhg0', 'fPjw7I8KjhI', 'N7L8togK94c', 'DOxEYlwoTgo', '6omkVq0WlZc', 'n-g1pwBHzJ8',
  'J1Ngz2DyGuk', 'NhqEri3SJWg', 'UtoOtKcO9q0', 'I9nrkSyDh-0', 'ullySFbiEOs', 'mzuoeFTijmk',
  'ELyhnNqgFQc', 'QbjY0v1Bp14', 'btjgrNIBDUw', 'W9qWDvWwTrQ', 'VqopOuke2EE', '22BrtIabYj4',
  '4IXrgGW24oM', 'd5FKEt7kpKs', 'W3Qz4yKQrvU', 'l8KBHvfwGEM', 'gX19XDNwjaQ', 'DCo9gyvhmFs',
  'JA8RV_53dnQ', '09cKBAGeyE0', 'wtxrSf53xPg', 'jLClkY7CgEE', 'lPKhorECsKA', 'jVRcMu6qFaQ',
  'fF6cKy6L_5g', 'r-cu9_39W2A', 'Z0Oggp-MIPM', 'PFTT8QsRw_0', '3YTwD-wm3W0', 'wau1HS5gvtQ',
  'mGC0OlpVBgU', 'eqZ6M1_025Q', 'os0aGjbWdog', 'bQ8RfawYg3s', 'JXO2YSxrbIw', '33iCRuvWY50',
  '0nONnFxueSk', 'otUglH4PyIw', '2ieckaELMrs', '6IeAVaPfXe8', 'l-CLYnM_lZI', 'M4S4z9LOzrs',
  '1Zy4lpK13t0', 'JlRNzMngVaI', 'ab9smODACCY', 'f3h7XoYW_ys', 'iII6yS4jHnY', 'dr0aLn1ArIs',
  'DPMMAq7-4ZM', 'xQvb79ZoaRk', '1rCtSYeyd1Q', 'ciSVQITEPfY', '0AlpMd14eTI', 'vdnK4YUYx4g',
  'pwvpN01ZtmY', 'HDWHTx0pM8w', '3VCUUUr312g', 'ObDtV2vMIlE', 'cNxa7DUhHBI', 'k61h0P6BhrA',
  'gG_HkBgXgr0', 'QRcQF5vskX0', '_pBQBIuyL9c', '8YWY6RlH_gI', 'meJhIRzmI1c', 'UmOAKqpHfUo',
  'CmNhF7L5zjk', 'oFqqxYYn34s', 'eyk39dWUh5k', 'sXC3fcE0Y-8', 'huf_eKzOPb0', 'VGK1k3m8q6o',
  '_yWyegd_ocQ', 'DiqycNOf8ic', 'l26-pmiCpAc', '0RthXfhC54w', 'FUM2OFiZf3k', 'TsAZ1tjiEOg',
  'D8jG6pcGiXA', 'HXi9jp510dE', 'RSMlWcCSfDo', 'oRjAIe_Qj50', '7uF4oOFnm6M', 'gkHMotGkITg',
  'VkGbmjTki2k', 'AGlO9QVJR0w', 'hQ3_DU4B3pM', '8WV_2B0v-Vw', 'ckteNqLq3tc', 'c0IKtCc-Egs',
  'Ur_Lb-vPVAE', 'AdPfesgjZ3E', 'i9xcXyG8UsE', 'I9E8KZ6uOHE', 'DaMBGsXb7h4', 'yrE8MW8obKw',
  'SG31zS1eSY8', 'receDKRzLaw', '5nfCLULlYBE', 't3jV7Ny1hI4', '3IAIIH64K98', '-0q_2KxhlDg',
  'uLJRx80RwI8', 'dJ4eYVkQxng', 'ciTZ7RXl3aE', 'WFVtyBsUUQA', 'PUTJQ7KwydY', 'V6d3OdH9KlU',
  'OBAxLP4XY_c', 'x0QOZT0lc-0', 'zySuSmx7L3A', '-tpt0ulOXt4', 'QzNjn234GpU', '7dyZoTJC8bk',
  'ff1g00m6zpA', 'if7sMPxU4s8', '2IFjNPF2uqI', 'tcNElmM_1T4', 'Y8MuDpLdVMI', 'YRW2_6CZ7H4',
  'O0h1uyiW398', 'kfT4ok02P-Y', 'MCsqQRZuCK8', '5TziJBbETfY', '0QIfKmFCkKA', 'KQBUGfwAy0M',
  'KGB3LnZqGTw', 'KOeijdfVi0I', 'v0YOZ6gwKcA', 'dlwqw0YOS9g', 'rm-80ZHRds4', 'DUmI5-28okE',
  'o99p0gUZ-tk', 'HZ__nOdCVSo', 'TUwLBhz2jOA', 'JgdfFXBEkqY', 'fbFfskP1RLM', 'HdHRtRmUNgA',
  'pIcS9AGjRVA', 'IJsPmdDJfFM', 'CPpyhqs4DVc', 'NxurFJ-cG_Y', 'NGOGtsaFjN0', 'Qvk5r0eZ3yE',
  'AO_83TCX2aI', 'mYyqTb6pbT0', 'AybBBzc_QZY', 'NF3qCLPouf8', 'Sh3zbPr0wLI', 'BI6FoNWK8m8',
  'ad1WiT3alH8', '4gKXM4ERWOQ', 'Zknh-801ynI', '-PhcR_qoEeA', 'VkoM9B0TtmM', 'zy_408NIQlA',
  'mZ0o6KAWJLg', 'roONsir5HZI', 'EXIQn1rd6ao', '9qIIr3sFb_w', 'DYjPxcQ49_A', '8HY8sU-drDI',
  'LHeEZLDcd3w', 'qsUqXTavTrM', 'wNNffszrQjc', 'XoYMwL5Ro2I', 'rF0QRl4BoEQ', 'JTkQvltPr5c',
  '_pN2ZpW-SxQ', 'bUb3pLIvWLQ', 'lR6S4a4Oz84'
];

// Episode number of each Hum Paanch item above
const HUM_PAANCH_NUMS = [
  1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
  45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56, 58, 59, 60, 61, 62, 63, 64, 65, 66,
  67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
  87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
  107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126,
  127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
  147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166,
  167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183
];

function toEpisodes(ids) { return ids.map(function (v) { return { video: v }; }); }
if (typeof window !== 'undefined') { window.RAMAYAN_TILAK = RAMAYAN_TILAK; window.HUM_PAANCH_ZEE = HUM_PAANCH_ZEE; window.HUM_PAANCH_NUMS = HUM_PAANCH_NUMS; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { RAMAYAN_TILAK: RAMAYAN_TILAK, HUM_PAANCH_ZEE: HUM_PAANCH_ZEE, HUM_PAANCH_NUMS: HUM_PAANCH_NUMS }; }
