operationContent.previousLesson=operationContent.lesson;
operationContent.previousQuestions=JSON.stringify(operationContent.questions);
const operationStages=[
{title:'Connect',owner:'Sales',action:'Find the client through designers, leasing contacts or project-management companies.',check:'Know the project contact and arrange the next conversation.',source:'1A'},
{title:'Specify',owner:'Sales',action:'Meet the source and introduce products that fit the project.',check:'Understand the requirement and develop interest in the proposal.',source:'2A'},
{title:'Quote',owner:'Sales + Sales Admin + PM',action:'Build a quotation that covers all costs and company profit.',check:'Check every line. Confirm technical scope and delivery commitments.',source:'3A'},
{title:'Agree',owner:'Sales + Sales Admin',action:'Coordinate price, payment terms and contract paperwork.',check:'Approved terms and supervisor-approved costing before signing.',source:'4A'},
{title:'Collect',owner:'Sales Admin',action:'Follow the contract: invoice, prepare collection documents and follow up.',check:'Full payment closes the source’s sales process.',source:'5A'}
];
operationContent.lesson=`OPERATION PROCESS AT A GLANCE

CONNECT → SPECIFY → QUOTE → AGREE → COLLECT

Connect — Sales finds the project contact.
Specify — Sales meets the source and develops the product requirement.
Quote — Sales, Sales Admin and PM check all items, costs and profit.
Agree — Sales and Sales Admin coordinate terms and paperwork. Obtain supervisor-approved costing before signing.
Collect — Sales Admin invoices and follows up until full payment.

SUPPORT THAT RUNS ALONGSIDE THE SALES STAGES
Supplier: Sales Admin confirms price, discount, ex-works date, HS code and origin information.
Forwarder: Sales Admin compares more than one forwarder for price and service. PM advises on trucking, loading and unloading at the site.
Site: PM supports technical proposals, follows safe and timely delivery and trains the Site Manager and workers to handle products carefully.

COMMUNICATION AND EVIDENCE
External subject: [Ergo-Client] Clear subject.
Internal subject: [Ergo Internal] Clear subject.
Email structure: greeting, thanks, purpose, closing remarks, closing.
Keep it specific and concise. The Email deck recommends no more than three paragraphs, with bullet points where useful.
Check the recipient, subject and files or links before sending.
Use Reply all when the relevant group needs the update. Use Reply for a private discussion. CC keeps recipients informed; BCC hides recipients from other recipients. Check intended recipients before sending.
The source asks for files on the company server with links in email. Use a location the intended recipient can access. Revision format: original file name - R01, then R02.
Mobile email: include your contact information in the signature. The deck’s device policy and messaging-app preferences are historical source details, not a newly confirmed policy.

ONE WORKING HABIT
Clarify the scope before starting. Discuss politely, learn, share and support the team.

BEFORE SIGNING
Are the price and payment terms acceptable? Are terms approved? Is costing approved by the supervisor? Have the team checked the delivery commitments?

Source: Ergovn Sales Process- Phuc Ngo.docx; Ergovn training - Write email Rev02.pptx (cover Rev01-2018).
The process document’s hit ratios are illustrative stage markers, not forecasts. Its full-payment marker is separate from academy completion.
Each test draws 30 random questions. Pass at 21/30 (70%), then pass the six-month retest at 70% for 100% module completion.`;
operationContent.questions.push(
{prompt:'Which subject follows the source’s external email format?',options:['[Ergo-ABC] Chair specification confirmation','Hi','No subject','Internal only'],answer:0,explanation:'Email slide 2 uses [Ergo-XYZ company] followed by the subject.'},
{prompt:'Which subject follows the internal email format?',options:['[Supplier Only]','[Ergo Internal] Project delivery review','Urgent!!!','No subject'],answer:1,explanation:'Email slide 3 uses [Ergo Internal] followed by the subject.'},
{prompt:'Which sequence matches the five email steps in the deck?',options:['Close, purpose, greeting','Attachment, signature, no message','Greeting, thanks, purpose, closing remarks, closing','Greeting and nothing else'],answer:2,explanation:'Email slide 4 lists these five steps.'},
{prompt:'What should you check before sending?',options:['Only the colour of the signature','Only the time','Nothing if sent from a phone','Recipient, subject, attached files or shared links'],answer:3,explanation:'Email slide 11 asks for a double check of files, recipient and subject. Slide 15 covers shared links.'},
{prompt:'Which filename follows the source’s first-revision convention?',options:['Project proposal - R01','Project proposal final final','Untitled','Project proposal old'],answer:0,explanation:'Email slide 15 specifies original filename - R0X, beginning with R01.'}
);
function operationVisual(){return `<section class="op-intro"><span class="pill">A QUICK WORKFLOW GUIDE</span><h2>One client journey. A coordinated team.</h2><p>Follow the sales stages. Coordinate supply and site work throughout.</p></section><div class="op-flow">${operationStages.map((s,i)=>`<a href="#op-stage-${i}"><b>0${i+1}</b>${s.title}</a>`).join('')}</div><div class="op-stages">${operationStages.map((s,i)=>`<article id="op-stage-${i}" class="card"><span class="pill">${esc(s.owner)}</span><h2>${i+1}. ${s.title}</h2><p>${esc(s.action)}</p><p class="op-check"><b>Check before moving on</b><br>${esc(s.check)}</p><small class="muted">Process source: ${s.source}</small></article>`).join('')}</div><h2>The support lanes</h2><p class="muted">These run alongside sales, rather than waiting until the contract is signed.</p><div class="op-lanes"><article class="card"><span class="pill">SALES ADMIN</span><h3>Supplier</h3><p>Price, discount and ex-works date.</p><p>HS code and origin documents to confirm duty with the forwarder.</p></article><article class="card"><span class="pill">SALES ADMIN + PM INPUT</span><h3>Forwarder</h3><p>Compare more than one for price and service.</p><p>Check vessel, clearance, trucking, loading and unloading.</p></article><article class="card"><span class="pill">PM</span><h3>Site</h3><p>Support the technical proposal and coordinate safe, timely delivery.</p><p>Train the Site Manager and workers to handle products carefully.</p></article></div><h2>Communication and evidence</h2><div class="card"><p><b>A useful subject makes a decision easy to find.</b></p><div class="op-email">[Ergo-ABC] Delivery date confirmation<br>[Ergo Internal] Costing approval request</div><details><summary>The five-step email</summary><ol><li>Begin with a greeting.</li><li>Thank the recipient.</li><li>State your purpose.</li><li>Add closing remarks.</li><li>End with a closing.</li></ol><p>Stay specific and concise. The source recommends a maximum of three paragraphs and useful bullet points.</p></details><details><summary>Reply, CC and BCC</summary><p>Reply all for an update relevant to the chain. Reply for a private discussion. CC informs visible recipients. BCC keeps recipient addresses hidden from other recipients. Verify the intended audience before sending.</p></details><details><summary>Files and revisions</summary><p>The source asks for company-server links rather than repeated attachments. Confirm access for the intended recipients.</p><p><b>Project proposal - R01</b><br>Next revision: Project proposal - R02.</p></details><details><summary>Before you send</summary><p>Check the recipient, subject, file or link, and message. Include contact information in a mobile signature.</p></details></div><h2>A decision to practise</h2><div class="card"><p>The client wants to sign today. Costing is not approved and the supplier date is unconfirmed.</p><details><summary>What should the team do?</summary><p>Resolve costing approval and confirm delivery commitments with Sales Admin and PM before signing. Coordinate the contract terms and paperwork, then follow the contractual payment steps.</p></details></div><details class="card"><summary>Working practices and source notes</summary><p>Clarify scope, discuss politely, learn and share, and support colleagues.</p><p>The process source suggests 9 AM–6 PM, office dress Monday–Thursday and a more individual Friday style. Confirm later HR policy.</p><p>Team involvement: Sales process 50/30/20; Supply Chain 30/50/20; PM process 20/30/50, in Sales / Sales Admin / PM order.</p><p>Source hit ratios: approach 20%, meeting 30%, quotation 50%, contract 90%, full payment 100%. These are source stage markers, not forecasts or academy scores.</p><p>Sources: Ergovn Sales Process- Phuc Ngo.docx; Ergovn training - Write email Rev02.pptx. The Email cover says Rev01-2018. “Sandwiches method” is named but not defined in the Email deck.</p></details><p class="muted">30 random questions · Pass with 21 correct · Six-month retest at 70%</p>`}
