class PlayerSubscription {
    constructor(expiration) {
        this.expiration = expiration;
    }

    getRemainingObject() {
        const now = Math.floor(Date.now() / 1000);
        let days = ((this.expiration - now) / 86400);

        const years = Math.floor(days / 365);
        let months = 0;
        if (days > 31) {
            months = Math.floor(days / 31);
            days -= (months * 31);
        }

        return {
            days: days,
            months: months,
            years: years,
        };
    }

    get days() {
        return this.getRemainingObject().days;
    }

    get months() {
        return this.getRemainingObject().months;
    }

    get years() {
        return this.getRemainingObject().years;
    }

    hasClub() {
        return this.expiration >= Math.floor(Date.now() / 1000);
    }
}

module.exports = PlayerSubscription;
