import * as cheerio from "cheerio";
import puppeteer from 'puppeteer';
import { MongoClient } from "mongodb";




async function main() {

    const html = `
<p>
<br> <strong>Livro I. AVISOS ÚTEIS PARA A VIDA ESPIRITUAL</strong>
<br> 1. <a href="https://rumoasantidade.com.br/da-imitacao-de-cristo-e-desprezo-de-todas-as-vaidades-do-mundo/">Da imitação de Cristo e desprezo de todas as vaidades do mundo</a>
<br> 2. <a href="https://rumoasantidade.com.br/do-humilde-sentir-de-si-mesmo/">Do humilde sentir de si mesmo</a>
<br> 3. <a href="https://rumoasantidade.com.br/dos-ensinamentos-da-verdade/">Dos ensinamentos da verdade</a>
<br> 4. <a href="https://rumoasantidade.com.br/da-prudencia-nas-acoes/">Da prudência nas ações</a>
<br> 5. <a href="https://rumoasantidade.com.br/da-leitura-das-sagradas-escrituras/">Da leitura das Sagradas Escrituras</a>
<br> 6. <a href="https://rumoasantidade.com.br/das-afeicoes-desordenadas/">Das afeições desordenadas</a>
<br> 7. <a href="https://rumoasantidade.com.br/como-se-deve-fugir-a-va-esperanca-e-presuncao/">Como se deve fugir à vã esperança e presunção</a>
<br> 8. <a href="https://rumoasantidade.com.br/como-se-deve-evitar-a-excessiva-familiaridade/">Como se deve evitar a excessiva familiaridade</a>
<br> 9. <a href="https://rumoasantidade.com.br/da-obediencia-e-submissao/">Da obediência e submissão</a>
<br> 10. <a href="https://rumoasantidade.com.br/como-se-devem-evitar-as-conversas-superfluas/">Como se devem evitar as conversas supérfluas</a>
<br> 11. <a href="https://rumoasantidade.com.br/da-paz-e-do-zelo-em-aproveitar/">Da paz e do zelo em aproveitar</a>
<br> 12. <a href="https://rumoasantidade.com.br/da-utilidade-das-adversidades/">Da utilidade das adversidades</a>
<br> 13. <a href="https://rumoasantidade.com.br/como-se-ha-de-resistir-as-tentacoes/">Como se há de resistir às tentações</a>
<br> 14. <a href="https://rumoasantidade.com.br/como-se-deve-evitar-o-juizo-temerario/">Como se deve evitar o juízo temerário</a>
<br> 15. <a href="https://rumoasantidade.com.br/das-obras-feitas-com-caridade/">Das obras feitas com caridade</a>
<br> 16. <a href="https://rumoasantidade.com.br/do-sofrer-os-defeitos-dos-outros/">Do sofrer os defeitos dos outros</a>
<br> 17. <a href="https://rumoasantidade.com.br/da-vida-monastica/">Da vida monástica</a>
<br> 18. <a href="https://rumoasantidade.com.br/dos-exemplos-dos-santos-padres/">Dos exemplos dos Santos Padres</a>
<br> 19. <a href="https://rumoasantidade.com.br/dos-exercicios-do-bom-religioso/">Dos exercícios do bom religioso</a>
<br> 20. <a href="https://rumoasantidade.com.br/do-amor-a-solidao-e-ao-silencio/">Do amor à solidão e ao silêncio</a>
<br> 21. <a href="https://rumoasantidade.com.br/da-compuncao-do-coracao/">Da compunção do coração</a>
<br> 22. <a href="https://rumoasantidade.com.br/da-consideracao-da-miseria-humana/">Da consideração da miséria humana</a>
<br> 23. <a href="https://rumoasantidade.com.br/da-meditacao-da-morte/">Da meditação da morte</a>
<br> 24. <a href="https://rumoasantidade.com.br/do-juizo-e-das-penas-dos-pecadores/">Do juízo e das penas dos pecadores</a>
<br> 25. <a href="https://rumoasantidade.com.br/da-diligente-emenda-de-toda-a-nossa-vida/">Da diligente emenda de toda a nossa vida</a></p>
<p><strong>Livro II. EXORTAÇÕES À VIDA INTERIOR</strong>
<br> 1. <a href="https://rumoasantidade.com.br/da-vida-interior/">Da vida interior</a>
<br> 2. <a href="https://rumoasantidade.com.br/da-humilde-submissao-2/">Da humilde submissão</a>
<br> 3. <a href="https://rumoasantidade.com.br/do-homem-bom-e-pacifico-2/">Do homem bom e pacífico</a>
<br> 4. <a href="https://rumoasantidade.com.br/da-mente-pura-e-da-intencao-simples/">Da mente pura e da intenção simples</a>
<br> 5. <a href="https://rumoasantidade.com.br/da-consideracao-de-si-mesmo/">Da consideração de si mesmo</a>
<br> 6. <a href="https://rumoasantidade.com.br/da-alegria-da-boa-consciencia/">Da alegria da boa consciência</a>
<br> 7. <a href="https://rumoasantidade.com.br/do-amor-de-jesus-sobre-todas-a-coisas/">Do amor de Jesus sobre todas a coisas</a>
<br> 8. <a href="https://rumoasantidade.com.br/da-familiar-amizade-com-jesus/">Da familiar amizade com Jesus</a>
<br> 9. <a href="https://rumoasantidade.com.br/da-privacao-de-toda-consolacao/">Da privação de toda consolação</a>
<br> 10. <a href="https://rumoasantidade.com.br/do-agradecimento-pela-graca-de-deus/">Do agradecimento pela graça de Deus</a>
<br> 11. <a href="https://rumoasantidade.com.br/quao-poucos-sao-os-que-amam-a-cruz-de-jesus/">Quão poucos são os que amam a cruz de Jesus</a>
<br> 12. <a href="https://rumoasantidade.com.br/da-estrada-real-da-santa-cruz/">Da estrada real da santa cruz</a></p>`

    const caps_3_4 = `<p><strong>Livro III. DA CONSOLAÇÃO INTERIOR</strong>
    <br> 1. <a href="https://rumoasantidade.com.br/da-comunicacao-intima-de-cristo-com-a-alma-fiel/">Da comunicação íntima de Cristo com a alma fiel</a>
    <br> 2. <a href="https://rumoasantidade.com.br/que-a-verdade-fala-dentro-de-nos-sem-estrepito-de-palavras/">Que a verdade fala dentro de nós, sem estrépito de palavras</a>
    <br> 3. <a href="https://rumoasantidade.com.br/como-as-palavras-de-deus-devem-ser-ouvidas-com-humildade-e-como-muitos-nao-as-ponderam/">Como as palavras de Deus devem ser ouvidas com humildade e como muitos não as ponderam</a>
    <br> 4. <a href="https://rumoasantidade.com.br/que-devemos-andar-perante-deus-em-verdade-e-humildade/">Que devemos andar perante Deus em verdade e humildade</a>
    <br> 5. <a href="https://rumoasantidade.com.br/dos-admiraveis-efeitos-do-amor-divino/">Dos admiráveis efeitos do amor divino</a>
    <br> 6. <a href="https://rumoasantidade.com.br/da-prova-do-verdadeiro-amor/">Da prova do verdadeiro amor</a>
    <br> 7. <a href="https://rumoasantidade.com.br/como-se-ha-de-ocultar-a-graca-sob-a-guarda-da-humildade/">Como se há de ocultar a graça sob a guarda da humildade</a>
    <br> 8. <a href="https://rumoasantidade.com.br/que-devemos-andar-perante-deus-em-verdade-e-humildade/">Da vil estima de si próprio ante os olhos de Deus</a>
    <br> 9. <a href="https://rumoasantidade.com.br/tudo-se-deve-referir-a-deus-como-ao-fim-ultimo/">Tudo se deve referir a Deus como ao fim último</a>
    <br> 10. <a href="https://rumoasantidade.com.br/como-desprezando-o-mundo-e-doce-servir-a-deus/">Como, desprezando o mundo, é doce servir a Deus</a>
    <br> 11. <a href="https://rumoasantidade.com.br/como-devemos-examinar-e-moderar-os-desejos-do-coracao/">Como devemos examinar e moderar os desejos do coração</a>
    <br> 12. <a href="https://rumoasantidade.com.br/da-escola-da-paciencia-e-luta-contra-as-concupiscencias/">Da escola da paciência e luta contra as concupiscências</a>
    <br> 13. <a href="https://rumoasantidade.com.br/da-obediencia-e-humilde-sujeicao-a-exemplo-de-jesus-cristo/">Da obediência e humilde sujeição, a exemplo de Jesus Cristo</a>
    <br> 14. <a href="https://rumoasantidade.com.br/que-se-devem-considerar-os-altos-juizos-de-deus-para-nao-nos-desvanecermos-na-prosperidade/">Que se devem considerar os altos juízos de Deus, para não nos desvanecermos na prosperidade</a>
    <br> 15. <a href="https://rumoasantidade.com.br/como-se-deve-haver-e-falar-cada-um-em-seus-desejos/">Como se deve haver e falar cada um em seus desejos</a>
    <br> 16. <a href="https://rumoasantidade.com.br/que-so-em-deus-se-ha-de-buscar-a-verdadeira-consolacao/">Que só em Deus se há de buscar a verdadeira consolação</a>
    <br> 17. <a href="https://rumoasantidade.com.br/que-todo-o-nosso-cuidado-devemos-entregar-a-deus/">Que todo o nosso cuidado devemos entregar a Deus</a>
    <br> 18. <a href="https://rumoasantidade.com.br/como-a-exemplo-de-cristo-se-hao-de-sofrer-com-igualdade-de-animo-as-miserias-temporais/">Como, a exemplo de Cristo, se hão de sofrer com igualdade de ânimo as misérias temporais</a>
    <br> 19. <a href="https://rumoasantidade.com.br/do-sofrimento-das-injurias-e-quem-e-provado-verdadeiro-paciente/">Do sofrimento das injúrias e quem é provado verdadeiro paciente</a>
    <br> 20. <a href="https://rumoasantidade.com.br/da-confissao-da-propria-fraqueza-e-das-miserias-desta-vida/">Da confissão da própria fraqueza, e das misérias desta vida</a>
    <br> 21. <a href="https://rumoasantidade.com.br/como-se-deve-descansar-em-deus-sobre-todos-os-bens-e-dons/">Como se deve descansar em Deus sobre todos os bens e dons</a>
    <br> 22. <a href="https://rumoasantidade.com.br/da-recordacao-dos-inumeraveis-beneficios-de-deus/">Da recordação dos inumeráveis benefícios de Deus</a>
    <br> 23. <a href="https://rumoasantidade.com.br/das-quatro-coisas-que-produzem-grande-paz/">Das quatro coisas que produzem grande paz</a>
    <br> 24. <a href="https://rumoasantidade.com.br/como-se-deve-evitar-a-curiosa-inquiricao-da-vida-alheia/">Como se deve evitar a curiosa inquirição da vida alheia</a>
    <br> 25. <a href="https://rumoasantidade.com.br/em-que-consiste-a-firme-paz-do-coracao-e-o-verdadeiro-aproveitamento/">Em que consiste a firme paz do coração e o verdadeiro aproveitamento</a>
    <br> 26. <a href="https://rumoasantidade.com.br/excelencia-da-liberdade-espiritual-a-qual-se-chega-antes-pela-oracao-humilde-que-pela-leitura/">Excelência da liberdade espiritual, à qual se chega antes pela oração humilde que pela leitura</a>
    <br> 27. <a href="https://rumoasantidade.com.br/como-o-amor-proprio-afasta-no-maximo-grau-do-sumo-bem/">Como o amor-próprio afasta no máximo grau do sumo bem</a>
    <br> 28. <a href="https://rumoasantidade.com.br/contra-as-linguas-maldizentes/">Contra as línguas maldizentes</a>
    <br> 29. <a href="https://rumoasantidade.com.br/como-durante-a-tribulacao-devemos-invocar-a-deus-e-bendize-lo/">Como, durante a tribulação, devemos invocar a Deus e bendizê-lo</a>
    <br> 30. <a href="https://rumoasantidade.com.br/como-se-ha-de-pedir-o-auxilio-divino-e-confiar-para-recuperar-a-graca/">Como se há de pedir o auxílio divino e confiar para recuperar a graça</a>
    <br> 31. <a href="https://rumoasantidade.com.br/do-desprezo-de-toda-criatura-para-que-se-possa-achar-o-criador/">Do desprezo de toda criatura, para que se possa achar o Criador</a>
    <br> 32. <a href="https://rumoasantidade.com.br/da-abnegacao-de-si-mesmo-e-abdicacao-de-toda-cobica/">Da abnegação de si mesmo e abdicação de toda cobiça</a>
    <br> 33. <a href="https://rumoasantidade.com.br/da-instabilidade-do-coracao-e-que-a-intencao-final-se-ha-de-dirigir-a-deus/">Da instabilidade do coração e que a intenção final se há de dirigir a Deus</a>
    <br> 34. <a href="https://rumoasantidade.com.br/como-deus-e-delicioso-em-tudo-e-sobretudo-a-quem-o-ama/">Como Deus é delicioso em tudo e sobretudo a quem o ama</a>
    <br> 35. <a href="https://rumoasantidade.com.br/como-nesta-vida-nao-ha-seguranca-contra-a-tentacao/">Como nesta vida não há segurança contra a tentação</a>
    <br> 36. <a href="https://rumoasantidade.com.br/contra-os-juizos-dos-homens/">Contra os juízos dos homens</a>
    <br> 37. <a href="https://rumoasantidade.com.br/da-pura-e-completa-renuncia-de-si-mesmo-para-obter-liberdade-de-coracao/">Da pura e completa renúncia de si mesmo para obter liberdade de coração</a>
    <br> 38. <a href="https://rumoasantidade.com.br/do-bom-procedimento-exterior-e-do-recurso-a-deus-nos-perigos/">Do bom procedimento exterior, e do recurso a Deus nos perigos</a>
    <br> 39. <a href="https://rumoasantidade.com.br/que-o-homem-nao-seja-impaciente-nos-seus-negocios/">Que o homem não seja impaciente nos seus negócios</a>
    <br> 40. <a href="https://rumoasantidade.com.br/que-o-homem-por-si-mesmo-nada-tem-de-bom-e-de-nada-se-pode-gloriar/">Que o homem por si mesmo nada tem de bom e de nada se pode gloriar</a>
    <br> 41. <a href="https://rumoasantidade.com.br/do-desprezo-de-toda-honra-temporal/">Do desprezo de toda honra temporal</a>
    <br> 42. <a href="https://rumoasantidade.com.br/como-nao-se-deve-procurar-a-paz-nos-homens/">Como não se deve procurar a paz nos homens</a>
    <br> 43. <a href="https://rumoasantidade.com.br/contra-a-va-ciencia-do-seculo/">Contra a vã ciência do século</a>
    <br> 44. <a href="https://rumoasantidade.com.br/que-se-nao-devem-tomar-a-peito-as-coisas-exteriores/">Que se não devem tomar a peito as coisas exteriores</a>
    <br> 45. <a href="https://rumoasantidade.com.br/que-se-nao-deve-dar-credito-a-todos-e-quao-facilmente-faltamos-nas-palavras/">Que se não deve dar crédito a todos, e quão facilmente faltamos nas palavras</a>
    <br> 46. <a href="https://rumoasantidade.com.br/da-confianca-que-havemos-de-ter-em-deus-quando-se-nos-dizem-palavras-afrontosas/">Da confiança que havemos de ter em Deus quando se nos dizem palavras afrontosas</a>
    <br> 47. <a href="https://rumoasantidade.com.br/que-todas-as-coisas-graves-se-devem-suportar-pela-vida-eterna/">Que todas as coisas graves se devem suportar pela vida eterna</a>
    <br> 48. <a href="https://rumoasantidade.com.br/do-dia-da-eternidade-e-das-angustias-desta-vida/">Do dia da eternidade e das angústias desta vida</a>
    <br> 49. <a href="https://rumoasantidade.com.br/do-desejo-da-vida-eterna-e-quantos-bens-estao-prometidos-aos-que-combatem/">Do desejo da vida eterna e quantos bens estão prometidos aos que combatem</a>
    <br> 50. <a href="https://rumoasantidade.com.br/como-o-homem-angustiado-se-deve-entregar-nas-maos-de-deus/">Como o homem angustiado se deve entregar nas mãos de Deus</a>
    <br> 51. <a href="https://rumoasantidade.com.br/que-devemos-praticar-as-obras-humildes-quando-somos-incapazes-para-as-mais-altas/">Que devemos praticar as obras humildes quando somos incapazes para as mais altas</a>
    <br> 52. <a href="https://rumoasantidade.com.br/que-o-homem-se-nao-repute-digno-de-consolacao-mas-merecedor-de-castigo/">Que o homem se não repute digno de consolação, mas merecedor de castigo</a>
    <br> 53. <a href="https://rumoasantidade.com.br/que-a-graca-de-deus-nao-se-comunica-aos-que-gostam-das-coisas-terrenas/">Que a graça de Deus não se comunica aos que gostam das coisas terrenas</a>
    <br> 54. <a href="https://rumoasantidade.com.br/dos-diversos-movimentos-da-natureza-e-da-graca/">Dos diversos movimentos da natureza e da graça</a>
    <br> 55. <a href="https://rumoasantidade.com.br/da-corrupcao-da-natureza-e-da-eficacia-da-graca-divina/">Da corrupção da natureza e da eficácia da graça divina</a>
    <br> 56. <a href="https://rumoasantidade.com.br/que-devemos-renunciar-a-nos-mesmos-e-seguir-a-cristo-pela-cruz/">Que devemos renunciar a nós mesmos e seguir a Cristo pela cruz</a>
    <br> 57. <a href="https://rumoasantidade.com.br/que-o-homem-nao-se-desanime-em-demasia-quando-cai-em-algumas-faltas/">Que o homem não se desanime em demasia, quando cai em algumas faltas</a>
    <br> 58. <a href="https://rumoasantidade.com.br/que-nao-devemos-escrutar-as-coisas-mais-altas-e-os-ocultos-juizos-de-deus/">Que não devemos escrutar as coisas mais altas e os ocultos juízos de Deus</a>
    <br> 59. <a href="https://rumoasantidade.com.br/que-so-em-deus-devemos-firmar-toda-esperanca-e-confianca/">Que só em Deus devemos firmar toda esperança e confiança</a></p>
<p><strong>Livro IV. DEVOTA EXORTAÇÃO PARA A SAGRADA COMUNHÃO</strong>
    <br> 1. <a href="https://rumoasantidade.com.br/com-quanta-reverencia-cumpre-receber-a-cristo/">Com quanta reverência cumpre receber a Cristo</a>
    <br> 2. <a href="https://rumoasantidade.com.br/como-neste-sacramento-se-mostra-ao-homem-a-grande-bondade-e-caridade-de-deus/">Como neste Sacramento se mostra ao homem a grande bondade e caridade de Deus</a>
    <br> 3. <a href="https://rumoasantidade.com.br/da-utilidade-da-comunhao-frequente/">Da utilidade da comunhão freqüente</a>
    <br> 4. <a href="https://rumoasantidade.com.br/dos-admiraveis-frutos-colhidos-pelos-que-comungam-devotamente/">Dos admiráveis frutos colhidos pelos que comungam devotamente</a>
    <br> 5. <a href="https://rumoasantidade.com.br/da-dignidade-do-sacramento-e-do-estado-sacerdotal/">Da dignidade do Sacramento e do estado sacerdotal</a>
    <br> 6. <a href="https://rumoasantidade.com.br/pergunta-concernente-ao-exercicio-antes-da-comunhao/">Pergunta concernente ao exercício antes da comunhão</a>
    <br> 7. <a href="https://rumoasantidade.com.br/do-exame-da-propria-consciencia-e-proposito-de-emenda/">Do exame da própria consciência e propósito de emenda</a>
    <br> 8. <a href="https://rumoasantidade.com.br/da-oblacao-de-cristo-na-cruz-e-da-propria-resignacao/">Da oblação de Cristo na cruz e da própria resignação</a>
    <br> 9. <a href="https://rumoasantidade.com.br/que-devemos-com-tudo-quanto-e-nosso-oferecer-nos-a-deus-e-orar-por-todos/">Que devemos com tudo quanto é nosso oferecer-nos a Deus, e orar por todos</a>
    <br> 10. <a href="https://rumoasantidade.com.br/que-nao-se-deve-deixar-por-leve-motivo-a-sagrada-comunhao/">Que não se deve deixar por leve motivo a sagrada comunhão</a>
    <br> 11. <a href="https://rumoasantidade.com.br/que-o-corpo-de-cristo-e-a-sagrada-escritura-sao-sumamente-necessarios-a-alma-fiel-voz-do-discipulo/">Que o corpo de Cristo e a Sagrada Escritura são sumamente necessários à alma fiel Voz do discípulo</a>
    <br> 12. <a href="https://rumoasantidade.com.br/que-a-alma-se-deve-preparar-com-grande-diligencia-para-a-sagrada-comunhao/">Que a alma se deve preparar com grande diligência para a sagrada comunhão</a>
    <br> 13. <a href="https://rumoasantidade.com.br/que-a-alma-devota-deve-aspirar-de-todo-o-coracao-a-uniao-com-cristo-no-sacramento/">Que a alma devota deve aspirar, de todo o coração, à união com Cristo no Sacramento</a>
    <br> 14. <a href="https://rumoasantidade.com.br/do-ardente-desejo-que-tem-alguns-devotos-de-receber-o-corpo-de-cristo/">Do ardente desejo que têm alguns devotos de receber o corpo de Cristo</a>
    <br> 15. <a href="https://rumoasantidade.com.br/que-a-graca-da-devocao-se-alcanca-pela-humildade-e-abnegacao-de-si-mesmo/">Que a graça da devoção se alcança pela humildade e abnegação de si mesmo</a>
    <br> 16. <a href="https://rumoasantidade.com.br/como-devemos-descobrir-nossas-necessidades-a-cristo-e-pedir-sua-graca/">Como devemos descobrir nossas necessidades a Cristo e pedir sua graça</a>
    <br> 17. <a href="https://rumoasantidade.com.br/do-ardente-amor-e-veemente-desejo-de-receber-a-cristo/">Do ardente amor e veemente desejo de receber a Cristo</a>
    `

    const lista = html + caps_3_4

    const $ = cheerio.load(lista);

    const links = [];

    $('a').each((index, element) => {
        links.push([$(element).attr('href'), $(element).text()]);
    });

    const client = new MongoClient("mongodb+srv://paulohs_1:114855@biblia.xvoadgp.mongodb.net/?retryWrites=true&w=majority&appName=Biblia", { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db("imitacao");

    const browser = await puppeteer.launch({ headless: true });

    for (const link of links) {
        const page = await browser.newPage();
        try {
            await page.goto(link[0]);

            const content = await page.evaluate(() => {
                const section = document.getElementsByClassName('post_content')[0];
                if (!section) {
                    return { h2s: [], paragraphs: [] };
                }

                const h2Elements = Array.from(section.getElementsByTagName('h2'));
                const paragraphs = Array.from(section.getElementsByTagName('p'));

                const h2s = h2Elements.map((h2, index) => ({
                    position: index + 1,
                    text: h2.innerText.trim(),
                }));

                let lastKey = '';

                const paragraphData = {};
                paragraphs.forEach(p => {
                    const strongElement = p.querySelector('strong');
                    if (strongElement) {
                        const strongText = strongElement.innerText.trim();
                        const keyMatch = strongText.match(/^\d+/); // Verifica se começa com um número

                        if (keyMatch) {
                            const key = keyMatch[0];
                            const value = p.innerText.replace(strongElement.outerHTML, '').trim();
                            paragraphData[key] = value;
                            lastKey = key; // Atualiza a última chave
                        } else if (lastKey) {
                            const value = p.innerText.replace(strongElement.outerHTML, '').trim();
                            paragraphData[lastKey] += ' ' + value;
                        }
                    } else if (lastKey) {
                        const value = p.innerText.trim();
                        paragraphData[lastKey] += ' ' + value;
                    }
                });

                return { h2s, paragraphs: paragraphData };
            });

            const bookTitle = content.h2s.find(h => h.position === 1)?.text || 'default';
            const chapterTitle = content.h2s.find(h => h.position === 2)?.text || 'Capítulo';

            const documentData = {
                capítulo: chapterTitle,
                titulo: link[1],
                conteúdo: content.paragraphs,
            };

            await db.collection(bookTitle).insertOne(documentData);

            console.log(`Acessou: ${link}`);
            console.log(`Coleção: ${bookTitle}`);
            console.log('_____________________________________________________________________________________');
        } catch (error) {
            console.error(`Erro ao acessar ${link}: ${error.message}`);
        } finally {
            await page.close();
        }
    }

    await browser.close();
    await client.close();
}

main().catch(console.error);
