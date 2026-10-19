# Costing and project preparation

Open `/costing.html` or `/costing.html?demo` for the fictional sample project. The academy navigation and the Costing lesson link to this page.

The workflow is Prepare costing → Excel preview → Download Excel. Drafts and JSON backups are browser-local. Excel generation runs locally using the vendored ExcelJS 4.4.0 browser bundle (MIT; license in `web/vendor`). No pricing data is sent to a server. Manager approval and SharePoint integration are deferred at the user's request.

## Formula model

`costing-engine.js` traces the common calculation chain from six supplied models: Milliken Carpet 1000sqm, Phonebooth, Chairs, Loose Furniture, Monitor Arm and Table. Source product prices and the original workbooks are not published with this update.

- Supplier FX conversion → supplier discount → two-decimal discounted unit cost.
- Quantity × unit CBM → two-decimal line CBM.
- Haulage and freight = maximum of minimum charge or rounded variable charge, plus flat fee. Allocate using rounded per-CBM rates.
- Local minimum = local charge + clearance + loading/installation + delivery + warehouse + preliminaries. Preserve the source R6 rule: when variable charge is at/below the minimum, total is minimum + flat + unrounded variable; otherwise rounded variable + flat.
- CIF = discounted product + haulage + freight + insurance on C&F.
- CIF to Ergo = CIF ÷ (1 − partner margin).
- Import duty on CIF to Ergo; CBPG on CIF to Ergo + import duty.
- Landed cost = CIF to Ergo + import duty + CBPG + local allocation. Extra per-unit delivery/installation is added once, separately from shared shipment costs.
- Target sales = total cost ÷ (1 − margin); rounded target unit price drives sales. Market unit pricing is supported independently.
- CAF and consultant fees are shown separately. Import VAT is separate cash required, excluded from landed cost. Rates remain editable assumptions, not validated tax advice.
- Quotation FX and rounding increment determine quoted totals and the margin at the quoted price. The profit-after-fees metric is explicitly before quote rounding.

Historical VAT/duty rates, hardcoded market prices, accessory bundles and income-tax estimates are not copied automatically. Add accessories as separate products. Shipment rounding differences are displayed instead of silently reallocated. Import tax has visible amber guidance and dedicated HS code, origin/CO and source-note fields in both UI and export.

## Excel

The export contains Summary, Costing and Inputs with typed values, editable blue cells, linked formulas and cached results. Excel recalculates on opening. Summary shows costing and quotation currencies, quoted total and quoted gross margin. Import-tax columns and notes are highlighted. Rates and calculations remain linked when inputs change. The product table has filters and frozen identifiers.

## Validation

`node check-costing-model.cjs` tests invalid/missing inputs, zero vs blank, minimum and variable charge branches, CBPG/VAT bases, multi-product allocation and Excel serialization/read-back. Private local fixtures additionally reconcile 144 cell results across the six actual workbooks; the fixture prices are intentionally excluded from GitHub.

The generated demo export was independently imported and recalculated using Artifact Tool: quote total 144,740,000 VND; doubling the sample chair quantity updated the same workbook to 223,420,000 VND. Summary, product inputs, calculation output and assumptions were visually inspected.
