export const TRANSPARENCY_CATEGORIES = [
    'Estatuto',
    'Atas',
    'Termos de Fomento',
    'Planos de Trabalho',
    'Pareceres',
    'Prestação de Contas',
    'Relatórios de Atividades',
    'Declarações',
    'Demonstrações Financeiras',
    'Certidões',
    'Outros',
] as const;

export type TransparencyCategory = (typeof TRANSPARENCY_CATEGORIES)[number];
