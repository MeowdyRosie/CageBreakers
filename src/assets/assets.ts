import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
  // Backgrounds
  image("backgrounds/background", "background"),
  image("circle", "circle"),

  // Characters
  image("characters/dragon_walk", "dragon_walk"),
  image("characters/dragon_sit", "dragon_sit"),
  image("characters/dragon_charge", "dragon_charge"),
  image("characters/dragon_fire", "dragon_fire"),
  image("characters/dragon_anger", "dragon_anger"),
  image("characters/dragon_smug", "dragon_smug"),

  // Items
  image("items/coin", "coin"),

  // UI
  image("ui/hud", "hud"),
  image("ui/timer", "timer"),
  image("ui/runetablet_base", "runetablet_base"),
  image("ui/runetablet_node_active", "runetablet_node_active"),
  image("ui/runetablet_node_inactive", "runetablet_node_inactive"),
  image("ui/runetablet_runes", "runetablet_runes"),
  image("ui/runetablet_stripes", "runetablet_stripes"),
  image("ui/music", "music"),
  image("ui/no_music", "no_music"),
  image("ui/sound", "sound"),
  image("ui/no_sound", "no_sound"),

  
  // Titlescreen
  image("titlescreen/sky", "title_sky"),
  image("titlescreen/background", "title_background"),
  image("titlescreen/foreground", "title_foreground"),
  image("titlescreen/character", "title_character"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
  spritesheet("characters/kobold", "kobold", 499, 758),
  spritesheet("characters/cat", "cat", 499, 758),
  spritesheet("characters/deer", "deer", 499, 758),
  spritesheet("characters/kobold_mage", "kobold_mage", 499, 758),
  spritesheet("characters/mouse", "mouse", 499, 758),
  spritesheet("characters/wolf", "wolf", 499, 758),
  spritesheet("characters/cage_front", "cage_front", 300, 425),
  spritesheet("characters/cage_back", "cage_back", 300, 425),
  spritesheet("characters/DragonFire", "fire", 512, 512),
];

/* Audios */
const audios: Audio[] = [
  music("title", "m_main_menu"),
  music("first", "m_first"),
  sound("tree/rustle", "t_rustle", 0.5),
];

/* Fonts */
await loadFont("Sketch", "Game Font");

export { images, spritesheets, audios };
