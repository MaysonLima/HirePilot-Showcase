import {useEffect,useState} from 'react'
import type {Language} from './i18n'

export type ThemePreference = 'light' | 'dark' | 'system'
const LANGUAGE_KEY='hirepilot.language'
const THEME_KEY='hirepilot.theme'

function readChoice<T extends string>(key:string,allowed:readonly T[],fallback:T):T {
 try {
   const stored=window.localStorage.getItem(key)
   return stored && allowed.includes(stored as T) ? stored as T : fallback
 } catch {return fallback}
}
function preferredLanguage():Language {
 if(typeof navigator==='undefined') return 'pt-BR'
 const candidate=navigator.language.toLowerCase()
 return candidate.startsWith('es')?'es-ES':candidate.startsWith('en')?'en-US':'pt-BR'
}
function prefersDark():boolean {
 return typeof window!=='undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}
export function usePreferences(){
 const [language,setLanguage]=useState<Language>(()=>readChoice(LANGUAGE_KEY,['pt-BR','en-US','es-ES'],preferredLanguage()))
 const [theme,setTheme]=useState<ThemePreference>(()=>readChoice(THEME_KEY,['light','dark','system'],'light'))
 const [systemDark,setSystemDark]=useState(prefersDark)
 useEffect(()=>{
   const media=window.matchMedia('(prefers-color-scheme: dark)')
   const onChange=(event:MediaQueryListEvent)=>setSystemDark(event.matches)
   media.addEventListener('change',onChange)
   return ()=>media.removeEventListener('change',onChange)
 },[])
 useEffect(()=>{
   document.documentElement.dataset.theme=theme==='system'?(systemDark?'dark':'light'):theme
   try{window.localStorage.setItem(THEME_KEY,theme)}catch{/* armazenamento bloqueado */}
 },[theme,systemDark])
 useEffect(()=>{
   document.documentElement.lang=language
   try{window.localStorage.setItem(LANGUAGE_KEY,language)}catch{/* armazenamento bloqueado */}
 },[language])
 return {language,setLanguage,theme,setTheme}
}
