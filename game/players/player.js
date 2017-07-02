class Player {
    constructor(id, name, motto, figure, gender, credits, home, club) {
        this.id = id;
        this.name = name;
        this.motto = motto;
        this.figure = figure;
        this.gender = gender;
        this.credits = credits;
        this.home = home;
        this.club = club;
        this.isOnline = false;
    }
}

module.exports = Player;
