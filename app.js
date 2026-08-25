const panels=[...document.querySelectorAll('.panel')];
function showPanel(id){panels.forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.panel===id));}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showPanel(b.dataset.go));

document.getElementById('calcBtn').onclick=()=>{
 const a=Number(siteArea.value)||0,b=Number(bcr.value)||0,f=Number(far.value)||0;
 const maxBuild=a*b/100,maxFloor=a*f/100;
 calcResult.innerHTML=`<div>最大建築面積</div><strong>${maxBuild.toFixed(1)}㎡</strong><br><div>指定容積率から見た最大延床面積</div><strong>${maxFloor.toFixed(1)}㎡</strong>`;
};

let rooms=[];
function renderRooms(){
 roomTable.innerHTML=rooms.map((r,i)=>`<tr><td>${r.name}</td><td>${r.area.toFixed(1)}㎡</td><td><button class="delete" onclick="removeRoom(${i})">削除</button></td></tr>`).join('');
 roomTotal.textContent=rooms.reduce((s,r)=>s+r.area,0).toFixed(1)+'㎡';
}
window.removeRoom=i=>{rooms.splice(i,1);renderRooms()};
addRoom.onclick=()=>{
 const name=roomName.value.trim(),area=Number(roomArea.value);
 if(!name||!area)return;
 rooms.push({name,area});roomName.value='';roomArea.value='';renderRooms();
};

conceptBtn.onclick=()=>{
 const u=use.value,us=users.value,p=priority.value,m=mood.value;
 conceptResult.innerHTML=`<strong>「${p}」を軸にした${u}</strong><p>${us}が安心して過ごせるよう、${m}な空間構成を基本とする。${p}を建築の中心的なテーマとして、共用空間と個人空間の距離を調整しながら、日常的な交流と一人で過ごす時間の両方をつくる。</p>`;
};

reviewBtn.onclick=()=>{
 const checked=[...document.querySelectorAll('.checks input:checked')].map(x=>x.parentElement.textContent.trim());
 reviewResult.innerHTML=`<strong>設計チェック項目：${checked.length}件</strong><ul>${checked.map(x=>`<li>${x}：平面図・断面図・動線図で確認</li>`).join('')}</ul><p>※これは設計初期のセルフチェック用です。法令適合を保証するものではありません。</p>`;
};

document.getElementById('calcBtn').click();

const chatMessages=document.getElementById('chatMessages');
const chatInput=document.getElementById('chatInput');

function addMessage(type,text){
  const div=document.createElement('div');
  div.className=`message ${type}`;
  div.innerHTML=`<b>${type==='ai'?'ARCHI AI':'あなた'}</b><p></p>`;
  div.querySelector('p').textContent=text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}

function makeConsultationReply(text){
  const lower=text.toLowerCase();
  let reply="いい計画ですね。まず、条件を「敷地・人・動線・空間体験」の4つに分けて考えると整理しやすいです。\n\n";
  if(lower.includes('グループホーム')||lower.includes('5〜9')||lower.includes('5-9')){
    reply+="【グループホームとしての方向性】\n・共用LDKを生活の中心にする\n・個室は共用空間から少し離して落ち着きを確保\n・スタッフ動線と入居者動線が必要以上に交差しないよう整理\n・中庭を介してLDKと個室に自然光や視線のつながりをつくる\n\n";
  }
  if(lower.includes('中庭')||lower.includes('緑')){
    reply+="【中庭の使い方】\n中庭を単なる採光スペースではなく「暮らしの中間領域」にするとコンセプトが強くなります。LDK→縁側的な場所→中庭という段階をつくると、内外のつながりを表現できます。\n\n";
  }
  if(lower.includes('ゾーニング')||lower.includes('動線')){
    reply+="【ゾーニング案】\n①道路側：アプローチ・玄関\n②中央：LDK＋中庭\n③静かな側：個室\n④サービス側：浴室・洗濯・収納・スタッフ室\n「人が集まる場所」を中心に置き、静かな場所を外周に逃がす構成が考えられます。\n\n";
  }
  if(lower.includes('問題')||lower.includes('チェック')){
    reply+="【見落としやすいポイント】\n・家具を置いた状態で動線幅が確保できるか\n・共用空間の音が個室に伝わりすぎないか\n・収納やゴミ置場などの裏方スペースが不足していないか\n・玄関から個室までのプライバシーが守られているか\n・採光だけでなく通風も成立しているか\n\n";
  }
  reply+="次は「平面構成」「面積配分」「動線」「コンセプト」のどれか1つに絞ると、もっと具体的な案まで掘れます。";
  return reply;
}

function sendChat(){
  const text=chatInput.value.trim();
  if(!text)return;
  addMessage('user',text);
  chatInput.value='';
  const typing=document.createElement('div');
  typing.className='message ai typing';
  typing.innerHTML='<b>ARCHI AI</b><p>設計条件を整理中…</p>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop=chatMessages.scrollHeight;
  setTimeout(()=>{typing.remove();addMessage('ai',makeConsultationReply(text));},500);
}
document.getElementById('sendChat').onclick=sendChat;
chatInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
document.querySelectorAll('.quick-prompts button').forEach(b=>b.onclick=()=>{chatInput.value=b.dataset.prompt;sendChat();});
document.getElementById('clearChat').onclick=()=>{chatMessages.innerHTML='<div class="message ai"><b>ARCHI AI</b><p>こんにちは！新しい設計相談を始めましょう。</p></div>';};
