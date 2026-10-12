const costingContent={lesson:`COSTING: FROM SUPPLIER PRICE TO SELLING PRICE

Sources: Ergovn training - Costing Rev02.pptx (cover identifies 2018 R01), and (Ergo-xxx) Costing Pxxx-E Rev00.xlsx. The deck and workbook disagree on some duties, supplier discounts, and logistics rates. These are training references, not a current approved price or tariff list. Confirm live inputs before preparing a quotation.

LEARNING OUTCOMES
Prepare a complete supplier request. Calculate discounted purchase cost and shipment volume. Identify freight, insurance, duty, delivery and installation costs. Calculate selling price from a target gross margin. Check the workbook before using its outputs.

1. SUPPLIER INFORMATION AND PRICE VALIDITY
Confirm the product model, specification, quantity, price and currency, purchase delivery term, lead time, warranty, manufacturing country and availability of origin documents. The workbook Note!C7 says to obtain a fresh quotation for an unfamiliar product or a price list / purchase order older than six months. Use the current supplier quotation and record its validity period. The named supplier contacts in the 2018 deck are historical references.
Source: deck slides 7–9; workbook Note!C7:C8.

2. DISCOUNTS AND CURRENCY
Check whether a price is a list price or already a net price. Confirm the agreed discount for this product and project before applying it. Avoid discounting a net quotation again. Convert the purchase price to the costing currency with the approved conversion factor. Do not mix GBP, USD and VND in one total without conversion.
Workbook sequence: converted unit cost = quoted unit price × conversion factor; discounted unit cost = converted unit cost × (1 − discount); total purchase cost = quantity × discounted unit cost. The workbook rounds discounted unit cost and totals to two decimals. Its purchase-currency factor at C7 differs from its USD-to-VND selling-price rate at AH13.
Practice example (invented for training): USD 1,000 list price, 30% discount, 10 units. Net unit cost = USD 700; total purchase cost = USD 7,000.
Source: deck slides 15–16; workbook Import!F14:J14 and Note!C9.

3. PACKING VOLUME (CBM)
CBM means cubic metres. Confirm packed dimensions and the number of units per package with the supplier. Dimensions in metres give volume = width × depth × height. Convert millimetres to metres before multiplying. Multiply unit CBM by quantity for total shipment CBM.
The deck includes chair and table shortcuts. The workbook notes also give estimates and point to packing dimensions. Treat shortcuts as estimates until confirmed by the shipper. Do not treat a product's assembled dimensions as verified packing dimensions.
Practice: 600 × 500 × 800 mm = 0.6 × 0.5 × 0.8 = 0.24 CBM. Ten such packages occupy 2.4 CBM.
Source: deck slide 10; workbook Note!C10:C11 and Import!D14:E14,K14.

4. DELIVERY TERMS AND LOGISTICS
Confirm the purchase delivery term and the sales delivery commitment. Identify costs already included by the supplier before adding haulage or freight. The deck's logistics examples are described as EXW-only. Obtain a forwarder quote when the route is unfamiliar. Include origin haulage and origin-document fees, freight, local charges, customs clearance, delivery, warehousing and installation when applicable.
The deck distinguishes LCL below 8 CBM and wholesale at or above 8 CBM. That is a historical training threshold, not a guarantee that a particular container is the best option. Confirm the route, packing and applicable current charges. Delivery location, access restrictions, project timing and installation requirements can change cost.
Source: deck slides 13–14; workbook Note!B4,C23:C34.

5. ALLOCATION AND INSURANCE
The workbook calculates total haulage and freight as the greater of the minimum fee and the CBM-based charge, then adds a flat fee. Cost per CBM = total charge ÷ total shipment CBM. Each item receives its total CBM × cost per CBM. The local-charge formula has an additional branch that should be checked rather than assumed identical to freight.
Practice: USD 600 freight allocated across 3 CBM gives USD 200/CBM. A line occupying 0.6 CBM receives USD 120 freight.
The workbook insurance calculation uses purchase cost including haulage plus freight as its base. Its sample rate is 0.75%. Confirm the required cover and actual rate before use. The Note sheet flags high-value shipments and long transit times for insurance.
Source: workbook Import!F6:H7,L14:P14,R6; Note!B4.

6. ORIGIN DOCUMENTS, DUTY AND IMPORT CHARGES
Check product classification, country of origin and qualifying origin documents with the forwarder or customs specialist. The source documents refer to Form E for China, Form D for Malaysia, and AANZ for Australia. They give conflicting numerical duty examples. Do not select a rate solely by brand or copy a historical rate into a live costing.
For a training calculation with an explicitly supplied duty base and rate: import duty = duty base × duty rate. The workbook uses CIF-to-Ergo as its duty base. It then calculates its CBPG duty using (CIF-to-Ergo + import duty) × the entered CBPG rate. Verify whether these charges apply to the actual goods. The workbook separately displays import VAT; do not silently include or exclude it from commercial cost without the approved accounting treatment.
Source: deck slides 4–5,11–12; workbook Note!C12:C17 and Import!R14:V14,I21.

7. LANDED COST AND GROSS MARGIN
Workbook to-warehouse cost = CIF-to-Ergo + import duty + CBPG duty + clearance and delivery. Check that the local-cost inputs include the delivery and installation services you have committed to. Gross profit = selling price − cost. Gross margin = gross profit ÷ selling price.
Selling price for a target gross margin = cost ÷ (1 − target margin). This differs from adding the same percentage to cost. Practice: USD 900 cost at a 25% target gross margin requires USD 1,200 revenue. Gross profit is USD 300. Adding 25% to cost gives USD 1,125 and only 20% gross margin.
The workbook divides total selling price by quantity to obtain unit price, then converts it to VND and rounds to the nearest VND 1,000. Check margin after final price rounding.
Source: workbook Import!X14:AE14,AH14 and T9.

8. PARTNER COSTS AND NET GP
The deck lists partner-discount examples. The workbook also calculates partner margin and a CAF deduction. These are separate calculations and must not be treated as interchangeable. Use only documented, approved business arrangements and the approved fee basis. Historical references to payments to an inside decision maker or unofficial charges are not an approved costing instruction.
The workbook gross profit and net GP differ because the CAF deduction reduces profit. Validate its purpose, percentage and approval before using it. A target gross margin does not guarantee the same net margin after additional fees.
Source: deck slide 14; workbook Import!Q14:R14,AD14:AG14.

9. WORKBOOK CHECKS
Use General for the overall project view. Import, PC, HAD and Cable Snake have imported-product costing structures; HAD's contains local components. Verify model, quantity, conversion factor, discount, unit CBM, total CBM, logistics allocation, insurance, duty, local cost, margin and final currency rounding. Extend totals and cross-check ranges when adding product rows.
The supplied file contains broken references at General!E10 and HAD!AM14. Do not use the affected project revenue, GP or component totals until those references are repaired and checked. Some cross-check formulas assume no partner margin: Import!R16 sums the base CIF components, while R14 includes a partner-margin uplift. Aggregate margin should use total profit ÷ total revenue, not the sum of individual margin percentages.
Source: workbook General!E10:E11; HAD!AM14:AN14; Import!R14,R16,AE15,AG16.

10. PRACTICE CASE
Use these fictional, already approved USD inputs: 10 units at USD 1,000 list price, 30% discount, 0.24 CBM per unit, USD 240 haulage, USD 600 freight, USD 60 insurance, 0% partner margin, 5% duty on CIF-to-Ergo, zero CBPG, USD 500 local charges, and 25% target gross margin.
Purchase cost: 10 × 1,000 × 70% = 7,000.
Total CBM: 10 × 0.24 = 2.4.
CIF-to-Ergo: 7,000 + 240 + 600 + 60 = 7,900.
Duty: 7,900 × 5% = 395.
To-warehouse cost: 7,900 + 395 + 500 = 8,795.
Selling price: 8,795 ÷ 75% = 11,726.67, rounded to cents.
Unit selling price: 11,726.67 ÷ 10 = 1,172.67, rounded to cents. Multiplying rounded unit price gives 11,726.70, so reconcile rounding when issuing the final quote.
The insurance amount here is a supplied fixed input, not the workbook's sample rate. Taxes, VAT and exchange-rate figures in this case are exercise assumptions only.

ASSESSMENT
20 equally weighted questions. Pass with at least 16 correct answers (70%). Passing the initial test schedules a retest six months later. Pass that retest at 70% to reach 100% module completion. Costing remains fourth in the pathway.`,questions:[
{prompt:'A supplier price list is more than six months old. What does the workbook Note sheet recommend?',options:['Obtain a fresh supplier quotation','Use it without checking','Increase every price by 25%','Ignore the currency'],answer:0,explanation:'Note!C7 recommends a fresh quotation for an unfamiliar product or a price list / PO older than six months.'},
{prompt:'Which information helps a supplier provide an accurate quotation?',options:['Only the project name','Only the desired margin','Product specification, quantity, currency, delivery terms, lead time and origin','Only the installation date'],answer:2,explanation:'Deck slides 7–9 and Note!C8 require enough product and order detail for an accurate quotation.'},
{prompt:'A quote explicitly states that its price is already net. What should you do before applying a further discount?',options:['Apply every historical discount','Confirm whether an additional discount is agreed','Deduct the gross margin','Divide the quote by quantity twice'],answer:1,explanation:'Note!C9 distinguishes net prices from list prices. Confirm the agreed terms to avoid double discounting.'},
{prompt:'For a USD 1,000 list price and a 30% discount, what is net unit purchase cost?',options:['USD 300','USD 1,300','USD 770','USD 700'],answer:3,explanation:'Import!I14 uses converted unit cost × (1 − discount). 1,000 × 0.70 = 700.'},
{prompt:'What is the volume of a 600 × 500 × 800 mm package?',options:['0.24 CBM','240 CBM','2.4 CBM','0.024 CBM'],answer:0,explanation:'Convert to metres: 0.6 × 0.5 × 0.8 = 0.24 cubic metres.'},
{prompt:'Ten units each occupy 0.24 CBM. What is the total volume?',options:['0.24 CBM','24 CBM','2.4 CBM','0.024 CBM'],answer:2,explanation:'Import!K14 uses quantity × unit CBM: 10 × 0.24 = 2.4.'},
{prompt:'Which is the strongest basis for final packing volume?',options:['An unconfirmed chair shortcut','Confirmed packing dimensions and units per package from the supplier','The target gross margin','The retail selling price'],answer:1,explanation:'Note!C11 recommends checking packing information with the shipper. Deck shortcuts are estimates.'},
{prompt:'Why check the supplier delivery term before adding freight and haulage?',options:['It sets the quiz score','It removes all import charges','It fixes the exchange rate','To identify included costs and avoid double counting'],answer:3,explanation:'Deck slide 13 says to check the supplier Incoterm before adding the EXW example costs.'},
{prompt:'USD 600 freight is allocated over 3 CBM. How much is allocated to a 0.6 CBM line?',options:['USD 120','USD 360','USD 200','USD 1,000'],answer:0,explanation:'Cost per CBM = 600 ÷ 3 = 200. Line freight = 0.6 × 200 = 120. See Import!H7,N14.'},
{prompt:'Minimum freight is USD 350, the volume-based charge is USD 300, and the flat fee is USD 20. What total does the workbook freight logic give?',options:['USD 320','USD 650','USD 370','USD 670'],answer:2,explanation:'Import!H6 uses the greater of the minimum fee and rounded volume charge, plus the flat fee: 350 + 20 = 370.'},
{prompt:'The deck and workbook give different duty percentages. What should you do for a live costing?',options:['Always use the higher rate as law','Verify classification, origin documents and the applicable rate with the forwarder/customs specialist','Average both percentages','Choose a rate by brand name alone'],answer:1,explanation:'The sources conflict. Note!C17 directs checking with the forwarder. Historical examples are not a current tariff schedule.'},
{prompt:'An exercise gives a USD 7,900 duty base and 5% duty rate. What is duty?',options:['USD 79','USD 790','USD 1,580','USD 395'],answer:3,explanation:'Using the explicitly supplied training assumptions: 7,900 × 0.05 = 395. See Import!T14.'},
{prompt:'CIF-to-Ergo is USD 7,900, duty USD 395, CBPG zero and local charges USD 500. What is to-warehouse cost?',options:['USD 8,795','USD 7,900','USD 8,295','USD 8,400'],answer:0,explanation:'Import!X14 sums CIF-to-Ergo, import duty, CBPG duty, clearance and delivery: 7,900 + 395 + 0 + 500 = 8,795.'},
{prompt:'Which selling-price formula gives a target gross margin?',options:['Cost × margin','Cost + margin','Cost ÷ (1 − margin)','Cost ÷ quantity only'],answer:2,explanation:'Import!Y14 uses X14 ÷ (1 − T9). Gross margin uses revenue as its denominator.'},
{prompt:'Cost is USD 900 and the target gross margin is 25%. What selling price achieves that margin?',options:['USD 1,125','USD 1,200','USD 925','USD 675'],answer:1,explanation:'900 ÷ 0.75 = 1,200. Profit is 300 and 300 ÷ 1,200 = 25%.'},
{prompt:'What gross margin results from selling a USD 900-cost item for USD 1,125?',options:['25%','30%','15%','20%'],answer:3,explanation:'Profit = 1,125 − 900 = 225. Gross margin = 225 ÷ 1,125 = 20%.'},
{prompt:'What should happen when the project revenue formula contains #REF!?',options:['Repair and check the references before relying on revenue or GP','Treat the error as zero revenue','Issue the quote immediately','Hide the affected row'],answer:0,explanation:'General!E10 contains broken references and E11 depends on that revenue. The result cannot be relied upon until repaired and checked.'},
{prompt:'How should an overall project margin be calculated across multiple product lines?',options:['Sum each line margin percentage','Use the largest line margin','Total gross profit ÷ total revenue','Average discounts'],answer:2,explanation:'General!E11 calculates profit relative to total revenue. Summing line percentages does not produce the correct project margin.'},
{prompt:'For which arrangement may partner costs be included in a costing?',options:['Any undocumented payment suggested in an old deck','A documented, approved business arrangement using its approved fee basis','Any payment to an inside decision maker','A fee copied from another project without checking'],answer:1,explanation:'Historical partner examples do not establish current approval. Confirm the legitimate business arrangement and its calculation basis.'},
{prompt:'In the practice case, cost is USD 8,795 and target gross margin is 25%. What is total selling price rounded to cents?',options:['USD 10,993.75','USD 8,820.00','USD 12,000.00','USD 11,726.67'],answer:3,explanation:'8,795 ÷ (1 − 0.25) = 11,726.666…, rounded to USD 11,726.67. Check rounding again when issuing unit prices.'}
]};
