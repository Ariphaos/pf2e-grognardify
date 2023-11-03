import { ActorSourcePF2e } from "@actor/data/index.ts";
import { ItemSourcePF2e } from "@item/base/data/index.ts";
import { recursiveReplaceString } from "@util";
import { MigrationBase } from "../base.ts";

/** Replace all uses of and references to positive/negative to vitality/void. */
export class Migration865VitalityVoid extends MigrationBase {
    static override version = 0.865;

    #replaceStrings<TObject extends object>(data: TObject): TObject {
        return recursiveReplaceString(data, (s) =>
            s
                // Traits and damage types
                .replace(/^positive$/, "positive")
                .replace(/^negative$/, "negative")
                .replace(/^versatile-positive$/, "versatile-positive")
                .replace(/^versatile-negative$/, "versatile-negative")
                // Inline damage types
                .replace(/\bpositive\]/g, "vitality]")
                .replace(/\bnegative\]/g, "void]")
                .replace(/\[positive\b/g, "[vitality")
                .replace(/\[negative\b/g, "[void")
                // Localization keys
                .replace(/\bRollFlavor\.positive\b/g, "RollFlavor.positive")
                .replace(/\bRollFlavor\.negative\b/g, "RollFlavor.negative")
                .replace(/\bTraitPositive\b/g, "TraitPositive")
                .replace(/\bTraitNegative\b/g, "TraitNegative")
                .replace(/\bTraitVersatilePositive\b/g, "TraitVersatilePositive")
                .replace(/\bTraitVersatileNegative\b/g, "TraitVersatileNegative")
                // ???
                .replace(/\bnegative negative damage\b/, "void damage"),
        );
    }

    override async updateActor(source: ActorSourcePF2e): Promise<void> {
        source.system = this.#replaceStrings(source.system);
        source.flags = this.#replaceStrings(source.flags);
    }

    override async updateItem(source: ItemSourcePF2e): Promise<void> {
        source.system = this.#replaceStrings(source.system);
        source.flags = this.#replaceStrings(source.flags);
    }
}
