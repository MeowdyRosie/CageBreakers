export type Difficulty = "easy" | "medium" | "hard";

export class Level {
  public patterns: number;
  public cages: number;
  public time: number;
  public level: number;
  public difficulty: Difficulty;

  constructor(difficulty: Difficulty = "easy", level: number = 1) {
    this.patterns = this.getPatterns();
    this.time = this.getTime();
    this.cages = this.getCages();
    this.level = level;
    this.difficulty = difficulty;
  }

  getPatterns() {
    // every 5 levels we get one pattern more, capped at 3
    let patternMod = 5;
    let cap = 3;
    if (this.difficulty == "medium") {
      cap = 4;
    }
    if (this.difficulty == "hard") {
      cap = 5;
      patternMod = 4;
    }
    return Math.min(cap, Math.ceil(this.level / patternMod));
  }

  getTime() {
    // default time 30s(?), every level we cull 2s until 20s
    /*let time = 30;
    let timeMod = 1;
    let timeStep = 2;
    let cap = 20;
    if (this.difficulty == "medium") {
      timeMod = 2;
    }
    if (this.difficulty == "hard") {
      timeMod = 3;
      timeStep = 1;
      cap = 10;
    }
    return Math.max(cap, Math.floor(time / timeMod) - this.level * timeStep) * 1000;*/
    return 15 * 1000;
  }

  getCages() {
    let cageMod = 2;
    let cap = 3;
    if (this.difficulty == "medium") {
      cap = 5;
    }
    if (this.difficulty == "hard") {
      cap = 7;
    }

    return Math.min(cap, Math.ceil(this.level / cageMod));
  }
}
