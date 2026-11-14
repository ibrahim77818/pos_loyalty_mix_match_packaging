/** @odoo-module **/

/**
 * Bridge: Mix & Match / Bundle rules count by unit, UoM or package with the
 * engine of pos_loyalty_packaging_uom (read only, neither module is modified).
 *
 * Load order: this module depends on both, so this patch comes after theirs.
 * pointsForPrograms() takes Mix & Match programs out again before calling
 * super, so that pos_loyalty_packaging_uom's port of the standard (OR) rule
 * evaluation never sees them, whatever the order of the two inner patches.
 */

import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";
// Imported for load order (both modules' PosOrder patches first).
import "@pos_loyalty_mix_match/js/mm_models";
import "@pos_loyalty_packaging_uom/js/pkg_loyalty_models";
import { isMixMatchType } from "@pos_loyalty_mix_match/js/mm_engine";

function m2oId(value) {
    if (Array.isArray(value)) {
        return value[0] || false;
    }
    if (value && typeof value === "object") {
        return value.id || false;
    }
    return value || false;
}

patch(PosOrder.prototype, {
    _mmRuleBlocked(rule) {
        return this._pkgRuleBlocked(rule) || super._mmRuleBlocked(...arguments);
    },
    _mmLineRatio(rule, line) {
        if (!this._pkgRuleActive(rule)) {
            return super._mmLineRatio(...arguments);
        }
        const engine = this._pkgEngine();
        // v18+ engine: rule settings come by rule id from pos.config (settingsFor).
        const conversion = engine.conversion(
            engine.settingsFor(rule),
            line.getProduct(),
            m2oId(line.packaging_uom_id),
            line.pkg_contained_qty || 0
        );
        return conversion ? conversion.ratio : null;
    },
    pointsForPrograms(programs) {
        const mixMatch = programs.filter((program) => isMixMatchType(program.program_type));
        if (!mixMatch.length) {
            return super.pointsForPrograms(...arguments);
        }
        const others = programs.filter((program) => !isMixMatchType(program.program_type));
        return Object.assign(super.pointsForPrograms(others), this._mmPointsForPrograms(mixMatch));
    },
});
