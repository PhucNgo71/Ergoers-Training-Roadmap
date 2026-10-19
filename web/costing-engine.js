/* Formula model traced from the six supplied costing workbooks. No source prices. */
const costingEngine = (() => {
  const round = (n, places=2) => Math.sign(n)*Math.round((Math.abs(n)+Number.EPSILON)*10**places)/10**places;
  const blankLine = id => ({id,category:'Chairs',description:'',code:'',supplier:'',hsCode:'',origin:'',taxNote:'',quantity:1,unit:'pcs',unitCost:'',costFx:1,discount:0,cbm:'',partnerMargin:0,importTax:0,cbpg:0,vat:0,installationPerUnit:0,priceMode:'margin',marketPrice:''});
  const defaults = () => ({currency:'USD',quoteCurrency:'USD',quoteFx:1,quoteRound:0.01,margin:30,insurance:0.75,cafRate:5,cafShare:70,consultantFee:0,haulageMin:0,haulageFlat:0,haulageRate:0,freightMin:0,freightFlat:0,freightRate:0,localCharge:0,clearance:0,loadInstall:0,delivery:0,warehouse:0,prelim:0,localFlat:0,localRate:0});
  function charge(min,flat,rate,cbm,local=false){
    const variable=round(rate*cbm);
    // R6 adds the unrounded variable charge when the local minimum binds.
    return local && variable<=min ? min+flat+rate*cbm : Math.max(min,variable)+flat;
  }
  function calculate(lines,settings){
    const s={...defaults(),...settings},errors=[];
    const number=(v,name,{positive=false,percent=false}={})=>{
      const n=(v===''||v===null||v===undefined)?NaN:Number(v);
      if(!Number.isFinite(n)||n<0||(positive&&n<=0)||(percent&&n>=100))errors.push(name+' '+(percent?'must be between 0 and below 100%.':positive?'must be greater than zero.':'needs a non-negative number.'));
      return n;
    };
    if(!lines.length)errors.push('Add at least one product.');
    for(const key of Object.keys(defaults()).filter(k=>!['currency','quoteCurrency'].includes(k)))number(s[key],key,{positive:['quoteFx','quoteRound'].includes(key),percent:['margin','insurance'].includes(key)});
    if(Number(s.cafRate)>100||Number(s.cafShare)>100)errors.push('CAF rate and payable share cannot exceed 100%.');
    const base=lines.map((l,i)=>{
      const prefix='Product '+(i+1)+': ';
      const q=number(l.quantity,prefix+'quantity',{positive:true}),fx=number(l.costFx,prefix+'supplier exchange rate',{positive:true});
      const cost=number(l.unitCost,prefix+'supplier unit cost'),volume=number(l.cbm,prefix+'CBM per unit');
      for(const key of ['discount','partnerMargin'])number(l[key],prefix+key,{percent:true});
      for(const key of ['importTax','cbpg','vat','installationPerUnit'])number(l[key],prefix+key);
      if(l.priceMode==='market')number(l.marketPrice,prefix+'market unit price',{positive:true});
      const discountedUnit=round(cost*fx*(1-Number(l.discount)/100));
      return {quantity:q,discountedUnit,product:round(q*discountedUnit),totalCbm:round(q*volume)};
    });
    const totalCbm=round(base.reduce((n,r)=>n+r.totalCbm,0));
    const localMin=['localCharge','clearance','loadInstall','delivery','warehouse','prelim'].reduce((n,k)=>n+Number(s[k]),0);
    const shipment={haulage:charge(+s.haulageMin,+s.haulageFlat,+s.haulageRate,totalCbm),freight:charge(+s.freightMin,+s.freightFlat,+s.freightRate,totalCbm),local:charge(localMin,+s.localFlat,+s.localRate,totalCbm,true)};
    if(totalCbm===0&&Object.values(shipment).some(n=>n>0))errors.push('Enter positive CBM to allocate shipment charges.');
    const rates=Object.fromEntries(Object.entries(shipment).map(([k,v])=>[k,totalCbm>0?round(v/totalCbm):0]));
    if(errors.length)return {valid:false,errors:[...new Set(errors)],rows:[],totals:null,shipment,totalCbm};
    const rows=base.map((b,i)=>{
      const l=lines[i];
      const haulage=round(b.totalCbm*rates.haulage),fob=b.product+haulage;
      const freight=round(b.totalCbm*rates.freight),insurance=round((fob+freight)*Number(s.insurance)/100);
      const cif=fob+freight+insurance,cifToErgo=round(cif/(1-Number(l.partnerMargin)/100));
      const duty=round(cifToErgo*Number(l.importTax)/100),cbpgDuty=round((cifToErgo+duty)*Number(l.cbpg)/100);
      const local=round(b.totalCbm*rates.local),installation=round(b.quantity*Number(l.installationPerUnit));
      const warehouseCost=round(cifToErgo+duty+cbpgDuty+local),totalCost=round(warehouseCost+installation);
      const targetSales=round(totalCost/(1-Number(s.margin)/100)),targetUnit=round(targetSales/b.quantity);
      const unitPrice=l.priceMode==='market'?Number(l.marketPrice)/Number(s.quoteFx):targetUnit;
      const sales=round(b.quantity*unitPrice),grossProfit=round(sales-totalCost),grossMargin=sales>0?grossProfit/sales*100:0;
      const caf=round(sales*Number(s.cafRate)/100*Number(s.cafShare)/100);
      const importVat=round((cifToErgo+duty+cbpgDuty)*Number(l.vat)/100);
      const quoteUnit=round(round(unitPrice*Number(s.quoteFx)/Number(s.quoteRound),0)*Number(s.quoteRound));
      const quotedTotal=round(quoteUnit*b.quantity),quotedBaseSales=quotedTotal/Number(s.quoteFx);
      return {...b,haulage,fob,freight,insurance,cif,cifToErgo,duty,cbpgDuty,local,installation,warehouseCost,totalCost,targetSales,targetUnit,sales,grossProfit,grossMargin,caf,netProfit:round(grossProfit-caf),importVat,quoteUnit,quotedTotal,quotedBaseSales};
    });
    const keys=['product','totalCbm','haulage','freight','insurance','cif','cifToErgo','duty','cbpgDuty','local','installation','warehouseCost','totalCost','targetSales','sales','grossProfit','caf','netProfit','importVat','quotedTotal','quotedBaseSales'];
    const totals=Object.fromEntries(keys.map(k=>[k,round(rows.reduce((n,r)=>n+r[k],0))]));
    totals.netProfit=round(totals.netProfit-Number(s.consultantFee));
    totals.grossMargin=totals.sales>0?totals.grossProfit/totals.sales*100:0;
    totals.netMargin=totals.sales>0?totals.netProfit/totals.sales*100:0;
    totals.quotedMargin=totals.quotedBaseSales>0?(totals.quotedBaseSales-totals.totalCost)/totals.quotedBaseSales*100:0;
    totals.cashCost=round(totals.totalCost+totals.importVat);
    const allocationDifference=round(shipment.haulage+shipment.freight+shipment.local-totals.haulage-totals.freight-totals.local);
    return {valid:true,errors:[],rows,totals,shipment,rates,allocationDifference,totalCbm};
  }
  return {round,blankLine,defaults,charge,calculate,version:'workbooks-2026-10-19-v1'};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=costingEngine;
