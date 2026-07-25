import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadOswald} from '@remotion/google-fonts/Oswald';

const inter = loadInter('normal', {
  weights: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
});

const oswald = loadOswald('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin', 'latin-ext'],
});

/** Corpo / UI — Inter */
export const fontBody = inter.fontFamily;

/** Display / títulos de impacto — Oswald */
export const fontDisplay = oswald.fontFamily;
