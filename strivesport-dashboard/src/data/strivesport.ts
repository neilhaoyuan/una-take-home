import { Workspace } from '../types';

export const STRIVESPORT: Workspace = {
  id: 'strivesport',
  name: 'StriveSport',
  plan: '2027 Budget Plan',
  color: '#6366f1',
  initials: 'SS',
  tags: ['Sports Apparel', '2 Entities', 'FY2027'],
  data: {
    usaRev:  [597583,587222,671350,759932,790698,804916,727138,701308,758449,799447,955131,1098785],
    usaCogs: [303132,299206,345803,392399,404176,412027,369357,361505,396325,427218,539527,632720],
    usaOpex: [121183,120250,127821,140374,150099,151379,139799,137474,147197,155467,151558,164487],
    usaDepr: [6167,6500,6500,6750,6750,6750,6917,6917,6917,7167,7667,8333],

    premRev:  [641505,626278,713304,804439,849655,873802,798139,763021,808761,834432,974116,1130704],
    premCogs: [317620,312464,360245,408026,423493,433805,391180,380868,413182,440339,547592,643154],
    premOpex: [270592,269526,275618,292191,302312,315643,305766,303308,316703,292191,316703,331513],
    premDepr: [7833,7833,7833,8250,8250,8500,8500,8500,8500,8917,9917,11250],

    usa26Rev:  [54000,54000,63000,72000,72000,72000,63000,63000,72000,81000,108000,126000],
    prem26Rev: [27000,27000,31500,36000,36000,36000,31500,31500,36000,40500,54000,63000],

    seas: [0.06,0.06,0.07,0.08,0.08,0.08,0.07,0.07,0.08,0.09,0.12,0.14],

    chRev: { Retail: 6808084, Online: 5783660, Wholesale: 6639134 },
    chGM:  { Retail: 0.625,   Online: 0.585,  Wholesale: 0.165 },

    products: [
      ['Compression Shirts',      0.604],
      ['Moisture-Wicking Shorts', 0.604],
      ['Zip-Up Hoodies',          0.630],
      ['Muscle Tanks',            0.604],
      ['Quick-Dry Joggers',       0.604],
      ['High-Waisted Leggings',   0.388],
      ['Seamless Sports Bras',    0.604],
      ['Lightweight Windbreakers',0.680],
      ['Training Tanks',          0.604],
      ['Thermal Base Layers',     0.604],
    ],
  },
};

export const WORKSPACES: Workspace[] = [STRIVESPORT];