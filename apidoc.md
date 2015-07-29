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

Search place
============

Search a place.

```
[POST] /api/places/search
```

Parameters
----------

* from ({x: int, y: int}, required) - Coordinates of the place to look by (30 LY max)
* habitable (boolean) - If set, select only habitable or non-habitable
* available (boolean) - If set, select only available or non-available
* with_report (boolean) - If set and true, select only places with reports

* population ([int]) - If set, select only places with population in array
* defense ([int]) - If set, select only places with defense in array
* resource ([int]) - If set, select only places with resource in array
* science ([int]) - If set, select only places with science in array

* inhabitants (int) - If set, select only places with at least that many inhabitants or unknown number of inhabitants
* resource_ratio (int) - If set, select only places with at least this resource ratio or unknown resource ratio
* science_bonus (int) - If set, select only places with at least this science bonus or unknown science bonus

* warehouses (int) - If set, select only places with at least this many resources in warehouses or unknown resources
* first_line ({min: int, max: int}) - If set, select only places where first line PEV is between min and max, default 0-Infinity