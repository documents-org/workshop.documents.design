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
        return `
        <article>
            <h2>${s.prenom} ${s.nom}</h2>
            <h3>${s.annee} ${s.option}</h3>
            <a href="${s.site}">${s.site.replace(/https?\:\/\//, '')}</a>
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
        const [prenom, nom, annee, option, site] = a.split(',');
        return {
            prenom,
            nom,
            annee: toFrenchAnnee(annee),
            option: toFrenchOption(option),
            site,
        };
    });
    writeHTML(students);
});

