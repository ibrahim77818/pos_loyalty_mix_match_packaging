/** @odoo-module **/

/**
 * Bridge (v20): Mix & Match / Bundle rules count by unit, UoM or package with
 * the engine of pos_loyalty_packaging_uom (read only, neither module is modified).
 *
 * pos_loyalty 20.0 evaluates Mix & Match points at program level
 * (LoyaltyProgram.getEarnedPoints, patched by pos_loyalty_mix_match), so the
 * packaging patch of LoyaltyRule.isFulfilled never decides for these programs:
 * only the two counting hooks below are needed. Server twin:
 * models/loyalty_rule.py.
 */

import { patch } from "@web/core/utils/patch";
import { LoyaltyRule } from "@pos_loyalty/app/models/loyalty_rule";
// Imported for load order (both modules' LoyaltyRule patches first).
import "@pos_loyalty_mix_match/js/mm_models";
import { engineFor } from "@pos_loyalty_packaging_uom/js/pkg_loyalty_models";
import { lineForEngine } from "@pos_loyalty_packaging_uom/js/pkg_loyalty_rule";

patch(LoyaltyRule.prototype, {
    mmIsBlocked(order) {
        const engine = engineFor(order);
        return Boolean(engine && engine.isRuleBlocked(this)) || super.mmIsBlocked(...arguments);
    },
    mmLineRatio(order, line) {
        const engine = engineFor(order);
        if (!engine || !engine.isRuleActive(this)) {
            return super.mmLineRatio(...arguments);
        }
        const input = lineForEngine(line);
        // Rule settings come by rule id from pos.config (settingsFor).
        const conversion = engine.conversion(
            engine.settingsFor(this),
            input.product,
            input.packagingId,
            input.packagingQty
        );
        return conversion ? conversion.ratio : null;
    },
});
