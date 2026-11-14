# -*- coding: utf-8 -*-
{
    'name': 'POS Mix & Match - Packaging & UoM Bridge',
    'version': '17.0.1.0.0',
    'category': 'Sales/Point of Sale',
    'summary': 'Mix & Match and Bundle programs count by unit, unit of measure or package '
               '(installed automatically with POS Loyalty Packaging & UoM).',
    'description': """
POS Mix & Match - Packaging & UoM Bridge
========================================
Installed automatically when both POS Mix & Match and Bundle Promotions
(pos_loyalty_mix_match) and POS Loyalty Packaging & UoM
(pos_loyalty_packaging_uom) are installed. Neither module is modified.

* The "Count by: Units / UoM / Package" of a rule applies to Mix & Match and
  Bundle programs: a rule "Minimum Quantity 3, count by Box of 6" needs 3 boxes
  (18 units) per set; the cheapest-item reward then frees one box.
* Same switch as POS Loyalty Packaging & UoM (packaging scanning + "Pricelists by
  Package"); where it is off, the rule's "Where Packaging Is Off" applies
  (count units, or the rule doesn't apply).
* Packages are counted exactly in sets: the rounding of fractional packages is
  not used by these programs (and is hidden on their rules).
""",
    'author': 'Ibrahim Yahia',
    'website': 'https://www.linkedin.com/in/ibrahim-yahia',
    'license': 'OPL-1',
    'depends': ['pos_loyalty_mix_match', 'pos_loyalty_packaging_uom'],
    'data': [
        'views/loyalty_rule_views.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_loyalty_mix_match_packaging/static/src/js/**/*.js',
        ],
    },
    'images': ['static/description/banner.png'],
    'installable': True,
    'application': False,
    'auto_install': True,
}
