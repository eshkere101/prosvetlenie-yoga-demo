const practices = [
  {id:'hatha',title:'Хатха-йога',tag:'ДВИЖЕНИЕ И БАЛАНС',image:'assets/yoga-hero.jpg',categories:['start','move'],short:'Дыхание глубже. Движения осознаннее. Ты — ближе к себе.',description:'Классическая практика, в которой сочетаются асаны, дыхание и внимание к телу. Постепенно знакомься с позами, исследуй движение и находи собственный темп. Подходящий уровень группы поможет выбрать администратор.'},
  {id:'beginner',title:'Йога с нуля',tag:'ТВОЙ ПЕРВЫЙ ШАГ',image:'assets/yoga-move.jpg',categories:['start','move'],short:'Без опыта и ожиданий. Просто начни — мы будем рядом.',description:'Занятия для тех, кто ещё не практиковал йогу. Знакомство с основами, постепенное освоение асан и внимание к дыханию. Никакой специальной подготовки: расскажи преподавателю о своём опыте и пожеланиях.'},
  {id:'qigong',title:'Цигун',tag:'ВЫДОХНИ И ПОЧУВСТВУЙ',image:'assets/yoga-calm.jpg',categories:['start','calm'],short:'Мягкое движение. Спокойное дыхание. Внимание внутрь.',description:'Практика, объединяющая движение, дыхание и концентрацию внимания. В центре есть группы цигун. Узнать подробнее о школе, преподавателе и подходящем занятии можно у администратора.'},
  {id:'kundalini',title:'Кундалини-йога',tag:'ВНИМАНИЕ И ЭНЕРГИЯ',image:'assets/yoga-calm.jpg',categories:['calm'],short:'Соедини движение, дыхание и медитативную практику.',description:'Направление, в котором используются упражнения, дыхательные техники и медитация. Знакомство с практикой и выбор группы лучше обсудить с преподавателем. Расписание и доступные занятия уточни в центре.'},
  {id:'pilates',title:'Пилатес',tag:'ОСОЗНАННОЕ ДВИЖЕНИЕ',image:'assets/yoga-move.jpg',categories:['move'],short:'Точность, контроль и движение с вниманием к телу.',description:'Мягкая работа над мышцами с концентрацией на движении и дыхании. Подходит, если хочется двигаться внимательно и последовательно. Доступность групп и уровень занятий уточни у администратора.'}
];
const centers = {
  novoslobodskaya:{name:'Новослободская',address:'ул. Долгоруковская, 29',phone:'+7 (499) 251-21-08',tel:'+74992512108',map:'https://yandex.ru/maps/-/CBRwVFtOxD',street:'Долгоруковская улица'},
  airport:{name:'Аэропорт',address:'ул. Черняховского, 5, корп. 1',phone:'+7 (499) 151-60-23',tel:'+74991516023',map:'https://yandex.ru/maps/-/CBRwVJtAHC',street:'улица Черняховского'}
};
const bookingDialog=document.querySelector('#booking-dialog');
const practiceDialog=document.querySelector('#practice-dialog');
let selectedPractice='';
function syncModalState(){document.body.classList.toggle('modal-open',!!document.querySelector('dialog[open]'));}
function openBooking(intent=''){
  selectedPractice=intent;
  if(practiceDialog.open)practiceDialog.close();
  document.querySelector('#booking-practice').textContent=intent?'Твой выбор: '+intent:'';
  updateBookingContact();
  if(!bookingDialog.open)bookingDialog.showModal();
  syncModalState();
}
function updateBookingContact(){
  const c=centers[document.querySelector('#booking-center').value];
  document.querySelector('.booking-call').href='tel:'+c.tel;
  const body=`Здравствуйте! Хочу записаться в центр на ${c.name}.\n${selectedPractice?'Интересует: '+selectedPractice+'.\n':''}Подскажите, пожалуйста, ближайшие занятия, наличие мест и стоимость.`;
  document.querySelector('.booking-email').href='mailto:yogacenter@mail.ru?subject='+encodeURIComponent('Запись на занятие · '+c.name)+'&body='+encodeURIComponent(body);
}
document.querySelector('#booking-center').addEventListener('change',updateBookingContact);
document.querySelectorAll('[data-book]').forEach(el=>el.addEventListener('click',()=>{openBooking(el.dataset.intent||'');closeMenu();}));
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',syncModalState);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
});
function renderPractices(filter='all'){
  const list=filter==='all'?practices:practices.filter(p=>p.categories.includes(filter));
  const grid=document.querySelector('#practice-grid');
  grid.replaceChildren();
  list.forEach((p,i)=>{
    const card=document.createElement('button');card.className='practice-card';card.type='button';card.setAttribute('aria-label','Подробнее: '+p.title);
    card.innerHTML=`<img src="${p.image}" alt="" loading="lazy"><span class="card-tag">${p.tag}</span><span class="card-num">0${i+1}</span><h3>${p.title}</h3><p>${p.short}</p><span class="card-arrow" aria-hidden="true">↗</span>`;
    card.addEventListener('click',()=>openPractice(p));grid.append(card);
  });
}
function openPractice(p){
  document.querySelector('#practice-title').textContent=p.title;
  document.querySelector('#practice-kicker').textContent=p.tag;
  document.querySelector('#practice-description').textContent=p.description;
  document.querySelector('#practice-modal-photo').src=p.image;
  document.querySelector('#practice-book').onclick=()=>openBooking(p.title);
  practiceDialog.showModal();syncModalState();
}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});renderPractices(btn.dataset.filter);
}));
document.querySelectorAll('[data-location]').forEach(btn=>btn.addEventListener('click',()=>{
  const key=btn.dataset.location,c=centers[key];
  document.querySelectorAll('[data-location]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
  const phone=document.querySelector('#location-phone');phone.href='tel:'+c.tel;phone.innerHTML=c.phone+' <span>↗</span>';
  document.querySelector('#map-link').href=c.map;
  document.querySelector('#original-map-photo').src='assets/original/map-'+key+'.jpg';
  document.querySelector('#original-map-photo').alt='Схема проезда: '+c.name;
  document.querySelector('#booking-center').value=key;
  document.querySelector('.map-art').style.backgroundColor=key==='airport'?'#e4e8dc':'';
}));
const menuButton=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');}
menuButton.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==item)other.open=false;});}));
renderPractices();

const galleryDialog=document.querySelector('#gallery-dialog');
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
  const number=button.dataset.gallery;
  document.querySelector('#gallery-large').src='assets/original/gallery-'+number+'.jpg';
  document.querySelector('#gallery-large').alt='Фотография '+number+' из фотогалереи центра «Просветление»';
  document.querySelector('#gallery-counter').textContent=number+' / 5 · ФОТОГАЛЕРЕЯ ЦЕНТРА';
  galleryDialog.showModal();syncModalState();
}));
