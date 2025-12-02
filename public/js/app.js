window.onload = () => {
    fetch("../components/header.html")
        .then(res => res.text())
        .then(data => document.getElementById("header").innerHTML = data)
        .then(()=> initHeaderToggle());

    fetch("../components/footer.html")
        .then(res => res.text())
        .then(data => document.getElementById("footer").innerHTML = data);
};
// PRODUCT CATALOG (simulated)
const productCatalog = [
    { id: 'noise-x', title: 'Fone Bluetooth Noise-X', desc: 'Som nítido e cancelamento básico — ótimo para quem curte tecnologia.', tags: ['tech'], ages: ['18-25','26-35','36-50'], budgets: ['75-200','200plus'], occasions:['birthday','holiday','just-because'], link: 'https://store.example.com/product/noise-x' },
    { id: 'homegrow', title: 'Kit de Jardinagem HomeGrow', desc: 'Perfeito para amantes de plantas e decoração de casa.', tags:['home'], ages:['26-35','36-50','50+'], budgets:['25-75','75-200'], occasions:['birthday','holiday','just-because'], link: 'https://store.example.com/product/homegrow' },
    { id: 'book-club', title: 'Assinatura Clube do Livro (3 meses)', desc: 'Livros selecionados todo mês — para quem ama ler.', tags:['books'], ages:['18-25','26-35','36-50','50+'], budgets:['25-75','75-200'], occasions:['birthday','holiday','just-because'], link: 'https://store.example.com/product/book-club' },
    { id: 'spa-kit', title: 'Voucher Spa em Casa', desc: 'Um kit relax para quem merece um mimo.', tags:['home','fashion'], ages:['26-35','36-50','50+'], budgets:['75-200','200plus'], occasions:['birthday','valentine','holiday'], link: 'https://store.example.com/product/spa-kit' },
    { id: 'smartwatch-mini', title: 'Relógio Smart Mini', desc: 'Relógio simples com funções de saúde — ótimo presente tecnológico.', tags:['tech','sport'], ages:['18-25','26-35','36-50'], budgets:['75-200','200plus'], occasions:['birthday','holiday','just-because'], link: 'https://store.example.com/product/smartwatch-mini' }
];

// Small helper: score candidates
function scoreProduct(prod, criteria){
    let score = 0;
    // budget match (higher priority)
    if(prod.budgets.includes(criteria.budget)) score += 3;
    // tag overlap
    for(const t of criteria.interests){ if(prod.tags.includes(t)) score += 2; }
    // occasion
    if(prod.occasions.includes(criteria.occasion)) score += 1;
    // age support
    if(prod.ages.includes(criteria.age)) score += 1;
    return score;
}

function findRecommendations(criteria, topN=3){
    const candidates = productCatalog.map(p=>({p,score:scoreProduct(p,criteria)}))
        .filter(x=>x.score>0)
        .sort((a,b)=>b.score-a.score);

    // if we found none, fallback to any affordable items by budget
    if(candidates.length===0){
        return productCatalog.filter(p=>p.budgets.includes(criteria.budget)).slice(0,topN);
    }

    return candidates.map(c=>c.p).slice(0,topN);
}

function renderProductCard(prod){
    return `
        <div class="result-card">
            <h3>${prod.title}</h3>
            <div class="result-meta">${prod.desc}</div>
            <div class="d-flex gap-2 align-items-center mt-2 result-cta">
                <a class="btn btn-primary" href="${prod.link}" target="_blank" rel="noopener">Comprar</a>
                <button class="btn btn-outline-secondary" onclick="copyToClipboard('${prod.link}')">Copiar link</button>
            </div>
        </div>
    `;
}

function copyToClipboard(text){
    if(navigator.clipboard){
        navigator.clipboard.writeText(text).then(()=> alert('Link copiado (simulado)!')).catch(()=> alert('Não foi possível copiar'));
        return;
    }

    // fallback for older browsers — temporary textarea
    const tmp = document.createElement('textarea');
    tmp.value = text;
    document.body.appendChild(tmp);
    tmp.select();
    try{ document.execCommand('copy'); alert('Link copiado (simulado)!'); } catch(e){ alert('Não foi possível copiar'); }
    tmp.remove();
}

// Form handling for the gift suggester
document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('sugForm');
    if(form){
        form.addEventListener('submit', e=>{
            e.preventDefault();
            const recipient = form.querySelector('#recipient').value;
            const age = form.querySelector('#age').value;
            const occasion = form.querySelector('#occasion').value;
            const budget = form.querySelector('#budget').value;
            const interests = Array.from(form.querySelectorAll('input[name="interest"]:checked')).map(i=>i.value);

            const criteria = {recipient, age, occasion, budget, interests};

            const results = findRecommendations(criteria,3);
            const container = document.getElementById('suggResult');
            if(!container) return;
            if(results.length===0){
                container.innerHTML = '<div class="result-card"><p>Nenhuma sugestão encontrada — tente alterar o orçamento ou interesses.</p></div>';
                return;
            }

            container.innerHTML = `<h3>Melhor sugestão</h3>` + renderProductCard(results[0]) + `<h4>Alternativas</h4>` + results.slice(1).map(renderProductCard).join('');
            window.scrollTo({top: container.offsetTop - 10, behavior: 'smooth'})
        });
    }

        // nothing else here — header toggle will be initialized after header loads
});

// Initialize the header toggle after the header component is injected
function initHeaderToggle(){
    const navToggle = document.querySelector('.nav-toggle');
    if(navToggle){
        navToggle.addEventListener('click', ()=>{
            const header = document.querySelector('.top-header');
            if(header) header.classList.toggle('open');
        });
    }
}
