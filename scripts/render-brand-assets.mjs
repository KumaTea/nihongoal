import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const brand = resolve('assets/brand');
const render = (source, destination, width) => {
  const svg = readFileSync(resolve(brand, source));
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  writeFileSync(resolve(brand, destination), png);
};

render('nihongoal-logo.svg', 'nihongoal-logo.png', 1024);
render('nihongoal-banner.svg', 'nihongoal-banner.png', 2400);
