export const hexToCBPrefixedZ80InstructionMap: { [key: string]: string } = {
  "00": "rlc,b",
  "01": "rlc,c",
  "02": "rlc,d",
  "03": "rlc,e",
  "04": "rlc,h",
  "05": "rlc,l",
  "06": "rlc,(hl)",
  "07": "rlc,a",
  "08": "rrc,b",
  "09": "rrc,c",
  "0A": "rrc,d",
  "0B": "rrc,e",
  "0C": "rrc,h",
  "0D": "rrc,l",
  "0E": "rrc,(hl)",
  "0F": "rrc,a",
  "10": "rl,b",
  "11": "rl,c",
  "12": "rl,d",
  "13": "rl,e",
  "14": "rl,h",
  "15": "rl,l",
  "16": "rl,(hl)",
  "17": "rl,a",
  "18": "rr,b",
  "19": "rr,c",
  "1A": "rr,d",
  "1B": "rr,e",
  "1C": "rr,h",
  "1D": "rr,l",
  "1E": "rr,(hl)",
  "1F": "rr,a",
  "20": "sla,b",
  "21": "sla,c",
  "22": "sla,d",
  "23": "sla,e",
  "24": "sla,h",
  "25": "sla,l",
  "26": "sla,(hl)",
  "27": "sla,a",
  "28": "sra,b",
  "29": "sra,c",
  "2A": "sra,d",
  "2B": "sra,e",
  "2C": "sra,h",
  "2D": "sra,l",
  "2E": "sra,(hl)",
  "2F": "sra,a",
  "30": "swap,b",
  "31": "swap,c",
  "32": "swap,d",
  "33": "swap,e",
  "34": "swap,h",
  "35": "swap,l",
  "36": "swap,(hl)",
  "37": "swap,a",
  "38": "srl,b",
  "39": "srl,c",
  "3A": "srl,d",
  "3B": "srl,e",
  "3C": "srl,h",
  "3D": "srl,l",
  "3E": "srl,(hl)",
  "3F": "srl,a",
  "40": "bit 0,b",
  "41": "bit 0,c",
  "42": "bit 0,d",
  "43": "bit 0,e",
  "44": "bit 0,h",
  "45": "bit 0,l",
  "46": "bit 0,(hl)",
  "47": "bit 0,a",
  "48": "bit 1,b",
  "49": "bit 1,c",
  "4A": "bit 1,d",
  "4B": "bit 1,e",
  "4C": "bit 1,h",
  "4D": "bit 1,l",
  "4E": "bit 1,(hl)",
  "4F": "bit 1,a",
  "50": "bit 2,b",
  "51": "bit 2,c",
  "52": "bit 2,d",
  "53": "bit 2,e",
  "54": "bit 2,h",
  "55": "bit 2,l",
  "56": "bit 2,(hl)",
  "57": "bit 2,a",
  "58": "bit 3,b",
  "59": "bit 3,c",
  "5A": "bit 3,d",
  "5B": "bit 3,e",
  "5C": "bit 3,h",
  "5D": "bit 3,l",
  "5E": "bit 3,(hl)",
  "5F": "bit 3,a",
  "60": "bit 4,b",
  "61": "bit 4,c",
  "62": "bit 4,d",
  "63": "bit 4,e",
  "64": "bit 4,h",
  "65": "bit 4,l",
  "66": "bit 4,(hl)",
  "67": "bit 4,a",
  "68": "bit 5,b",
  "69": "bit 5,c",
  "6A": "bit 5,d",
  "6B": "bit 5,e",
  "6C": "bit 5,h",
  "6D": "bit 5,l",
  "6E": "bit 5,(hl)",
  "6F": "bit 5,a",
  "70": "bit 6,b",
  "71": "bit 6,c",
  "72": "bit 6,d",
  "73": "bit 6,e",
  "74": "bit 6,h",
  "75": "bit 6,l",
  "76": "bit 6,(hl)",
  "77": "bit 6,a",
  "78": "bit 7,b",
  "79": "bit 7,c",
  "7A": "bit 7,d",
  "7B": "bit 7,e",
  "7C": "bit 7,h",
  "7D": "bit 7,l",
  "7E": "bit 7,(hl)",
  "7F": "bit 7,a",
  "80": "res 0,b",
  "81": "res 0,c",
  "82": "res 0,d",
  "83": "res 0,e",
  "84": "res 0,h",
  "85": "res 0,l",
  "86": "res 0,(hl)",
  "87": "res 0,a",
  "88": "res 1,b",
  "89": "res 1,c",
  "8A": "res 1,d",
  "8B": "res 1,e",
  "8C": "res 1,h",
  "8D": "res 1,l",
  "8E": "res 1,(hl)",
  "8F": "res 1,a",
  "90": "res 2,b",
  "91": "res 2,c",
  "92": "res 2,d",
  "93": "res 2,e",
  "94": "res 2,h",
  "95": "res 2,l",
  "96": "res 2,(hl)",
  "97": "res 2,a",
  "98": "res 3,b",
  "99": "res 3,c",
  "9A": "res 3,d",
  "9B": "res 3,e",
  "9C": "res 3,h",
  "9D": "res 3,l",
  "9E": "res 3,(hl)",
  "9F": "res 3,a",
  A0: "res 4,b",
  A1: "res 4,c",
  A2: "res 4,d",
  A3: "res 4,e",
  A4: "res 4,h",
  A5: "res 4,l",
  A6: "res 4,(hl)",
  A7: "res 4,a",
  A8: "res 5,b",
  A9: "res 5,c",
  AA: "res 5,d",
  AB: "res 5,e",
  AC: "res 5,h",
  AD: "res 5,l",
  AE: "res 5,(hl)",
  AF: "res 5,a",
  B0: "res 6,b",
  B1: "res 6,c",
  B2: "res 6,d",
  B3: "res 6,e",
  B4: "res 6,h",
  B5: "res 6,l",
  B6: "res 6,(hl)",
  B7: "res 6,a",
  B8: "res 7,b",
  B9: "res 7,c",
  BA: "res 7,d",
  BB: "res 7,e",
  BC: "res 7,h",
  BD: "res 7,l",
  BE: "res 7,(hl)",
  BF: "res 7,a",
  C0: "set 0,b",
  C1: "set 0,c",
  C2: "set 0,d",
  C3: "set 0,e",
  C4: "set 0,h",
  C5: "set 0,l",
  C6: "set 0,(hl)",
  C7: "set 0,a",
  C8: "set 1,b",
  C9: "set 1,c",
  CA: "set 1,d",
  CB: "set 1,e",
  CC: "set 1,h",
  CD: "set 1,l",
  CE: "set 1,(hl)",
  CF: "set 1,a",
  D0: "set 2,b",
  D1: "set 2,c",
  D2: "set 2,d",
  D3: "set 2,e",
  D4: "set 2,h",
  D5: "set 2,l",
  D6: "set 2,(hl)",
  D7: "set 2,a",
  D8: "set 3,b",
  D9: "set 3,c",
  DA: "set 3,d",
  DB: "set 3,e",
  DC: "set 3,h",
  DD: "set 3,l",
  DE: "set 3,(hl)",
  DF: "set 3,a",
  E0: "set 4,b",
  E1: "set 4,c",
  E2: "set 4,d",
  E3: "set 4,e",
  E4: "set 4,h",
  E5: "set 4,l",
  E6: "set 4,(hl)",
  E7: "set 4,a",
  E8: "set 5,b",
  E9: "set 5,c",
  EA: "set 5,d",
  EB: "set 5,e",
  EC: "set 5,h",
  ED: "set 5,l",
  EE: "set 5,(hl)",
  EF: "set 5,a",
  F0: "set 6,b",
  F1: "set 6,c",
  F2: "set 6,d",
  F3: "set 6,e",
  F4: "set 6,h",
  F5: "set 6,l",
  F6: "set 6,(hl)",
  F7: "set 6,a",
  F8: "set 7,b",
  F9: "set 7,c",
  FA: "set 7,d",
  FB: "set 7,e",
  FC: "set 7,h",
  FD: "set 7,l",
  FE: "set 7,(hl)",
  FF: "set 7,a",
};
