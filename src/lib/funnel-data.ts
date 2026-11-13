// Plano principal — é o único oferecido no funil.
export const CHECKOUT_URL = "https://pay.hotmart.com/L108486884A?checkoutMode=10";
export const VSL_ID = "498sx1kb25";
export const VSL_POSTER = "https://cdn.vslwave.site/v/498sx1kb25/rmw9jq37r/poster.jpg";

export type Option = { value: number; label: string; image?: string; emoji?: string };
export type Question =
  | { id: number; type?: "single" | "multiselect"; question: string; description?: string; options: Option[] }
  | { id: number; type: "slider"; question: string; slider: { min: number; max: number; defaultValue: number; unit: string } }
  | { id: string; type: "social-proof"; autoSkip: number };

export const ageOptions: Option[] = [
  { value: 1, label: "18 - 29", image: "/assets/18-29.webp" },
  { value: 2, label: "30 - 39", image: "/assets/30-39.webp" },
  { value: 3, label: "40 - 49", image: "/assets/40-49.webp" },
  { value: 4, label: "50+", image: "/assets/50+.webp" },
];

export const questions: Question[] = [
  { id: 3, question: "Elige tu edad", options: ageOptions.map((o) => ({ ...o, label: `Edad: ${o.label}` })) },
  { id: 1, question: "¿Cuál es tu objetivo principal?", options: [
    { value: 1, label: "Perder peso", image: "/assets/objetivo/perder.webp" },
    { value: 2, label: "Ganar músculo", image: "/assets/objetivo/ganar.webp" },
    { value: 3, label: "Perder grasa y ganar músculo", image: "/assets/objetivo/ganareperder.webp" },
    { value: 4, label: "Mejorar la condición física general", image: "/assets/objetivo/mejorar.webp" },
  ] },
  { id: 4, question: "¿Cuál es tu objetivo corporal?", options: [
    { value: 1, label: "Delgado", image: "/assets/slim.webp" },
    { value: 2, label: "Atlético", image: "/assets/athletic.webp" },
    { value: 3, label: "Marcado", image: "/assets/definied.webp" },
    { value: 4, label: "Fuerte", image: "/assets/fuerte.webp" },
  ] },
  { id: 11, type: "multiselect", question: "¿Cuáles son las áreas en las que quieres enfocarte?", description: "Elige todas las opciones que apliquen.", options: [
    { value: 1, label: "Pectorales", image: "/assets/zones/chest.webp" },
    { value: 2, label: "Brazos", image: "/assets/zones/brazos.webp" },
    { value: 3, label: "Abdomen", image: "/assets/zones/abdomen.webp" },
    { value: 4, label: "Piernas", image: "/assets/zones/piernas.webp" },
  ] },
  { id: 13, question: "¿Cuántas veces por semana te gustaría entrenar?", options: [
    { value: 1, label: "1-2 veces", emoji: "📅" },
    { value: 2, label: "3-4 veces", emoji: "💪" },
    { value: 3, label: "5 o más veces", emoji: "🔥" },
  ] },
  { id: "social-proof-2", type: "social-proof", autoSkip: 8 },
  { id: 20, type: "slider", question: "¿CUÁL ES TU ALTURA?", slider: { min: 140, max: 220, defaultValue: 175, unit: "cm" } },
  { id: 21, type: "slider", question: "¿Cuál es tu peso actual?", slider: { min: 40, max: 150, defaultValue: 75, unit: "kg" } },
  { id: 22, type: "slider", question: "¿Cuál es el peso que quieres alcanzar?", slider: { min: 40, max: 150, defaultValue: 70, unit: "kg" } },
];

export const socialProof = [
  { name: "Carlos", text: "Este protocolo activó el modo anabólico natural de su cuerpo. 21 Días sin gimnasio.", img: "/assets/transformations/NEW/1.webp", img2: "/assets/transformations/NEW/2.webp" },
  { name: "Javier", text: "Pensé que mi genética era el problema. El Protocolo me demostró lo contrario.", img: "/assets/transformations/NEW/3.webp", img2: "/assets/transformations/NEW/4.webp" },
  { name: "Luis", text: "La disciplina y el método correcto cambiaron mi vida en tiempo récord.", img: "/assets/transformations/NEW/5.webp", img2: "/assets/transformations/NEW/6.webp" },
  { name: "Miguel", text: "Nunca creí que a mi edad podría lograr este nivel de definición.", img: "/assets/transformations/NEW/7.webp", img2: "/assets/transformations/NEW/8.webp" },
];
