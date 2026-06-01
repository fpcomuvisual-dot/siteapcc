export const TRANSPARENCY_CATEGORIES = [
    'Estatuto',
    'Atas',
    'Prestação de Contas',
    'Relatórios de Atividades',
    'Demonstrações Financeiras',
    'Certidões',
    'Outros',
] as const;

export type TransparencyCategory = (typeof TRANSPARENCY_CATEGORIES)[number];
