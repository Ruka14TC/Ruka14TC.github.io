import{d as o,c as s,o as m,am as r}from"#entry";import{u}from"./cEWgK4AK.js";const d=o({__name:"PmRun",props:{inStack:{type:Boolean,default:!1},script:{},sync:{default:"_pm"},noSync:{type:Boolean}},setup(n){const e=`
::code-group{${n.inStack?"in-stack":""} ${n.noSync?"":`sync="${n.sync}"`}}
${u().packageManagers.value.map(a=>{const c=`${a.command}${a.run}${n.script}`;return`\`\`\`bash [${a.name}]
${c}
\`\`\`
`}).join(`
`)}
::
`;return(a,c)=>{const t=r;return m(),s(t,{value:e,class:"[&:not(:first-child)]:mt-5"})}}});export{d as default};
