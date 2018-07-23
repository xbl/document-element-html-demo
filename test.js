const strTemplateRegExp = /\{\{((?:.|\n)+?)\}\}/g;
const strTemplate = 'hi {{ name }} age: {{ age + 1}}';
let match;
while ((match = strTemplateRegExp.exec(strTemplate) )) {
    console.log(match)
}