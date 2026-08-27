import"./rolldown-runtime-B0Z9INg1.js";import{n as e,t}from"./react-9zDUDP1d.js";import{t as n}from"./compiler-runtime-C6Gkfpu9.js";import{Gr as r,Kr as i,h as a,mt as o,o as s,wt as c,x as l}from"./_visual-editing-atbsRaDF.js";import{Ao as u,Co as d,Dl as f,Eo as p,Ga as m,Io as h,Ka as g,Lo as _,Mo as v,No as y,Oo as b,Os as x,_o as S,bo as C,fn as w,yo as T}from"./index2-CYgsVvlW.js";var E=e(),D=n();t(),f(),y(),v(),p(),u(),d(),h(),_(),b(),x(),C(),T(),S();var O=1,k=3,A=i(a).withConfig({displayName:`RootFlex`,componentId:`sc-1y8zfkj-0`})(({theme:e})=>{let t=e.sanity.media;return r`
    min-height: 100%;

    @media (max-width: ${t[k]}px) {
      position: relative;
    }
  `}),j=i(l).withConfig({displayName:`SidebarMotionLayer`,componentId:`sc-1y8zfkj-1`})(({theme:e})=>{let t=e.sanity.media;return r`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 360px;
    border-left: 1px solid var(--card-border-color);
    box-sizing: border-box;
    overflow: hidden;

    box-shadow:
      0px 6px 8px -4px var(--card-shadow-umbra-color),
      0px 12px 17px -1px var(--card-shadow-penumbra-color);

    @media (max-width: ${t[k]}px) {
      bottom: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    @media (max-width: ${t[O]}px) {
      border-left: 0;
      min-width: 100%;
      left: 0;
    }
  `});function M(e){let t=(0,D.c)(12),n=o(),{state:r}=g(),{isOpen:i}=r,a=n<=O&&i?`hidden`:`auto`,l;t[0]===e?l=t[1]:(l=e.renderDefault(e),t[0]=e,t[1]=l);let u;t[2]!==a||t[3]!==l?(u=(0,E.jsx)(s,{flex:1,height:`fill`,overflow:a,children:l}),t[2]=a,t[3]=l,t[4]=u):u=t[4];let d;t[5]===i?d=t[6]:(d=i&&(0,E.jsx)(j,{zOffset:100,height:`fill`,children:(0,E.jsx)(w,{})}),t[5]=i,t[6]=d);let f;t[7]===d?f=t[8]:(f=(0,E.jsx)(c,{initial:!1,children:d}),t[7]=d,t[8]=f);let p;return t[9]!==u||t[10]!==f?(p=(0,E.jsxs)(A,{sizing:`border`,height:`fill`,children:[u,f]}),t[9]=u,t[10]=f,t[11]=p):p=t[11],p}function N(e){let t=(0,D.c)(4),{enabled:n}=m();if(!n){let n;return t[0]===e?n=t[1]:(n=e.renderDefault(e),t[0]=e,t[1]=n),n}let r;return t[2]===e?r=t[3]:(r=(0,E.jsx)(M,{...e}),t[2]=e,t[3]=r),r}export{N as TasksStudioActiveToolLayout};