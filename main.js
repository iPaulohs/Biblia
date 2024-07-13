import puppeteer from "puppeteer";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuidv4 } from "uuid";

async function main() {
  let biblia = [
    ["genesis", 50, "Genesis"],
    ["exodo", 40, "Exodo"],
    ["levitico", 27, "Levitico"],
    ["numeros", 36, "Numeros"],
    ["deuteronomio", 34, "Deuteronomio"],
    ["josue", 24, "Josue"],
    ["juizes", 21, "Juizes"],
    ["rute", 4, "Rute"],
    ["i-samuel", 31, "I Samuel"],
    ["ii-samuel", 24, "II Samuel"],
    ["i-reis", 22, "I Reis"],
    ["ii-reis", 25, "II Reis"],
    ["i-cronicas", 29, "I Cronicas"],
    ["ii-cronicas", 36, "II Cronicas"],
    ["esdras", 10, "Esdras"],
    ["neemias", 13, "Neemias"],
    ["tobias", 14, "Tobias"],
    ["judite", 16, "Judite"],
    ["ester", 10, "Ester"],
    ["i-macabeus", 16, "I Macabeus"],
    ["ii-macabeus", 15, "II Macabeus"],
    ["jo", 42, "Jo"],
    ["salmos", 150, "Salmos"],
    ["proverbios", 31, "Proverbios"],
    ["eclesiastes", 12, "Eclesiastes"],
    ["cantico-dos-canticos", 8, "Cantico dos Canticos"],
    ["sabedoria", 19, "Sabedoria"],
    ["eclesiastico", 51, "Eclesiastico"],
    ["isaias", 66, "Isaias"],
    ["jeremias", 52, "Jeremias"],
    ["lamentacoes", 5, "Lamentacoes"],
    ["baruc", 6, "Baruc"],
    ["ezequiel", 48, "Ezequiel"],
    ["daniel", 14, "Daniel"],
    ["oseias", 14, "Oseias"],
    ["joel", 3, "Joel"],
    ["amos", 9, "Amos"],
    ["abdias", 1, "Abdias"],
    ["jonas", 4, "Jonas"],
    ["miqueias", 7, "Miqueias"],
    ["naum", 3, "Naum"],
    ["habacuc", 3, "Habacuc"],
    ["sofonias", 3, "Sofonias"],
    ["ageu", 2, "Ageu"],
    ["zacarias", 14, "Zacarias"],
    ["malaquias", 4, "Malaquias"],
    ["sao-mateus", 28, "Sao Mateus"],
    ["sao-marcos", 16, "Sao Marcos"],
    ["sao-lucas", 24, "Sao Lucas"],
    ["sao-joao", 21, "Sao Joao"],
    ["atos-dos-apostolos", 28, "Atos dos Apostolos"],
    ["romanos", 16, "Romanos"],
    ["i-corintios", 16, "I Corintios"],
    ["ii-corintios", 13, "II Corintios"],
    ["galatas", 6, "Galatas"],
    ["efesios", 6, "Efesios"],
    ["filipenses", 4, "Filipenses"],
    ["colossenses", 4, "Colossenses"],
    ["i-tessalonicenses", 5, "I Tessalonicenses"],
    ["ii-tessalonicenses", 3, "II Tessalonicenses"],
    ["i-timoteo", 6, "I Timoteo"],
    ["ii-timoteo", 4, "II Timoteo"],
    ["tito", 3, "Tito"],
    ["filemon", 1, "Filemon"],
    ["hebreus", 13, "Hebreus"],
    ["sao-tiago", 5, "Sao Tiago"],
    ["i-sao-pedro", 5, "I Sao Pedro"],
    ["ii-sao-pedro", 3, "II Sao Pedro"],
    ["i-sao-joao", 5, "I Sao Joao"],
    ["ii-sao-joao", 1, "II Sao Joao"],
    ["iii-sao-joao", 1, "III Sao Joao"],
    ["sao-judas", 1, "Sao Judas"],
    ["apocalipse", 22, "Apocalipse"],
  ];

  const db = await open({
    filename: 'biblia.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Livro (
      Id TEXT PRIMARY KEY,
      Titulo TEXT NOT NULL,
      Capitulo INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Versiculo (
      Id TEXT PRIMARY KEY,
      Numero INTEGER NOT NULL,
      Conteudo TEXT NOT NULL,
      LivroId TEXT,
      FOREIGN KEY(LivroId) REFERENCES Livro(Id)
    );
  `);

  for (let i = 0; i < biblia.length; i++) {
    const bookName = biblia[i][0];
    const chapters = biblia[i][1];
    const bookTitle = biblia[i][2];

    for (let j = 0; j < chapters; j++) {
      const livroId = uuidv4();
      const chapterNumber = j + 1;
      const chapterTitle = `${bookTitle} - Capítulo ${chapterNumber}`;

      await db.run(`
        INSERT OR IGNORE INTO Livro (Id, Titulo, Capitulo)
        VALUES (?, ?, ?)
      `, [livroId, chapterTitle, chapterNumber]);

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.setViewport({ width: 1, height: 1 });

      await page.goto(
        `https://www.bibliacatolica.com.br/biblia-matos-soares-1956/${bookName}/${chapterNumber}/`,
      );

      const paragrafos = await page.evaluate(() => {
        const section = document.getElementsByClassName("entry clearfix")[0];
        if (!section) {
          return [];
        }
        const pElements = section.querySelectorAll("p");
        return Array.from(pElements).map((p) => p.innerText);
      });

      const versiculos = {};

      paragrafos.forEach((e) => {
        const resultado = separarNumeroTexto(e);
        if (resultado) {
          versiculos[resultado.numero] = resultado.textoSemNumero;
        }
      });

      for (const [numero, conteudo] of Object.entries(versiculos)) {
        const versiculoId = uuidv4(); // Geração de UUID para o versículo

        await db.run(`
          INSERT OR IGNORE INTO Versiculo (Id, Numero, Conteudo, LivroId)
          VALUES (?, ?, ?, ?)
        `, [versiculoId, numero, conteudo, livroId]);
      }

      await browser.close();
    }
  }

  await db.close();
}

const separarNumeroTexto = (texto) => {
  const regex = /^(\d+)\.\s*(.*)$/;
  const resultado = texto.match(regex);

  if (resultado) {
    const numero = resultado[1];
    const textoSemNumero = resultado[2];
    return { numero, textoSemNumero };
  } else {
    return null;
  }
};

main();
