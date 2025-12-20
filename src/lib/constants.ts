
export const ZAMBIAN_DISTRICTS = [
  "Chadiza", "Chama", "Chanchaga", "Chavuma", "Chembe", "Chibombo", "Chiengi", "Chililabombwe", "Chilubi", "Chingola", 
  "Chinsali", "Chipangali", "Chipata", "Chirundu", "Chisamba", "Chitambo", "Choma", "Chongwe", "Gwembe", "Ikelenge", 
  "Isoka", "Itezhi-Tezhi", "Kabompo", "Kabwe", "Kafue", "Kaoma", "Kapiri Mposhi", "Kaputa", "Kasama", "Kasempa", 
  "Katete", "Kawambwa", "Kazungula", "Kitwe", "Livingstone", "Luanshya", "Luangwa", "Luano", "Lukulu", "Lundazi", 
  "Lusaka", "Lusangazi", "Luwingu", "Macha", "Mafinga", "Mambwe", "Mansa", "Manyinga", "Masaiti", "Mazabuka", 
  "Mbala", "Mchinga", "Menge", "Milenge", "Misheshi", "Mkushi", "Mongu", "Monze", "Mpika", "Mporokoso", 
  "Mpulungu", "Mufulira", "Mumbwa", "Mungwi", "Mwansabombwe", "Mwense", "Mwinilunga", "Nakonde", "Nchelenge", 
  "Ndola", "Ngabwe", "Nkeyema", "Nyimba", "Petauke", "Rufunsa", "Samfya", "Senanga", "Serenje", "Sesheke", 
  "Shangombo", "Shiwang'andu", "Sinda", "Sioma", "Solwezi", "Vubwi", "Zambezi", "Zimba"
] as const;

export type District = typeof ZAMBIAN_DISTRICTS[number];

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice_president',
  REGIONAL_ADMIN: 'regional_admin',
  OPERATIONS: 'operations',
  FINANCE: 'finance',
  SUPPORT: 'support',
  TEACHER: 'teacher',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
