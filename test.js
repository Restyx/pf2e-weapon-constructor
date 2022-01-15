class weapon {
    // #points;
    // #name;
    // #description;
    // #isRanged;
    // #category;
    // #hands;
    // #range;
    // #reload;
    // #ammunition;
    // #dice;
    // #dmgType;
    // #group;
    // #properties;
    // #traits;

    constructor() {
        this.#points = 3;
        this.#name = ``;
        this.#description = ``;
        this.#isRanged = false;
        this.#category = 0;
        this.#hands = 0;
        this.#range = { value: 0, cost: 0 };
        this.#reload = 0;
        this.#ammunition = ``;
        this.#dice = 0;
        this.#dmgType = ``;
        this.#group = ``;
        this.#properties = [];
        this.#traits = [];
    }

    // Setters
    set setName(nameText) {
        this.#name = nameText;
    }
    set setDescription(descriptionText) {
        this.#description = descriptionText;
    }
    set setType(isRanged) {
        this.#type = isRanged;
        calculateCost();
    }
    set setCategory(categoryIndex) {
        this.#category = categoryIndex;
        calculateCost();
    }
    set setHands(handsIndex) {
        this.#hands = handsIndex;
        calculateCost();
    }
    set setRange(rangeValue) {
        var pointCost = 0;
        if (rangeValue <= 30) { pointCost = 1; }
        else if (rangeValue > 30 && rangeValue <= 60) { pointCost = 2; }
        else { pointCost = 3; }
        this.#range = { value: rangeValue, cost: pointCost }
        calculateCost();
    }
    set setReload(reloadValue) {
        this.#reload = reloadValue;
        calculateCost();
    }
    set setAmmunition(ammunitionType) {
        this.#ammunition = ammunitionType;
    }
    set setDice(DiceValue) {
        this.#dice = DiceValue;
        calculateCost();
    }
    set setDmgType(typeName) {
        this.#dmgType = typeName;
    }
    set setGroup(groupName) {
        this.#group = groupName;
    }
    set setProperties(propertiesArray) {
        this.#properties = propertiesArray;
        calculateCost();
    }
    set addProperty(property) {
        this.#properties.push(property);
        calculateCost();
    }
    set setTraits(traitsArray) {
        this.#traits = traitsArray;
        calculateCost();
    }
    set addTrait(trait) {
        this.#traits.push(trait);
        calculateCost();
    }
    // getters

    // functions
    calculateCost() {
        if (this.#isRanged) { this.#points = (4 + this.#category * 2 + Math.floor(this.#hands * 1.5) + calculatePropertiesCost()) - (this.#dice * 3 + this.#range.cost + this.#reload * 3 + calculateBoonsCost()); }
        else { this.#points = (4 + this.#category * 2 + this.#hands * 3 + calculatePropertiesCost()) - (this.#dice * 3 + calculateBoonsCost()); }
    }
    calculateBoonsCost() {
        var totalCost = 0;
        for (var i = 0; i < this.#traits.length; i++) {
            totalCost += this.#traits[i].cost;
        }
        return totalCost;
    }
    calculatePropertiesCost() {
        var totalCost = 0;
        for (var i = 0; i < this.#traits.length; i++) {
            totalCost += this.#properties[i].cost;
        }
        return totalCost;
    }
}