import { JournalIssue, OccasionKey, OrderRecord, PaletteKey, Product, WeaveKey } from '../types';

export const IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida/ALJJyrAY5_vqxT9VK9fXM6fJJY4fMsP8wA4pkQkI9nDPRlO836H1HzkQR7NA0qWjAVOwGeIXDwxcYwtJ8PGoURL65EwmAA-fS0bUPF4Kn0jm8X6xxAQrRlS_Jo3bZOcICBI8MiX-lY4ZKKhAetVQhZQBfEbYERjEGh5wuDXPM-fprN4KHVu-P082T8ybdzVHPaHaFWci-pxM9Gp6GbcD6zAcZ4FaY2Peuz8TUqlpra3IjDUP0CFBO_ge9QdpvSc3r8kI9PJgNk46zQ',
  heroCampaign:
    'https://lh3.googleusercontent.com/aida/ALJJyrBca263lbLK3SJt5P5CoPFSH581lHIMYP3g99BGWChQaCc8j3dBUMUrQZTT_gTZkfYMS4zq8DdXH13t_0yPXD9Y3vWjYJM2rrOIjtT1f34EsIwHj6Ku-hJkw2DUGrZkRpZm4v0nhVDBxzIYj2u_jNIpMDEXubHLCf_PtJ4yQKk2lTULVMa9QcjORSLIIuweJTEs9mPMMaKXcd-31dY01WypuVoGJ7LNWOJC6waY-_NMKdOAb0P8q0jhL5X1SIp7gQcEev68VV9XyA',
  catTussar:
    'https://lh3.googleusercontent.com/aida/ALJJyrAmzuGCA_mOO31ouCN_xVW9l62IZDO0GNwmqMGs58Lm_Q3ulpwoYd5zSxPDj8Z8XGf2J0IEa8v9e0QX0TqT1qAp1DX5EIikmTOC9utAMZR0lIhFegtiOS3nOU5beuu_o0NNtWxof3BK48MYafEVk9Kf6UTunAQbWvPovgjheCq9U5jepiKM28oGyzL34Z35-znXSOI1VGRvn801G-Zz82aYWmN5v4O1RqZAF27g6TytTqPaYRqCnuVjQhY7LyqaQQ',
  catKanchipuram:
    'https://lh3.googleusercontent.com/aida/ALJJyrCCSHwhML4AXngyIfRaRI4BrRJPXijDh0ngY9IeaCeB79rNgNZAsPeT7dylJpN7JsLayJBbx0-C4Ns77vBTaAq9gPoHfgwYe2tlzsPJeub_EnvGKYu-7tMcV225pfCTXInQxrWmNThNS8GhIQIH4VSUnkamL9npxYUSfXGh-T7DSxN9g29t001VifKw5oK2itZBZqOxrJgdF63gfph2r7_fKLJw6lYnaywLwz2Ots_4zUkJnN-Ch8wbqbQmqwMvpSmAfK3t',
  catOrganza:
    'https://lh3.googleusercontent.com/aida/ALJJyrAZ87Hf7vusTY0uJxjPNckTP2iU9rUeTrWLQuWVgxAb2lwiA6WA_IE8zkkjfgDvJ_xbRKAdkQGUu-_OkmFjh2nVUrdJy4eQZILeyaSzZenIFV1tz0yafVI2euEbwLO60a_GA0aHNln0cerxPgPseml2HoztV3UiDzxIh_Cd92yHRcUiCxtd2VRp6uSVzeC0gug-DWCY7OasLZmDvlTonoWXXDiT3TnzkId2PuGijlnpwumNo1QYAbKHk96848C1mgk',
  catChanderi:
    'https://lh3.googleusercontent.com/aida/ALJJyrDd202arBYjXBWFpy0cOMeFQ81d16s9-fKSG93jRk1NI-t5zOgsUVQzznvAr4K4xNOMmmc80t6ekdYjubk6DkVHjN-nCkAtkaEWms-lMYSu8pMjk7xizL-FvM8gwVm8blVegX672_Q1Ut1n0EsjY3aqqImG2gdEopkILXJJyrGBH3tFu2FZub1rTy_eeDy4MICxoGRefJfwVS1MymaCT_aTqiwxjPCI3WRTXhVfp0RTQ8xRAvKjiuI8dKRC7q5RgcI',
  iraFront:
    'https://lh3.googleusercontent.com/aida/ALJJyrAIDnS1lE-0kxtn6UHXwb5fxOUuqL4LkQb2tlezWmyOcnXNToCevZqce_f-ZGhibmZnIuAUxbWOO-s4kxLBgBHG5p58Kgihx5MTYGQdnNZtg4CiVPzCX8bWT2QyDuMsAe2-ihsTicbTdoe4aIm1PCK6_Bxroe2xbitNCrBBLgsIpgt4ubnx4AZWoZSANC8fYLNabvUUXyLs16wcHL9XVuxT66NQNowhd3kwcSX7ipvdwUAb5aeOw9nJRtSoaEuasS8psJ4',
  iraBack:
    'https://lh3.googleusercontent.com/aida/ALJJyrBNQ8Dx7-zJ8XxMcZKjkhvjdObz1hduiirQdJZByDQFvKTWviTg_6PLSEqi1ykJ3m_ZZchCBaUMyjaygFmNFPQFzLyoIzRBkFiUyXhakL5uqKJ2dw-7edTKSTz8S0WOEk4Xy3rr2QPoXcW7I2rFRjzNc6SZSEZq1F4X9Vn23Q0ztoMm-nh0pW2-680SzlwpPlv7enbZLazyZhRZvvJ_SEJXvp6A2ZtW3lXZ-NZhRVODOy3Oqwn4YHYgwYQUaeir__LLBA',
  meeraFront:
    'https://lh3.googleusercontent.com/aida/ALJJyrDvIdR3TV6LKVVPazhL8h8ELBWD7DU7jN9blVecftRn1KtMN4RXGaTU0dZrTEy4lrIxD0Mp8nhy94srvyW4owoOC3m6lPMnVCIKj4e7Mn9VFEnMjCAVUjWKdrAYl6tdOK2dmeaCjQ3rXI0xO0ouV2XmnEZ8QUgSSAM9bjzPRag1AYLRl3iiZjsuKumIMCODlnD9klSVqEWn3TMKjLdI3YBsgWhBstPvgKo-VzoqKviw6644VwUyHxvYNKXuxmuyPllXXv9e',
  meeraBack:
    'https://lh3.googleusercontent.com/aida/ALJJyrAt4pWVL04bJ3GilUy5cUF-q6pac3SixDbkQvgHIvGQzQ7HBMmZIjhS9T-KvskbWHkMM9oj1QPJi9FY3U0CblTUvoEBEdHKRdWS7LBCr6HutRY3O9Nxjgn2OZs9ettCDQ_0kgPNTaCVnGemj7K9EvYcOBP4S0pNd2W_LF0f278kSFr9dZSQ4t_KosALM_DyfPlu3ToHWwnGgexrw9TVXq7KRrNU4ZFbjIbRv4NTHWGkIaB-_cKFWtO0tFC3R1qImwJutQo',
  kavyaFront:
    'https://lh3.googleusercontent.com/aida/ALJJyrCcHvM-SrzebkUK9XpYS6CvE8a2YZG4fv9HOAylfCK2pFQauCM7Nj00X5oZVyyNdKH0dxOHswLWU9cTJ4b9dPHCXxHx48gRWJZqHI8pYBNhI2kUJzY_TNwKM5d3a9_bdZygYCcQ8vHaV5mcM0lE-WEBGTy_yWvr8GAt9p6U4FdGjr-pgVrqv6qr01P3zrdBqpVoWO4vRgkkybGXe7uzd3xqIkjLh81W7dmKvgFpm-sDpvC2TEPBHH1j9L8wF1LW4f1sBf1WmQ',
  kavyaBack:
    'https://lh3.googleusercontent.com/aida/ALJJyrCpTAlaHzBiBu5-WSXtsWiQqSjZPSWhdyiwyVQKiuaj3ZYXr5qcp5nUUFHQGYvK2A3XAYYifh3hEG8KtaYyEIyyZPV_7y4p6jFNPU6ef4NVCqJ49cvDkInl8gQYaavgBmZvQZh_nVfJzezMJzlJFFss0TCSM8ttB32yehlwh1Zb3Mv5Vq-rNQah3dnTIgf7XwRITH4lH4SXuGcFYPEZ3NJsxvlYaTtHa-i3TUIW1OYU1yR6SJJMb2UOtlXEOHeyIXm--_Py',
  taraFront:
    'https://lh3.googleusercontent.com/aida/ALJJyrDNcr9Ppm4Xo77KRZwuFFajvBZ-57meRk4_L9XBX83YDsnDJWV2Nyofn5ebi-nT6kW3tjd3DFwmEFbF6Sj6dn71GGHfx5tAUSxgpo1OhrLSBE_OCF2gcIjUhuWcbI92ikz22vuXgVGNy5JkQ52VTaj5HK4maVb0BE7gOx4t6NMNTjlzIbWAb-irBd9mDvyj2zGniFrrZvig9TjmRdcDpzQfJMSNcoZxSdfVrtMRZ9jTU915NYoOfBK4O6bt-g86jg8FV7nz',
  taraBack:
    'https://lh3.googleusercontent.com/aida/ALJJyrB-Y24Hkr4tKaoNcg1qn6Fyl5y-KKenrJASM8t_iTMrUM8akpCTxRLmpTXQYUuaeqzMlubpm8Sqnw9bxo3qf20-aRcZCQXVBoDVPX6UZdMxSfM6uHTdhsdWxesu2U3rB19IkF0nnihoT4vpfKeoL35-yHMiDEsRphVZ1dShIcJ12j0acPDTRTvpgbQ4V5RAT-cTVqAjSFI7QxIAV4JwKZwatZI_C2fpmktTtDVZiLAfDLeItF3-l3eFTe9J-P3Y-apci90',
  craftLoom:
    'https://lh3.googleusercontent.com/aida/ALJJyrBGBeDDFuwTt9HpKL0mQiAsfvJgSIFQzSZwUy-XxdMiSJ3iQNwg8LSWMfW8smfP8qJhM-SetaebFzrkW8FkJm929NtO8hvFgw9OscF2I5fSsVRoGYJGyyycs8AjhFOm26MSn7H3d5vGBL1Rm9Wj6BKskgTqF1rehGpcYyN7xBvB6Rtj_5nwc0ZzkeFpb394ZfCKb43LX5Wrl5VBbq6rl4EmM_uDXU_UJpPRuw1k9rX0hZzZl8vv1P15uyJ4vDFyLVGa-jASmQ',
  campaignEdgeToEdge:
    'https://lh3.googleusercontent.com/aida/ALJJyrBogLVZ96GWErDoeCQdpt4UYbwCtQA6IPIIAm34WWFRImAJUn7En9HX2D4KA-PGVSslrnw7WIyCEILxgPzMkU1Lrap1YH0brLSMNU0hyOrQl_EYa3gyb8pPdQXlioOhTecTDVJfG-rqy087ywr1wx3M2NnHOtc4hCT-asg0ODXAkjbBH9lWZshg3XVnEII3orjSQSY4yVhQHKAZRWTaoNbWQFfSl2hboL1DAkeEANdA86H039yqmI4ZJ9zgRiFe-kfLqClIPspym8-T',
  occasionCeremony:
    'https://lh3.googleusercontent.com/aida/ALJJyrDsY9JTSg5kTngVKbksmVxJXF_f8RC6as9YbwlGiXt3L7xDJvHki4c8VtlYK_m4ebtSSnl0AAnZmsSjJE_aiy-BZz--icXyX10shzRlotXcAFbylvYgYH6dL03btvW_nk37FHbJCwyRle5LwV0aoH7w1sXRp4Kic7T3vutcRJIzMuRw2q8PWnEPqAhGsJz99QGTdPVLgi0bzMngRpGBDSVdBaeEtDxMmbBvZKEc_HmLIrNosdJxhn4d8QijLoOMHp6OK733Rg',
  occasionEvening:
    'https://lh3.googleusercontent.com/aida/ALJJyrBa_faMrpkjJROvNG1cM120GGTYkGYZFZso3SonsBl-4LhNVAeJitkw5OPRM2va62UlyEVLqqBToO4wlucQ6QoAa58eWn2rTIgoVmdPQlcvZ5J3VK7jZqaOh0xjt_wem_7a7sJ0GIWn6mxN50_1EdogBbvRNXimXxs0Qd8tLPhQqYZ87T18gzxUG8qdZeJVhRixquABbIUUa7xz01khNGhylBriQjX-4Motyb8FR5PH9Toa_3ADVC2irH-CH9jx3hh-nvFJKQ',
  textureTussar:
    'https://lh3.googleusercontent.com/aida/ALJJyrAPS9Ea0KhD6aQGllXmXh-goUaRYK-2msr-RtbkuTCv3XOPONldR5eY-lO7RxvrOo_uKfG-taG9ax5hP11ycAhmYo7X4eO6VugrRdJ-QoORSRCrBVgXGc3bgAa07sXwrwFg_l_97iC9U_Ew2A-TiqabD38XnF9VwSpyGuKsGQTjyTZt420S1s-Z1mkTFd6nfrOkMBkigeP4OguBbnJDTlzSfg3bXjfkJ_jfJuYJqtQrcdu3ZKjfggMVYaQkRztRDG-o3YZxFkPkPrs',
  textureJamdani:
    'https://lh3.googleusercontent.com/aida/ALJJyrA8aJisclBkdfWA-cz3QZakVjrRAq85yAr_qa7BTQkxiFh_oaQ7ku_OO9TXJAA-DehoobcmMNFvtI2tHuNor3HxWFOlubnScStFx36LuPyTnEJ3hmz5rFm6mY5GZp-79C2_N5q_LDP8MJQ7PabEPuJfIIcV9T4iwnJstkDl_qquzrurBKKmhYwPjWHYVTgi-iCNiuKusA89YXOWT8mjLVoHtBbW8C8NyiP3pVuBPIDScylLHUz4F4ykg6D3Eulv_HAvm_76gkkI9Ao',
  textureKanchi:
    'https://lh3.googleusercontent.com/aida/ALJJyrAHwM3PrQ9J_tpPonp4Q9lrzjVOhTFFB6mUmJ6V39-kB0zuB5kUIWqWAvWA5Ez-4U7_sQCNixF1USeMxBBo54_vDkiBc3x6rNi6UFnluoNnqpOYBH5BsnxDSHEPS1OJ_U-I3kmn1gCJeM0mKggNLFBpV-e3sZ7ikJ9IOILdUVcxuoJiQuDU3VwCqOpr0vDrhvN8fMXo2QIv2bbglVexXlBy9S2-RcVI5tWkN2PDXM_rDdF8VPaTYwd_vnda9ZlrD37a7MczYKjKQ9g',
  weddingEditorial:
    'https://lh3.googleusercontent.com/aida/ALJJyrAiNia9whiMyff_9N_VFmG0PEzTpSHlFoBE0GTEvdnb7dA-AowCE8-dzbcNifG4u7o2TEtBmVAcu5zxv9qYizWizI-ha2O1VK0MnTUilK7csGfJA8-m5bByAOmsdb2ztc3p8J2oaKJp0e55dUuNB6ls0wD0suQ6W9W7Rv4GZ9wXqZD6EDt0mq0jFql4UGzRtldI5gdQTSQYdMpZTh5osxLeeiZ4xvEaQeTvS23h75y4JC6TvyWa5-G35HyNabcRjDL9c0WTGgiwjiRaZDMU',
  stylingAtelier:
    'https://lh3.googleusercontent.com/aida/ALJJyrC9T6J9LGk437hpz6bdBxkZ8AT-HqBPbr-4PjDngX0MybU0MI9w_cwsTQY6GpVb1qCjGo13N_4Q4po60WNOtm4MLE_uuvrJi2_Ydd9bD-S6Tn8yN6XMutiEcIqEzu5BojHNid91HpvmQDuAm55yRjbgPD47L0S8aTKUL8WDkcy9RLpaHr3JV1lEf1TKxrXwfmHF8GpRROJ1uhg1d83ahi5D1Rh9o60v43lFMhgwzgdSssI2xJlUA9pNqVYrxZwSyT5Mcds',
  journal1:
    'https://lh3.googleusercontent.com/aida/ALJJyrBXCSoC1siXyMnQ5OOWynSehEroUNvhvguHkkRfhD29C3rBJkEdlkEk_QHxup8Wg8VU6l2aBIkgTWT-UEdDmzIulwN2NbWunlU1Ex-7sKTLSbUxfQlb1mtODs8kRlH5KaO3GmgT4ADsdW4mPT3AXVbc7ku6i-Z9_tyhVn-w5AurSkmbTzFbYSku1SjQDjHq20jvM0GhWWgncVpCPLGNcna46AjukT_ZpPWP6YYTskpadCaLS85-Pi8aO3wu9mL1',
  journal2:
    'https://lh3.googleusercontent.com/aida/ALJJyrBOS3thTnJukjMDlfT9vi9qVY47mNs4adnh7nd0UMMiO2NLnJq-Y9WyCAGju6o1hrJHEzKrjm6B24_UsQhR5fNrR54mgYZH7CMK1piil3gsBCFUSCLSamlhdvHOQBEWFyxxQHZHJWa8MR2aRavZ72WKxwErhQH80by8isQlC6u73oqkUcEc5j8lB6mR9JPUkTExe0Bvi9Up37PntLC-potvdcaYNyKnMTIZvM7CeCoAKsk23s2A76cBYQWLrhQ',
} as const;

export const CATEGORIES: {
  id: WeaveKey;
  title: string;
  countLabel: string;
  image: string;
  alt: string;
}[] = [
  {
    id: 'tussar',
    title: 'Raw Tussar',
    countLabel: '18 Pieces',
    image: IMAGES.catTussar,
    alt: 'Handspun Bhagalpur Raw Tussar weave',
  },
  {
    id: 'kanchipuram',
    title: 'Kanchipuram',
    countLabel: '14 Pieces',
    image: IMAGES.catKanchipuram,
    alt: 'Contemporary Kanchipuram Mulberry Silk',
  },
  {
    id: 'organza',
    title: 'Silk Organza',
    countLabel: '11 Pieces',
    image: IMAGES.catOrganza,
    alt: 'Handwoven unbleached Silk Organza',
  },
  {
    id: 'chanderi',
    title: 'Chanderi',
    countLabel: '9 Pieces',
    image: IMAGES.catChanderi,
    alt: 'Chanderi Linen and Silk-Cotton weave',
  },
];

export const WEAVE_FILTERS: { key: WeaveKey; label: string }[] = [
  { key: 'tussar', label: 'Bhagalpur Tussar' },
  { key: 'kanchipuram', label: 'Kanchipuram Silk' },
  { key: 'jamdani', label: 'Dhakai Jamdani' },
  { key: 'chanderi', label: 'Chanderi Linen-Silk' },
  { key: 'organza', label: 'Silk Organza' },
];

export const PALETTE_FILTERS: { key: PaletteKey; hex: string }[] = [
  { key: 'Terracotta', hex: '#7A4631' },
  { key: 'Ivory', hex: '#DCCBB5' },
  { key: 'Ink', hex: '#241814' },
  { key: 'Olive', hex: '#686B55' },
  { key: 'Walnut', hex: '#4A2F20' },
];

export const OCCASION_FILTERS: OccasionKey[] = [
  'Daylight Ceremonies',
  'Gallery Evenings',
  'Bridal Trousseau',
];

export const PRODUCTS: Product[] = [
  {
    id: 'ira-raw-tussar',
    sku: 'NMW-TS-042',
    name: 'Ira Raw Tussar Saree',
    subtitle: 'Handspun Bhagalpur Tussar',
    weave: 'Bhagalpur Tussar',
    weaveKey: 'tussar',
    price: 42000,
    tag: 'New Arrival',
    shades: [
      { name: 'Terracotta Clay', palette: 'Terracotta', hex: '#7A4631' },
      { name: 'Natural Ivory', palette: 'Ivory', hex: '#DCCBB5' },
      { name: 'Muted Olive', palette: 'Olive', hex: '#686B55' },
    ],
    occasions: ['Daylight Ceremonies', 'Gallery Evenings'],
    frontImage: IMAGES.iraFront,
    backImage: IMAGES.iraBack,
    textureImage: IMAGES.textureTussar,
    description:
      'Handwoven from wild Bhagalpur tussar cocoons and dyed in madder-root terracotta. Designed with an architectural unbleached selvedge and fluid, structured fall.',
    provenance:
      '100% handspun wild tussar silk woven by master artisans in Nathnagar, Bhagalpur over 14 days on a wooden pit loom.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean only. Store folded in the accompanying unbleached muslin bag away from direct light.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'meera-mulberry-zari',
    sku: 'NMW-KN-018',
    name: 'Meera Mulberry Zari',
    subtitle: 'Kanchipuram Pure Silk',
    weave: 'Kanchipuram Silk',
    weaveKey: 'kanchipuram',
    price: 68500,
    tag: 'Limited Loom',
    shades: [
      { name: 'Deep Ink', palette: 'Ink', hex: '#241814' },
      { name: 'Walnut Brown', palette: 'Walnut', hex: '#4A2F20' },
    ],
    occasions: ['Gallery Evenings', 'Bridal Trousseau'],
    frontImage: IMAGES.meeraFront,
    backImage: IMAGES.meeraBack,
    textureImage: IMAGES.textureKanchi,
    description:
      'Three-ply twisted Kanchipuram mulberry silk anchored with understated antique silver-dipped zari korvai borders. Weighty, luminous, and free of metallic glare.',
    provenance:
      'Handwoven over 22 days by a third-generation korvai loom family in Kanchipuram using pure mulberry yarn and tested zari.',
    dimensions: 'Saree length: 5.5 metres · Width: 46 inches · Unstitched contrast blouse: 0.9 metres.',
    care: 'Dry clean only. Refold every four months to preserve crease geometry.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'kavya-ivory-jamdani',
    sku: 'NMW-JM-009',
    name: 'Kavya Ivory Jamdani',
    subtitle: '100-Count Cotton-Silk',
    weave: 'Dhakai Jamdani',
    weaveKey: 'jamdani',
    price: 54000,
    shades: [
      { name: 'Warm Ivory', palette: 'Ivory', hex: '#DCCBB5' },
      { name: 'Antique Gold', palette: 'Walnut', hex: '#B38A5D' },
    ],
    occasions: ['Daylight Ceremonies', 'Bridal Trousseau'],
    frontImage: IMAGES.kavyaFront,
    backImage: IMAGES.kavyaBack,
    textureImage: IMAGES.textureJamdani,
    description:
      'Featherlight 100-count cotton-silk jamdani with discontinuous supplementary weft geometric buttis hand-inserted by two weavers working in tandem.',
    provenance:
      'Woven in Phulia, West Bengal over 28 days without mechanical jacquard cards—each motif laid thread by thread by hand.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Includes 0.9m unbleached cotton-silk blouse.',
    care: 'Specialist dry clean or gentle cold hand soak with pH-neutral soap; steam press on reverse.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'tara-olive-linen-silk',
    sku: 'NMW-CH-027',
    name: 'Tara Olive Linen-Silk',
    subtitle: 'Handloom Chanderi',
    weave: 'Chanderi Linen-Silk',
    weaveKey: 'chanderi',
    price: 36500,
    shades: [
      { name: 'Muted Olive', palette: 'Olive', hex: '#686B55' },
      { name: 'Terracotta Clay', palette: 'Terracotta', hex: '#7A4631' },
    ],
    occasions: ['Daylight Ceremonies', 'Gallery Evenings'],
    frontImage: IMAGES.taraFront,
    backImage: IMAGES.taraBack,
    textureImage: IMAGES.catChanderi,
    description:
      'Crisp Chanderi silk warp interlaced with hand-reeled linen weft, botanically dyed in myrobalan and iron water for a cool sage-olive cast.',
    provenance:
      'Crafted on traditional throw-shuttle looms in Chanderi, Madhya Pradesh with an ultra-fine hairline temple border.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean recommended. Air out in shade after wear.',
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'veda-unbleached-tussar',
    sku: 'NMW-TS-051',
    name: 'Veda Unbleached Tussar',
    subtitle: 'Bhagalpur Tussar',
    weave: 'Bhagalpur Tussar',
    weaveKey: 'tussar',
    price: 39000,
    shades: [
      { name: 'Unbleached Sand', palette: 'Ivory', hex: '#DCCBB5' },
    ],
    occasions: ['Daylight Ceremonies'],
    frontImage: IMAGES.catTussar,
    backImage: IMAGES.textureTussar,
    textureImage: IMAGES.textureTussar,
    description:
      'Pure undyed wild tussar yarn celebrating the natural warm honey and oat slub of raw silk cocoons, finished with hand-knotted tassels.',
    provenance:
      'Spun and woven entirely in Bhagalpur without bleaching agents or chemical softeners.',
    dimensions: 'Saree length: 5.5 metres · Width: 45 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean only. Avoid direct steam on raw slubs.',
  },
  {
    id: 'nila-walnut-kanchipuram',
    sku: 'NMW-KN-033',
    name: 'Nila Walnut Kanchipuram',
    subtitle: 'Kanchipuram Silk',
    weave: 'Kanchipuram Silk',
    weaveKey: 'kanchipuram',
    price: 74000,
    tag: 'Bridal Edit',
    shades: [
      { name: 'Walnut Bark', palette: 'Walnut', hex: '#4A2F20' },
      { name: 'Antique Gold', palette: 'Ivory', hex: '#B38A5D' },
    ],
    occasions: ['Bridal Trousseau', 'Gallery Evenings'],
    frontImage: IMAGES.catKanchipuram,
    backImage: IMAGES.textureKanchi,
    textureImage: IMAGES.textureKanchi,
    description:
      'An heirloom bridal Kanchipuram in deep roasted walnut and burnished antique gold, stripped of heavy motifs for architectural purity.',
    provenance:
      'Handwoven in Kanchipuram using double-twisted mulberry silk dyed in pomegranate rind and black catechu.',
    dimensions: 'Saree length: 5.5 metres · Width: 46 inches · Unstitched blouse piece: 0.9 metres.',
    care: 'Dry clean only. Store wrapped in pure cotton muslin.',
  },
  {
    id: 'rhea-ivory-organza',
    sku: 'NMW-OR-012',
    name: 'Rhea Unbleached Organza',
    subtitle: 'Handwoven Silk Organza',
    weave: 'Silk Organza',
    weaveKey: 'organza',
    price: 46000,
    tag: 'Bridal Edit',
    shades: [
      { name: 'Warm Ivory', palette: 'Ivory', hex: '#DCCBB5' },
    ],
    occasions: ['Daylight Ceremonies', 'Bridal Trousseau'],
    frontImage: IMAGES.catOrganza,
    backImage: IMAGES.occasionCeremony,
    textureImage: IMAGES.textureJamdani,
    description:
      'Translucent, sculptural pure silk organza with a crisp matte finish and tonal hand-embroidered selvedge, tailored for sunlit ceremonies.',
    provenance:
      'Woven from high-twist degummed kora silk yarns on narrow-width handlooms in Varanasi.',
    dimensions: 'Saree length: 5.5 metres · Width: 44 inches · Raw silk camisole blouse piece: 0.9 metres.',
    care: 'Dry clean only. Hang on padded hanger or roll around acid-free tissue.',
  },
];

export const WEAVE_LIBRARY: {
  key: WeaveKey;
  title: string;
  description: string;
  image: string;
  alt: string;
}[] = [
  {
    key: 'tussar',
    title: 'Bhagalpur Tussar',
    description: 'Organic slubs, matte golden undertone, structured drape.',
    image: IMAGES.textureTussar,
    alt: 'Macro texture of raw Bhagalpur tussar silk',
  },
  {
    key: 'jamdani',
    title: 'Dhakai Jamdani',
    description: 'Featherlight supplementary weft motifs woven by hand.',
    image: IMAGES.textureJamdani,
    alt: 'Macro texture of fine ivory Jamdani handloom',
  },
  {
    key: 'kanchipuram',
    title: 'Kanchipuram Mulberry',
    description: 'Three-ply twisted mulberry silk with pure silver-dipped zari.',
    image: IMAGES.textureKanchi,
    alt: 'Macro texture of walnut mulberry Kanchipuram silk',
  },
];

export const JOURNAL_ISSUES: JournalIssue[] = [
  {
    id: 'issue-09',
    issueLabel: 'Issue 09 · Natural Dyeing',
    title: 'Madder, Pomegranate & Iron Water: Color Without Synthetics',
    subtitle:
      'How our dye house achieves deep terracotta and muted walnut tones using mineral-rich river water and fermented botanicals.',
    byline: 'By Meenakshi Verma · Photographed in Bhagalpur · 6 min read',
    heroImage: IMAGES.journal1,
    heroAlt: 'Botanical dye vats, madder root, and raw silk skeins',
    lead:
      'Before a single shuttle crosses the warp on our Bhagalpur looms, the raw tussar yarn spends four days in copper and clay vats steeped with dried Rubia cordifolia roots, crushed pomegranate rinds, and fermented jaggery-iron liquor.',
    paragraphs: [
      'Unlike synthetic reactive dyes that coat fiber in a uniform, flat film, botanical pigments bond unevenly with the natural sericin in wild silk. The result is our signature Terracotta Clay—a living hue that shifts between warm rust in noon sunlight and deep walnut in evening rooms.',
    ],
    quote: '“Botanical color never shouts. It settles into the grain of the yarn and ages with the wearer.”',
    galleryImages: [
      { src: IMAGES.journal2, alt: 'Sunlit weaving studio' },
      { src: IMAGES.textureTussar, alt: 'Macro texture of raw tussar silk' },
    ],
    closingParagraph:
      'Every dye bath is exhausted and neutralized before returning to the garden beds surrounding our partner workshops, keeping the river basin clean for the next generation of weavers.',
    featuredProductIds: ['ira-raw-tussar', 'tara-olive-linen-silk', 'kavya-ivory-jamdani'],
  },
  {
    id: 'issue-08',
    issueLabel: 'Issue 08 · Architecture',
    title: 'Light, Shadow, and the Unbleached Selvedge',
    subtitle: 'A photographic study of weaver workshops in West Bengal at four in the afternoon.',
    byline: 'By Arvind Subramanian · Photographed in Phulia · 5 min read',
    heroImage: IMAGES.journal2,
    heroAlt: 'Sunlit handloom weaving studio in West Bengal',
    lead:
      'At four in the afternoon, low western light cuts through lime-washed brick louvers in Phulia, illuminating thousands of suspended 100-count cotton-silk warp threads like architectural drafting lines.',
    paragraphs: [
      'In a pit loom studio, humidity and temperature live inside the earth below the weaver’s feet. Rather than forcing brittle unbleached yarns through industrial air-conditioned halls, the damp clay pit keeps each delicate weft pliable without synthetic sizing.',
    ],
    quote: '“An unbleached selvedge carries the exact tension of the afternoon light in which it was thrown.”',
    galleryImages: [
      { src: IMAGES.craftLoom, alt: 'Weaver hands dressing raw silk warp threads' },
      { src: IMAGES.textureJamdani, alt: 'Fine ivory Dhakai Jamdani weave structure' },
    ],
    closingParagraph:
      'When you hold a Kavya Jamdani up to a window, the space between threads matters as much as the yarn itself—precision measured by touch, patience, and inherited rhythm.',
    featuredProductIds: ['kavya-ivory-jamdani', 'meera-mulberry-zari', 'nila-walnut-kanchipuram'],
  },
];

export const CLIENT_REVIEWS = [
  {
    quote:
      '“The Ira Raw Tussar drapes like liquid architecture. No stiffness, no loud shine—just extraordinary handspun texture that drew quiet compliments all evening.”',
    author: 'Ananya R.',
    meta: 'Mumbai · Verified Buyer',
    image: IMAGES.catTussar,
    alt: 'Client Ananya R. wearing Ira Raw Tussar',
  },
  {
    quote:
      '“I wore the Kavya Ivory Jamdani for my afternoon wedding registry. The 100-count cotton-silk felt weightless even in warm coastal weather.”',
    author: 'Devika M.',
    meta: 'London · Verified Buyer',
    image: IMAGES.catOrganza,
    alt: 'Client Devika M. wearing Kavya Ivory Jamdani',
  },
];

export const SAMPLE_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'NMW-1042',
    placedAt: '19 November 2026',
    customerName: 'Ananya Rao',
    email: 'ananya.rao@studio.in',
    address: '14 Carmichael Road, Malabar Hill',
    city: 'Mumbai',
    pinCode: '400026',
    paymentMethod: 'Card / NetBanking / UPI',
    items: [
      {
        key: 'ira-raw-tussar::Terracotta Clay::fall-pico',
        productId: 'ira-raw-tussar',
        name: 'Ira Raw Tussar Saree',
        subtitle: 'Handspun Bhagalpur Tussar',
        sku: 'NMW-TS-042',
        image: IMAGES.iraFront,
        shadeName: 'Terracotta Clay',
        finishing: 'fall-pico',
        unitPrice: 43500,
        quantity: 1,
      },
    ],
    subtotal: 43500,
    discount: 0,
    total: 43500,
    statusStep: 3,
    courier: 'Blue Dart Insured Air',
    trackingNumber: 'BD-88412094IN',
    estimatedDelivery: '24 November 2026',
  },
];

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
