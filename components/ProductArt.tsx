import type { Product } from '@/lib/catalog';

export default function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  const gid = 'shine-' + product.id;
  const soft = 'soft-' + product.id;
  return (
    <div className={'art-stage art-' + product.visual + (large ? ' art-large' : '')}>
      <div className="art-glow" />
      <svg className="art-drawing" viewBox="0 0 440 330" role="img" aria-label={'Изображение-концепт ' + product.name}>
        <defs>
          <linearGradient id={gid} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={product.visual === 'shoe' ? '#fafafa' : '#f9fafb'} />
            <stop offset="47%" stopColor={product.visual === 'case' ? '#9fa6b3' : '#d5d8df'} />
            <stop offset="100%" stopColor={product.visual === 'lamp' ? '#f8f8fa' : '#8e949e'} />
          </linearGradient>
          <linearGradient id={soft} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".98" />
            <stop offset="100%" stopColor="#989eaa" stopOpacity=".72" />
          </linearGradient>
          <filter id={'shadow-' + product.id} x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#59606b" floodOpacity=".20" />
          </filter>
        </defs>
        <ellipse cx="220" cy="282" rx="113" ry="15" fill="#444b5b" opacity=".09" />
        {product.visual === 'case' && <g transform="rotate(-14 221 167)" filter={'url(#shadow-' + product.id + ')'}>
          <rect x="152" y="38" width="140" height="245" rx="29" fill={'url(#' + gid + ')'} stroke="#dfe1e5" strokeWidth="4" />
          <rect x="160" y="46" width="124" height="229" rx="24" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2"/>
          <rect x="163" y="52" width="55" height="63" rx="17" fill="#e4e7ed" stroke="#a1a6b0" />
          <circle cx="180" cy="70" r="10" fill="#626876" stroke="#f0f3f5" strokeWidth="4"/>
          <circle cx="204" cy="95" r="10" fill="#626876" stroke="#f0f3f5" strokeWidth="4"/>
          <circle cx="204" cy="69" r="4" fill="#fafafa"/>
          {Array.from({length: 7}, (_,i)=><path key={i} d={'M165 ' + (125+i*19) + ' Q221 ' + (91+i*18) + ' 280 ' + (136+i*19)} stroke="#fcfcfd" strokeOpacity={.75-i*.07} strokeWidth="5" fill="none"/>)}
        </g>}
        {product.visual === 'strap' && <g transform="rotate(-23 218 165)" filter={'url(#shadow-' + product.id + ')'}>
          <rect x="183" y="12" width="74" height="121" rx="24" fill={'url(#' + soft + ')'} stroke="#b4b9c3" strokeWidth="2"/>
          {Array.from({length: 6},(_,i)=><ellipse key={i} cx="220" cy={29+i*17} rx="18" ry="5" fill="#8e96a4" opacity=".55"/>)}
          <rect x="182" y="194" width="76" height="128" rx="25" fill={'url(#' + gid + ')'} stroke="#b4b9c3" strokeWidth="2"/>
          {Array.from({length: 5},(_,i)=><ellipse key={i} cx="220" cy={218+i*20} rx="17" ry="5" fill="#fff" opacity=".82"/>)}
          <rect x="170" y="113" width="100" height="100" rx="29" fill="#565d69" stroke="#e6e8ec" strokeWidth="6"/>
          <rect x="179" y="122" width="82" height="82" rx="23" fill="#1b2028"/>
          <circle cx="220" cy="163" r="27" fill="none" stroke="#d8dce5" strokeWidth="2"/>
          <path d="M220 142v23l15 10" fill="none" stroke="#e9e9ec" strokeWidth="3" strokeLinecap="round"/>
        </g>}
        {product.visual === 'grip' && <g transform="rotate(-21 215 165)" filter={'url(#shadow-' + product.id + ')'}>
          <rect x="152" y="52" width="143" height="224" rx="55" fill={'url(#' + gid + ')'} stroke="#cbd0d9" strokeWidth="3"/>
          <rect x="166" y="66" width="114" height="198" rx="47" fill="none" stroke="#fafafa" strokeWidth="2" opacity=".8"/>
          {Array.from({length: 6},(_,r)=>Array.from({length: 4},(_,c)=><ellipse key={r+'-'+c} cx={181+c*25} cy={91+r*27} rx="9" ry="12" fill="#eff0f3" stroke="#adb3be" strokeWidth="1.5"/>))}
        </g>}
        {product.visual === 'desk' && <g filter={'url(#shadow-' + product.id + ')'}>
          <path d="M127 251L238 111q15-16 30-4l42 35-109 137z" fill={'url(#' + gid + ')'} stroke="#b8bec8" strokeWidth="3"/>
          <path d="M182 228l51-65 20 15-51 67z" fill="#fafafa" opacity=".85"/>
          <rect x="127" y="240" width="203" height="24" rx="12" fill="#b4b9c2"/>
          <rect x="122" y="252" width="210" height="20" rx="10" fill={'url(#' + soft + ')'} stroke="#b9bdc5"/>
          <rect x="196" y="40" width="88" height="174" rx="18" fill="#343943" transform="rotate(20 240 128)" stroke="#e3e5e9" strokeWidth="3"/>
          <rect x="205" y="47" width="70" height="158" rx="13" fill="#b9b9c3" transform="rotate(20 240 128)"/>
        </g>}
        {product.visual === 'lamp' && <g filter={'url(#shadow-' + product.id + ')'}>
          <ellipse cx="220" cy="252" rx="108" ry="28" fill="#9da4ae"/>
          <path d="M133 242 Q156 98 218 48 Q290 105 306 242 Q220 294 133 242Z" fill={'url(#' + soft + ')'} stroke="#e5e7eb" strokeWidth="3"/>
          {Array.from({length: 9},(_,i)=><path key={i} d={'M' + (146+i*17) + ' 244 Q' + (150+i*17) + ' 119 219 54'} fill="none" stroke="#fff" strokeWidth="3" opacity=".75"/>)}
          <ellipse cx="220" cy="244" rx="87" ry="17" fill="#f3f4f6" stroke="#a5abb6"/>
        </g>}
        {product.visual === 'cup' && <g filter={'url(#shadow-' + product.id + ')'}>
          <rect x="165" y="42" width="110" height="24" rx="12" fill="#8d939e" />
          <path d="M169 60H271L260 271q-39 25-82 0z" fill={'url(#' + gid + ')'} stroke="#d3d7dd" strokeWidth="3"/>
          <path d="M177 131H263l-5 105q-36 20-76 0z" fill="#929ba7"/>
          {Array.from({length: 7},(_,i)=><path key={i} d={'M180 ' + (145+i*14) + ' Q216 ' + (125+i*15) + ' 260 ' + (151+i*14)} fill="none" stroke="#f0f2f5" strokeWidth="4" opacity=".6"/>)}
          <rect x="188" y="43" width="65" height="8" rx="4" fill="#f4f5f7" opacity=".7"/>
        </g>}
        {product.visual === 'key' && <g transform="rotate(-24 220 160)" filter={'url(#shadow-' + product.id + ')'}>
          <circle cx="220" cy="60" r="27" fill="none" stroke="#9298a5" strokeWidth="9" />
          <path d="M220 83v32" stroke="#9298a5" strokeWidth="9"/>
          <rect x="145" y="110" width="150" height="157" rx="37" fill={'url(#' + gid + ')'} stroke="#f8f8fa" strokeWidth="4" />
          <circle cx="220" cy="136" r="10" fill="#e9edf1" stroke="#9fa5af" strokeWidth="3"/>
          <path d="M188 213v-55h68M189 185h55" fill="none" stroke="#fefefe" strokeWidth="11" strokeLinecap="round"/>
        </g>}
        {product.visual === 'prototype' && <g filter={'url(#shadow-' + product.id + ')'}>
          <path d="M220 41l110 59v125l-110 60-110-60V100z" fill={'url(#' + gid + ')'} stroke="#e4e7ed" strokeWidth="4"/>
          <path d="M220 41v125l110 59M220 166l-110 59M220 166l-110-66M220 166l110-66" fill="none" stroke="#ffffff" strokeWidth="3"/>
          {Array.from({length: 5},(_,i)=><path key={i} d={'M' + (130+i*20) + ' 110l88 47'} stroke="#7d8796" strokeWidth="1.5" opacity=".33"/>)}
          <circle cx="220" cy="166" r="18" fill="#f8f9fa" stroke="#a5abb5" strokeWidth="3"/>
        </g>}
        {product.visual === 'shoe' && <g transform="rotate(-9 220 170)" filter={'url(#shadow-' + product.id + ')'}>
          <path d="M69 206q34-8 63-27l44-89q9-18 26-11l70 34 18 52q28 28 73 40 21 6 22 28v19H72q-17-17-3-46z" fill={'url(#' + soft + ')'} stroke="#b9bdc7" strokeWidth="4"/>
          <path d="M73 233q156 11 314-3v24q-149 19-315 0z" fill="#d3d7df" stroke="#f8f9fa" strokeWidth="3"/>
          <path d="M128 182q78 20 162 3M157 126q54 14 120 8M150 149q60 14 132 11" fill="none" stroke="#818996" strokeWidth="6" strokeLinecap="round" opacity=".6"/>
          {Array.from({length: 6},(_,i)=><path key={i} d={'M' + (150+i*16) + ' 127l-18 43'} stroke="#fefefe" strokeWidth="3" opacity=".75"/>)}
          <path d="M77 238q135 33 300 4" fill="none" stroke="#fff" strokeWidth="8" opacity=".8"/>
        </g>}
      </svg>
      <span className="art-orbit art-orbit-one"/>
      <span className="art-orbit art-orbit-two"/>
    </div>
  );
}