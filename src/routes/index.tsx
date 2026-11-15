import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { track } from '@/lib/pixel';
import '../br-sales.css';

// Configurar com a URL real da oferta Cakto antes de publicar esta versão.
const CHECKOUTS: Record<'basic' | 'complete', string> = { basic: '', complete: '' };
const PRICE = 29.90;
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Calistenia Militar | 350 exercícios e sua rotina organizada' },
    { name: 'description', content: 'Pare de improvisar seu treino. 350 exercícios de calistenia organizados por dia e grupo muscular, no celular, computador ou tablet. R$ 29,90.' },
    { property: 'og:title', content: 'Calistenia Militar — seu próximo treino já tem direção' },
    { property: 'og:description', content: '350 exercícios. Rotina organizada. Treine em casa ou ao ar livre.' },
  ] }), component: BrasilSales,
});

function CheckoutButton({ label = 'QUERO O PLANO COMPLETO', plan = 'complete' }: { label?: string; plan?: 'basic' | 'complete' }) {
  const checkoutUrl = CHECKOUTS[plan];
  const price = plan === 'basic' ? 12.90 : 29.90;
  const go = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!checkoutUrl) return;
    try {
      const url = new URL(checkoutUrl);
      const params = new URLSearchParams(window.location.search);
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck','fbclid'].forEach(key => {
        const value = params.get(key); if (value) url.searchParams.set(key, value);
      });
      event.currentTarget.href = url.toString();
    } catch { /* O link original continua disponível. */ }
    track('InitiateCheckout', { content_name: `Calistenia Militar BR - ${plan}`, currency: 'BRL', value: price });
  };
  return <a className="br-cta" href={checkoutUrl || '#oferta'} onClick={go}>{label}<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>;
}

const benefits = [
  ['01', 'Abra o treino do dia', 'Uma rotina organizada para você parar de perder tempo decidindo por onde começar.'],
  ['02', 'Confira como fazer', 'Consulte os exercícios e as orientações de execução, quantidade, tempo e descanso.'],
  ['03', 'Coloque em prática', 'Treine em casa ou ao ar livre, respeitando seu nível e a estrutura necessária para cada movimento.'],
];
const areas = [ ['Peito', 'chest'], ['Braços', 'brazos'], ['Abdômen', 'abdomen'], ['Pernas', 'piernas'] ];
const faq = [
  ['Qual é a diferença entre os planos?', 'O Básico custa R$ 12,90 e inclui somente os exercícios. O Completo custa R$ 29,90 e libera todos os entregáveis do programa: exercícios, rotinas organizadas, orientações de execução, séries, tempo e descanso, conteúdo sobre alimentação e o bônus Cross Operacional.'],
  ['O que vem no bônus Cross Operacional?', 'Incluído exclusivamente no Plano Completo: uma tabela visual complementar, com quatro séries de intensidade, imagens dos movimentos e tempos ou repetições. É um documento de consulta e não uma avaliação física nem um plano individual.'],
  ['Preciso fazer um quiz para acessar?', 'Não. Você conhece o programa nesta página e vai direto para a compra.'],
  ['É um aplicativo para instalar?', 'O produto é uma plataforma digital acessível pelo celular, computador ou tablet. Você recebe as instruções de acesso após a confirmação do pagamento.'],
  ['São 350 treinos ou 350 exercícios?', 'São 350 exercícios de calistenia organizados na plataforma, com rotinas por dia e grupo muscular. Exercícios são os movimentos que compõem cada treino.'],
  ['Preciso de academia?', 'Há exercícios para casa e para espaços ao ar livre. Alguns movimentos podem exigir barra ou apoio adequado; confira as instruções e a estrutura necessária antes de começar.'],
  ['Vou receber um treino individual ou atendimento de um profissional?', 'A proposta apresentada aqui é acesso ao conteúdo e às rotinas organizadas da plataforma. Isso não substitui avaliação ou orientação individual de um profissional.'],
  ['Em quanto tempo vou ter resultados?', 'Não há prazo garantido. Os resultados variam conforme seu ponto de partida, regularidade, recuperação, alimentação e condições individuais.'],
  ['O programa é oficial das Forças Armadas?', 'Não é apresentado como produto oficial ou endossado por uma instituição militar. A identidade militar representa o foco em disciplina e constância.'],
];
export function BrasilSales() {
  useEffect(() => { track('ViewContent', {content_name: 'Calistenia Militar BR', currency:'BRL', value:PRICE}); }, []);
  return <main className="br-page">
    <div className="br-top">350 EXERCÍCIOS • PLATAFORMA EM PORTUGUÊS</div>
    <header className="br-nav br-wrap"><a href="#" className="br-brand"><span aria-hidden="true">≋</span> CALISTENIA<span>MILITAR</span></a><a href="#conteudo">Conheça o programa ↓</a></header>
    <section className="br-hero br-wrap">
      <div className="br-hero-copy"><p className="br-eyebrow">SUA ROTINA COMEÇA COM UMA DECISÃO</p>
      <h1>Pare de improvisar.<br/><em>Comece a treinar com direção.</em></h1>
      <p className="br-lead">350 exercícios de calistenia em uma plataforma organizada por dia e grupo muscular. Abra no celular, encontre seu treino e coloque sua rotina em movimento.</p>
      <div className="br-tags"><span>Em casa ou ao ar livre</span><span>Celular, tablet e computador</span></div>
      <a className="br-cta" href="#oferta">COMPARAR OS PLANOS →</a><p className="br-micro">Básico: R$ 12,90 · <strong>Completo + bônus: R$ 29,90</strong></p></div>
      <div className="br-hero-art"><span className="br-art-label">DISCIPLINA EM MOVIMENTO</span><img src="/assets/athletic.webp" alt="Ilustração de condicionamento físico, sem promessa de resultado" width="600" height="750" fetchPriority="high"/><div className="br-count"><strong>350</strong><span>exercícios.<br/>Uma rotina com direção.</span></div></div>
    </section>
    <div className="br-ribbon"><span>ESCOLHA O DIA</span><b>→</b><span>CONSULTE OS EXERCÍCIOS</span><b>→</b><span>COMECE O TREINO</span></div>
    <section className="br-section br-wrap br-split"><div><p className="br-eyebrow">CHEGA DE TREINAR NO IMPROVISO</p><h2>Salvar exercícios é fácil.<br/><em>Ter uma rotina muda o jogo.</em></h2></div><div><p>Um vídeo de flexão hoje. Um treino aleatório amanhã. E, quando chega a hora de treinar, você volta a procurar o que fazer.</p><p>A Calistenia Militar reúne os exercícios e a organização no mesmo lugar. Você dedica menos tempo à procura e mais atenção à execução e à constância.</p><p className="br-punch">Você não precisa de mais uma pasta de vídeos soltos. Precisa saber qual é o próximo passo.</p></div></section>
    <section id="conteudo" className="br-section br-light"><div className="br-wrap"><p className="br-eyebrow">TUDO O QUE O PLANO COMPLETO ENTREGA</p><h2>Seu treino deixa de ser<br/>uma lista de dúvidas.</h2><div className="br-steps">{benefits.map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="br-content-grid"><article><h3>350 exercícios organizados</h3><p>Uma biblioteca de movimentos distribuídos por grupo muscular para consultar dentro da plataforma.</p></article><article><h3>Rotina por dia</h3><p>Localize o dia de treino e veja os exercícios que fazem parte da sua rotina.</p></article><article><h3>Execução, séries e descanso</h3><p>Orientações de como realizar os movimentos, com quantidade, tempo e intervalos indicados no conteúdo.</p></article><article><h3>Conteúdo sobre alimentação</h3><p>Informações educativas para apoiar seus hábitos. Necessidades e planos alimentares individuais exigem orientação profissional.</p></article></div>
    </div></section>
    <section className="br-section br-wrap"><p className="br-eyebrow">ENCONTRE O FOCO DO SEU TREINO</p><h2>Uma biblioteca.<br/><em>Diferentes grupos musculares.</em></h2><div className="br-areas">{areas.map(([title,img])=><article key={title}><img src={`/assets/zones/${img}.webp`} alt={`Ilustração da região: ${title}`} width="400" height="500" loading="lazy"/><h3>{title}</h3></article>)}</div><p className="br-caption">Imagens ilustrativas dos grupos musculares. Consulte os movimentos e as instruções dentro da plataforma.</p></section>
    <section className="br-section br-panel"><div className="br-wrap br-split"><div><p className="br-eyebrow">TREINO QUE ACOMPANHA A SUA ROTINA</p><h2>Em casa.<br/>No parque.<br/><em>Onde você puder começar.</em></h2></div><div><p>A proposta da calistenia é trabalhar com o peso do próprio corpo. A plataforma ajuda você a encontrar os exercícios e seguir uma organização.</p><ul className="br-checks"><li>Consulte o conteúdo no celular durante o treino.</li><li>Use o computador ou tablet para organizar sua rotina.</li><li>Confira o espaço e os equipamentos exigidos pelo exercício.</li><li>Respeite seu nível, os intervalos e a recuperação.</li></ul><a className="br-text-link" href="#oferta">Ver tudo que está incluído →</a></div></div></section>
    <section className="br-section br-light br-bonus"><div className="br-wrap br-split"><div className="br-bonus-preview"><img src="/assets/bonus/cross-operacional.jpg" alt="Prévia real da tabela Cross Operacional: séries verde, amarela, azul e vermelha" width="592" height="1100" loading="lazy"/><span>PRÉVIA DO MATERIAL INCLUÍDO</span></div><div><p className="br-eyebrow">BÔNUS EXCLUSIVO DO PLANO COMPLETO</p><h2>Cross Operacional.<br/>Quatro séries em um painel visual.</h2><p>No Plano Completo, além de todos os entregáveis da plataforma, receba a tabela de consulta Cross Operacional: movimentos ilustrados, tempos e repetições apresentados lado a lado.</p><div className="br-series"><span>Verde</span><span>Amarela</span><span>Azul</span><span>Vermelha</span></div><ul className="br-bonus-list"><li>Compare as quatro séries de intensidade.</li><li>Veja as imagens que acompanham os movimentos.</li><li>Consulte os tempos e as quantidades indicados no documento.</li></ul><p className="br-bonus-note">Material complementar de consulta, não uma prescrição individual. As séries incluem movimentos intensos e avançados: a escolha e adaptação devem considerar seu condicionamento e orientação profissional.</p><p className="br-bonus-credit">O documento fornecido identifica a Escola de Educação Física do Exército. Sua inclusão não representa vínculo ou endosso institucional ao programa.</p><a className="br-text-link" href="#oferta">Quero o programa com o bônus →</a></div></div></section>
    <section id="oferta" className="br-section br-wrap br-plans-section"><div className="br-plans-heading"><p className="br-eyebrow">ESCOLHA SEU ACESSO</p><h2>Exercícios para começar.<br/><em>O programa completo para ir além.</em></h2><p>Por <strong>R$ 17 a mais</strong>, o Plano Completo reúne todos os entregáveis do programa e o bônus Cross Operacional.</p></div><div className="br-plans-grid">
      <article className="br-offer br-complete"><div className="br-plan-badge">ACESSO A TODOS OS ENTREGÁVEIS + BÔNUS</div><div className="br-offer-label">A EXPERIÊNCIA COMPLETA</div><h3>Plano Completo</h3><p>Exercícios, organização e conteúdo complementar no mesmo acesso.</p><ul className="br-checks"><li>350 exercícios de calistenia</li><li>Rotinas organizadas por dia e grupo muscular</li><li>Orientações de execução, séries, tempo e descanso</li><li>Rotinas para casa ou ao ar livre</li><li>Conteúdo educativo sobre alimentação</li><li>Acesso pelo celular, tablet e computador</li><li><strong>Bônus exclusivo: Cross Operacional</strong></li></ul><div className="br-plan-price"><p className="br-price-label">Pagamento único</p><p className="br-price"><small>R$</small>29<span>,90</span></p><CheckoutButton plan="complete" label="QUERO TUDO + O BÔNUS"/><p className="br-micro">{CHECKOUTS.complete ? 'Checkout seguro da Cakto · Plano Completo' : 'Checkout em configuração. Compra ainda indisponível.'}</p></div></article>
      <article className="br-offer br-basic"><div className="br-offer-label">SOMENTE OS EXERCÍCIOS</div><h3>Plano Básico</h3><p>Para quem quer acessar apenas a biblioteca de exercícios.</p><ul className="br-checks"><li>350 exercícios de calistenia</li></ul><div className="br-plan-exclusions"><p>Este plano não inclui:</p><ul><li>Rotinas organizadas e materiais complementares do Completo</li><li>Conteúdo sobre alimentação</li><li>Bônus Cross Operacional</li></ul></div><div className="br-plan-price"><p className="br-price-label">Pagamento único</p><p className="br-price"><small>R$</small>12<span>,90</span></p><CheckoutButton plan="basic" label="QUERO SOMENTE OS EXERCÍCIOS"/><p className="br-micro">{CHECKOUTS.basic ? 'Checkout seguro da Cakto · Plano Básico' : 'Checkout em configuração. Compra ainda indisponível.'}</p></div></article>
    </div></section>
    <section className="br-section br-light"><div className="br-wrap br-faq"><p className="br-eyebrow">ANTES DE COMEÇAR</p><h2>Respostas diretas.</h2>{faq.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    <footer className="br-wrap br-footer"><strong>CALISTENIA MILITAR</strong><p>Conteúdo educativo para adultos. Os resultados variam. Adapte a prática às suas condições e procure orientação profissional quando necessário. Conteúdo sobre alimentação não substitui acompanhamento nutricional individual.</p></footer>
  </main>;
}
