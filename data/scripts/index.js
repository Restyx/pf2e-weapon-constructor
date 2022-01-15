class Weapon {
    #points;
    #name;
    #description;
    #isRanged;
    #category;
    #hands;
    #range;
    #reload;
    #ammunition;
    #dice;
    #dmgType;
    #group;
    #properties;
    #traits;

    constructor() {
        this.#name = ``;
        this.#description = ``;
        this.#isRanged = document.getElementById('MeleeRanged').checked;
        this.#category = parseInt(document.getElementById('Increased_training').options[document.getElementById("Increased_training").selectedIndex].value);
        this.#hands = parseInt(document.getElementById('hands').options[document.getElementById("hands").selectedIndex].value);
        this.#range = { value: 20, cost: 1 };
        this.#reload = 0;
        this.#ammunition = ``;
        this.#dice = parseInt(document.getElementById("damage_dice").options[document.getElementById("damage_dice").selectedIndex].value);
        this.#dmgType = document.querySelector('#damage_type').options[document.querySelector('#damage_type').selectedIndex].value;
        this.#group = ``;
        this.#properties = [];
        this.#traits = [];
        this.calculateCost();
    }

    // Setters
    set setName(nameText) {
        this.#name = nameText;
    }
    set setDescription(descriptionText) {
        this.#description = descriptionText;
    }
    set setType(typeIndex) {
        this.#isRanged = typeIndex;
        this.calculateCost();
    }
    set setCategory(categoryIndex) {
        this.#category = categoryIndex;
        this.calculateCost();
    }
    set setHands(handsIndex) {
        this.#hands = handsIndex;
        this.calculateCost();
    }
    set setRange(rangeValue) {
        var pointCost = 1;
        if (rangeValue <= 30) { pointCost = 1; }
        else if (rangeValue > 30 && rangeValue <= 60) { pointCost = 2; }
        else { pointCost = 3; }
        this.#range = { value: rangeValue, cost: pointCost };
        console.log(this.#range.value);
        this.calculateCost();
    }
    set setReload(reloadValue) {
        this.#reload = 0;
        this.#reload = reloadValue;
        this.calculateCost();
    }
    set setAmmunition(ammunitionType) {
        this.#ammunition = ammunitionType;
    }
    set setDice(diceSize) {
        this.#dice = diceSize;
        this.calculateCost();
    }
    set setDmgType(typeName) {
        this.#dmgType = typeName;
    }
    set setGroup(groupName) {
        this.#group = groupName;
    }
    set setProperties(properties) {
        var propertiesList = [];
        for (var j = 0; j < properties.length; j++) {
            var property = {
                name: properties[j].name,
                cost: parseInt(properties[j].value)
            };
            propertiesList.push(property);
        }
        this.#properties = propertiesList;
        this.calculateCost();
    }
    set setTraits(traits) {
        var traitList = [];
        for (var j = 0; j < traits.length; j++) {
            var trait = {
                name: traits[j].attributes[3].value,
                cost: parseInt(traits[j].attributes[4].value)
            };
            traitList.push(trait);
        }
        this.#traits = traitList;
        this.calculateCost();
    }
    // getters

    // functions
    calculateCost() {
        if (this.#isRanged) { this.#points = (4 + this.#category * 2 + Number(Boolean(this.#category)) + Math.floor(this.#hands * 1.5) + this.calculatePropertiesCost() + this.#reload * 3) - (this.#dice * 3 + this.#range.cost + this.calculateBoonsCost()); }
        else { this.#points = (4 + this.#category * 2 + Number(Boolean(this.#category)) + this.#hands * 3 + this.calculatePropertiesCost()) - (this.#dice * 3 + this.calculateBoonsCost()); }
        document.getElementById("points").textContent = this.#points;
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
        for (var i = 0; i < this.#properties.length; i++) {
            totalCost += this.#properties[i].cost;
        }
        return totalCost;
    }
}

// Get Data from Database
async function getData() {
    const response = await fetch('/db');
    const data = await response.json();
    return data;
}

// add received data to html table 
async function fill_boons() {
    // get data
    const data = await getData();

    // convert received to suitable form, for easier insert into html table
    var boons = [[], [], []];
    for (var i = 0; i < data.length; i++) {
        if (data[i].category == 1) {
            boons[0].push(data[i]);
        }
        else if (data[i].category == 2) {
            boons[1].push(data[i]);
        }
        else {
            boons[2].push(data[i]);
        }
    }

    // add converted data to html table
    for (var i = 0; i < boons.length; i++) {
        for (var j = 0; j < boons[i].length; j++) {
            addRow("boon_list", boons[i][j].boon_name, boons[i][j].description, j + 1, i);
        }
    }
}

function addRow(tableID, text, description, row, cell) {
    var tableRef = document.getElementById(tableID),
        newRow = undefined;
    if (cell === 0) { newRow = tableRef.insertRow(row); }
    else { newRow = tableRef.rows[row]; }

    var newCell = newRow.insertCell(cell);
    newCell.className = 'tooltip inputGroup';

    var newspan = document.createElement("span");
    newspan.className = 'tooltiptext';
    newspan.appendChild(document.createTextNode(description));

    var checkBox = document.createElement("input"),
        label = document.createElement("label");


    checkBox.type = "checkbox";
    checkBox.className = 'boon';
    checkBox.id = text;
    checkBox.name = text;
    checkBox.value = cell + 1;

    label.htmlFor = text;
    label.appendChild(document.createTextNode(text));
    label.appendChild(newspan)

    newCell.appendChild(checkBox);
    newCell.appendChild(label);
}

function get_boonList(boonList) {
    var cost = 0,
        list = ``;

    boonList.sort();

    for (var i = 0; i < boonList.length; i++) {
        if (i != 0) list += `, `;
        list += `${boonList[i][0]}`;
        cost += parseInt(boonList[i][1]);
    }

    return [list, cost];
}

function deselectable() {
    setTimeout(checked => this.checked = !checked, 0, this.checked);
    if (!this.checked) { weapon.setReload = parseInt(this.value); }
    else { weapon.setReload = 0; }
}

// main
var weapon = new Weapon(`sample`);

fill_boons()
    .then(() => {
        const reloadSelector = document.querySelectorAll('input[type="radio"].reload_radio');
        for (i = 0; i < reloadSelector.length; i++) {
            reloadSelector[i].onmouseup = deselectable;
        }

        const boonsCheckboxes = document.querySelectorAll('input[type="checkbox"].boon');
        for (var i = 0; i < boonsCheckboxes.length; i++) {
            boonsCheckboxes[i].addEventListener('change', () => { weapon.setTraits = document.querySelectorAll('input[type="checkbox"].boon:checked'); })
        }

        const propertyCheckboxes = document.querySelectorAll('input[type="checkbox"].property')
        for (var i = 0; i < propertyCheckboxes.length; i++) {
            propertyCheckboxes[i].addEventListener('change', () => { weapon.setProperties = document.querySelectorAll('input[type="checkbox"].property:checked'); })
        }

        const nameTextField = document.querySelector('#name');
        nameTextField.addEventListener('input', (result) => { weapon.setName = result.target.value; });

        const descriptionTextField = document.querySelector('#description');
        descriptionTextField.addEventListener('input', (result) => { weapon.setDescription = result.target.value; });

        const dmgTypeSelector = document.querySelector('#damage_type');
        dmgTypeSelector.addEventListener('change', () => { weapon.setDmgType = dmgTypeSelector.options[dmgTypeSelector.selectedIndex].value; });

        const damageDiceSelector = document.querySelector('#damage_dice');
        damageDiceSelector.addEventListener('change', () => { weapon.setDice = parseInt(damageDiceSelector.options[damageDiceSelector.selectedIndex].value); });

        const CategorySelector = document.querySelector('#Increased_training');
        CategorySelector.addEventListener('change', () => { weapon.setCategory = parseInt(CategorySelector.options[CategorySelector.selectedIndex].value); });

        const typeSelector = document.querySelector('#MeleeRanged');
        typeSelector.addEventListener('change', () => {
            var content = document.getElementById("rangedContent");
            if (content.style.display === "flex") { content.style.display = "none"; }
            else { content.style.display = "flex"; }
            weapon.setType = document.getElementById('MeleeRanged').checked;
        });

        const handsSelector = document.querySelector('#hands');
        handsSelector.addEventListener('change', () => { weapon.setHands = parseInt(handsSelector.options[handsSelector.selectedIndex].value); });
    });
