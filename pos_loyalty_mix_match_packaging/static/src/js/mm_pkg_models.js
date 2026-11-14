/** @odoo-module **/

/**
 * Bridge: Mix & Match / Bundle rules count by unit, UoM or package with the
 * engine of pos_loyalty_packaging_uom (read only, neither module is modified).
 *
 * Load order: this module depends on both, so this extension wraps theirs.
 * pointsForPrograms() takes Mix & Match programs out again before calling
 * super, so that pos_loyalty_packaging_uom's port of the standard (OR) rule
 * evaluation never sees them, whatever the order of the two inner extensions.
 */

import { Order } from "point_of_sale.models";
import Registries from "point_of_sale.Registries";
// Imported for load order (both modules' Order extensions first).
import "@pos_loyalty_mix_match/js/mm_models";
import "@pos_loyalty_packaging_uom/js/pkg_loyalty_models";
import { isMixMatchType } from "@pos_loyalty_mix_match/js/mm_engine";

const MixMatchPkgOrder = (Order) =>
    class extends Order {
        _mmRuleBlocked(rule) {
            return this.pos.pkgRuleBlocked(rule) || super._mmRuleBlocked(...arguments);
        }
        _mmLineRatio(rule, line) {
            if (!this.pos.pkgRuleQtyActive(rule)) {
                return super._mmLineRatio(...arguments);
            }
            const conversion = this.pos.pkgLoyalty.conversion(
                rule,
                line.get_product(),
                line.packaging_id || false,
                line.pkg_contained_qty || 0
            );
            return conversion ? conversion.ratio : null;
        }
        pointsForPrograms(programs) {
            const mixMatch = programs.filter((program) => isMixMatchType(program.program_type));
            if (!mixMatch.length) {
                return super.pointsForPrograms(...arguments);
            }
            const others = programs.filter((program) => !isMixMatchType(program.program_type));
            return Object.assign(super.pointsForPrograms(others), this._mmPointsForPrograms(mixMatch));
        }
    };
Registries.Model.extend(Order, MixMatchPkgOrder);
