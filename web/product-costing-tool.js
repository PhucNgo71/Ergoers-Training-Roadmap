const productCostingHardFloor=12;
let productCostingTargetMargin=30;
let productCostingNextId=2;
let productCostingLines=[productCostingBlankLine(1)];

function productCostingBlankLine(id){
  return {id,description:'',code:'',quantity:1,unit:'pcs',unitCost:'',cbm:'',logisticsPerCbm:'',inlandPerCbm:'',importTax:'',installationPerUnit:''};
}
function productCostingNumber(value){
  const number=Number(value);
  return Number.isFinite(number)&&number>0?number:0;
}
function productCostingCalculate(line,margin=productCostingTargetMargin){
  const quantity=productCostingNumber(line.quantity);
  const product=quantity*productCostingNumber(line.unitCost);
  const totalCbm=quantity*productCostingNumber(line.cbm);
  const international=totalCbm*productCostingNumber(line.logisticsPerCbm);
  const inland=totalCbm*productCostingNumber(line.inlandPerCbm);
  const importTax=(product+international)*(productCostingNumber(line.importTax)/100);
  const installation=quantity*productCostingNumber(line.installationPerUnit);
  const totalCost=product+international+inland+importTax+installation;
  const marginNumber=productCostingNumber(margin);
  const sellingPrice=marginNumber<100?totalCost/(1-marginNumber/100):0;
  return {quantity,product,totalCbm,international,inland,importTax,installation,totalCost,sellingPrice,profit:sellingPrice-totalCost};
}
function productCostingTotals(){
  const rows=productCostingLines.map(line=>productCostingCalculate(line));
  const totals=rows.reduce((sum,row)=>{
    for(const key of ['totalCbm','international','inland','importTax','installation','totalCost'])sum[key]+=row[key];
    return sum;
  },{totalCbm:0,international:0,inland:0,importTax:0,installation:0,totalCost:0});
  const margin=productCostingNumber(productCostingTargetMargin);
  totals.sellingPrice=margin<100?totals.totalCost/(1-margin/100):0;
  totals.profit=totals.sellingPrice-totals.totalCost;
  return {rows,totals};
}
function productCostingEscape(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function productCostingMoney(value){
  if(!value)return '—';
  return new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(value);
}
function productCostingInput(line,field,label,options={}){
  const {type='number',placeholder='',step='any'}=options;
  return `<label><span>${label}</span><input type="${type}" ${type==='number'?'min="0" inputmode="decimal"':''} step="${step}" placeholder="${placeholder}" value="${productCostingEscape(line[field])}" oninput="productCostingUpdate(${line.id},'${field}',this.value)"></label>`;
}
function productCostingLine(line,index,row){
  return `<article class="costing-line">
    <div class="costing-line-title"><div><span class="costing-index">${String(index+1).padStart(2,'0')}</span><strong>${productCostingEscape(line.description)||'New product'}</strong><small>${productCostingEscape(line.code)||'Add description and product code'}</small></div>${productCostingLines.length>1?`<button class="costing-remove" type="button" onclick="productCostingRemove(${line.id})" aria-label="Remove product ${index+1}">Remove</button>`:''}</div>
    <div class="costing-fields">
      ${productCostingInput(line,'description','Product description',{type:'text',placeholder:'e.g. task chair'})}
      ${productCostingInput(line,'code','Product code',{type:'text',placeholder:'SKU / model'})}
      ${productCostingInput(line,'quantity','Quantity / area',{placeholder:'1'})}
      <label><span>Unit</span><select onchange="productCostingUpdate(${line.id},'unit',this.value)"><option value="pcs" ${line.unit==='pcs'?'selected':''}>pcs</option><option value="sqm" ${line.unit==='sqm'?'selected':''}>sqm</option></select></label>
      ${productCostingInput(line,'unitCost',`Base product cost / ${line.unit}`,{placeholder:'Enter cost'})}
      ${productCostingInput(line,'cbm',`CBM / ${line.unit}`,{placeholder:'Enter CBM'})}
      ${productCostingInput(line,'logisticsPerCbm','International logistics / CBM',{placeholder:'Enter rate'})}
      ${productCostingInput(line,'inlandPerCbm','Inland logistics / CBM',{placeholder:'Enter rate'})}
      ${productCostingInput(line,'importTax','Import tax %',{placeholder:'Enter %'})}
      ${productCostingInput(line,'installationPerUnit',`Delivery / installation / ${line.unit}`,{placeholder:'Enter cost'})}
    </div>
    <div class="costing-row-result">
      <span><small>Product</small><strong>${productCostingMoney(row.product)}</strong></span>
      <span><small>Total CBM</small><strong>${productCostingMoney(row.totalCbm)}</strong></span>
      <span><small>International</small><strong>${productCostingMoney(row.international)}</strong></span>
      <span><small>Inland</small><strong>${productCostingMoney(row.inland)}</strong></span>
      <span><small>Import tax</small><strong>${productCostingMoney(row.importTax)}</strong></span>
      <span><small>Delivery / installation</small><strong>${productCostingMoney(row.installation)}</strong></span>
      <span class="costing-total-cell"><small>Total cost</small><strong>${productCostingMoney(row.totalCost)}</strong></span>
    </div>
  </article>`;
}
function productCostingTool(){
  const {rows,totals}=productCostingTotals();
  const margin=productCostingNumber(productCostingTargetMargin);
  const marginWarning=margin<productCostingHardFloor
    ?`<p class="costing-warning"><strong>Margin below the 12% hard floor.</strong> Escalate for approval before quoting.</p>`
    :margin>=100?`<p class="costing-warning"><strong>Margin must be below 100%.</strong> Check the target before quoting.</p>`
    :`<p class="costing-ok">Target margin is at or above the 12% hard floor.</p>`;
  return `<section id="product-costing-tool" class="academy-costing-tool">
    <div class="costing-tool-head"><div><span class="costing-kicker">PRACTICAL COSTING TOOL</span><h2>Product landed cost calculator</h2><p>Build a multi-product estimate for product, freight, import tax, delivery and installation. Use one currency consistently across the quotation.</p></div><div class="costing-rule"><strong>12%</strong><span>minimum gross-margin floor</span></div></div>
    <div class="costing-control"><label><span>Target gross margin %</span><input type="number" min="0" max="99.99" step="0.1" value="${productCostingEscape(productCostingTargetMargin)}" oninput="productCostingSetMargin(this.value)"></label><button type="button" onclick="productCostingRender()">Calculate costing</button>${marginWarning}</div>
    <div class="costing-lines">${productCostingLines.map((line,index)=>productCostingLine(line,index,rows[index])).join('')}</div>
    <div class="costing-actions"><button class="secondary" type="button" onclick="productCostingAdd()">+ Add another product</button></div>
    <div class="costing-summary">
      <span><small>Total CBM</small><strong>${productCostingMoney(totals.totalCbm)}</strong></span>
      <span><small>Total landed cost</small><strong>${productCostingMoney(totals.totalCost)}</strong></span>
      <span><small>Target selling price</small><strong>${productCostingMoney(totals.sellingPrice)}</strong></span>
      <span><small>Estimated profit</small><strong>${productCostingMoney(totals.profit)}</strong></span>
    </div>
    <details class="costing-formula"><summary>How the calculation works</summary><p>Total cost = product + international logistics + inland logistics + import tax + delivery / installation.</p><p>Import tax is estimated on product plus international logistics. Target selling price = total cost ÷ (1 − target gross margin).</p><p><strong>Decision check:</strong> validate HS code, tax base, Incoterm, exchange rate, insurance and current freight quotations before submitting a bid. AI advises; P makes the final decision.</p></details>
  </section>`;
}
function productCostingUpdate(id,field,value){
  const line=productCostingLines.find(item=>item.id===id);
  if(!line)return;
  line[field]=field==='description'||field==='code'||field==='unit'?value:(value===''?'':Number(value));
}
function productCostingSetMargin(value){
  productCostingTargetMargin=value===''?'':Number(value);
}
function productCostingRender(){
  const node=document.getElementById('product-costing-tool');
  if(node)node.outerHTML=productCostingTool();
}
function productCostingAdd(){
  productCostingLines.push(productCostingBlankLine(productCostingNextId++));
  productCostingRender();
}
function productCostingRemove(id){
  productCostingLines=productCostingLines.filter(item=>item.id!==id);
  if(!productCostingLines.length)productCostingLines=[productCostingBlankLine(productCostingNextId++)];
  productCostingRender();
}
