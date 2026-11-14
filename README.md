# POS Mix & Match - Packaging & UoM Bridge

Bridge (auto-install) between [pos_loyalty_mix_match](https://github.com/ibrahim77818/pos_loyalty_mix_match) and [pos_loyalty_packaging_uom](https://github.com/ibrahim77818/pos_loyalty_packaging_uom): Mix & Match and Bundle rules count by unit, unit of measure or package ("any 3 boxes, cheapest box free"). Neither module is modified.

Installed automatically when both modules are installed.

| Branch | Odoo version |
|---|---|
| `16.0` (default) | 16.0 Community & Enterprise |
| `17.0` | 17.0 Community & Enterprise |
| `18.0` | 18.0 Community & Enterprise |
| `19.0` | 19.0 Community & Enterprise |
| `20.0` | 20.0 Community & Enterprise |

This branch: **19.0**. Depends on: `pos_loyalty_mix_match, pos_loyalty_packaging_uom`. Languages: English, Arabic.

## Installation
1. Check out the branch matching your Odoo version and copy the `pos_loyalty_mix_match_packaging` folder into your addons path
   (`git clone -b 19.0 https://github.com/ibrahim77818/pos_loyalty_mix_match_packaging.git`).
2. Restart Odoo, update the Apps list and install **POS Mix & Match - Packaging & UoM Bridge**
   (or `odoo-bin -d <db> -i pos_loyalty_mix_match_packaging`).

Author: Ibrahim Yahia ([LinkedIn](https://www.linkedin.com/in/ibrahim-yahia)) · License: OPL-1
