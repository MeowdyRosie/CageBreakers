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
  image("ui/runeprompt", "runeprompt"),
  image("ui/music", "music"),
  image("ui/no_music", "no_music"),
  image("ui/sound", "sound"),
  image("ui/no_sound", "no_sound"),
  image("ui/gameover", "gameover"),
  image("ui/goodjob_1", "goodjob_1"),
  image("ui/goodjob_2", "goodjob_2"),
  image("ui/goodjob_3", "goodjob_3"),
  image("ui/goodjob_4", "goodjob_4"),


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
  spritesheet("characters/DragonFire", "dragon_firing", 512, 1024),
  spritesheet("backgrounds/backgroundFireAnim", "background_fire", 640, 1280),
  spritesheet("characters/dragon_anger_spritesheet", "dragon_anger_spritesheet", 384, 256),
  spritesheet("characters/dragon_smug_spritesheet", "dragon_smug_spritesheet", 384, 256),

];

/* Audios */
const audios: Audio[] = [
  music("title", "m_main_menu"),
  music("game", "m_first"),
  sound("dragon_step", "dragon_step"),
  sound("tree/rustle", "t_rustle", 0.5),
  sound("win", "win", 0.5),
  sound("lose", "lose", 0.5),
  sound("ui_hover", "ui_hover", 0.5),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
