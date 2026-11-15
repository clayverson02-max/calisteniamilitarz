import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/pixel';
import '../eletro-sales.css';

// Oferta principal na Cakto (produto 4q8hAqE, checkout 1327167).
const CHECKOUT_URL: string = 'https://pay.cakto.com.br/mx6odts_1327167';
const PRICE_BRL: number | null = 19.99;
// Guia de Câmeras, oferecido como order bump dentro do checkout acima.
const BUMP_BRL = 15.99;
const samples = [
  { id: 'lavadora', label: 'Lavadoras', title: 'Não centrifuga. Por onde começar?', detail: 'Programa, carga, tampa e saída de água: organize as observações antes de suspeitar de uma peça.', category: 'Lavanderia' },
  { id: 'geladeira', label: 'Geladeiras', title: 'Não está gelando como deveria?', detail: 'Ajuste, circulação de ar e vedação aparecem lado a lado para facilitar a consulta.', category: 'Refrigeração' },
  { id: 'forno', label: 'Fornos elétricos', title: 'Liga, mas não aquece?', detail: 'Entenda o que observar nos controles e na câmara antes de uma avaliação interna.', category: 'Cozinha' },
  { id: 'microondas', label: 'Micro-ondas', title: 'O painel acende. E agora?', detail: 'Confira comandos e sinais externos, com limites claros para não se expor à alta tensão.', category: 'Cozinha' },
  { id: 'liquidificador', label: 'Liquidificadores', title: 'De onde vem esse vazamento?', detail: 'Copo, tampa, vedação e base: uma sequência visual para localizar e registrar o sintoma.', category: 'Pequenos aparelhos' },
  { id: 'multimetro', label: 'Multímetro', title: 'Entenda antes de medir.', detail: 'Visor, função e entradas das pontas em um exemplo didático de baixa tensão.', category: 'Fundamentos' },
];
const faq = [
  ['O que é o Guia Visual de Reparação?', 'É um manual digital ilustrado para estudar componentes, reconhecer sintomas e organizar o diagnóstico inicial de eletrodomésticos. As páginas desta tela são do próprio material: o que você vê aqui é o formato que recebe.'],
  ['Vou receber um livro físico?', 'Não. O formato da entrega é um arquivo digital em PDF, para consultar no celular, tablet ou computador. Não há envio de material físico.'],
  ['É indicado para quem está começando?', 'A linguagem é voltada a estudantes e iniciantes. O guia diferencia observação externa, cuidados de uso e intervenções técnicas. Ele não substitui formação, manual do fabricante ou supervisão profissional.'],
  ['Serve para qualquer marca e modelo?', 'Os diagramas são conceituais. Componentes, códigos, valores de teste e procedimentos variam por modelo. Sempre consulte a documentação específica do fabricante antes de uma intervenção.'],
  ['O guia ensina a abrir micro-ondas?', 'Não. Em micro-ondas, a orientação ao iniciante se limita a comandos e verificações externas. O equipamento pode manter alta tensão mesmo desligado da tomada; reparos internos são destinados à assistência qualificada.'],
  ['O guia de câmeras está incluído?', 'Não. O Guia Visual de Instalação de Câmeras de Segurança é um produto separado e opcional. Ele aparece dentro do checkout por R$ 15,99, em vez dos R$ 19,90 que custa sozinho, e você decide na hora de pagar.'],
  ['Como recebo depois de pagar?', 'O acesso ao PDF é liberado assim que o pagamento é confirmado. No Pix a confirmação costuma ser em minutos; no cartão, depois da aprovação da operadora.'],
  ['E se eu não gostar?', 'A Cakto garante o reembolso em até 7 dias da compra, por lei. Você pede pela própria plataforma e o valor volta integral.'],
];
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Guia Visual de Reparação de Eletrodomésticos | Manual ilustrado' },
    { name: 'description', content: 'Entenda os componentes, reconheça sintomas e organize o diagnóstico. Conheça as páginas ilustradas do guia de eletrodomésticos em português.' },
    { property: 'og:title', content: 'O aparelho parou. Saiba por onde começar.' },
    { property: 'og:description', content: 'Um guia visual de eletrodomésticos: componentes, sintomas e diagnóstico organizado. Conheça o material por dentro.' },
    { property: 'og:image', content: 'https://calisteniamilitarz.lovable.app/guia/capa-checkout.webp' },
  ] }), component: EletroSales,
});
export function EletroSales() {
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState('Todos');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { track('ViewContent', { content_name: 'Guia Visual de Reparação de Eletrodomésticos', content_category: 'Manual digital', currency: 'BRL' }); }, []);

  // Entrada dos blocos conforme a pessoa rola. As classes entram por JS: se o
  // script falhar, a página fica visível do mesmo jeito.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const alvos = Array.from(
      document.querySelectorAll<HTMLElement>('.ev-hero > *, .ev-section > .ev-wrap > *'),
    );
    if (!alvos.length || !('IntersectionObserver' in window)) return;
    alvos.forEach((el, i) => {
      el.classList.add('ev-reveal');
      // colunas de seção dividida entram pelos lados, o resto sobe
      if (el.parentElement?.classList.contains('ev-split')
        || el.parentElement?.classList.contains('ev-offer')
        || el.parentElement?.classList.contains('ev-bump')) {
        el.classList.add(i % 2 ? 'ev-reveal-r' : 'ev-reveal-l');
      }
    });
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).classList.add('ev-in');
        obs.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    alvos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  function openSample(index: number) { setActive(index); dialog.current?.showModal(); }
  const categories = ['Todos', ...new Set(samples.map(s => s.category))];
  const buy = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!CHECKOUT_URL) return;
    const url = new URL(CHECKOUT_URL);
    const query = new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck','fbclid'].forEach(key => { const value = query.get(key); if(value) url.searchParams.set(key, value); });
    event.currentTarget.href = url.toString();
    track('InitiateCheckout', { content_name: 'Guia Visual de Reparação de Eletrodomésticos', currency: 'BRL', ...(PRICE_BRL !== null ? { value: PRICE_BRL } : {}) });
  };
  return <main className="ev-page">
    <div className="ev-top">EDIÇÃO EM PORTUGUÊS <span>•</span> GUIA DIGITAL ILUSTRADO</div>
    <header className="ev-wrap ev-nav"><a className="ev-brand" href="#inicio"><span className="ev-brand-symbol" aria-hidden="true">＋</span>GUIA VISUAL<span className="ev-brand-sub">ELETRODOMÉSTICOS</span></a><a href="#por-dentro">Veja por dentro <span aria-hidden="true">↓</span></a></header>
    <section id="inicio" className="ev-hero ev-wrap">
      <p className="ev-kicker">GUIA VISUAL • EDIÇÃO EM PORTUGUÊS</p>
      <h1>A máquina parou.<br/><em>E ninguém te explica por quê.</em></h1>
      <p className="ev-lead">O técnico cobra a visita só para olhar. Aí diz que <strong>não compensa consertar</strong>. E você troca o aparelho inteiro por causa de uma peça. Este guia mostra, em desenho, o que olhar antes de gastar.</p>
      <div className="ev-hero-books" aria-label="Capa, páginas do guia e a leitura no celular">
        <img className="ev-sheet ev-sheet-far-left" src="/guia/lavadora.svg" alt="Página do guia: lavadora que não centrifuga" width="900" height="1200" loading="eager"/>
        <img className="ev-sheet ev-sheet-left" src="/guia/microondas.svg" alt="Página do guia: micro-ondas" width="900" height="1200" loading="eager"/>
        <img className="ev-sheet ev-sheet-right" src="/guia/forno.svg" alt="Página do guia: forno elétrico" width="900" height="1200" loading="eager"/>
        <img className="ev-sheet ev-sheet-far-right" src="/guia/geladeira.svg" alt="Página do guia: geladeira que não gela" width="900" height="1200" loading="eager"/>
        <img className="ev-main-cover" src="/guia/capa-checkout.webp" alt="Capa: Guia Visual de Reparação de Eletrodomésticos" width="1000" height="1000" fetchPriority="high"/>
        <div className="ev-hero-phone" aria-hidden="true"><span className="ev-hero-phone-notch"/><img src="/guia/multimetro.svg" alt="" width="900" height="1200" loading="eager"/></div>
      </div>
      <p className="ev-caption">Diagramas próprios • Consulta por aparelho e por sintoma • PDF em português</p>
    </section>
    <div className="ev-strip"><span>COMPONENTES IDENTIFICADOS</span><span>SEQUÊNCIA DE OBSERVAÇÃO</span><span>LIMITES DE SEGURANÇA</span></div>
    <section className="ev-section ev-white"><div className="ev-wrap ev-split"><div><p className="ev-kicker">ANTES DE TROCAR UMA PEÇA</p><h2>Trocar peça por palpite<br/><em>sai caro duas vezes.</em></h2></div><div className="ev-copy"><p>A lavadora não centrifuga. A geladeira não gela. O forno liga e não esquenta.</p><p>Você assiste a um vídeo, compra a peça que ele mandou comprar, e o problema continua. Perdeu o dinheiro da peça e ainda não sabe o que era.</p><p className="ev-highlight">O mesmo sintoma tem causas diferentes. O guia organiza o começo: o que olhar, em que ordem, e onde parar.</p></div></div></section>
    <section id="por-dentro" className="ev-section ev-pale"><div className="ev-wrap"><div className="ev-section-head"><p className="ev-kicker">VEJA O FORMATO DO MATERIAL</p><h2>Abra uma página.<br/>Veja a diferença de aprender visualmente.</h2><p>Toque nas prévias para ampliar. São páginas demonstrativas criadas para esta edição, com desenhos, orientação de leitura e cuidados específicos.</p></div><div className="ev-filters" aria-label="Filtrar prévias">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="ev-samples">{samples.map((s,i)=>(category==='Todos'||s.category===category)&&<article className="ev-sample" key={s.id}><button className="ev-preview-button" onClick={()=>openSample(i)} aria-label={`Ampliar página: ${s.label}`}><img src={`/guia/${s.id}.svg`} alt={`Prévia de ${s.label}: ${s.title}`} width="900" height="1200" loading="lazy"/><span>AMPLIAR PÁGINA <b aria-hidden="true">＋</b></span></button><div className="ev-sample-copy"><p className="ev-kicker">{s.label}</p><h3>{s.title}</h3><p>{s.detail}</p></div></article>)}</div></div></section>
    <section className="ev-section ev-navy"><div className="ev-wrap ev-split"><div className="ev-page-detail"><img src="/guia/lavadora.svg" alt="Diagrama com componentes da lavadora identificados por números" width="900" height="1200" loading="lazy"/></div><div><p className="ev-kicker">UMA ESTRUTURA FÁCIL DE CONSULTAR</p><h2>Você vê.<br/>Você entende.<br/><em>Você para de chutar.</em></h2><ol className="ev-numbered"><li><span>01</span><div><h3>Ache a peça no desenho</h3><p>Cada componente aparece numerado, no lugar onde ele está de verdade dentro do aparelho.</p></div></li><li><span>02</span><div><h3>Siga a ordem certa</h3><p>Do mais simples ao mais caro. A maioria das falhas morre nos três primeiros passos.</p></div></li><li><span>03</span><div><h3>Saiba onde parar</h3><p>O guia diz quando o caso é de técnico. Micro-ondas, gás e sistema de refrigeração têm limite claro.</p></div></li></ol><a className="ev-cta" href="#oferta">QUERO O GUIA COMPLETO <span aria-hidden="true">↓</span></a></div></div></section>
    <section id="conteudo" className="ev-section ev-white"><div className="ev-wrap"><div className="ev-section-head"><p className="ev-kicker">UM ÍNDICE QUE PARTE DO APARELHO</p><h2>Da lavanderia à cozinha.<br/>Encontre o assunto que precisa estudar.</h2></div><div className="ev-modules">
      <article><span>01 / LAVANDERIA</span><h3>Lavadoras</h3><p>Funcionamento inicial, enchimento, drenagem, centrifugação, vazamentos e ruídos.</p><img src="/guia/lavadora.svg" alt="Página ilustrada de lavadoras" width="900" height="1200" loading="lazy"/></article>
      <article><span>02 / REFRIGERAÇÃO</span><h3>Geladeiras</h3><p>Falta de resfriamento, gelo em excesso, umidade, vedação e sinais de funcionamento.</p><img src="/guia/geladeira.svg" alt="Página ilustrada de geladeiras" width="900" height="1200" loading="lazy"/></article>
      <article><span>03 / COZINHA</span><h3>Fornos e micro-ondas</h3><p>Componentes, controles, observações externas e situações que exigem assistência.</p><img src="/guia/forno.svg" alt="Página ilustrada de forno elétrico" width="900" height="1200" loading="lazy"/></article>
      <article><span>04 / FUNDAMENTOS</span><h3>Base do diagnóstico</h3><p>Segurança, introdução ao multímetro, identificação do modelo, peças e registro da avaliação.</p><img src="/guia/multimetro.svg" alt="Página ilustrada sobre o multímetro" width="900" height="1200" loading="lazy"/></article>
    </div><div className="ev-small-appliances"><h3>E os aparelhos menores do dia a dia?</h3><p>O escopo do manual também contempla:</p><div>{['Liquidificadores','Batedeiras','Ferros de passar','Chaleiras elétricas','Ventiladores','Aspiradores','Air fryers','Cafeteiras','Secadores de cabelo'].map(a=><span key={a}>{a}</span>)}</div></div></div></section>
    <section className="ev-section ev-pale"><div className="ev-wrap ev-split"><div><p className="ev-kicker">PARA ESTUDAR E VOLTAR A CONSULTAR</p><h2>O conhecimento fica<br/><em>ao alcance da sua mão.</em></h2><p>Um material digital para acompanhar seus estudos, organizar dúvidas e revisar a lógica da observação sem depender de lembrar de tudo.</p><ul className="ev-checks"><li>Estudantes que querem visualizar os componentes.</li><li>Técnicos iniciantes que buscam organizar o raciocínio.</li><li>Pessoas interessadas em conhecer melhor seus aparelhos.</li></ul><p className="ev-note">Material educativo. Não substitui treinamento técnico, documentação do modelo nem habilitação profissional.</p></div><div className="ev-device"><div className="ev-device-top">GUIA VISUAL <span>CONSULTA DIGITAL</span></div><img src="/guia/liquidificador.svg" alt="Exemplo de leitura da página sobre liquidificador em um dispositivo" width="900" height="1200" loading="lazy"/></div></div></section>
    <section id="oferta" className="ev-section ev-navy"><div className="ev-wrap ev-offer"><img src="/guia/capa-checkout.webp" alt="Capa do manual de eletrodomésticos" width="1000" height="1000" loading="lazy"/><div><p className="ev-kicker">GUIA VISUAL DE REPARAÇÃO</p><h2>Pare de trocar peça<br/><em>no escuro.</em></h2><ul className="ev-checks"><li>Lavadora, geladeira, fogão, forno e micro-ondas.</li><li>Nove aparelhos pequenos, do liquidificador ao secador.</li><li>Componentes numerados no desenho, não só descritos.</li><li>Sequência de verificação, do mais simples ao mais caro.</li><li>Base do multímetro e os limites de segurança de cada aparelho.</li></ul>{PRICE_BRL!==null&&<p className="ev-price">{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(PRICE_BRL)}</p>}{CHECKOUT_URL?<a className="ev-cta" href={CHECKOUT_URL} onClick={buy}>QUERO O GUIA AGORA <span aria-hidden="true">→</span></a>:<div className="ev-pending"><strong>Em preparação para lançamento</strong><p>O material completo e o checkout estão sendo finalizados. Enquanto isso, conheça as prévias acima.</p><a href="#por-dentro">EXPLORAR AS PÁGINAS DEMONSTRATIVAS ↑</a></div>}<p className="ev-caption">Entrega prevista em PDF • Sem envio físico</p></div></div></section>
    <section className="ev-section ev-white"><div className="ev-wrap ev-bump"><img src="/guia/cameras-checkout.webp" alt="Capa do produto adicional: Guia Visual de Instalação de Câmeras de Segurança" width="1000" height="1000" loading="lazy"/><div><p className="ev-kicker">CONTEÚDO ADICIONAL • OPCIONAL</p><h2>Quem conserta em casa<br/><em>é quem instala a câmera.</em></h2><p>É o mesmo cliente, na mesma visita. Instalação de câmera paga melhor e não depende de peça de reposição. O guia cobre escolha de equipamento, posicionamento, cabeamento, DVR e NVR, acesso remoto, gravações e manutenção.</p><p className="ev-note"><strong>Produto separado, opcional.</strong> Aparece dentro do checkout por {new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(BUMP_BRL)}, em vez dos R$ 19,90 que custa sozinho. Você escolhe na hora de pagar.</p></div></div></section>
    <section className="ev-section ev-pale"><div className="ev-wrap ev-faq"><p className="ev-kicker">ANTES DE DECIDIR</p><h2>Sem dúvidas sobre a entrega.</h2>{faq.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">＋</span></summary><p>{a}</p></details>)}</div></section>
    <footer className="ev-wrap ev-footer"><strong>GUIA VISUAL • ELETRODOMÉSTICOS</strong><p>Diagramas conceituais e conteúdo educativo. Procedimentos variam conforme fabricante e modelo. Não execute intervenções em circuitos energizados, sistemas de gás ou refrigeração sem capacitação adequada.</p></footer>
    <dialog ref={dialog} className="ev-dialog" aria-label={`Página demonstrativa: ${samples[active]!.label}`} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><div className="ev-dialog-toolbar"><strong>{samples[active]!.label}</strong><button onClick={()=>dialog.current?.close()} aria-label="Fechar prévia">Fechar ×</button></div><img src={`/guia/${samples[active]!.id}.svg`} alt={`Página ampliada: ${samples[active]!.title}`} width="900" height="1200"/><div className="ev-dialog-nav"><button onClick={()=>setActive((active+samples.length-1)%samples.length)}>← Anterior</button><span>{active+1} / {samples.length}</span><button onClick={()=>setActive((active+1)%samples.length)}>Próxima →</button></div></dialog>
  </main>;
}
