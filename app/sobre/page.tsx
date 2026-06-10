import { getVolunteers } from "@/app/admin/actions";
import SobreContent from "./SobreContent";

// Fallback para quando o Firestore ainda não tem dados (usa imagens locais)
const fallbackVolunteers = [
    { id: "1", nome: "Ana Luiza Henrique da Silva", role: "", imagemUrl: "/voluntarios/ana-luiza-henrique-da-silva.png", ordem: 1 },
    { id: "2", nome: "Aparecida de Jesus Tomazini Pelegrini", role: "", imagemUrl: "/voluntarios/aparecida-de-jesus-tomazini-pelegrini.png", ordem: 2 },
    { id: "3", nome: "Eliane Cardozo Salum", role: "", imagemUrl: "/voluntarios/eliane-cardozo-salum.png", ordem: 3 },
    { id: "4", nome: "Fatima AP. Moreira Lacerda", role: "", imagemUrl: "/voluntarios/fatima-ap-moreira-lacerda.png", ordem: 4 },
    { id: "5", nome: "Fernanda Santos Hipólito Ferreira", role: "", imagemUrl: "/voluntarios/fernanda-santos-hipolito-ferreira.png", ordem: 5 },
    { id: "6", nome: "Francelina Gonçalves Matheus", role: "Fundadora", imagemUrl: "/voluntarios/francelina-goncalves-matheus.png", ordem: 6 },
    { id: "7", nome: "Magali Pangoni Soares", role: "", imagemUrl: "/voluntarios/magali-pangoni-soares.png", ordem: 7 },
    { id: "8", nome: "Mara Rosana Peralta Romeiro", role: "", imagemUrl: "/voluntarios/mara-rosana-peralta-romeiro.png", ordem: 8 },
    { id: "9", nome: "Maria Antônia Aliotti de Lima", role: "", imagemUrl: "/voluntarios/maria-antonia-aliotti-de-lima.png", ordem: 9 },
    { id: "10", nome: "Maria Carolina Casanova", role: "", imagemUrl: "/voluntarios/maria-carolina-casanova.png", ordem: 10 },
    { id: "11", nome: "Maria Cuerin Parisotto", role: "", imagemUrl: "/voluntarios/maria-cuerin-parisotto.png", ordem: 11 },
    { id: "12", nome: "Maria de Lourdes Santos Bertolla", role: "", imagemUrl: "/voluntarios/maria-de-lourdes-santos-bertolla.png", ordem: 12 },
    { id: "13", nome: "Maria Regina Plaza", role: "", imagemUrl: "/voluntarios/maria-regina-plaza.png", ordem: 13 },
    { id: "14", nome: "Marlei Regina da Luz Durães", role: "", imagemUrl: "/voluntarios/marlei-regina-da-luz-duraes.png", ordem: 14 },
    { id: "15", nome: "Márcia Regina Deperon", role: "Atual Presidente", imagemUrl: "/voluntarios/marcia-regina-deperon.png", ordem: 15 },
    { id: "16", nome: "Matilde Ribeiro de Melo", role: "", imagemUrl: "/voluntarios/matilde-ribeiro-de-melo.png", ordem: 16 },
    { id: "17", nome: "Oclesia Maria Maróstica Hortal", role: "", imagemUrl: "/voluntarios/oclesia-maria-marostica-hortal.png", ordem: 17 },
    { id: "18", nome: "Sander Figueiredo Salum", role: "", imagemUrl: "/voluntarios/sander-figueiredo-salum.png", ordem: 18 },
    { id: "19", nome: "Silvia Affini Jorge", role: "", imagemUrl: "/voluntarios/silvia-affini-jorge.png", ordem: 19 },
    { id: "20", nome: "Silvia Barbosa de Sá Pinheiro", role: "", imagemUrl: "/voluntarios/silvia-barbosa-de-sa-pinheiro.png", ordem: 20 },
];

export const dynamic = "force-dynamic";

export default async function SobrePage() {
    let volunteers;
    try {
        const firestoreVolunteers = await getVolunteers();
        volunteers = (firestoreVolunteers as any[]).length > 0 ? firestoreVolunteers : fallbackVolunteers;
    } catch {
        volunteers = fallbackVolunteers;
    }

    return <SobreContent volunteers={volunteers as any} />;
}
