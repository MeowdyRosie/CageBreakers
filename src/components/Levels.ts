export class Level {
  public patterns: number;
  public cages: number;
  public time: number;

  constructor(difficulty: string = "easy", level: number = 1) {
    this.patterns = this.getPatterns(level, difficulty);
    this.time = this.getTime(level, difficulty);
    this.cages = this.getCages(level, difficulty);
  }

  getPatterns(level: number = 1, difficulty: string = "easy") {
    // every 5 levels we get one pattern more, capped at 3
    let patternMod = 5;
    let cap = 3;
    if (difficulty == "medium") {
      cap = 4;
    }
    if (difficulty == "hard") {
      cap = 5;
      patternMod = 4;
    }
    return Math.min(cap, Math.ceil(level / patternMod));
  }

  getTime(level: number = 1, difficulty: string = "easy") {
    // default time 2 mins, every level we cull 2s until 20s
    let time = 120;
    let timeMod = 1;
    let timeStep = 2;
    let cap = 20;
    if (difficulty == "medium") {
      timeMod = 2;
    }
    if (difficulty == "hard") {
      timeMod = 3;
      timeStep = 1;
      cap = 10;
    }
    return Math.max(cap, time / timeMod - level * timeStep) * 1000;
  }

  getCages(level: number = 1, difficulty: string = "easy") {
    let cageMod = 7;
    let cap = 3;
    if (difficulty == "medium") {
      cap = 5;
    }
    if (difficulty == "hard") {
      cap = 7;
    }
    return Math.min(cap, level / cageMod);
  }
}
