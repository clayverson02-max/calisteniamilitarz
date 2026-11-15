from pathlib import Path
from xml.sax.saxutils import escape
import textwrap
OUT=Path(__file__).resolve().parents[2]/'public/guia';OUT.mkdir(parents=True,exist_ok=True)
navy='#143852';blue='#087eae';lime='#d5ef73';ink='#243b4e'
def text(x,y,s,size=20,fill=ink,weight=400): return f'<text x="{x}" y="{y}" font-family="Arial,sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}">{escape(s)}</text>'
def lines(x,y,s,width=62,size=20,fill=ink):return ''.join(text(x,y+i*28,line,size,fill) for i,line in enumerate(textwrap.wrap(s,width)))
def rect(x,y,w,h,fill,rx=12,stroke='none'):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="4"/>'
def circle(x,y,r,fill,stroke='none'):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="5"/>'
def line(x,y,xx,yy):return f'<path d="M{x} {y} L{xx} {yy}" stroke="{blue}" stroke-width="3" fill="none"/>'
def badge(x,y,n):return circle(x,y,19,blue)+text(x-6,y+7,str(n),20,'white',700)
def drawing(kind):
 s=''
 if kind=='lavadora':
  s=rect(292,240,270,290,'white',15,navy)+rect(308,258,238,48,'#e3eef4')+circle(427,415,86,'#dcebf1',navy)+circle(427,415,65,'#b9dce9',blue)+circle(515,280,10,navy)+rect(325,273,88,16,'#9db9c7',2)
  s+=line(325,280,205,280)+badge(185,280,1)+line(345,415,205,415)+badge(185,415,2)+line(555,478,660,478)+badge(680,478,3)
 elif kind=='geladeira':
  s=rect(322,224,215,330,'white',13,navy)+line(322,340,537,340)+rect(505,268,8,40,blue,3)+rect(505,370,8,65,blue,3)+rect(340,365,135,12,'#b9dce9',2)+rect(340,421,135,12,'#b9dce9',2)+rect(340,475,135,35,'#e3eef4',3)
  s+=line(340,371,205,300)+badge(185,300,1)+line(533,420,660,420)+badge(680,420,2)+line(420,552,660,525)+badge(680,525,3)
 elif kind=='forno':
  s=rect(292,263,280,250,'white',14,navy)+rect(312,325,240,165,'#dcebf1',8,navy)+rect(326,342,212,13,blue,4)+line(325,436,538,436)
  for x in [330,375,420,465,520]:s+=circle(x,290,10,navy)
  s+=line(330,290,205,270)+badge(185,270,1)+line(550,370,660,370)+badge(680,370,2)+line(325,436,205,460)+badge(185,460,3)
 elif kind=='microondas':
  s=rect(245,287,370,220,'white',15,navy)+rect(263,307,265,180,'#c6dce5',8,navy)+rect(539,310,54,50,navy,5)+line(280,455,510,455)+rect(510,360,8,70,blue,3)
  for y in [385,411,437]:s+=circle(555,y,6,blue)+circle(580,y,6,blue)
  s+=line(510,385,660,270)+badge(680,270,1)+line(265,455,205,490)+badge(185,490,2)+line(566,335,660,390)+badge(680,390,3)
 elif kind=='liquidificador':
  s=rect(335,438,180,103,'white',18,navy)+f'<path d="M340 265 L510 265 L490 435 L360 435 Z" fill="#dcebf1" stroke="{navy}" stroke-width="5"/>'+rect(331,250,188,18,blue,5)+circle(425,488,20,blue)+line(385,400,465,420)+line(385,420,465,400)+f'<path d="M510 285 Q580 285 549 380 L499 380" fill="none" stroke="{navy}" stroke-width="12"/>'
  s+=line(332,259,205,259)+badge(185,259,1)+line(365,426,205,425)+badge(185,425,2)+line(510,495,660,495)+badge(680,495,3)
 else:
  s=rect(326,240,210,310,'#f3ce64',20,navy)+rect(345,265,172,65,'#e3eef4',5,navy)+text(365,308,'1.50 V',30,navy,700)+circle(431,407,52,navy)+line(431,407,454,370)+circle(380,510,11,'#111')+circle(480,510,11,'#dd5353')+text(354,538,'COM',14)+text(464,538,'VΩ',14)
  s+=line(380,510,275,555)+line(480,510,620,555)+badge(185,290,1)+line(205,290,345,290)+badge(680,400,2)+line(660,400,484,400)+badge(680,525,3)+line(660,525,500,525)
 return s
cards=[
('lavadora','LAVADORAS','Não centrifuga?','O sintoma não identifica sozinho a peça com defeito. Comece pelas condições de uso.',['Painel e programa','Porta ou tampa','Saída de água'],['Observe o ciclo: a máquina ainda está drenando ou está em pausa? Anote o código mostrado no painel.','Com o ciclo parado, siga o manual para redistribuir a carga. Não force uma tampa travada.','Com o aparelho desligado, observe apenas o trecho externo da mangueira: dobras e instalação devem seguir o manual.'],'Água retida muda o caminho da investigação. Não conclua que o motor ou a placa estão danificados só pela falta de centrifugação.','Não burle a trava da tampa nem acesse partes energizadas. Falha persistente exige avaliação técnica.'),
('geladeira','REFRIGERAÇÃO','Não está gelando?','Separe ajuste, circulação de ar e vedação antes de suspeitar de uma falha interna.',['Circulação de ar','Vedação da porta','Ventilação externa'],['Confira o ajuste selecionado e se embalagens estão obstruindo as saídas internas de ar.','Observe se a porta fecha sem obstáculos e se a borracha apresenta sujeira, deformação ou rasgos.','Registre há quanto tempo o problema ocorre, o ambiente de instalação e se houve grande carga de alimentos.'],'O ruído do compressor, isoladamente, não confirma refrigeração correta. Registre os sinais e consulte o manual do modelo.','Não perfure tubulações, não use objetos para remover gelo e não intervenha no circuito refrigerante.'),
('forno','COZINHA ELÉTRICA','Forno não aquece?','Uma configuração incorreta pode parecer uma falha de aquecimento. Observe antes de abrir.',['Seletor e timer','Porta e vedação','Câmara do forno'],['Anote a função escolhida, a temperatura e o comportamento do timer. Alguns modos não acionam todas as resistências.','Espere esfriar completamente. Observe a porta, a vedação e resíduos, sem remover proteções ou painéis.','Se o sintoma continuar, registre o modelo e o que funciona: luz, ventilação, painel e aquecimento.'],'Uma resistência aparentemente íntegra pode ter defeito. Uma inspeção visual não substitui os testes próprios de assistência.','Não faça pontes em termostatos ou fusíveis térmicos. Intervenções elétricas internas são para profissionais habilitados.'),
('microondas','MICRO-ONDAS','Liga, mas não aquece?','Nesta categoria, a consulta do usuário se limita aos controles e à inspeção externa.',['Porta e fechos','Cavidade acessível','Função selecionada'],['Confira se foi selecionado um programa de cozimento, e não apenas a função de temporizador.','Observe a porta sem forçá-la. Dano, desalinhamento, faíscas ou cheiro de queimado exigem interrupção do uso.','Se o comando está correto e o problema persiste, anote o sintoma e encaminhe para assistência.'],'O painel aceso não prova que o conjunto interno está seguro. Não opere com a porta ou as proteções danificadas.','NUNCA remova a carcaça. Há risco de alta tensão mesmo fora da tomada. Não teste nem descarregue o capacitor.'),
('liquidificador','PEQUENOS APARELHOS','Vazamento no copo?','Localize a origem sem colocar as mãos perto das lâminas e sem molhar a base.',['Tampa e copo','Conjunto inferior','Base do motor'],['Retire da tomada. Remova o copo conforme o manual e seque o exterior para localizar o ponto do vazamento.','Observe trincas, tampa e vedação acessível. Só desmonte componentes que o fabricante permite ao usuário retirar.','Se a peça removível estiver danificada, identifique o código correto antes de substituir. Reinstale conforme o manual.'],'Copo trincado e vedação inadequada não se resolvem apertando indiscriminadamente. Não use cola para reparar partes em contato com alimentos.','Se líquido entrou na base, não religue para testar. Encaminhe para avaliação; não toque nas lâminas.'),
('multimetro','BASES DO DIAGNÓSTICO','Conheça o multímetro','Exemplo didático em pilha isolada. Não é uma instrução para medir tomadas ou circuitos internos.',['Visor e unidade','Seletor de função','Entradas das pontas'],['Leia o manual do instrumento. Confira pontas e isolação; a ponta preta fica em COM e a vermelha na entrada indicada para tensão.','Para uma pilha AA isolada, selecione tensão contínua e uma faixa compatível, conforme o instrumento. Nunca use a entrada de corrente.','Encoste cada ponta em um polo sem uni-los. Observe valor, unidade e polaridade; depois retire as pontas e desligue o medidor.'],'Tensão medida sem carga não garante que a pilha esteja boa em uso. Continuidade e resistência são funções diferentes de tensão.','Não pratique em rede elétrica. Um aparelho fora da tomada ainda pode armazenar energia em capacitores.')]
for idx,(kind,area,title,sub,labels,steps,result,warning) in enumerate(cards,1):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">'+rect(0,0,900,1200,'#fff',0)+rect(0,0,900,70,navy,0)+text(42,43,'GUIA VISUAL • ELETRODOMÉSTICOS',21,'white',700)+text(780,43,f'{idx:02}',23,lime,700)
 s+=text(42,112,area,15,blue,700)+text(42,163,title,39,navy,700)+lines(42,200,sub,83,18)
 s+=rect(42,238,816,325,'#f0f6f8')+drawing(kind)
 for n,label in enumerate(labels,1):s+=badge(65+(n-1)*275,594,n)+text(94+(n-1)*275,600,label,16,navy,700)
 s+=rect(42,632,816,38,blue,5)+text(58,658,'ROTEIRO DE OBSERVAÇÃO',17,'white',700)
 for n,step in enumerate(steps,1):
  y=700+(n-1)*82;s+=text(47,y,f'0{n}',25,blue,700)+lines(105,y,step,69,18)
 s+=rect(42,942,816,102,'#eaf2d2',8)+text(58,966,'COMO INTERPRETAR',15,navy,700)+lines(58,992,result,85,16)
 s+=rect(42,1061,816,94,'#fff0d7',8)+text(58,1085,'LIMITE DE SEGURANÇA',15,'#8e4814',700)+lines(58,1112,warning,88,16,'#603c22')
 s+=text(42,1180,'PÁGINA DEMONSTRATIVA • Esquema conceitual. Consulte o manual do modelo.',12,'#617785')+'</svg>'
 (OUT/f'{kind}.svg').write_text(s)
# Capa editorial: desenhos vetoriais próprios, consistentes com as páginas internas.
s='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">'+rect(0,0,900,1200,navy,0)
s+=text(60,82,'BIBLIOTECA DE CONSULTA • EDIÇÃO BRASIL',18,lime,700)+text(60,174,'GUIA VISUAL',72,'white',700)+text(60,258,'DE REPARAÇÃO',66,'white',700)+text(60,338,'ELETRODOMÉSTICOS',49,lime,700)
s+=lines(60,400,'Entenda os componentes. Reconheça os sintomas. Organize o diagnóstico.',48,25,'white')
s+='<g transform="translate(-190,290) scale(1.15)">'+drawing('lavadora')+'</g>'
s+='<g transform="translate(315,370) scale(.82)">'+drawing('multimetro')+'</g>'
s+=rect(60,1000,780,100,lime,10)+text(88,1042,'LAVADORAS • GELADEIRAS • COZINHA',24,navy,700)+text(88,1080,'PEQUENOS APARELHOS • BASES DO DIAGNÓSTICO',21,navy,700)+text(60,1162,'Material educativo ilustrado • Consulta por aparelho e sintoma',18,'#d5e3ed')+'</svg>'
(OUT/'capa.svg').write_text(s)
print('7 visuais editoriais criados')
