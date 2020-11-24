const fs = require('fs');

const toFrenchAnnee = y => ({
    annee_2: "2<sup>e</sup> année",
    annee_3: "3<sup>e</sup> année",
    annee_4: "4<sup>e</sup> année",
    annee_5: "5<sup>e</sup> année",
}[y] || "");

const toFrenchOption = o => ({
    art: "Art",
    com: "Communication",
    design: "Design",
}[o] || "");

const writeHTML = students => {

    const students_string = students.map(s => {
        const rotate = Math.random() * 180;
        const dec1 = Math.random() > 0.5 ? -20 : 20;
        const dec2 = Math.random() > 0.5 ? -20 : 20;
        const top = Math.random() * dec1 + 50;
        const left = Math.random() * dec2 + 50;
        return `
        <article>
            ${s.image ? `<img class="insecte" data-src="images/${s.image}" style="top: ${top}%; left: ${left}%; transform: translate(-50%, -50%) rotate(${rotate}deg)"/>` : ''}
            <div class="content">
            <h2>${s.prenom} ${s.nom}</h2>
            <h3>${s.annee} ${s.option}</h3>
            ${
                s.site ? `<a href="${s.site}">${s.site.replace(/https?\:\/\//, '')}</a>` : s.pdf ? `<a href="pdf/${s.pdf}">Portfolio.pdf</a>` : ''
            }
            </div>
        </article>
        `;
    }).join('\n');
    const source = fs.readFile('index.src.html', (err, data) => {
        const s = data.toString();
        fs.writeFile('index.html', s.replace("### CONTENT_HERE ###", students_string), 'utf-8', () => {
            console.log('BUILD DONE.');
        });
    });
}

fs.readFile('liste_sites.csv', (err, data) => {
    const str = data.toString();
    const lines = str.split('\r\n');
    const students = lines.slice(1).map(a => {
        const [prenom, nom, annee, option, site, pdf, image] = a.split(',');
        return {
            prenom,
            nom,
            annee: toFrenchAnnee(annee),
            option: toFrenchOption(option),
            site,
            pdf,
            image
        };
    });
    students.sort((a, b) => a.prenom.toLowerCase() > b.prenom.toLowerCase() ? 1 : -1);
    writeHTML(students);
});

