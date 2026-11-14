# -*- coding: utf-8 -*-
from odoo import models

from odoo.addons.pos_loyalty_packaging_uom.models.loyalty_rule import MODE_BLOCKED, MODE_COUNT


class LoyaltyRule(models.Model):
    _inherit = 'loyalty.rule'

    # Server twins of static/src/js/mm_pkg_models.js: Odoo 20 recomputes the
    # points of POS orders on the server (pos.order._process_loyalty).
    def _mm_is_blocked(self, order):
        self.ensure_one()
        if order.config_id and self._pkg_pos_mode(order.config_id) == MODE_BLOCKED:
            return True
        return super()._mm_is_blocked(order)

    def _mm_line_ratio(self, order, line):
        self.ensure_one()
        if not order.config_id or self._pkg_pos_mode(order.config_id) != MODE_COUNT:
            return super()._mm_line_ratio(order, line)
        conversion = self._pkg_line_conversion(line.product_id, line.packaging_uom_id or None)
        return conversion[1] if conversion else 0.0
