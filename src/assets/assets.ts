import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
  // Backgrounds
  image("backgrounds/background", "background"),
  image("backgrounds/backgroundFireAnim1", "background_fire_1"),
  image("backgrounds/backgroundFireAnim2", "background_fire_2"),
  image("backgrounds/backgroundFireAnim3", "background_fire_3"),
  image("backgrounds/backgroundFireAnim4", "background_fire_4"),
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
  image("ui/runeprompt", "runeprompt"),
  image("ui/music", "music"),
  image("ui/no_music", "no_music"),
  image("ui/sound", "sound"),
  image("ui/no_sound", "no_sound"),
  image("ui/gameover", "gameover"),

  // Titlescreen
  image("titlescreen/background_base", "bg_base"),
  image("titlescreen/background_layer1", "bg_layer1"),
  image("titlescreen/background_layer2", "bg_layer2"),
  image("titlescreen/background_layer3", "bg_layer3"),
  image("titlescreen/background_layer4", "bg_layer4"),
  image("titlescreen/background_layer5", "bg_layer5"),
  image("titlescreen/background_layer6", "bg_layer6"),
  image("titlescreen/mainmenu_text_01", "mainmenu_1"),
  image("titlescreen/mainmenu_text_02", "mainmenu_2"),
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
  spritesheet("characters/DragonFire", "dragon_firing", 512, 1024)
];

/* Audios */
const audios: Audio[] = [
  music("title", "m_main_menu"),
  music("first", "m_first"),
  sound("tree/rustle", "t_rustle", 0.5),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
