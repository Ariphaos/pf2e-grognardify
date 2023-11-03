import fs from "graceful-fs";
import path from "path";
import { glob } from "glob";

const version = "5.8.3";
const checkPackage = JSON.parse(fs.readFileSync("package.json").toString());
if (checkPackage.version !== version) {
    throw new Error(
        "Version check failed. Expected version: " + version + ", system version claims to be: " + checkPackage.version,
    );
}

const languageMap = new Map([
    ["thalassic", "aquan"],
    ["sussuran", "auran"],
    ["pyric", "ignan"],
    ["fey", "sylvan"],
    ["petran", "terran"],
]);
const traitMap = new Map([
    ["vitality", "positive"],
    ["void", "negative"],
]);

const unRenameSpells = new Map([
    ["Blazing Bolt", "Scorching Ray"],
    ["Breathe Fire", "Burning Hands"],
    ["Calm", "Calm Emotions"],
    ["Cleanse Cuisine", "Purify Food and Drink"],
    ["Entangling Flora", "Entangle"],
    ["Environmental Endurance", "Endure Elements"],
    ["Falling Stars", "Meteor Swarm"],
    ["Interplanar Teleport", "Plane Shift"],
    ["Know the Way", "Know Direction"],
    ["Mist", "Obscuring Mist"],
    ["Mountain Resilience", "Stoneskin"],
    ["Mystic Armor", "Mage Armor"],
    ["Nature's Pathway", "Tree Stride"],
    ["Oaken Resilience", "Barkskin"],
    ["One with Plants", "Tree Shape"],
    ["One with Stone", "Meld into Stone"],
    ["Peaceful Rest", "Gentle Repose"],
    ["Petrify", "Flesh to Stone"],
    ["Phantasmal Minion", "Unseen Servant"],
    ["Planar Palace", "Magnificent Mansion"],
    ["Planar Seal", "Dimensional Lock"],
    ["Runic Body", "Magic Fang"],
    ["Runic Weapon", "Magic Weapon"],
    ["See the Unseen", "See Invisibility"],
    ["Tailwind", "Longstrider"],
    ["Tailwind (8 hours)", "Longstrider (8 hours)"],
    ["Tangle Vine", "Tanglefoot"],
    ["Telekinetic Hand", "Mage Hand"],
    ["Translate", "Comprehend Language"],
    ["Translocate", "Dimension Door"],
    ["Truespeech", "Tongues"],
    ["Vapor Form", "Gaseous Form"],
    ["Veil of Privacy", "Nondetection"],
]);

const staticReplace = new Map([
    ["Off-Guard", "Flat-Footed"],
    ["OffGuard", "FlatFooted"],
    ["Off-guard", "Flat-footed"],
    ["off-guard", "flat-footed"],
    [",void", ",negative"],
    [", void, healing", ", negative, healing"],
    ["void resistance", "negative resistance"],
    ["[void]", "[negative]"],
    ["void splash", "negative splash"],
    ["void damage", "negative damage"],
    ['"void": "void",', '"negative": "negative",'],
    ['"Void": "Pink (Void)"', '"Negative": "Pink (Negative)"'],
    ["Void Damage", "Negative Damage"],
    ["VoidDamage", "NegativeDamage"],
    ["DescriptionVoid", "DescriptionNegative"],
    ["TraitVoid", "TraitNegative"],
    ["VersatileVoid", "VersatileNegative"],
    ["Versatile Void", "Versatile Negative"],
    ["void energy", "negative energy"],
    ['"TraitNegative": "Void",', '"TraitNegative": "Negative",'],
    [",vitality", ",positive"],
    [", vitality, healing", ", positive, healing"],
    ["vitality resistance", "positive resistance"],
    ["[vitality]", "[positive]"],
    ["Vitality Damage", "Positive Damage"],
    ["VitalityDamage", "PositiveDamage"],
    ["DescriptionVitality", "DescriptionPositive"],
    ["TraitVitality", "TraitPositive"],
    ["VersatileVitality", "VersatilePositive"],
    ["Versatile Vitality", "Versatile Positive"],
    ["vitality energy", "positive energy"],
    ['"TraitPositive": "Vitality",', '"TraitPositive": "Positive",'],
    ["vitality splash", "positive splash"],
    ["vitality damage", "positive damage"],
    ['"vitality": "vitality",', '"positive": "positive",'],
    ["energy from the Forge of Creation", "positive energy"],
    ["Attribute Bonus", "Ability Bonus"],
    ["Attribute Boost", "Ability Boost"],
    ["attribute boost", "ability boost"],
    ["Attribute Modifier", "Ability Modifier"],
    ["attribute modifier", "ability modifier"],
    ["Attribute Penalty", "Ability Penalty"],
    ["Attribute Variant", "Ability Variant"],
    ["Apex Attribute", "Apex Ability"],
    ["Divine Attribute", "Divine Ability"],
    ["Key Attribute", "Key Ability"],
    ["Key attribute", "Key ability"],
    ["Master Attribute", "Master Ability"],
    [': "Attribute",', ': "Ability",'],
    ['"LanguageFey": "Fey",', '"LanguageSylvan": "Sylvan",'],
    ['"LanguagePetran": "Petran",', '"LanguageTerran": "Terran",'],
    ['"LanguagePyric": "Pyric",', '"LanguageIgnan": "Ignan",'],
    ['"LanguageSussuran": "Sussuran",', '"LanguageAuran": "Auran",'],
    ['"LanguageThalassic": "Thalassic",', '"LanguageAquan": "Aquan",'],
    ["Heightened Rank", "Heightened Level"],
    ["Heighten Rank", "Heighten Level"],
    ["(Rank {level})", "(Level {level})"],
    ["Spell Rank", "Spell Level"],
    ["spell rank", "spell level"],
    ["spell's rank", "spell's level"],
    ["cast at any rank", "cast at any level"],
    ["equal or higher rank", "equal or higher level"],
    ["th-rank", "th-level"],
    ['"Label": "Rank",', '"Label": "Level",'],
    ['"Ordinal": "{rank} Rank"', '"Ordinal": "{rank} Level"'],
]);
const staticClean = new Map([
    ["an flat-footed", "a flat-footed"],
    ["An flat-footed", "A flat-footed"],
]);

const packReplace = new Map([
    ["Off-Guard", "Flat-Footed"],
    ["Off-guard", "Flat-footed"],
    ["off-guard", "flat-footed"],
    ["OffGuard", "FlatFooted"],
    ["offGuardable", "flatFootable"],
    ['"Reactive Strike"', '"Attack of Opportunity"'],
    ["spell rank", "spell level"],
    ["[void]", "[negative]"],
    [",void", ",negative"],
    [":void", ":negative"],
    ["void damage", "negative damage"],
    ["void plus", "negative plus"],
    ['.Void",', '.Negative",'],
    ['"value": "void"', '"value": "negative"'],
    ["TraitVoid", "TraitNegative"],
    ['"damageType": "void"', '"damageType": "negative"'],
    ['"type": "void"', '"type": "negative"'],
    ["[vitality]", "[positive]"],
    [",vitality", ",positive"],
    [":vitality", ":positive"],
    ["vitality damage", "positive damage"],
    ['.Vitality",', '.Positive",'],
    ['"value": "vitality"', '"value": "positive"'],
    ["TraitVitality", "TraitPositive"],
    ['"damageType": "vitality"', '"damageType": "positive"'],
    ['"type": "vitality"', '"type": "positive"'],
    // ["", ""],
]);
const packClean = new Map([
    ["an flat-footed", "a flat-footed"],
    ["An flat-footed", "A flat-footed"],
    [
        "an @UUID[Compendium.pf2e.conditionitems.Item.Flat-Footed]",
        "a @UUID[Compendium.pf2e.conditionitems.Item.Flat-Footed]",
    ],
    ["catch your foe flat-footed", "catch your foe off-guard"],
    ["catch an opponent flat-footed", "catch an opponent off-guard"],
]);

const itemArray = ["action", "ancestry", "armor", "consumable", "effect", "equipment", "feat", "spell", "weapon"];
const spellSchools = JSON.parse(fs.readFileSync("spellschools.json").toString());

const dirPacks = "packs";
const dirSpells = path.join(dirPacks, "spells");
const dirSpellEffects = path.join(dirPacks, "spell-effects");

let unRenameSpellSlugs = new Map();
let renamedSpellSlugs = [
    "collective-memories",
    "fire-shield",
    "frostbite",
    "ignition",
    "speak-with-animals",
    "speak-with-plants",
    "thunderstrike",
];

(() => {
    let tempPath = "packs/conditions";

    if (fs.existsSync(path.join(tempPath, "off-guard.json"))) {
        fs.renameSync(path.join(tempPath, "off-guard.json"), path.join(tempPath, "flat-footed.json"));
        console.log(
            "Renaming: " + path.join(tempPath, "off-guard.json") + " to: " + path.join(tempPath, "flat-footed.json"),
        );
    }

    tempPath = "packs/other-effects";
    if (fs.existsSync(path.join(tempPath, "effect-off-guard-until-end-of-your-next-turn.json"))) {
        fs.renameSync(
            path.join(tempPath, "effect-off-guard-until-end-of-your-next-turn.json"),
            path.join(tempPath, "effect-flat-footed-until-end-of-your-next-turn.json"),
        );
        console.log(
            "Renaming: " +
                path.join(tempPath, "effect-off-guard-until-end-of-your-next-turn.json") +
                " to: " +
                path.join(tempPath, "effect-flat-footed-until-end-of-your-next-turn.json"),
        );
    }

    unRenameSpells.forEach((value, key) => {
        let newSlugName = value
            .replaceAll("'", "")
            .replaceAll(" ", "-")
            .replaceAll("(", "")
            .replaceAll(")", "")
            .toLowerCase();
        unRenameSpellSlugs.set(
            key.replaceAll("'", "").replaceAll(" ", "-").replaceAll("(", "").replaceAll(")", "").toLowerCase(),
            newSlugName,
        );
        renamedSpellSlugs.push(newSlugName);
    });
    unRenameSpellSlugs.forEach((value, key) => {
        if (fs.existsSync(path.join(dirSpells, key) + ".json")) {
            fs.renameSync(path.join(dirSpells, key) + ".json", path.join(dirSpells, value) + ".json");
            console.log(
                "Renaming: " + path.join(dirSpells, key) + ".json" + " to: " + path.join(dirSpells, value) + ".json",
            );
        }
        if (fs.existsSync(path.join(dirSpellEffects, "spell-effect-" + key) + ".json")) {
            fs.renameSync(
                path.join(dirSpellEffects, "spell-effect-" + key) + ".json",
                path.join(dirSpellEffects, "spell-effect-" + value) + ".json",
            );
            console.log(
                "Renaming: " +
                    path.join(dirSpellEffects, key) +
                    ".json to: " +
                    path.join(dirSpellEffects, value) +
                    ".json",
            );
        }
    });
})();

// Goes down here because we're renaming some files above.
const packFiles = await glob("packs/**/*.json", {});
const staticFiles = await glob("static/**/*.json", {});

(() => {
    function ucFirst(string) {
        return string[0].toUpperCase() + string.substring(1).toLowerCase();
    }

    /**
     * @param {array} languageArray
     */
    function revertLanguages(languageArray) {
        languageArray.forEach((value, i) => {
            if (languageMap.has(value)) {
                languageArray[i] = languageMap.get(value);
            }
        });
        return languageArray.sort();
    }

    /**
     * @param {array} traitArray
     */
    function revertTraits(traitArray) {
        traitArray.forEach((value, i) => {
            if (traitMap.has(value)) {
                traitArray[i] = traitMap.get(value);
            }
        });
        return traitArray.sort();
    }

    function sortObject(object) {
        return Object.keys(object)
            .sort()
            .reduce(function (result, key) {
                result[key] = object[key];
                return result;
            }, {});
    }

    staticFiles.forEach((fileName) => {
        const fileText = fs.readFileSync(fileName).toString();
        let newText = fileText;

        staticReplace.forEach((value, key) => {
            newText = newText.replaceAll(key, value);
        });

        staticClean.forEach((value, key) => {
            newText = newText.replaceAll(key, value);
        });

        let staticObject = JSON.parse(newText);

        // eslint-disable-next-line no-prototype-builtins
        if (staticObject.hasOwnProperty("PF2E")) {
            // Full reorder a bit too aggressive
            // staticObject.PF2E = sortObject(staticObject.PF2E);
            // eslint-disable-next-line no-prototype-builtins
            if (staticObject.PF2E.hasOwnProperty("Damage")) {
                // eslint-disable-next-line no-prototype-builtins
                if (staticObject.PF2E.Damage.hasOwnProperty("IWR")) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (staticObject.PF2E.Damage.IWR.hasOwnProperty("Type")) {
                        staticObject.PF2E.Damage.IWR.Type = sortObject(staticObject.PF2E.Damage.IWR.Type);
                    }
                }
                // eslint-disable-next-line no-prototype-builtins
                if (staticObject.PF2E.Damage.hasOwnProperty("RollFlavor")) {
                    staticObject.PF2E.Damage.RollFlavor = sortObject(staticObject.PF2E.Damage.RollFlavor);
                }
            }
        }

        newText = JSON.stringify(staticObject, null, 4) + "\n";

        if (fileText !== newText) {
            fs.writeFileSync(fileName, newText);
            console.log(fileName + " is different, rewriting...");
        }
    });

    packFiles.forEach((fileName) => {
        const fileText = fs.readFileSync(fileName).toString();
        let newText = fileText;
        let dirName = path.dirname(fileName);
        let subDir = path.basename(dirName);

        packReplace.forEach((value, key) => {
            newText = newText.replaceAll(key, value);
        });

        packClean.forEach((value, key) => {
            newText = newText.replaceAll(key, value);
        });

        unRenameSpells.forEach((value, key) => {
            newText = newText
                .replaceAll("<em>" + key.toLowerCase() + "'s</em>", "<em>" + value.toLowerCase() + "'s</em>")
                .replaceAll("<em>" + key.toLowerCase() + "</em>", "<em>" + value.toLowerCase() + "</em>")
                .replaceAll("<em>" + ucFirst(key) + "</em>", "<em>" + ucFirst(value) + "</em>")
                .replaceAll(
                    "@UUID[Compendium.pf2e.spell-effects.Item.Spell Effect: " + key + "]",
                    "@UUID[Compendium.pf2e.spell-effects.Item.Spell Effect: " + value + "]",
                )
                .replaceAll('"Spell Effect: ' + key + '",', '"Spell Effect: ' + value + '",')
                .replaceAll(
                    "@UUID[Compendium.pf2e.spells-srd.Item." + key + "]",
                    "@UUID[Compendium.pf2e.spells-srd.Item." + value + "]",
                );
        });

        let packObject = JSON.parse(newText);

        if (itemArray.indexOf(packObject.type) > -1) {
            if (packObject.type === "action" && subDir === "bestiary-ability-glossary-srd") {
                switch (packObject.name) {
                    case "Change Shape":
                        if (packObject.system.traits.value.indexOf("transmutation") < 0) {
                            packObject.system.traits.value.push("transmutation");
                        }
                        break;
                    case "Coven":
                        if (packObject.system.traits.value.indexOf("divination") < 0) {
                            packObject.system.traits.value.push("divination");
                        }
                        break;
                    case "Telepathy":
                        if (packObject.system.traits.value.indexOf("divination") < 0) {
                            packObject.system.traits.value.push("divination");
                        }
                        break;
                    default:
                }
            }
            packObject = revertItem(packObject);
        } else if (packObject.type === "npc" || packObject.type === "character" || packObject.type === "hazard") {
            packObject.system.traits.value = revertTraits(packObject.system.traits.value);
            if (
                // eslint-disable-next-line no-prototype-builtins
                packObject.system.attributes.hasOwnProperty("resistances") &&
                Array.isArray(packObject.system.attributes.resistances)
            ) {
                // console.log(packObject.system.attributes.resistances);
                packObject.system.attributes.resistances.forEach((value, i) => {
                    // eslint-disable-next-line no-prototype-builtins
                    if (packObject.system.attributes.resistances[i].hasOwnProperty("doubleVs")) {
                        packObject.system.attributes.resistances[i].doubleVs = revertTraits(
                            packObject.system.attributes.resistances[i].doubleVs,
                        );
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    if (packObject.system.attributes.resistances[i].hasOwnProperty("exceptions")) {
                        packObject.system.attributes.resistances[i].exceptions = revertTraits(
                            packObject.system.attributes.resistances[i].exceptions,
                        );
                    }
                    if (packObject.system.attributes.resistances[i].type === "void") {
                        packObject.system.attributes.resistances[i].type = "negative";
                    }
                    if (packObject.system.attributes.resistances[i].type === "vitality") {
                        packObject.system.attributes.resistances[i].type = "positive";
                    }
                });
            }
            packObject.items.forEach((value, i) => {
                packObject.items[i] = revertItem(value);
            });
        }
        if (packObject.type === "npc" || packObject.type === "character") {
            packObject.system.traits.languages.value = revertLanguages(packObject.system.traits.languages.value);
        }
        if (packObject.type === "spell") {
            if (spellSchools.hasOwnProperty(packObject.name)) {
                if (packObject.system.traits.value.indexOf(spellSchools[packObject.name]) < 0) {
                    packObject.system.traits.value.push(spellSchools[packObject.name]);
                    packObject.system.traits.value.sort();
                }
            }
        }

        newText = JSON.stringify(packObject, null, 4) + "\n";

        if (fileText !== newText) {
            fs.writeFileSync(fileName, newText);
            console.log(fileName + " is different, rewriting...");
        }
    });

    /**
     * @param {object} item
     */
    function revertItem(item) {
        switch (item.type) {
            case "action":
                // eslint-disable-next-line no-prototype-builtins
                if (item.system.hasOwnProperty("rules") && Array.isArray(item.system.rules)) {
                    item.system.rules = revertRules(item.system.rules);
                }
                item.system.traits.value = revertTraits(item.system.traits.value);
                break;
            case "ancestry":
                item.system.additionalLanguages.value = revertLanguages(item.system.additionalLanguages.value);
                item.system.languages.value = revertLanguages(item.system.languages.value);
                break;
            case "armor":
                item.system.traits.value = revertTraits(item.system.traits.value);
                break;
            case "consumable":
                // eslint-disable-next-line no-prototype-builtins
                if (item.system.hasOwnProperty("spell")) {
                    item.system.spell = revertItem(item.system.spell);
                }
                item.system.traits.value = revertTraits(item.system.traits.value);
                break;
            case "effect":
                // eslint-disable-next-line no-prototype-builtins
                if (item.system.hasOwnProperty("rules") && Array.isArray(item.system.rules)) {
                    item.system.rules = revertRules(item.system.rules);
                }
                break;
            case "equipment":
                item.system.traits.value = revertTraits(item.system.traits.value);
                // eslint-disable-next-line no-prototype-builtins
                if (item.system.hasOwnProperty("rules") && Array.isArray(item.system.rules)) {
                    item.system.rules = revertRules(item.system.rules);
                }
                break;
            case "feat":
                // eslint-disable-next-line no-prototype-builtins
                if (item.system.hasOwnProperty("rules") && Array.isArray(item.system.rules)) {
                    item.system.rules = revertRules(item.system.rules);
                }
                item.system.traits.value = revertTraits(item.system.traits.value);
                break;
            case "melee":
                item.system.traits.value = revertTraits(item.system.traits.value);
                break;
            case "spell":
                if (unRenameSpells.has(item.name)) {
                    item.name = unRenameSpells.get(item.name);
                }
                // eslint-disable-next-line no-prototype-builtins
                if (item.system.hasOwnProperty("slug") && unRenameSpellSlugs.has(item.system.slug)) {
                    item.system.slug = unRenameSpellSlugs.get(item.system.slug);
                }
                item.system.traits.value = revertTraits(item.system.traits.value);
                break;
            case "weapon":
                item.system.traits.value = revertTraits(item.system.traits.value);
                break;
            default:
        }
        return item;
    }

    /**
     * @param {array} rules
     */
    function revertRules(rules) {
        rules.forEach((value, i) => {
            // eslint-disable-next-line no-prototype-builtins
            if (rules[i].hasOwnProperty("type") && Array.isArray(rules[i].type)) {
                rules[i].type = revertTraits(rules[i].type);
            }
            if (
                // eslint-disable-next-line no-prototype-builtins
                rules[i].hasOwnProperty("traits") &&
                Array.isArray(rules[i].traits)
            ) {
                rules[i].traits = revertTraits(rules[i].traits);
            }
            if (
                // eslint-disable-next-line no-prototype-builtins
                rules[i].hasOwnProperty("predicate") &&
                Array.isArray(rules[i].predicate)
            ) {
                rules[i].predicate = JSON.parse(
                    JSON.stringify(rules[i].predicate)
                        .replaceAll('"vitality"', '"positive"')
                        .replaceAll('"void"', '"negative"'),
                );
            }
            if (
                // eslint-disable-next-line no-prototype-builtins
                rules[i].hasOwnProperty("exceptions") &&
                Array.isArray(rules[i].exceptions)
            ) {
                rules[i].exceptions = revertTraits(rules[i].exceptions);
            }
            if (
                // eslint-disable-next-line no-prototype-builtins
                rules[i].hasOwnProperty("deactivatedBy") &&
                Array.isArray(rules[i].deactivatedBy)
            ) {
                rules[i].deactivatedBy = revertTraits(rules[i].deactivatedBy);
            }
            if (
                // eslint-disable-next-line no-prototype-builtins
                rules[i].hasOwnProperty("value") &&
                rules[i].value &&
                // eslint-disable-next-line no-prototype-builtins
                rules[i].value.hasOwnProperty("damageTypes") &&
                Array.isArray(rules[i].value.damageTypes)
            ) {
                rules[i].value.damageTypes = revertTraits(rules[i].value.damageTypes);
            }
        });
        return rules;
    }
})();
