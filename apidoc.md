Parse systems
=============

Update systems database.

```
[POST] /api/systems/parse
```

Parameters
----------

* sessid (int, required) - A valid PHPSESSID cookie

Parse places
============

Update places database.

```
[POST] /api/places/parse
```

Parameters
----------

* sessid (int, required) - A valid PHPSESSID cookie
* relatedplace (int, required) - A valid place id of one of the user's colonies

Post report
===========

Upload a report.

```
[POST] /api/reports
```

Parameters
----------

* report_id (int, required) - Id of the report
* place_id (int, required) - Id of the place

* coordinates (string) - Format : ⟨41⟩ 216:202:3
* inhabitants (int) - "habitants"
* resource_ratio (int) - "coeff. ressource"
* science_bonus (int) - "bonus scientifique"

* warehouses (int) - "Ressources dans les entrepôts"
* counterintelligence (int) - "Investissement dans le contre-espionnage"
* trade_routes (int) - "Revenus des routes commerciales"

* first_line ([compo]) - An array of compo
* second_line ([compo]) - An array of compo

### Compo schema

* name (string) - Commander name
* level (string) - Commander level
* pev (int) - PEV
* compo (*) - Ships