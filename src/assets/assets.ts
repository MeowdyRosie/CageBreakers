import { Image, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';


/* Images */
const images: Image[] = [
	// Backgrounds
	image('backgrounds/background', 'background'),
	image('circle', 'circle'),

	// Characters
	image('characters/dragon', 'dragon'),
  image('characters/kobold', 'kobold'),
	image('characters/player', 'player'),
	image('characters/dragon_walk_01', 'dragon'),
	image('characters/dragon', 'dragon'),
  image('characters/kobold', 'kobold'),

	// Items
	image('items/coin', 'coin'),

	// UI
	image('ui/hud', 'hud'),

	// Titlescreen
	image('titlescreen/sky', 'title_sky'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/character', 'title_character'),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [

];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	sound('tree/rustle', 't_rustle', 0.5),
];

/* Fonts */
await loadFont('Sketch', 'Game Font');

export {
	images,
	spritesheets,
	audios
};